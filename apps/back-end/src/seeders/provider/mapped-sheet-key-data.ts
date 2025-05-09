import { MappingData } from "../../database/model/mapping.model";
import { MatchInfo } from "../../database/model/match-info.model";
import { MatchScoreboard } from "../../database/model/match-scoreboard.model";
import { Player } from "../../database/model/player.model";
import { Referee } from "../../database/model/referee.model";
import { Team } from "../../database/model/team.model";
import { Tournament } from "../../database/model/tournament.model";
import { Umpire } from "../../database/model/umpire.model";
import { Venue } from "../../database/model/venue.model";

export const MAPPED_SHEET_KEY_DATA: MappingData[] = [
    {
        collectionName: Tournament.name,
        fields: {
            event: [
                "event"
            ],
            gender: [
                "gender"
            ],
            startDate: ["date"]
        }
    },
    {
        collectionName: Venue.name,
        fields: {
            name: [
                "venue"
            ],
            city: [
                "city"
            ],
        }
    },
    {
        collectionName: Team.name,
        fields: {
            name: [
                "team1",
                "team2",
            ],
        }
    },
    {
        collectionName: Player.name,
        fields: {
            name: [
                "registry1", "registry2", "registry3", "registry4", "registry5", "registry6", "registry7", "registry8", "registry9", "registry10", "registry11", "registry12", "registry13", "registry14", "registry15", "registry16", "registry17", "registry18", "registry19", "registry20", "registry21", "registry22", "registry23", "registry24", "registry25", "registry26", "registry27", "registry28",
            ],
            uniqueId: [
            ],
            gender: [
                "gender"
            ],
        }
    },
    {
        collectionName: Referee.name,
        fields: {
            name: [
                "match_referee",
            ],
        }
    },
    {
        collectionName: Umpire.name,
        fields: {
            name: [
                "umpire1",
                "umpire2",
                "reserve_umpire",
                "tv_umpire"
            ],
        }
    },
    {
        collectionName: MatchInfo.name,
        fields: {
            "toss.winnerTeam": [
                "toss_winner",
            ],
            "toss.winnerTeamDecision": [
                "toss_decision",
            ],
            "result.playerOfMatch": [
                "player_of_match"
            ],
            "result.winningTeam": [
                "winner"
            ],
            "result.winBy": [
                "winner_wickets"
            ],
            "result.status": [
                "winner_wickets"
            ],
            "umpire.fourthUmpire": [
                "tv_umpire"
            ],
            "umpire.thirdUmpire": [
                "reserve_umpire"
            ],
            "umpire.onFieldBowlerEndUmpire": [
                "umpire1"
            ],
            "umpire.onFieldLegUmpire": [
                "umpire2"
            ],
            "team1.team": [
                "team1"
            ],
            "team2.team": [
                "team2"
            ],
            "team1.playingEleven.$": [
                "player1", "player2", "player3", "player4", "player5", "player6", "player7", "player8", "player9", "player10", "player11",
            ],
            "team2.playingEleven.$": [
                "player12", "player13", "player14", "player15", "player16", "player17", "player18", "player19", "player20", "player21", "player22",
            ]
        }
    },
    {
        collectionName: MatchScoreboard.name,
        fields: {
            "balls.$.ball": [
                "ball",
            ],
            "balls.$.striker.player": [
                "striker",
            ],
            "balls.$.non_striker.player": [
                "non_striker"
            ],
            "balls.$.bowler": [
                "bowler"
            ],
            "balls.$.runs_off_bat": [
                "runs_off_bat"
            ],
            "balls.$.extras.total": [
                "extras"
            ],
            "balls.$.extras.wides": [
                "wides"
            ],
            "balls.$.extras.noballs": [
                "noballs"
            ],
            "balls.$.extras.penalty": [
                "penalty"
            ],
            "balls.$.extras.byes": [
                "byes"
            ],
            "balls.$.extras.legbyes": [
                "legbyes"
            ],
            "balls.$.wicket.type": [
                "wicket_type",
                "other_wicket_type"
            ],
            "balls.$.wicket.dismissedPlayer": [
                "player_dismissed",
                "other_player_dismissed"
            ],
        }
    },
];