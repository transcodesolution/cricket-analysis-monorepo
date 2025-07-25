import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { BattingStats, BowlingStats, FallOfWickets, MatchAnalytics, PlayerStats, TeamAnalytics } from '../../database/model/match-analytics.model';
import { Ball } from '../../database/model/match-scoreboard.model';
import { CommonHelperService } from '../../helper/common.helper';

@Injectable()
export class AnalyticsService {
    constructor(
        @InjectModel(MatchAnalytics.name) private readonly analyticsModel: Model<MatchAnalytics>,
        private readonly commonHelperService: CommonHelperService,
    ) { }

    async generateAnalyticsForMatch(matchId: string): Promise<MatchAnalytics | undefined> {
        const [matchInfo, scoreboards] = await this.commonHelperService.checkMatchInfoAndScoreboardExists({ sheet_match_id: matchId, queryMethodName: "find" });

        if (matchInfo && scoreboards.length) {
            // Separate innings
            const inningsOneBalls = scoreboards.filter(sb => sb.innings === 1).flatMap(sb => sb.balls.map((i) => ({ ...i, over: sb.over, _id: sb._id })));
            const inningsTwoBalls = scoreboards.filter(sb => sb.innings === 2).flatMap(sb => sb.balls.map((i) => ({ ...i, over: sb.over, _id: sb._id })));

            const analytics = new this.analyticsModel(); // Create empty analytics document

            analytics.matchId = matchInfo?._id as unknown as string;

            analytics.teamOne = this.calculateTeamAnalytics(inningsOneBalls, matchInfo.team1.playingEleven);
            analytics.teamOne.team = matchInfo.team1.team;
            analytics.teamTwo = this.calculateTeamAnalytics(inningsTwoBalls, matchInfo.team2.playingEleven);
            analytics.teamTwo.team = matchInfo.team2.team;

            const team1TotalRuns = this.calculateTotalRuns(inningsOneBalls);
            const team2TotalRuns = this.calculateTotalRuns(inningsTwoBalls);

            analytics.teamOne.runsScored = team1TotalRuns;
            analytics.teamTwo.runsScored = team2TotalRuns;

            analytics.totalRuns = team1TotalRuns + team2TotalRuns;
            analytics.totalBallFaced = (analytics.teamOne.ballFaced + analytics.teamTwo.ballFaced) || 0;

            const team1NRR = this.calculateNetRunRate(team1TotalRuns, inningsOneBalls.length);
            const team2NRR = this.calculateNetRunRate(team2TotalRuns, inningsTwoBalls.length);

            analytics.teamOne.netRunRate = team1NRR - team2NRR;
            analytics.teamTwo.netRunRate = team2NRR - team1NRR;

            // (Optional) Save to DB
            await analytics.save();

            await this.commonHelperService.deleteKeysContainingId(matchId);

            return analytics;
        }

        return;
    }

