import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { TossResult, WinnerTeamDecision, MatchStatus, MatchMethod } from '@cricket-analysis-monorepo/constants';
import { BallType, Brand, Color } from '@cricket-analysis-monorepo/constants';

@Schema({ timestamps: true, versionKey: false })
export class MatchInfo {
    @Prop()
    name: string;

    @Prop({ type: Date, index:true })
    start_date: string;

    @Prop({ type: SchemaTypes.ObjectId })
    venue: string;

    @Prop({ type: Date })
    end_date: string;

    @Prop({ type: SchemaTypes.ObjectId })
    referee: string;

    @Prop({ type: String, enum: MatchMethod })
    method: MatchMethod;

    @Prop({
        type: {
            fourthUmpire: SchemaTypes.ObjectId,
            onFieldBowlerEndUmpire: SchemaTypes.ObjectId,
            onFieldLegUmpire: SchemaTypes.ObjectId,
            thirdUmpire: SchemaTypes.ObjectId,
        }
    })
    umpire: {
        fourthUmpire: string;
        onFieldBowlerEndUmpire: string;
        onFieldLegUmpire: string;
        thirdUmpire: string;
    };

    @Prop({
        type: {
            tossResult: { type: String, enum: TossResult },
            winnerTeam: SchemaTypes.ObjectId,
            winnerTeamDecision: { type: String, enum: WinnerTeamDecision },
        }
    })
    toss: {
        tossResult: TossResult;
        winnerTeam: string;
        winnerTeamDecision: WinnerTeamDecision;
    };

    @Prop()
    match_number: number;

    @Prop({ index: true })
    match_id: string;

    @Prop()
    summary: string;

    @Prop({
        type: {
            impactPlayerIn: SchemaTypes.ObjectId,
            impactPlayerOut: SchemaTypes.ObjectId,
            playingEleven: { type: [SchemaTypes.ObjectId], index: true },
            substitutePlayers: [SchemaTypes.ObjectId],
            team: { type: SchemaTypes.ObjectId, index: true },
        }
    })
    team2: {
        impactPlayerIn: string;
        impactPlayerOut: string;
        playingEleven: string[];
        substitutPlayers: string[];
        team?: string;
    };

    @Prop({ type: SchemaTypes.ObjectId, index: true })
    tournamentId: string;

    @Prop({
        type: {
            brand: { type: String, enum: Brand },
            color: { type: String, enum: Color },
            type: { type: String, enum: BallType },
        }
    })
    ball: {
        brand: string;
        color: string;
        type: string;
    };

    @Prop({
        type: {
            impactPlayerIn: SchemaTypes.ObjectId,
            impactPlayerOut: SchemaTypes.ObjectId,
            playingEleven: { type: [SchemaTypes.ObjectId], index: true },
            substitutePlayers: [SchemaTypes.ObjectId],
            team: { type: SchemaTypes.ObjectId, index: true },
        }
    })
    team1: {
        impactPlayerIn: string;
        impactPlayerOut: string;
        playingEleven: string[];
        substitutePlayers: string[];
        team?: string;
    };

    @Prop({
        type: {
            playerOfMatch: [SchemaTypes.ObjectId],
            status: { type: String, enum: MatchStatus },
            winBy: Number,
            winningTeam: SchemaTypes.ObjectId,
            eliminator: SchemaTypes.ObjectId
        }
    })
    result: {
        playerOfMatch: string[];
        status: MatchStatus;
        winBy: number;
        winningTeam: string;
        eliminator: string;
    };

    @Prop()
    balls_per_over: number;

    constructor() {
        this.name = '';
        this.start_date = '';
        this.method = MatchMethod.DLS;
        this.end_date = '';
        this.balls_per_over = 6;
        this.toss = {
            tossResult: TossResult.head,
            winnerTeam: '',
            winnerTeamDecision: WinnerTeamDecision.bat,
        };
        this.match_number = 0;
        this.match_id = "";
        this.summary = '';
        this.team2 = {
            impactPlayerIn: '',
            impactPlayerOut: '',
            playingEleven: [],
            substitutPlayers: [],
        };
        this.tournamentId = '';
        this.ball = {
            brand: '',
            color: '',
            type: '',
        };
        this.team1 = {
            impactPlayerIn: '',
            impactPlayerOut: '',
            playingEleven: [],
            substitutePlayers: [],
        };
        this.result = {
            playerOfMatch: [],
            status: MatchStatus.tie,
            winBy: 0,
            winningTeam: '',
            eliminator: ""
        };
    }
}

export const MatchInfoSchema = SchemaFactory.createForClass(MatchInfo);