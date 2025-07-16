import { FormInputElement, MatchFormat, TournamentName, TournamentType } from "@cricket-analysis-monorepo/constants";
import { MatchInfo } from "../../database/model/match-info.model";
import { Ball, MatchScoreboard } from "../../database/model/match-scoreboard.model";
import { Player } from "../../database/model/player.model";
import { Referee } from "../../database/model/referee.model";
import { Team } from "../../database/model/team.model";
import { Tournament } from "../../database/model/tournament.model";
import { Umpire } from "../../database/model/umpire.model";
import { Venue } from "../../database/model/venue.model";
import { IFormInput } from "@cricket-analysis-monorepo/interfaces";

function getDeepKeys<T>(obj: T, parent = ''): string[] {
    let keys: string[] = [];

    for (const key in obj) {
        if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;

        const value = obj[key];
        const currentPath = parent ? `${parent}.${key}` : key;

        if (Array.isArray(value)) {
            if (value.length > 0 && typeof value[0] === 'object') {
                // Use `$.` notation for arrays of objects
                keys = keys.concat(getDeepKeys(value[0], `${currentPath}`));
            } else {
                // Array of primitives
                keys.push(`${currentPath}`);
            }
        } else if (value !== null && typeof value === 'object') {
            // Recurse into nested object
            keys = keys.concat(getDeepKeys(value, currentPath));
        } else {
            // Primitive value
            keys.push(currentPath);
        }
    }

    return keys;
}


export const DatabaseFields = {
    Tournament: () => {
        const tournamentObj = new Tournament();
        return getDeepKeys(tournamentObj, "");
    },
    Venue: () => {
        const venueObj = new Venue();
        return Object.keys(venueObj);
    },
    Referee: () => {
        const refereeObj = new Referee();
        return Object.keys(refereeObj);
    },
    Player: () => {
        const playerObj = new Player();
        return getDeepKeys(playerObj, "");
    },
    Team: () => {
        const teamObj = new Team();
        return Object.keys(teamObj);
    },
    MatchInfo: () => {
        const matchInfoObj = new MatchInfo();
        return getDeepKeys(matchInfoObj, "");
    },
    MatchScoreboard: () => {
        const matchScoreboardObj = new MatchScoreboard();
        const ball = new Ball();
        matchScoreboardObj.balls.push(ball);
        return getDeepKeys(matchScoreboardObj, "");
    },
    Umpire: () => {
        const umpireObj = new Umpire();
        return Object.keys(umpireObj);
    },
}

export const UIInputRequiredFieldConfiguration: Record<string, () => IFormInput> = {
    matchFormat: () => ({ label: "Match Format", key: "matchFormat", elementType: FormInputElement.dropdown, options: Object.values(MatchFormat) }),
    type: () => ({ label: "Tournament Type", key: "type", elementType: FormInputElement.dropdown, options: Object.values(TournamentType) }),
    event: () => ({ label: "Tournament Name", key: "event", elementType: FormInputElement.dropdown, options: Object.values(TournamentName) }),
}