    private calculateTeamAnalytics(balls: Ball[], playingEleven: string[]): TeamAnalytics {
        const teamAnalytics: Partial<TeamAnalytics> = {};

        const battingStats = new Map<string, BattingStats>();
        const bowlingStats = new Map<string, BowlingStats>();
        const fallOfWickets: FallOfWickets[] = [];
        const nonStrikers: string[] = [];

        let totalRuns = 0, ballFaced = 0;

        for (const ball of balls) {
            if (!ball.striker?.player) {
                return teamAnalytics;
            }
            const strikerId = ball.striker?.player?.toString();
            const nonStrikerId = ball.non_striker?.player?.toString();
            const bowlerId = ball.bowler.toString();
            const runs = +ball.runs_off_bat + +(ball.extras?.total ?? 0);
            totalRuns += runs;

            if (!(+(ball.extras?.wides || 0) || +(ball.extras?.noballs || 0))) {
                ballFaced++;
            }

            // Batting
            if (strikerId) {
                if (!battingStats.has(strikerId)) {
                    battingStats.set(strikerId, this.initializeBattingStat());
                }
                this.updateBattingStat(battingStats.get(strikerId), ball);
            }

            // Bowling
            if (bowlerId) {
                if (!bowlingStats.has(bowlerId)) {
                    bowlingStats.set(bowlerId, this.initializeBowlingStat());
                }
                this.updateBowlingStat(bowlingStats.get(bowlerId), ball, bowlerId);
            }

            // Wickets
            if (ball.wicket?.dismissedPlayer) {
                fallOfWickets.push({
                    over: ball.over,
                    ballNumber: ball.ball,
                    player: ball.wicket.dismissedPlayer,
                    bowler: ball.bowler,
                    type: ball.wicket.type,
                    takenBy: ball.wicket.takenBy,
                    runsScore: totalRuns,
                    ballReference: ball._id,
                });
            }

            if (nonStrikerId) {
                nonStrikers.push(nonStrikerId);
            }
        }

        // Now create unique player stats
        const combinedPlayerIds = new Set<string>([
            ...battingStats.keys(),
            ...bowlingStats.keys(),
        ]);

        teamAnalytics.playerStats = Array.from(combinedPlayerIds).map(playerId => {
            const batting = battingStats.get(playerId);
            const bowling = bowlingStats.get(playerId);

            return {
                player: new mongoose.Types.ObjectId(playerId),
                batting: batting || undefined,
                bowling: bowling || undefined,
            };
        }) as unknown as PlayerStats[];

        teamAnalytics.fallOfWickets = fallOfWickets;

        // Top scorer
        const topScorer = Array.from(battingStats.entries())
            .sort((a, b) => (b[1]?.runs || 0) - (a[1]?.runs || 0))[0];
        if (topScorer) {
            teamAnalytics.summary = teamAnalytics.summary || {};
            teamAnalytics.summary.topScorer = topScorer[0] ? new mongoose.Types.ObjectId(topScorer[0]) as unknown as string : null;
        }

        // Top wicket taken
        const topWicketTaken = Array.from(bowlingStats.entries())
            .sort((a, b) => (b[1]?.totalWicketTaken || 0) - (a[1]?.totalWicketTaken || 0))[0];
        if (topWicketTaken) {
            teamAnalytics.summary = teamAnalytics.summary || {};
            teamAnalytics.summary.topWicketTaken = topWicketTaken[0] ? new mongoose.Types.ObjectId(topWicketTaken[0]) as unknown as string : null;
        }

        // Identify players who are yet to bat
        teamAnalytics.yetToBatPlayers = Array.from(playingEleven).filter(playerId => !battingStats.has(playerId.toString()) || !nonStrikers.includes(playerId.toString()));

        teamAnalytics.ballFaced = ballFaced;

        return teamAnalytics;
    }

    private calculateTotalRuns(balls: Ball[]): number {
        return balls.reduce((sum, ball) => sum + (+ball?.runs_off_bat) + +(ball.extras?.total ?? 0), 0);
    }

    private calculateNetRunRate(totalRuns: number, totalBalls: number): number {
        return totalBalls ? (totalRuns / (totalBalls / 6)) : 0;
    }

    private initializeBattingStat(): BattingStats {
        return {
            overPlayedIn: [],
            runs: 0,
            ballsFaced: 0,
            0: 0,
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0,
            strikeRate: 0,
            timeSpend: 0,
            shot: [],
        };
    }

