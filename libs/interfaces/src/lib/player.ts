import { Gender, PlayerRole, BattingStyle, BowlingStyleType } from "@cricket-analysis-monorepo/constants";

export interface IPlayer {
    name: string;
    role: PlayerRole;
    teams: { id: string; capNumber: number }[];
    shortName: string;
    gender: Gender;
    dob: string;
    profilePictureUrl: string;
    uniqueId: string;
    bowlingStyle: BowlingStyleType;
    battingStyle: BattingStyle;
    debut: Record<string, string>; // or a stricter type if you have structure
    aboutMe: string;
}