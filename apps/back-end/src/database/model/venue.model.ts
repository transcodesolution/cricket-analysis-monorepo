import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { City, Country, PitchType, VenueName } from '@cricket-analysis-monorepo/constants';

@Schema({ timestamps: true, versionKey: false })
export class Venue {
    _id: string;

    @Prop({ default: '' })
    location: string;

    @Prop({ type: String, enum: VenueName })
    name: VenueName;

    @Prop({
        type: String,
        enum: Object.values(PitchType),
    })
    pitchType: PitchType;

    @Prop({ type: String, enum: Object.values(Country) })
    country: Country;

    @Prop({ type: String, enum: Object.values(City) })
    city: City;

    constructor() {
        this.location = '';
        this.name = VenueName.Arun_Jaitley_Stadium;
        this.pitchType = PitchType.Wet;
        this.country = Country.India;
        this.city = City.Mumbai;
    }
}

export const VenueSchema = SchemaFactory.createForClass(Venue);