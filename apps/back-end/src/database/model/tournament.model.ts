import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Country, MatchFormat, TournamentBoard, TournamentType } from "@cricket-analysis-monorepo/constants";
import { Gender } from '@cricket-analysis-monorepo/constants';

@Schema({ timestamps: true, versionKey: false })
export class Tournament {
    @Prop()
    event: string;

    @Prop({
        type: {
            contact: { type: String, default: '' },
            countryCode: { type: String, default: '' },
            email: { type: String, default: '' },
            name: { type: String, default: '' },
        },
    })
    organizerDetails: {
        contact: string;
        countryCode: string;
        email: string;
        name: string;
    };

    @Prop({ type: Date })
    endDate: Date | null;

    @Prop({ type: Date })
    startDate: Date | null;

    @Prop({ type: String, enum: Object.values(Gender) })
    gender: string;

    @Prop()
    logo: string;

    @Prop()
    season: string;

    @Prop({ enum: Object.values(TournamentBoard) })
    board: string;

    @Prop({ enum: Object.values(TournamentType) })
    type: string;

    @Prop({ type: String, enum: Country })
    country: Country;

    @Prop({
        type: String,
        default: MatchFormat.ODI,
        enum: Object.values(MatchFormat),
    })
    matchFormat: MatchFormat;

    constructor() {
        this.event = '';
        this.gender = '';
        this.organizerDetails = {
            contact: '',
            countryCode: '',
            email: '',
            name: '',
        };
        this.endDate = null;
        this.startDate = null;
        this.logo = '';
        this.season = '';
        this.board = '';
        this.type = '';
        this.country = Country.India;
        this.matchFormat = MatchFormat.ODI;
    }
}

export const TournamentSchema = SchemaFactory.createForClass(Tournament);