    private updateBattingStat(stat: BattingStats, ball: Ball) {
        const checklegalDelivery = !(+(ball.extras?.wides ?? 0) || +(ball.extras?.noballs ?? 0));
        if (checklegalDelivery) {
            stat.ballsFaced++;
        }
        stat.runs += (+ball.runs_off_bat);

        const playingOverIn = stat.overPlayedIn.find((i) => (i.over === ball.over));
        const has0s = ball.runs_off_bat == 0 && checklegalDelivery ? 1 : 0;
        const has1s = ball.runs_off_bat == 1 ? 1 : 0;
        const has2s = ball.runs_off_bat == 2 ? 1 : 0;
        const has3s = ball.runs_off_bat == 3 ? 1 : 0;
        const has5s = ball.runs_off_bat == 5 ? 1 : 0;
        if (!playingOverIn) {
            let ballsFaced = 0;
            if (checklegalDelivery) {
                ballsFaced = 1;
            }
            stat.overPlayedIn.push({ over: ball.over, runs: +ball.runs_off_bat, ballsFaced, 0: has0s, 1: has1s, 2: has2s, 3: has3s, 4: ball.foursHit || 0, 5: has5s, 6: ball.sixHit || 0 });
        } else {
            playingOverIn.runs += (+ball.runs_off_bat);
            playingOverIn[0] += has0s;
            playingOverIn[1] += has1s;
            playingOverIn[2] += has2s;
            playingOverIn[3] += has3s;
            playingOverIn[4] += +(ball.foursHit || 0);
            playingOverIn[5] += has5s;
            playingOverIn[6] += +(ball.sixHit || 0);
            if (checklegalDelivery) {
                playingOverIn.ballsFaced++;
            }
        }

        const hasBallRuns = stat[ball.runs_off_bat] !== undefined;

        if ((has0s && hasBallRuns) || (checklegalDelivery && hasBallRuns) || (+ball.runs_off_bat && hasBallRuns)) {
            stat[ball.runs_off_bat]++;
        }

        if (ball.striker?.shot) {
            stat.shot.push({
                over: ball.over,
                bowler: ball.bowler,
                angle: ball.striker.shot.angle,
                distance: ball.striker.shot.distance,
                runs: +ball.runs_off_bat,
                // shotType: ball.striker.shot.type,
                // result: ball.wicket ? 'out' : 'not out'
            });
        }

        stat.strikeRate = stat.ballsFaced ? (stat.runs / stat.ballsFaced) * 100 : 0;
    }

    private initializeBowlingStat(): BowlingStats {
        return {
            overs: 0,
            ballsBowled: 0,
            runsConceded: 0,
            totalNoBall: 0,
            totalWicketTaken: 0,
            totalWide: 0,
            totalFourConceded: 0,
            totalSixConceded: 0,
            totalMaidenOvers: 0,
            totalDotBalls: 0,
            economyRate: 0,
            // phases: [],
        };
    }

    private updateBowlingStat(stat: BowlingStats, ball: Ball, bowlerId: string) {
        ball.runs_off_bat = +ball.runs_off_bat;
        const checklegalDelivery = !(+(ball.extras?.wides ?? 0) || +(ball.extras?.noballs ?? 0));
        const hasDotBall = ball.runs_off_bat === 0;
        if (checklegalDelivery) {
            stat.ballsBowled++;
        }
        stat.runsConceded += ball.runs_off_bat + (!checklegalDelivery ? +(ball.extras?.total ?? 0) : 0);

        if (ball.extras?.noballs) stat.totalNoBall++;
        if (ball.extras?.wides) stat.totalWide++;

        if (ball.wicket.dismissedPlayer && ball.wicket.takenBy.find((i) => i.toString() === bowlerId)) stat.totalWicketTaken++;

        if (+ball.runs_off_bat === 4) stat.totalFourConceded++;
        if (+ball.runs_off_bat === 6) stat.totalSixConceded++;
        if (checklegalDelivery && hasDotBall) stat.totalDotBalls++;

        const ballBowledWithDecimal = stat.ballsBowled / 6;

        stat.overs = Math.floor(ballBowledWithDecimal);
        stat.economyRate = stat.ballsBowled ? (stat.runsConceded / stat.overs) : 0;

        if (checklegalDelivery && stat.ballsBowled === ball.ball && hasDotBall) {
            stat[`_current${ball.over}`] += 1;
        }
        if (stat[`_current${ball.over}`] === 6) {
            stat.totalMaidenOvers++;
            stat[`_current${ball.over}`] = 0;
        }
    }
}
