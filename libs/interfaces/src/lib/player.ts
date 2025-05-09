import { Gender } from "@cricket-analysis-monorepo/constants";
import { PlayerRole, BattingStyle } from "@cricket-analysis-monorepo/constants";

export interface Player {
    name: string;
    role: PlayerRole;
    teams: { id: string, capNumber: number }[];
    season: number;
    shortName: string;
    gender: Gender;
    dob: string;
    profilePictureUrl: string;
    uniqueId: string;
    bowlingStyle: { code: string; name: string };
    battingStyle: BattingStyle;
    debut: object;
    aboutMe: string;
}
