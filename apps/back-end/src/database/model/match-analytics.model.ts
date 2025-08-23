import { WicketType } from '@cricket-analysis-monorepo/constants';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { MatchInfo } from './match-info.model';

export class BattingStats {
    @Prop({
        type: [{
            over: Number,
            runs: Number,
            ballsFaced: Number,
            0: Number,
            1: Number,
            2: Number,
            3: Number,
            4: Number,
            5: Number,
            6: Number,
        }],
        default: [],
    })
    overPlayedIn?: Array<{
        over: number,
        runs: number,
        ballsFaced: number,
        0: number,
        1: number,
        2: number,
        3: number,
        4: number,
        5: number,
        6: number,
    }>;
    @Prop()
    runs?: number;
    @Prop()
    ballsFaced?: number;
    @Prop()
    0?: number;
    @Prop()
    1?: number;
    @Prop()
    2?: number;
    @Prop()
    3?: number;
    @Prop()
    4?: number;
    @Prop()
    5?: number;
    @Prop()
    6?: number;
    @Prop()
    strikeRate?: number;
    @Prop()
    timeSpend?: number;
    @Prop({
        type: [{
            over: Number,
            bowler: SchemaTypes.ObjectId,
            angle: Number,
            distance: Number,
            runs: Number,
            shotType: String,
            result: String
        }]
    })
    shot?: {
        over?: number,
        bowler?: string,
        angle?: number,
        distance?: number,
        runs?: number,
        shotType?: string,
        result?: string
    }[];
}

export class BowlingStats {
    @Prop()
    overs?: number;
    @Prop()
    ballsBowled?: number;
    @Prop()
    runsConceded?: number;
    @Prop()
    totalNoBall?: number;
    @Prop()
    totalWicketTaken?: number;
    @Prop()
    totalWide?: number;
    @Prop()
    totalFourConceded?: number;
    @Prop()
    totalSixConceded?: number;
    @Prop()
    totalMaidenOvers?: number;
    @Prop()
    totalDotBalls?: number;
    @Prop()
    economyRate?: number;
    // @Prop()
    // phases?: { powerPlay?: number, middle?: number, Death?: number }[];
}

export class FallOfWickets {
    @Prop()
    over?: number;
    @Prop()
    ballNumber?: number;
    @Prop()
    player?: string;
    @Prop()
    bowler?: string;
    @Prop({ type: String, enum: WicketType })
    type?: WicketType;
    @Prop({ type: [String], default: [] })
    takenBy?: string[];
    @Prop()
    runsScore?: number;
    @Prop({ type: SchemaTypes.ObjectId })
    ballReference?: string;
}

export class PlayerStats {
    @Prop()
    batting?: BattingStats;
    @Prop()
    bowling?: BowlingStats;
    @Prop()
    player?: string;
}

export class MatchSummary {
    @Prop({ type: SchemaTypes.ObjectId })
    topScorer?: string;
    @Prop()
    totalWicketTaken?: number;
    @Prop({ type: SchemaTypes.ObjectId })
    topWicketTaken?: string;
    @Prop()
    margin?: number;
}

export class TeamAnalytics {
    @Prop()
    runsScored?: number;

    @Prop()
    ballFaced?: number;

    @Prop()
    netRunRate?: number;

    @Prop({
        type: [{
            over: Number,
            ballNumber: Number,
            player: SchemaTypes.ObjectId,
            bowler: SchemaTypes.ObjectId,
            runsScore: Number,
        }]
    })
    fallOfWickets?: FallOfWickets[];

    @Prop({
        type: [{
            batting: BattingStats,
            bowling: BowlingStats,
            player: SchemaTypes.ObjectId,
        }]
    })
    playerStats?: PlayerStats[];

    @Prop({ type: SchemaTypes.ObjectId })
    team?: string;

    @Prop({ type: [SchemaTypes.ObjectId] })
    yetToBatPlayers?: string[];

    @Prop({
        type: MatchSummary
    })
    summary?: MatchSummary;

    @Prop({
        type: Object
    })
    overRuns?: Record<string, number>;

    constructor() {
        this.fallOfWickets = [{}];
        this.playerStats = [{}];
        this.team = "";
        this.yetToBatPlayers = [""];
    }
}

@Schema({ timestamps: true, versionKey: false })
export class MatchAnalytics {
    @Prop()
    totalBallFaced: number;

    @Prop()
    totalRuns: number;

    @Prop({ type: SchemaTypes.ObjectId, ref: MatchInfo.name, index: true })
    matchId: string;

    @Prop({ type: TeamAnalytics })
    inningOne: TeamAnalytics;

    @Prop({ type: TeamAnalytics })
    inningTwo: TeamAnalytics;

    @Prop({ type: TeamAnalytics })
    inningThree: TeamAnalytics;

    @Prop({ type: TeamAnalytics })
    inningFour: TeamAnalytics;
}

export const MatchAnalyticsSchema = SchemaFactory.createForClass(MatchAnalytics);

MatchAnalyticsSchema.index({ 'inningOne.playerStats.batting.overPlayedIn.over': 1 });
MatchAnalyticsSchema.index({ 'inningOne.playerStats.batting.player': 1 });
MatchAnalyticsSchema.index({ 'inningOne.team': 1 });
MatchAnalyticsSchema.index({ 'inningOne.fallOfWickets.ballReference': 1 });
MatchAnalyticsSchema.index({ 'inningTwo.playerStats.batting.overPlayedIn.over': 1 });
MatchAnalyticsSchema.index({ 'inningTwo.playerStats.batting.player': 1 });
MatchAnalyticsSchema.index({ 'inningTwo.team': 1 });
MatchAnalyticsSchema.index({ 'inningTwo.fallOfWickets.ballReference': 1 });
MatchAnalyticsSchema.index({ 'inningThree.playerStats.batting.overPlayedIn.over': 1 });
MatchAnalyticsSchema.index({ 'inningThree.playerStats.batting.player': 1 });
MatchAnalyticsSchema.index({ 'inningThree.team': 1 });
MatchAnalyticsSchema.index({ 'inningThree.fallOfWickets.ballReference': 1 });
MatchAnalyticsSchema.index({ 'inningFour.playerStats.batting.overPlayedIn.over': 1 });
MatchAnalyticsSchema.index({ 'inningFour.playerStats.batting.player': 1 });
MatchAnalyticsSchema.index({ 'inningFour.team': 1 });
MatchAnalyticsSchema.index({ 'inningFour.fallOfWickets.ballReference': 1 });