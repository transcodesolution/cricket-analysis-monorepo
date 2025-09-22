import { TournamentName } from "@cricket-analysis-monorepo/constants";
import { CachedInput, MappingData } from "../../database/model/mapping.model";

export const MAPPED_SHEET_KEY_DATA: MappingData[] = [
    {
        "collectionName": "Venue",
        "fields": {
            "name": [
                "venue"
            ],
            "city": [
                "city"
            ]
        },
        "inputs": []
    },
    {
        "collectionName": "MatchInfo",
        "fields": {
            "balls_per_over": [
                "info.balls_per_over"
            ],
            "city": [
                "info.city"
            ],
            "venue": [
                "venue",
                "info.venue"
            ],
            "tournamentId": [],
            "toss.winnerTeam": [
                "toss_winner",
                "info.toss.winner"
            ],
            "toss.winnerTeamDecision": [
                "toss_decision",
                "info.toss.decision"
            ],
            "result.playerOfMatch": [
                "player_of_match",
                "player_of_match1",
                "player_of_match2",
                "info.player_of_match[0]"
            ],
            "result.winningTeam": [
                "winner",
                "info.outcome.winner"
            ],
            "result.winBy": [
                "winner_wickets",
                "winner_runs",
                "info.outcome.by.wickets"
            ],
            "result.status": [
                "winner_wickets",
                "winner_runs",
                "outcome",
                "info.outcome.by.wickets"
            ],
            "umpire.fourthUmpire": [
                "tv_umpire",
                "umpire3",
                "info.officials.tv_umpires[0]"
            ],
            "umpire.thirdUmpire": [
                "reserve_umpire",
                "reserve_umpire1",
                "reserve_umpire2",
                "info.officials.reserve_umpires[0]"
            ],
            "umpire.onFieldBowlerEndUmpire": [
                "umpire1",
                "info.officials.umpires[0]"
            ],
            "umpire.onFieldLegUmpire": [
                "umpire2",
                "info.officials.umpires[1]"
            ],
            "team1.team": [
                "team1",
                "info.teams[0]"
            ],
            "team2.team": [
                "team2",
                "info.teams[1]"
            ],
            "referee": [
                "match_referee",
                "match_referee1",
                "match_referee2",
                "info.officials.match_referees[0]"
            ],
            "start_date": [
                "date",
                "date1",
                "info.dates[0]"
            ],
            "team1.playingEleven": [
                "info.players.England[0]",
                "info.players.England[1]",
                "info.players.England[2]",
                "info.players.England[3]",
                "info.players.England[4]",
                "info.players.England[5]",
                "info.players.England[6]",
                "info.players.England[7]",
                "info.players.England[8]",
                "info.players.England[9]",
                "info.players.England[10]",
                "info.players.South Africa[0]",
                "info.players.South Africa[1]",
                "info.players.South Africa[2]",
                "info.players.South Africa[3]",
                "info.players.South Africa[4]",
                "info.players.South Africa[5]",
                "info.players.South Africa[6]",
                "info.players.South Africa[7]",
                "info.players.South Africa[8]",
                "info.players.South Africa[9]",
                "info.players.South Africa[10]",
                "player1",
                "player2",
                "player3",
                "player4",
                "player5",
                "player6",
                "player7",
                "player8",
                "player9",
                "player10",
                "player11",
                "player12",
                "player13",
                "player14",
                "player15",
                "player16",
                "player17",
                "player18",
                "player19",
                "player20",
                "player21",
                "player22",
                "player23",
                "player24",
                "player25",
                "player26",
                "player27",
                "player28",
                "player29",
                "player30",
                "player31",
                "player32",
                "player33",
                "player34",
                "player35",
                "player36",
                "player37",
                "player38",
                "player39",
                "player40",
                "player41",
                "player42",
                "players1",
                "players2",
                "players3",
                "players4",
                "players5",
                "players6",
                "players7",
                "players8",
                "players9",
                "players10",
                "players11",
                "players12",
                "players13",
                "players14",
                "players15",
                "players16",
                "players17",
                "players18",
                "players19",
                "players20",
                "players21",
                "players22"
            ],
            "team2.playingEleven": [
                "info.registry.people.AK Markram",
                "info.registry.people.AU Rashid",
                "info.registry.people.BA Carse",
                "info.registry.people.BM Duckett",
                "info.registry.people.C Bosch",
                "info.registry.people.D Brevis",
                "info.registry.people.HC Brook",
                "info.registry.people.J Srinath",
                "info.registry.people.JC Archer",
                "info.registry.people.JC Buttler",
                "info.registry.people.JE Root",
                "info.registry.people.JG Bethell",
                "info.registry.people.JL Smith",
                "info.registry.people.KA Maharaj",
                "info.registry.people.L Ngidi",
                "info.registry.people.M Burns",
                "info.registry.people.N Burger",
                "info.registry.people.Nitin Menon",
                "info.registry.people.PWA Mulder",
                "info.registry.people.RD Rickelton",
                "info.registry.people.RJ Warren",
                "info.registry.people.S Baker",
                "info.registry.people.Sharfuddoula",
                "info.registry.people.T Bavuma",
                "info.registry.people.T Stubbs",
                "info.registry.people.T de Zorzi",
                "info.registry.people.WG Jacks",
                "registry1",
                "registry2",
                "registry3",
                "registry4",
                "registry5",
                "registry6",
                "registry7",
                "registry8",
                "registry9",
                "registry10",
                "registry11",
                "registry12",
                "registry13",
                "registry14",
                "registry15",
                "registry16",
                "registry17",
                "registry18",
                "registry19",
                "registry20",
                "registry21",
                "registry22",
                "registry23",
                "registry24",
                "registry25",
                "registry26",
                "registry27",
                "registry28",
                "registry29",
                "registry30",
                "registry31",
                "registry32",
                "registry33",
                "registry34",
                "registry35",
                "registry36",
                "registry37",
                "registry38",
                "registry39",
                "registry40",
                "registry41",
                "registry42"
            ],
            "result.eliminator": [
                "eliminator"
            ],
            "end_date": [
                "date2",
                "date3",
                "date4",
                "date5"
            ],
            "other": [
                "season",
                "winner_innings",
                "meta",
                "meta.data_version",
                "meta.created",
                "meta.revision",
                "info",
                "info.dates",
                "info.event",
                "info.match_type_number",
                "info.officials",
                "info.officials.match_referees",
                "info.officials.reserve_umpires",
                "info.officials.tv_umpires",
                "info.officials.umpires",
                "info.officials.umpires",
                "info.outcome.by",
                "info.outcome",
                "info.player_of_match",
                "info.players",
                "info.players.England",
                "info.players.South Africa",
                "info.registry",
                "info.registry.people",
                "info.season",
                "info.teams",
                "info.toss"
            ],
            "totalOvers": [
                "info.overs"
            ],
            "match_number": [
                "info.event.match_number"
            ],
            "event": [
                "info.event.name"
            ],
            "gender": [
                "info.gender"
            ],
            "matchFormat": [
                "info.match_type"
            ],
            "type": [
                "info.team_type"
            ]
        },
        "inputs": [
            {
                "referenceKey": "event",
                "referenceValue": "ICC Champions Trophy",
                "matchFormat": "ODI",
                "type": "international",
                "event": "ICC Champions Trophy"
            },
            {
                "referenceKey": "event",
                "referenceValue": "Malta Tri-Nation T20I Series",
                "matchFormat": "T20",
                "type": "international",
                "event": "Malta Tri-Nation T20I Series"
            },
            {
                "referenceKey": "event",
                "referenceValue": "ICC Women's World Cup",
                "matchFormat": "ODI",
                "type": "international",
                "event": "ICC Women's Cricket World Cup"
            },
            {
                "referenceKey": "event",
                "referenceValue": "ICC Men's T20 World Cup",
                "matchFormat": "T20",
                "type": "international",
                "event": "ICC Men's T20 World Cup"
            },
            {
                "referenceKey": "event",
                "referenceValue": "World T20",
                "matchFormat": "T20",
                "type": "domestic",
                "event": "ICC Men's T20 World Cup"
            },
            {
                "referenceKey": "event",
                "referenceValue": "Indian Premier League",
                "matchFormat": "T20",
                "type": "domestic",
                "event": "Indian Premier League"
            },
            {
                "referenceKey": "event",
                "referenceValue": "NatWest T20 Blast",
                "matchFormat": "T20",
                "type": "domestic",
                "event": "NatWest T20 Blast"
            },
            {
                "referenceKey": "event",
                "referenceValue": "Vitality Blast",
                "matchFormat": "T20",
                "type": "domestic",
                "event": "Vitality Blast"
            },
            {
                "referenceKey": "event",
                "referenceValue": "Vitality Blast Men",
                "matchFormat": "T20",
                "type": "domestic",
                "event": "Vitality Blast"
            },
            {
                "referenceKey": "event",
                "referenceValue": "International League T20",
                "matchFormat": "T20",
                "type": "international",
                "event": "International League T20"
            },
            {
                "referenceKey": "event",
                "referenceValue": "Nepal Premier League",
                "matchFormat": "T20",
                "type": "domestic",
                "event": "Nepal Premier League"
            },
            {
                "referenceKey": "event",
                "referenceValue": "Pakistan Super League",
                "matchFormat": "T20",
                "type": "domestic",
                "event": "Pakistan Super League"
            },
            {
                "referenceKey": "event",
                "referenceValue": "ICC World Cup",
                "matchFormat": "ODI",
                "type": "international",
                "event": "ICC Men's Cricket World Cup"
            },
            {
                "referenceKey": "event",
                "referenceValue": "ICC Cricket World Cup",
                "matchFormat": "ODI",
                "type": "international",
                "event": "ICC Men's Cricket World Cup"
            },
            {
                "referenceKey": "event",
                "referenceValue": "World Cup",
                "matchFormat": "T20",
                "type": "international",
                "event": "ICC Men's T20 World Cup"
            },
            {
                "referenceKey": "event",
                "referenceValue": "CG United Women's Super50",
                "matchFormat": "ODI",
                "type": "domestic",
                "event": "CG United Women's Super50"
            },
            {
                "referenceKey": "event",
                "referenceValue": "ICC World Cricket League Americas Region Division One Twenty20",
                "matchFormat": "T20",
                "type": "international",
                "event": "ICC World Cricket League Americas Region Division One"
            },
            {
                "referenceKey": "event",
                "referenceValue": "Women's World T20",
                "matchFormat": "T20",
                "type": "international",
                "event": "ICC Women's T20 World Cup"
            },
            {
                "referenceKey": "event",
                "referenceValue": "ICC Women's T20 World Cup",
                "matchFormat": "T20",
                "type": "international",
                "event": "ICC Women's T20 World Cup"
            },
            {
                "referenceKey": "event",
                "referenceValue": "ICC Intercontinental Cup",
                "matchFormat": "FirstClass",
                "type": "international",
                "event": "ICC Intercontinental Cup"
            },
            {
                "referenceKey": "event",
                "referenceValue": "India tour of New Zealand",
                "matchFormat": "ODI",
                "type": "international",
                "event": "India tour of New Zealand"
            },
            {
                "referenceKey": "event",
                "referenceValue": "Australia tour of West Indies",
                "matchFormat": "ODI",
                "type": "international",
                "event": "Australia tour of West Indies"
            },
            {
                "referenceKey": "event",
                "referenceValue": "Big Bash League",
                "matchFormat": "T20",
                "type": "domestic",
                "event": "Big Bash League"
            },
            {
                "referenceKey": "event",
                "referenceValue": "Women's T20 Blaze",
                "matchFormat": "T20",
                "type": "domestic",
                "event": "Cricket West Indies Women's Twenty20 Blaze"
            },
            {
                "referenceKey": "event",
                "referenceValue": "T20 Blaze",
                "matchFormat": "T20",
                "type": "domestic",
                "event": "Cricket West Indies Women's Twenty20 Blaze"
            },
            {
                "referenceKey": "event",
                "referenceValue": "Bangladesh Premier League",
                "matchFormat": "T20",
                "type": "domestic",
                "event": "Bangladesh Premier League"
            },
            {
                "referenceKey": "event",
                "referenceValue": "Charlotte Edwards Cup",
                "matchFormat": "T20",
                "type": "domestic",
                "event": "Charlotte Edwards Cup"
            },
            {
                "referenceKey": "event",
                "referenceValue": "Caribbean Premier League",
                "matchFormat": "T20",
                "type": "domestic",
                "event": "Caribbean Premier League"
            },
            {
                "referenceKey": "event",
                "referenceValue": "The Hundred Men's Competition",
                "matchFormat": "TheHundred",
                "type": "domestic",
                "event": "The Hundred Men's Competition"
            },
            {
                "referenceKey": "event",
                "referenceValue": "The Hundred Women's Competition",
                "matchFormat": "TheHundred",
                "type": "domestic",
                "event": "The Hundred Women's Competition"
            },
            {
                "referenceKey": "event",
                "referenceValue": "Cricket Ireland Inter-Provincial Limited Over Cup",
                "matchFormat": "ODI",
                "type": "domestic",
                "event": "Cricket Ireland Inter‑Provincial Limited Over Cup"
            },
            {
                "referenceKey": "event",
                "referenceValue": "Cricket Ireland Inter-Provincial Twenty20 Trophy",
                "matchFormat": "T20",
                "type": "domestic",
                "event": "Cricket Ireland Inter‑Provincial Twenty20 Trophy"
            },
            {
                "referenceKey": "event",
                "referenceValue": "Major Clubs T20 Tournament",
                "matchFormat": "ListA",
                "type": "domestic",
                "event": "Major Clubs T20 Sri Lanka"
            },
            {
                "referenceKey": "event",
                "referenceValue": "Lanka Premier League",
                "matchFormat": "T20",
                "type": "domestic",
                "event": "Lanka Premier League"
            },
            {
                "referenceKey": "event",
                "referenceValue": "Major League Cricket",
                "matchFormat": "T20",
                "type": "domestic",
                "event": "Major League Cricket"
            },
            {
                "referenceKey": "event",
                "referenceValue": "Rachael Heyhoe Flint Trophy",
                "matchFormat": "ODI",
                "type": "domestic",
                "event": "Rachael Heyhoe Flint Trophy"
            },
            {
                "referenceKey": "event",
                "referenceValue": "Royal London One-Day Cup",
                "matchFormat": "ListA",
                "type": "domestic",
                "event": "Metro Bank One Day Cup"
            },
            {
                "referenceKey": "event",
                "referenceValue": "SA20",
                "matchFormat": "T20",
                "type": "domestic",
                "event": "Betway SA20"
            },
            {
                "referenceKey": "event",
                "referenceValue": "One-Day Cup",
                "matchFormat": "ListA",
                "type": "domestic",
                "event": "Metro Bank One Day Cup"
            },
            {
                "referenceKey": "event",
                "referenceValue": "HRV Cup",
                "matchFormat": "T20",
                "type": "domestic",
                "event": "Super Smash"
            },
            {
                "referenceKey": "event",
                "referenceValue": "Syed Mushtaq Ali Trophy",
                "matchFormat": "T20",
                "type": "domestic",
                "event": "Syed Mushtaq Ali Trophy"
            },
            {
                "referenceKey": "event",
                "referenceValue": "Women's Super Smash",
                "matchFormat": "T20",
                "type": "domestic",
                "event": "Women's Super Smash"
            },
            {
                "referenceKey": "event",
                "referenceValue": "HRV Twenty20",
                "matchFormat": "T20",
                "type": "domestic",
                "event": "Super Smash"
            },
            {
                "referenceKey": "event",
                "referenceValue": "New Zealand Cricket Women's Twenty20",
                "matchFormat": "T20",
                "type": "domestic",
                "event": "Women's Super Smash"
            },
            {
                "referenceKey": "event",
                "referenceValue": "Women's Big Bash League",
                "matchFormat": "T20",
                "type": "domestic",
                "event": "Women's Big Bash League"
            },
            {
                "referenceKey": "event",
                "referenceValue": "Super Smash",
                "matchFormat": "T20",
                "type": "domestic",
                "event": "Super Smash"
            },
            {
                "referenceKey": "event",
                "referenceValue": "Women's Caribbean Premier League",
                "matchFormat": "T20",
                "type": "domestic",
                "event": "Women's Caribbean Premier League"
            },
            {
                "referenceKey": "event",
                "referenceValue": "ECB Women's One-Day Cup",
                "matchFormat": "ListA",
                "type": "domestic",
                "event": "Metro Bank One Day Cup Women"
            },
            {
                "referenceKey": "event",
                "referenceValue": "Women's Premier League",
                "matchFormat": "T20",
                "type": "domestic",
                "event": "Women's Premier League"
            },
            {
                "referenceKey": "event",
                "referenceValue": "Vitality Blast Women",
                "matchFormat": "T20",
                "type": "domestic",
                "event": "Vitality Blast Female"
            },
            {
                "referenceKey": "event",
                "referenceValue": "Women's T20 Challenge Match",
                "matchFormat": "T20",
                "type": "domestic",
                "event": "Women's Premier League"
            },
            {
                "referenceKey": "event",
                "referenceValue": "Women's T20 Challenge",
                "matchFormat": "T20",
                "type": "domestic",
                "event": "Women's Premier League"
            },
            {
                "referenceKey": "event",
                "referenceValue": "LV= County Championship",
                "matchFormat": "FirstClass",
                "type": "domestic",
                "event": "County Championship"
            },
            {
                "referenceKey": "event",
                "referenceValue": "Plunket Shield",
                "matchFormat": "FirstClass",
                "type": "domestic",
                "event": "Plunket Shield"
            },
            {
                "referenceKey": "event",
                "referenceValue": "Major League Tournament",
                "matchFormat": "T20",
                "type": "domestic",
                "event": "Major League Tournament"
            },
            {
                "referenceKey": "event",
                "referenceValue": "England tour of Australia",
                "matchFormat": "TEST",
                "type": "international",
                "event": "England Tour of Australia"
            },
            {
                "referenceKey": "event",
                "referenceValue": "England tour of India",
                "matchFormat": "TEST",
                "type": "international",
                "event": "England Tour of India"
            },
            {
                "referenceKey": "event",
                "referenceValue": "Women's ICC T20 Tri-Series",
                "type": "international",
                "event": "ICC Women's T20 Tri-Series",
                "matchFormat": "T20",
                "_id": {
                    "$oid": "68be9577e549ec1fd68a0211"
                }
            },
            {
                "referenceKey": "event",
                "referenceValue": "Czech Republic tour of Romania",
                "type": "international",
                "event": "Czech Republic tour of Romania",
                "matchFormat": "T20",
                "_id": {
                    "$oid": "68be960ce549ec1fd68a0416"
                }
            },
            {
                "referenceKey": "event",
                "referenceValue": "ICC Men's Cricket World Cup League 2",
                "type": "international",
                "event": "ICC Men's Cricket World Cup League 2",
                "matchFormat": "ODI",
                "_id": {
                    "$oid": "68be9c8ee549ec1fd68a103d"
                }
            },
            {
                "referenceKey": "event",
                "referenceValue": "CWC Challenge League",
                "type": "international",
                "event": "CWC Challenge League",
                "matchFormat": "ODI",
                "_id": {
                    "$oid": "68be9c8ee549ec1fd68a103e"
                }
            },
            {
                "referenceKey": "event",
                "referenceValue": "ICC Women's T20 World Cup Europe Division 1 Qualifier",
                "type": "international",
                "event": "ICC Women's T20 World Cup Europe Division 1 Qualifier",
                "matchFormat": "T20",
                "_id": {
                    "$oid": "68be9c8ee549ec1fd68a103f"
                }
            }
        ] as unknown as CachedInput[]
    },
    {
        "collectionName": "Umpire",
        "fields": {
            "name": [
                "umpire1",
                "umpire2",
                "reserve_umpire",
                "tv_umpire",
                "umpire3",
                "reserve_umpire1",
                "reserve_umpire2"
            ]
        },
        "inputs": []
    },
    {
        "collectionName": "Tournament",
        "fields": {
            "event": [
                "event"
            ],
            "gender": [
                "gender"
            ],
            "startDate": [],
            "season": []
        },
        "inputs": [
            {
                "referenceKey": "event",
                "referenceValue": "ICC Champions Trophy",
                "matchFormat": "ODI",
                "type": "international",
                "event": "ICC Champions Trophy"
            },
            {
                "referenceKey": "event",
                "referenceValue": "Malta Tri-Nation T20I Series",
                "matchFormat": "T20",
                "type": "international",
                "event": "Malta Tri-Nation T20I Series"
            },
            {
                "referenceKey": "event",
                "referenceValue": "ICC Women's World Cup",
                "matchFormat": "ODI",
                "type": "international",
                "event": "ICC Women's Cricket World Cup"
            },
            {
                "referenceKey": "event",
                "referenceValue": "ICC Men's T20 World Cup",
                "matchFormat": "T20",
                "type": "international",
                "event": "ICC Men's T20 World Cup"
            },
            {
                "referenceKey": "event",
                "referenceValue": "World T20",
                "matchFormat": "T20",
                "type": "domestic",
                "event": "ICC Men's T20 World Cup"
            },
            {
                "referenceKey": "event",
                "referenceValue": "Indian Premier League",
                "matchFormat": "T20",
                "type": "domestic",
                "event": "Indian Premier League"
            },
            {
                "referenceKey": "event",
                "referenceValue": "NatWest T20 Blast",
                "matchFormat": "T20",
                "type": "domestic",
                "event": "NatWest T20 Blast"
            },
            {
                "referenceKey": "event",
                "referenceValue": "Vitality Blast",
                "matchFormat": "T20",
                "type": "domestic",
                "event": "Vitality Blast"
            },
            {
                "referenceKey": "event",
                "referenceValue": "Vitality Blast Men",
                "matchFormat": "T20",
                "type": "domestic",
                "event": "Vitality Blast"
            },
            {
                "referenceKey": "event",
                "referenceValue": "International League T20",
                "matchFormat": "T20",
                "type": "international",
                "event": "International League T20"
            },
            {
                "referenceKey": "event",
                "referenceValue": "Nepal Premier League",
                "matchFormat": "T20",
                "type": "domestic",
                "event": "Nepal Premier League"
            },
            {
                "referenceKey": "event",
                "referenceValue": "Pakistan Super League",
                "matchFormat": "T20",
                "type": "domestic",
                "event": "Pakistan Super League"
            },
            {
                "referenceKey": "event",
                "referenceValue": "ICC World Cup",
                "matchFormat": "ODI",
                "type": "international",
                "event": "ICC Men's Cricket World Cup"
            },
            {
                "referenceKey": "event",
                "referenceValue": "ICC Cricket World Cup",
                "matchFormat": "ODI",
                "type": "international",
                "event": "ICC Men's Cricket World Cup"
            },
            {
                "referenceKey": "event",
                "referenceValue": "World Cup",
                "matchFormat": "T20",
                "type": "international",
                "event": "ICC Men's T20 World Cup"
            },
            {
                "referenceKey": "event",
                "referenceValue": "CG United Women's Super50",
                "matchFormat": "ODI",
                "type": "domestic",
                "event": "CG United Women's Super50"
            },
            {
                "referenceKey": "event",
                "referenceValue": "ICC World Cricket League Americas Region Division One Twenty20",
                "matchFormat": "T20",
                "type": "international",
                "event": "ICC World Cricket League Americas Region Division One"
            },
            {
                "referenceKey": "event",
                "referenceValue": "Women's World T20",
                "matchFormat": "T20",
                "type": "international",
                "event": "ICC Women's T20 World Cup"
            },
            {
                "referenceKey": "event",
                "referenceValue": "ICC Women's T20 World Cup",
                "matchFormat": "T20",
                "type": "international",
                "event": "ICC Women's T20 World Cup"
            },
            {
                "referenceKey": "event",
                "referenceValue": "ICC Intercontinental Cup",
                "matchFormat": "FirstClass",
                "type": "international",
                "event": "ICC Intercontinental Cup"
            },
            {
                "referenceKey": "event",
                "referenceValue": "India tour of New Zealand",
                "matchFormat": "ODI",
                "type": "international",
                "event": "India tour of New Zealand"
            },
            {
                "referenceKey": "event",
                "referenceValue": "Australia tour of West Indies",
                "matchFormat": "ODI",
                "type": "international",
                "event": "Australia tour of West Indies"
            },
            {
                "referenceKey": "event",
                "referenceValue": "Big Bash League",
                "matchFormat": "T20",
                "type": "domestic",
                "event": "Big Bash League"
            },
            {
                "referenceKey": "event",
                "referenceValue": "Women's T20 Blaze",
                "matchFormat": "T20",
                "type": "domestic",
                "event": "Cricket West Indies Women's Twenty20 Blaze"
            },
            {
                "referenceKey": "event",
                "referenceValue": "T20 Blaze",
                "matchFormat": "T20",
                "type": "domestic",
                "event": "Cricket West Indies Women's Twenty20 Blaze"
            },
            {
                "referenceKey": "event",
                "referenceValue": "Bangladesh Premier League",
                "matchFormat": "T20",
                "type": "domestic",
                "event": "Bangladesh Premier League"
            },
            {
                "referenceKey": "event",
                "referenceValue": "Charlotte Edwards Cup",
                "matchFormat": "T20",
                "type": "domestic",
                "event": "Charlotte Edwards Cup"
            },
            {
                "referenceKey": "event",
                "referenceValue": "Caribbean Premier League",
                "matchFormat": "T20",
                "type": "domestic",
                "event": "Caribbean Premier League"
            },
            {
                "referenceKey": "event",
                "referenceValue": "The Hundred Men's Competition",
                "matchFormat": "TheHundred",
                "type": "domestic",
                "event": "The Hundred Men's Competition"
            },
            {
                "referenceKey": "event",
                "referenceValue": "The Hundred Women's Competition",
                "matchFormat": "TheHundred",
                "type": "domestic",
                "event": "The Hundred Women's Competition"
            },
            {
                "referenceKey": "event",
                "referenceValue": "Cricket Ireland Inter-Provincial Limited Over Cup",
                "matchFormat": "ODI",
                "type": "domestic",
                "event": "Cricket Ireland Inter‑Provincial Limited Over Cup"
            },
            {
                "referenceKey": "event",
                "referenceValue": "Cricket Ireland Inter-Provincial Twenty20 Trophy",
                "matchFormat": "T20",
                "type": "domestic",
                "event": "Cricket Ireland Inter‑Provincial Twenty20 Trophy"
            },
            {
                "referenceKey": "event",
                "referenceValue": "Major Clubs T20 Tournament",
                "matchFormat": "ListA",
                "type": "domestic",
                "event": "Major Clubs T20 Sri Lanka"
            },
            {
                "referenceKey": "event",
                "referenceValue": "Lanka Premier League",
                "matchFormat": "T20",
                "type": "domestic",
                "event": "Lanka Premier League"
            },
            {
                "referenceKey": "event",
                "referenceValue": "Major League Cricket",
                "matchFormat": "T20",
                "type": "domestic",
                "event": "Major League Cricket"
            },
            {
                "referenceKey": "event",
                "referenceValue": "Rachael Heyhoe Flint Trophy",
                "matchFormat": "ODI",
                "type": "domestic",
                "event": "Rachael Heyhoe Flint Trophy"
            },
            {
                "referenceKey": "event",
                "referenceValue": "Royal London One-Day Cup",
                "matchFormat": "ListA",
                "type": "domestic",
                "event": "Metro Bank One Day Cup"
            },
            {
                "referenceKey": "event",
                "referenceValue": "SA20",
                "matchFormat": "T20",
                "type": "domestic",
                "event": "Betway SA20"
            },
            {
                "referenceKey": "event",
                "referenceValue": "One-Day Cup",
                "matchFormat": "ListA",
                "type": "domestic",
                "event": "Metro Bank One Day Cup"
            },
            {
                "referenceKey": "event",
                "referenceValue": "HRV Cup",
                "matchFormat": "T20",
                "type": "domestic",
                "event": "Super Smash"
            },
            {
                "referenceKey": "event",
                "referenceValue": "Syed Mushtaq Ali Trophy",
                "matchFormat": "T20",
                "type": "domestic",
                "event": "Syed Mushtaq Ali Trophy"
            },
            {
                "referenceKey": "event",
                "referenceValue": "Women's Super Smash",
                "matchFormat": "T20",
                "type": "domestic",
                "event": "Women's Super Smash"
            },
            {
                "referenceKey": "event",
                "referenceValue": "HRV Twenty20",
                "matchFormat": "T20",
                "type": "domestic",
                "event": "Super Smash"
            },
            {
                "referenceKey": "event",
                "referenceValue": "New Zealand Cricket Women's Twenty20",
                "matchFormat": "T20",
                "type": "domestic",
                "event": "Women's Super Smash"
            },
            {
                "referenceKey": "event",
                "referenceValue": "Women's Big Bash League",
                "matchFormat": "T20",
                "type": "domestic",
                "event": "Women's Big Bash League"
            },
            {
                "referenceKey": "event",
                "referenceValue": "Super Smash",
                "matchFormat": "T20",
                "type": "domestic",
                "event": "Super Smash"
            },
            {
                "referenceKey": "event",
                "referenceValue": "Women's Caribbean Premier League",
                "matchFormat": "T20",
                "type": "domestic",
                "event": "Women's Caribbean Premier League"
            },
            {
                "referenceKey": "event",
                "referenceValue": "ECB Women's One-Day Cup",
                "matchFormat": "ListA",
                "type": "domestic",
                "event": "Metro Bank One Day Cup Women"
            },
            {
                "referenceKey": "event",
                "referenceValue": "Women's Premier League",
                "matchFormat": "T20",
                "type": "domestic",
                "event": "Women's Premier League"
            },
            {
                "referenceKey": "event",
                "referenceValue": "Vitality Blast Women",
                "matchFormat": "T20",
                "type": "domestic",
                "event": "Vitality Blast Female"
            },
            {
                "referenceKey": "event",
                "referenceValue": "Women's T20 Challenge Match",
                "matchFormat": "T20",
                "type": "domestic",
                "event": "Women's Premier League"
            },
            {
                "referenceKey": "event",
                "referenceValue": "Women's T20 Challenge",
                "matchFormat": "T20",
                "type": "domestic",
                "event": "Women's Premier League"
            },
            {
                "referenceKey": "event",
                "referenceValue": "LV= County Championship",
                "matchFormat": "FirstClass",
                "type": "domestic",
                "event": "County Championship"
            },
            {
                "referenceKey": "event",
                "referenceValue": "Plunket Shield",
                "matchFormat": "FirstClass",
                "type": "domestic",
                "event": "Plunket Shield"
            },
            {
                "referenceKey": "event",
                "referenceValue": "Major League Tournament",
                "matchFormat": "T20",
                "type": "domestic",
                "event": "Major League Tournament"
            }
        ] as unknown as CachedInput[],
        "names": [
            "Big Bash League",
            "Cricket West Indies Women's Twenty20 Blaze",
            "Bangladesh Premier League",
            "Bob Willis Trophy",
            "County Championship",
            "Charlotte Edwards Cup",
            "Caribbean Premier League",
            "CSA T20 Challenge",
            "FairBreak Invitational Tournament",
            "The Hundred Men's Competition",
            "The Hundred Women's Competition",
            "International League T20",
            "Indian Premier League",
            "Cricket Ireland Inter‑Provincial Limited Over Cup",
            "Cricket Ireland Inter‑Provincial Twenty20 Trophy",
            "Lanka Premier League",
            "Major League Cricket",
            "Mzansi Super League",
            "Nepal Premier League",
            "NatWest T20 Blast",
            "Vitality Blast",
            "Vitality Blast Female",
            "Plunket Shield",
            "Pakistan Super League",
            "Rachael Heyhoe Flint Trophy",
            "Metro Bank One Day Cup",
            "Betway SA20",
            "CG United Women's Super50",
            "Syed Mushtaq Ali Trophy",
            "Sheffield Shield",
            "Super Smash",
            "Women's Big Bash League",
            "Women's Caribbean Premier League",
            "Women's Premier League",
            "Women's Super Smash",
            "Metro Bank One Day Cup Women",
            "ICC Champions Trophy",
            "ICC Men's Cricket World Cup",
            "ICC Women's Cricket World Cup",
            "ICC Men's T20 World Cup",
            "ICC Women's T20 World Cup",
            "ICC Intercontinental Cup",
            "ICC World Cricket League Americas Region Division One",
            "Malta Tri-Nation T20I Series",
            "Major Clubs T20 Sri Lanka",
            "Major League Tournament",
            "ICC World Test Championship",
            "The Ashes",
            "Border–Gavaskar Trophy",
            "Frank Worrell Trophy",
            "Basil D'Oliveira Trophy",
            "Pataudi Trophy",
            "Anthony de Mello Trophy",
            "Wisden Trophy",
            "Richards–Botham Trophy",
            "Trans-Tasman Trophy",
            "Warne–Muralitharan Trophy",
            "Sobers–Tissera Trophy",
            "Benaud–Qadir Trophy",
            "Freedom Trophy",
            "Sir Vivian Richards Trophy",
            "Cyprus tour of Croatia",
            "Switzerland tour of Estonia",
            "Afghanistan Tour of Australia",
            "Afghanistan Tour of Bangladesh",
            "Afghanistan Tour of England",
            "Afghanistan Tour of India",
            "Afghanistan Tour of Ireland",
            "Afghanistan Tour of New Zealand",
            "Afghanistan Tour of Pakistan",
            "Afghanistan Tour of South Africa",
            "Afghanistan Tour of Sri Lanka",
            "Afghanistan Tour of West Indies",
            "Afghanistan Tour of Zimbabwe",
            "Australia Tour of Afghanistan",
            "Australia Tour of Bangladesh",
            "Australia Tour of England",
            "Australia Tour of India",
            "Australia Tour of Ireland",
            "Australia Tour of New Zealand",
            "Australia Tour of Pakistan",
            "Australia Tour of South Africa",
            "Australia Tour of Sri Lanka",
            "Australia Tour of West Indies",
            "Australia Tour of Zimbabwe",
            "Bangladesh Tour of Afghanistan",
            "Bangladesh Tour of Australia",
            "Bangladesh Tour of England",
            "Bangladesh Tour of India",
            "Bangladesh Tour of Ireland",
            "Bangladesh Tour of New Zealand",
            "Bangladesh Tour of Pakistan",
            "Bangladesh Tour of South Africa",
            "Bangladesh Tour of Sri Lanka",
            "Bangladesh Tour of West Indies",
            "Bangladesh Tour of Zimbabwe",
            "England Tour of Afghanistan",
            "England Tour of Australia",
            "England Tour of Bangladesh",
            "England Tour of India",
            "England Tour of Ireland",
            "England Tour of New Zealand",
            "England Tour of Pakistan",
            "England Tour of South Africa",
            "England Tour of Sri Lanka",
            "England Tour of West Indies",
            "England Tour of Zimbabwe",
            "India Tour of Afghanistan",
            "India Tour of Australia",
            "India Tour of Bangladesh",
            "India Tour of England",
            "India Tour of Ireland",
            "India Tour of New Zealand",
            "India Tour of Pakistan",
            "India Tour of South Africa",
            "India Tour of Sri Lanka",
            "India Tour of West Indies",
            "India Tour of Zimbabwe",
            "Ireland Tour of Afghanistan",
            "Ireland Tour of Australia",
            "Ireland Tour of Bangladesh",
            "Ireland Tour of England",
            "Ireland Tour of India",
            "Ireland Tour of New Zealand",
            "Ireland Tour of Pakistan",
            "Ireland Tour of South Africa",
            "Ireland Tour of Sri Lanka",
            "Ireland Tour of West Indies",
            "Ireland Tour of Zimbabwe",
            "New Zealand Tour of Afghanistan",
            "New Zealand Tour of Australia",
            "New Zealand Tour of Bangladesh",
            "New Zealand Tour of England",
            "New Zealand Tour of India",
            "New Zealand Tour of Ireland",
            "New Zealand Tour of Pakistan",
            "New Zealand Tour of South Africa",
            "New Zealand Tour of Sri Lanka",
            "New Zealand Tour of West Indies",
            "New Zealand Tour of Zimbabwe",
            "Pakistan Tour of Afghanistan",
            "Pakistan Tour of Australia",
            "Pakistan Tour of Bangladesh",
            "Pakistan Tour of England",
            "Pakistan Tour of India",
            "Pakistan Tour of Ireland",
            "Pakistan Tour of New Zealand",
            "Pakistan Tour of South Africa",
            "Pakistan Tour of Sri Lanka",
            "Pakistan Tour of West Indies",
            "Pakistan Tour of Zimbabwe",
            "South Africa Tour of Afghanistan",
            "South Africa Tour of Australia",
            "South Africa Tour of Bangladesh",
            "South Africa Tour of England",
            "South Africa Tour of India",
            "South Africa Tour of Ireland",
            "South Africa Tour of New Zealand",
            "South Africa Tour of Pakistan",
            "South Africa Tour of Sri Lanka",
            "South Africa Tour of West Indies",
            "South Africa Tour of Zimbabwe",
            "Sri Lanka Tour of Afghanistan",
            "Sri Lanka Tour of Australia",
            "Sri Lanka Tour of Bangladesh",
            "Sri Lanka Tour of England",
            "Sri Lanka Tour of India",
            "Sri Lanka Tour of Ireland",
            "Sri Lanka Tour of New Zealand",
            "Sri Lanka Tour of Pakistan",
            "Sri Lanka Tour of South Africa",
            "Sri Lanka Tour of West Indies",
            "Sri Lanka Tour of Zimbabwe",
            "West Indies Tour of Afghanistan",
            "West Indies Tour of Australia",
            "West Indies Tour of Bangladesh",
            "West Indies Tour of England",
            "West Indies Tour of India",
            "West Indies Tour of Ireland",
            "West Indies Tour of New Zealand",
            "West Indies Tour of Pakistan",
            "West Indies Tour of South Africa",
            "West Indies Tour of Sri Lanka",
            "West Indies Tour of Zimbabwe",
            "Zimbabwe Tour of Afghanistan",
            "Zimbabwe Tour of Australia",
            "Zimbabwe Tour of Bangladesh",
            "Zimbabwe Tour of England",
            "Zimbabwe Tour of India",
            "Zimbabwe Tour of Ireland",
            "Zimbabwe Tour of New Zealand",
            "Zimbabwe Tour of Pakistan",
            "Zimbabwe Tour of South Africa",
            "Zimbabwe Tour of Sri Lanka",
            "Zimbabwe Tour of West Indies",
            "United Arab Emirates T20I Tri-Series",
            "ICC Cricket World Cup Challenge League A",
            "ICC Women's T20 Tri-Series",
            "Czech Republic tour of Romania",
            "ICC Men's Cricket World Cup League 2",
            "CWC Challenge League",
            "ICC Women's T20 World Cup Europe Division 1 Qualifier"
        ]
    },
    {
        "collectionName": "Team",
        "fields": {
            "name": [
                "team1",
                "team2",
                "batting_team",
                "bowling_team"
            ]
        },
        "inputs": []
    },
    {
        "collectionName": "MatchScoreboard",
        "fields": {
            "innings": [
                "innings"
            ],
            "balls.ball": [
                "ball"
            ],
            "balls.striker.player": [
                "striker",
                "innings[?].overs[?].deliveries[?].batter"
            ],
            "balls.non_striker.player": [
                "non_striker",
                "innings[?].overs[?].deliveries[?].non_striker"
            ],
            "balls.bowler": [
                "bowler",
                "innings[?].overs[?].deliveries[?].bowler"
            ],
            "balls.runs_off_bat": [
                "runs_off_bat",
                "innings[?].overs[?].deliveries[?].total"
            ],
            "balls.extras.total": [
                "extras",
                "innings[?].overs[?].deliveries[?].extras"
            ],
            "balls.extras.wides": [
                "wides",
                "innings[?].overs[?].deliveries[?].extras.wides"
            ],
            "balls.extras.noballs": [
                "noballs",
                "innings[?].overs[?].deliveries[?].extras.noballs"
            ],
            "balls.extras.penalty": [
                "penalty",
                "innings[?].overs[?].deliveries[?].extras.penalty"
            ],
            "balls.extras.byes": [
                "byes",
                "innings[?].overs[?].deliveries[?].extras.byes"
            ],
            "balls.extras.legbyes": [
                "legbyes",
                "innings[?].overs[?].deliveries[?].extras.legbyes"
            ],
            "balls.wicket.type": [
                "wicket_type",
                "other_wicket_type",
                "innings[?].overs[?].deliveries[?].wickets[?].kind"
            ],
            "balls.wicket.takenBy": [
                "innings[?].overs[?].deliveries[?].wickets[?].fielders[?].name"
            ],
            "balls.wicket.dismissedPlayer": [
                "player_dismissed",
                "other_player_dismissed",
                "innings[?].overs[?].deliveries[?].wickets[?].player_out"
            ],
            "other": [
                "season",
                "start_date",
                "venue",
                "batting_team",
                "bowling_team",
                "innings",
                "innings[?].team",
                "innings[?].overs[?].deliveries",
                "innings[?].overs[?].deliveries[?].review",
                "innings[?].overs[?].deliveries[?].review.by",
                "innings[?].overs[?].deliveries[?].review.umpire",
                "innings[?].overs[?].deliveries[?].review.batter",
                "innings[?].overs[?].deliveries[?].review.decision",
                "innings[?].overs[?].deliveries[?].review.type",
                "innings[?].powerplays",
                "innings[?].powerplays[?].from",
                "innings[?].powerplays[?].to",
                "innings[?].powerplays[?].type",
                "innings[?].target",
                "innings[?].target.overs",
                "innings[?].target.runs",
                "innings[?].overs[?].deliveries[?].runs.batter",
                "innings[?].overs[?].deliveries[?].runs.extras",
                "innings[?].overs[?].deliveries[?].wickets",
                "innings[?].overs[?].deliveries[?].wickets[?].fielders"
            ],
            "over": [
                "innings[?].overs"
            ]
        },
        "inputs": []
    },
    {
        "collectionName": "Player",
        "fields": {
            "name": [
                "registry1",
                "registry2",
                "registry3",
                "registry4",
                "registry5",
                "registry6",
                "registry7",
                "registry8",
                "registry9",
                "registry10",
                "registry11",
                "registry12",
                "registry13",
                "registry14",
                "registry15",
                "registry16",
                "registry17",
                "registry18",
                "registry19",
                "registry20",
                "registry21",
                "registry22",
                "registry23",
                "registry24",
                "registry25",
                "registry26",
                "registry27",
                "registry28",
                "registry29",
                "registry30",
                "registry31",
                "registry32",
                "registry33",
                "registry34",
                "registry35",
                "registry36",
                "registry37",
                "registry38",
                "registry39",
                "registry40",
                "registry41",
                "registry42"
            ],
            "uniqueId": [],
            "gender": []
        },
        "inputs": []
    },
    {
        "collectionName": "Referee",
        "fields": {
            "name": [
                "match_referee",
                "match_referee1",
                "match_referee2"
            ]
        },
        "inputs": []
    }
];