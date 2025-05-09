import { Country } from "@cricket-analysis-monorepo/constants";
import { UmpireType, UmpireSubType } from "@cricket-analysis-monorepo/constants";

export interface Umpire {
    name: string;
    type: UmpireType;
    subType: UmpireSubType;
    country: Country;
    dob: string;
}