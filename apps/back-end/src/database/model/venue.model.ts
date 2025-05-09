import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { City, Country, PitchType } from '@cricket-analysis-monorepo/constants';

@Schema({ timestamps: true, versionKey: false })
export class Venue {
    @Prop({ default: '' })
    location: string;

    @Prop({ default: '' })
    name: string;

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
        this.name = '';
        this.pitchType = PitchType.Wet;
        this.country = Country.India;
        this.city = City.Mumbai;
    }
}

export const VenueSchema = SchemaFactory.createForClass(Venue);