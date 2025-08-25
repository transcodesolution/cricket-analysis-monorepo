import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { BattingStyle, SubstituteReasonType, WicketType } from '@cricket-analysis-monorepo/constants';
import { MatchInfo } from './match-info.model';

export class Wicket {
    @Prop({ type: SchemaTypes.ObjectId })
    dismissedPlayer?: string;
    @Prop({ type: [SchemaTypes.ObjectId] })
    takenBy?: string[];
    @Prop({ type: String, enum: WicketType })
    type?: WicketType;
}

export class Ball {
    _id?: string;
    over?: number;

    @Prop({ type: Number })
    ball: number;

    @Prop({ type: Number })
    foursHit: number;

    @Prop({ type: Number })
    sixHit: number;

    @Prop({ type: SchemaTypes.ObjectId, index: true })
    bowler: string;

    @Prop({ type: { player: SchemaTypes.ObjectId }, index: true })
    non_striker: {
        player: string;
    };

    @Prop({ type: Number })
    runs_off_bat: number;

    @Prop({
        type: {
            player: { type: SchemaTypes.ObjectId, index: true },
            position: { type: String, enum: BattingStyle },
            shot: {
                name: String,
                type: String,
                angle: Number,
                distance: Number,
            },
        },
    })
    striker: {
        player: string;
        position: BattingStyle;
        shot: {
            name: string;
            type: string;
            angle: number;
            distance: number;
        };
    };

    @Prop({
        type: {
            player: { type: SchemaTypes.ObjectId, index: true },
            reasonType: { type: String, enum: SubstituteReasonType },
            replacedPlayer: { type: SchemaTypes.ObjectId },
        },
    })
    substitute: {
        player: string;
        reasonType: SubstituteReasonType;
        replacedPlayer: string;
    };

    @Prop({
        type: Wicket,
    })
    wicket: Wicket;

    @Prop()
    winningChance: number;

    @Prop({
        type: {
            byes: Number,
            fours: Number,
            legbyes: Number,
            noballs: Number,
            penalty: Number,
            sixes: Number,
            total: Number,
            wides: Number,
            dots: Number,
        }
    })
    extras: Partial<Record<"byes" | "legbyes" | "noballs" | "penalty" | "total" | "wides" | "dots", number>>;

    constructor() {
        this.ball = 0;
        this.bowler = '';
        this.non_striker = { player: '' };
        this.runs_off_bat = 0;
        this.striker = {
            player: '',
            position: BattingStyle.LEFT_HAND,
            shot: { name: '', type: '', angle: 0, distance: 0 },
        };
        this.substitute = {
            player: '',
            reasonType: SubstituteReasonType.injured,
            replacedPlayer: '',
        };
        this.wicket = { dismissedPlayer: "", takenBy: [""], type: WicketType.bowled };
        this.winningChance = 0;
        this.extras = { byes: 0, legbyes: 0, noballs: 0, penalty: 0, total: 0, wides: 0 };
    }
}

@Schema({ timestamps: true, versionKey: false })
export class MatchScoreboard {
    _id: Types.ObjectId;

    @Prop({ type: Number, index: true })
    over: number;

    @Prop({ type: SchemaTypes.ObjectId, ref: MatchInfo.name, index: true })
    match_id: string;

    @Prop({ type: String, index: true })
    sheet_match_id: string;

    @Prop({ type: Number, index: true })
    innings: number;

    @Prop({ type: [Ball] })
    balls: Ball[];

    other?: object;

    constructor() {
        this.over = 0;
        this.match_id = '';
        this.sheet_match_id = '';
        this.innings = 0;
        this.balls = [];
        this.other = {};
    }
}

export const MatchScoreboardSchema = SchemaFactory.createForClass(MatchScoreboard);