import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Country, MatchFormat, TournamentName, TournamentType } from "@cricket-analysis-monorepo/constants";
import { Gender } from '@cricket-analysis-monorepo/constants';

@Schema({ timestamps: true, versionKey: false })
export class Tournament {
    _id: string;

    @Prop({ type: String, enum: TournamentName })
    event: TournamentName;

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

    @Prop({ type: String, enum: Gender })
    gender: string;

    @Prop()
    logo: string;

    @Prop({ enum: Object.values(TournamentType) })
    type: string;

    @Prop({ type: String, enum: Country })
    country: Country;

    @Prop({
        type: String,
        default: MatchFormat.ODI,
        enum: MatchFormat,
        index: true
    })
    matchFormat: MatchFormat;

    constructor() {
        this.event = TournamentName.ipl;
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
        this.type = '';
        this.country = Country.India;
        this.matchFormat = MatchFormat.T20;
    }
}

export const TournamentSchema = SchemaFactory.createForClass(Tournament);
