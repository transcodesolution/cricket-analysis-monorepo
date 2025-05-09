import { City, Country, PitchType } from '@cricket-analysis-monorepo/constants';

export interface IVenue {
  location: string;
  name: string;
  pitchType: PitchType;
  country: Country;
  city: City;
}