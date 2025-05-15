import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';

export class BattingStats {
    @Prop({
        type: [{
            over: Number,
            runs: Number,
            0: Number,
            1: Number,
            2: Number,
            3: Number,
            4: Number,
            5: Number,
            6: Number,
        }]
    })
    overPlayedIn?: {
        over: number,
        runs: number,
        0: number,
        1: number,
        2: number,
        3: number,
        4: number,
        5: number,
        6: number,
    }[];
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
        type: {
            over: Number,
            bowler: SchemaTypes.ObjectId,
            angle: Number,
            distance: Number,
            runs: Number,
            shotType: String,
            result: String
        }
    })
    shot?: {
        over?: number,
        bowler?: string,
        angle?: number,
        distance?: number,
        runs?: number,
        shotType?: string,
        result?: string
    };
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
    @Prop()
    runsScore?: number;
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

    @Prop({ type: SchemaTypes.ObjectId })
    matchId: string;

    @Prop({ type: TeamAnalytics })
    teamOne: TeamAnalytics;

    @Prop({ type: TeamAnalytics })
    teamTwo: TeamAnalytics;

    constructor() {
        this.totalBallFaced = 0;
        this.totalRuns = 0;
        this.matchId = '';
        this.teamTwo = {};
        this.teamOne = {};
    }
}

export const MatchAnalyticsSchema = SchemaFactory.createForClass(MatchAnalytics);