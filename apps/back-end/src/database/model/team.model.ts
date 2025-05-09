import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { MatchFormat, TournamentType } from "@cricket-analysis-monorepo/constants";
import { ITeam } from '@cricket-analysis-monorepo/interfaces';

@Schema({ timestamps: true, versionKey: false })
export class Team implements ITeam {
    @Prop({ default: '' })
    name: string;

    @Prop({})
    membersCount: number;

    @Prop({ type: SchemaTypes.ObjectId, index: true })
    captainId: string | null;

    @Prop({ default: '' })
    shortName: string;

    @Prop({ type: String, enum: Object.values(MatchFormat) })
    formatPlayed: MatchFormat;

    @Prop({ type: String, enum: Object.values(TournamentType) })
    tournamentType: TournamentType;

    @Prop({ default: '' })
    foundedYear: string;

    @Prop({ default: '' })
    logoUrl: string;

    constructor() {
        this.name = '';
        this.membersCount = 0;
        this.captainId = null;
        this.shortName = '';
        this.formatPlayed = MatchFormat.T20;
        this.tournamentType = TournamentType.DOMESTIC;
        this.foundedYear = '';
        this.logoUrl = '';
    }
}

export const TeamSchema = SchemaFactory.createForClass(Team);