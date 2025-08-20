import { MatchFormat, TournamentType } from "@cricket-analysis-monorepo/constants";
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
            startDate: [],
            season: []
        },
        inputs: [
            {
                referenceKey: "event",
                referenceValue: "ICC Champions Trophy",
                matchFormat: MatchFormat.ODI,
                type: TournamentType.INTERNATIONAL,
            },
            {
                referenceKey: "event",
                referenceValue: "Malta Tri-Nation T20I Series",
                matchFormat: MatchFormat.T20,
                type: TournamentType.INTERNATIONAL,
            },
            {
                referenceKey: "event",
                referenceValue: "ICC Women's World Cup",
                matchFormat: MatchFormat.ODI,
                type: TournamentType.INTERNATIONAL,
            },
            {
                referenceKey: "event",
                referenceValue: "ICC Men's T20 World Cup",
                matchFormat: MatchFormat.T20,
                type: TournamentType.INTERNATIONAL,
            },
            {
                referenceKey: "event",
                referenceValue: "World T20",
                matchFormat: MatchFormat.T20,
                type: TournamentType.DOMESTIC,
            },
            {
                referenceKey: "event",
                referenceValue: "Indian Premier League",
                matchFormat: MatchFormat.T20,
                type: TournamentType.DOMESTIC,
            },
        ]
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
                "batting_team",
                "bowling_team",
            ],
        }
    },
    {
        collectionName: Player.name,
        fields: {
            name: [
                "registry1", "registry2", "registry3", "registry4", "registry5", "registry6", "registry7",
                "registry8", "registry9", "registry10", "registry11", "registry12", "registry13", "registry14",
                "registry15", "registry16", "registry17", "registry18", "registry19", "registry20", "registry21",
                "registry22", "registry23", "registry24", "registry25", "registry26", "registry27", "registry28",
                "registry29", "registry30", "registry31", "registry32", "registry33", "registry34", "registry35",
                "registry36", "registry37", "registry38", "registry39", "registry40", "registry41", "registry42"
            ],
            uniqueId: [
            ],
            gender: [],
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
            "venue": ["venue"],
            "tournamentId": ["event"],
            "toss.winnerTeam": [
                "toss_winner",
            ],
            "toss.winnerTeamDecision": [
                "toss_decision",
            ],
            "result.playerOfMatch": [
                "player_of_match",
                "player_of_match1",
                "player_of_match2",
            ],
            "result.winningTeam": [
                "winner"
            ],
            "result.winBy": [
                "winner_wickets",
                "winner_runs"
            ],
            "result.status": [
                "winner_wickets",
                "winner_runs",
                "outcome"
            ],
            "result.eliminator": [
                "eliminator"
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
            "referee": [
                "match_referee"
            ],
            "start_date": [
                "date",
                "date1"
            ],
            "end_date": [
                "date",
                "date2"
            ],
            "team1.playingEleven": [
                "player1", "player2", "player3", "player4", "player5", "player6", "player7",
                "player8", "player9", "player10", "player11", "player12", "player13", "player14",
                "player15", "player16", "player17", "player18", "player19", "player20", "player21",
                "player22", "player23", "player24", "player25", "player26", "player27", "player28",
                "player29", "player30", "player31", "player32", "player33", "player34", "player35",
                "player36", "player37", "player38", "player39", "player40", "player41", "player42"
            ],
            "team2.playingEleven": [
                "registry1", "registry2", "registry3", "registry4", "registry5", "registry6", "registry7",
                "registry8", "registry9", "registry10", "registry11", "registry12", "registry13", "registry14",
                "registry15", "registry16", "registry17", "registry18", "registry19", "registry20", "registry21",
                "registry22", "registry23", "registry24", "registry25", "registry26", "registry27", "registry28",
                "registry29", "registry30", "registry31", "registry32", "registry33", "registry34", "registry35",
                "registry36", "registry37", "registry38", "registry39", "registry40", "registry41", "registry42"
            ]
        }
    },
    {
        collectionName: MatchScoreboard.name,
        fields: {
            "innings": ["innings"],
            "balls.ball": [
                "ball",
            ],
            "balls.striker.player": [
                "striker",
            ],
            "balls.non_striker.player": [
                "non_striker"
            ],
            "balls.bowler": [
                "bowler"
            ],
            "balls.runs_off_bat": [
                "runs_off_bat"
            ],
            "balls.extras.total": [
                "extras"
            ],
            "balls.extras.wides": [
                "wides"
            ],
            "balls.extras.noballs": [
                "noballs"
            ],
            "balls.extras.penalty": [
                "penalty"
            ],
            "balls.extras.byes": [
                "byes"
            ],
            "balls.extras.legbyes": [
                "legbyes"
            ],
            "balls.wicket.type": [
                "wicket_type",
                "other_wicket_type"
            ],
            "balls.wicket.dismissedPlayer": [
                "player_dismissed",
                "other_player_dismissed"
            ],
        }
    },
];