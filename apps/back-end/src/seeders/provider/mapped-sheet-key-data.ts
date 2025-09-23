import { TeamName, TournamentName, VenueName } from "@cricket-analysis-monorepo/constants";
import { CachedInput, MappingData } from "../../database/model/mapping.model";

export const MAPPED_SHEET_KEY_DATA: MappingData[] = [{
    "collectionName": "Venue",
    "names": Object.values(VenueName),
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
    "names": [],
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
            "info.outcome.by.wickets",
            "info.outcome.by.runs"
        ],
        "result.status": [
            "winner_wickets",
            "winner_runs",
            "outcome",
            "info.outcome.by.wickets",
            "info.outcome.result"
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
            "info.players",
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
            "registry42",
            "info.registry.people"
        ],
        "result.eliminator": [
            "eliminator"
        ],
        "end_date": [
            "date2",
            "date3",
            "date4",
            "date5",
            "info.dates[3]"
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
            "info.outcome.by",
            "info.outcome",
            "info.player_of_match",
            "info.players.England",
            "info.players.South Africa",
            "info.registry",
            "info.season",
            "info.teams",
            "info.toss",
            "info.event.stage",
            "innings[?].overs[?].deliveries[?].review.umpires_call",
            "info.event.group",
            "info.dates[2]",
            "info.dates[1]",
            "info.missing[0]",
            "info.missing[?].powerplays",
            "info.missing[?].powerplays.2",
            "info.missing[?].powerplays.2[0]",
            "info.missing[?].powerplays.2[1]",
            "info.missing[?].powerplays.2[2]",
            "info.missing[?].powerplays.1",
            "info.missing[?].powerplays.1[0]",
            "info.missing[?].powerplays.1[1]",
            "info.missing[?].powerplays.1[2]",
            "info.missing"
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
        ],
        "method": [
            "info.outcome.method"
        ]
    },
    "inputs": [
        {
            "referenceKey": "event",
            "referenceValue": "ICC Champions Trophy",
            "type": "international",
            "event": "ICC Champions Trophy",
            "matchFormat": "ODI"
        },
        {
            "referenceKey": "event",
            "referenceValue": "Malta Tri-Nation T20I Series",
            "type": "international",
            "event": "Malta Tri-Nation T20I Series",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "ICC Women's World Cup",
            "type": "international",
            "event": "ICC Women's Cricket World Cup",
            "matchFormat": "ODI"
        },
        {
            "referenceKey": "event",
            "referenceValue": "ICC Men's T20 World Cup",
            "type": "international",
            "event": "ICC Men's T20 World Cup",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "World T20",
            "type": "domestic",
            "event": "ICC Men's T20 World Cup",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "Indian Premier League",
            "type": "domestic",
            "event": "Indian Premier League",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "NatWest T20 Blast",
            "type": "domestic",
            "event": "NatWest T20 Blast",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "Vitality Blast",
            "type": "domestic",
            "event": "Vitality Blast",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "Vitality Blast Men",
            "type": "domestic",
            "event": "Vitality Blast",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "International League T20",
            "type": "international",
            "event": "International League T20",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "Nepal Premier League",
            "type": "domestic",
            "event": "Nepal Premier League",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "Pakistan Super League",
            "type": "domestic",
            "event": "Pakistan Super League",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "ICC World Cup",
            "type": "international",
            "event": "ICC Men's Cricket World Cup",
            "matchFormat": "ODI"
        },
        {
            "referenceKey": "event",
            "referenceValue": "ICC Cricket World Cup",
            "type": "international",
            "event": "ICC Men's Cricket World Cup",
            "matchFormat": "ODI"
        },
        {
            "referenceKey": "event",
            "referenceValue": "World Cup",
            "type": "international",
            "event": "ICC Men's T20 World Cup",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "CG United Women's Super50",
            "type": "domestic",
            "event": "CG United Women's Super50",
            "matchFormat": "ODI"
        },
        {
            "referenceKey": "event",
            "referenceValue": "ICC World Cricket League Americas Region Division One Twenty20",
            "type": "international",
            "event": "ICC World Cricket League Americas Region Division One",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "Women's World T20",
            "type": "international",
            "event": "ICC Women's T20 World Cup",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "ICC Women's T20 World Cup",
            "type": "international",
            "event": "ICC Women's T20 World Cup",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "ICC Intercontinental Cup",
            "type": "international",
            "event": "ICC Intercontinental Cup",
            "matchFormat": "FirstClass"
        },
        {
            "referenceKey": "event",
            "referenceValue": "India tour of New Zealand",
            "type": "international",
            "event": TournamentName.IndiaTourOfNewZealand,
            "matchFormat": "ODI"
        },
        {
            "referenceKey": "event",
            "referenceValue": "Australia tour of West Indies",
            "type": "international",
            "event": TournamentName.AustraliaTourOfWestIndies,
            "matchFormat": "ODI"
        },
        {
            "referenceKey": "event",
            "referenceValue": "Big Bash League",
            "type": "domestic",
            "event": "Big Bash League",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "Women's T20 Blaze",
            "type": "domestic",
            "event": "Cricket West Indies Women's Twenty20 Blaze",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "T20 Blaze",
            "type": "domestic",
            "event": "Cricket West Indies Women's Twenty20 Blaze",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "Bangladesh Premier League",
            "type": "domestic",
            "event": "Bangladesh Premier League",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "Charlotte Edwards Cup",
            "type": "domestic",
            "event": "Charlotte Edwards Cup",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "Caribbean Premier League",
            "type": "domestic",
            "event": "Caribbean Premier League",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "The Hundred Men's Competition",
            "type": "domestic",
            "event": "The Hundred Men's Competition",
            "matchFormat": "TheHundred"
        },
        {
            "referenceKey": "event",
            "referenceValue": "The Hundred Women's Competition",
            "type": "domestic",
            "event": "The Hundred Women's Competition",
            "matchFormat": "TheHundred"
        },
        {
            "referenceKey": "event",
            "referenceValue": "Cricket Ireland Inter-Provincial Limited Over Cup",
            "type": "domestic",
            "event": "Cricket Ireland Inter‑Provincial Limited Over Cup",
            "matchFormat": "ODI"
        },
        {
            "referenceKey": "event",
            "referenceValue": "Cricket Ireland Inter-Provincial Twenty20 Trophy",
            "type": "domestic",
            "event": "Cricket Ireland Inter‑Provincial Twenty20 Trophy",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "Major Clubs T20 Tournament",
            "type": "domestic",
            "event": "Major Clubs T20 Sri Lanka",
            "matchFormat": "ListA"
        },
        {
            "referenceKey": "event",
            "referenceValue": "Lanka Premier League",
            "type": "domestic",
            "event": "Lanka Premier League",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "Major League Cricket",
            "type": "domestic",
            "event": "Major League Cricket",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "Rachael Heyhoe Flint Trophy",
            "type": "domestic",
            "event": "Rachael Heyhoe Flint Trophy",
            "matchFormat": "ODI"
        },
        {
            "referenceKey": "event",
            "referenceValue": "Royal London One-Day Cup",
            "type": "domestic",
            "event": "Metro Bank One Day Cup",
            "matchFormat": "ListA"
        },
        {
            "referenceKey": "event",
            "referenceValue": "SA20",
            "type": "domestic",
            "event": "Betway SA20",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "One-Day Cup",
            "type": "domestic",
            "event": "Metro Bank One Day Cup",
            "matchFormat": "ListA"
        },
        {
            "referenceKey": "event",
            "referenceValue": "HRV Cup",
            "type": "domestic",
            "event": "Super Smash",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "Syed Mushtaq Ali Trophy",
            "type": "domestic",
            "event": "Syed Mushtaq Ali Trophy",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "Women's Super Smash",
            "type": "domestic",
            "event": "Women's Super Smash",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "HRV Twenty20",
            "type": "domestic",
            "event": "Super Smash",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "New Zealand Cricket Women's Twenty20",
            "type": "domestic",
            "event": "Women's Super Smash",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "Women's Big Bash League",
            "type": "domestic",
            "event": "Women's Big Bash League",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "Super Smash",
            "type": "domestic",
            "event": "Super Smash",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "Women's Caribbean Premier League",
            "type": "domestic",
            "event": "Women's Caribbean Premier League",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "ECB Women's One-Day Cup",
            "type": "domestic",
            "event": "Metro Bank One Day Cup Women",
            "matchFormat": "ListA"
        },
        {
            "referenceKey": "event",
            "referenceValue": "Women's Premier League",
            "type": "domestic",
            "event": "Women's Premier League",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "Vitality Blast Women",
            "type": "domestic",
            "event": "Vitality Blast Female",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "Women's T20 Challenge Match",
            "type": "domestic",
            "event": "Women's Premier League",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "Women's T20 Challenge",
            "type": "domestic",
            "event": "Women's Premier League",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "LV= County Championship",
            "type": "domestic",
            "event": "County Championship",
            "matchFormat": "FirstClass"
        },
        {
            "referenceKey": "event",
            "referenceValue": "Plunket Shield",
            "type": "domestic",
            "event": "Plunket Shield",
            "matchFormat": "FirstClass"
        },
        {
            "referenceKey": "event",
            "referenceValue": "Major League Tournament",
            "type": "domestic",
            "event": "Major League Tournament",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "England tour of Australia",
            "type": "international",
            "event": "England Tour of Australia",
            "matchFormat": "TEST"
        },
        {
            "referenceKey": "event",
            "referenceValue": "England tour of India",
            "type": "international",
            "event": "England Tour of India",
            "matchFormat": "TEST"
        },
        {
            "referenceKey": "event",
            "referenceValue": "Women's ICC T20 Tri-Series",
            "type": "international",
            "event": "ICC Women's T20 Tri-Series",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "Czech Republic tour of Romania",
            "type": "international",
            "event": "Czech Republic tour of Romania",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "ICC Men's Cricket World Cup League 2",
            "type": "international",
            "event": "ICC Men's Cricket World Cup League 2",
            "matchFormat": "ODI"
        },
        {
            "referenceKey": "event",
            "referenceValue": "CWC Challenge League",
            "type": "international",
            "event": "CWC Challenge League",
            "matchFormat": "ODI"
        },
        {
            "referenceKey": "event",
            "referenceValue": "ICC Women's T20 World Cup Europe Division 1 Qualifier",
            "type": "international",
            "event": "ICC Women's T20 World Cup Europe Division 1 Qualifier",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "South Africa tour of England",
            "event": "South Africa Tour of England"
        },
        {
            "referenceKey": "event",
            "referenceValue": "ICC Intercontinental Shield",
            "type": "international",
            "event": "Big Bash League",
            "matchFormat": "ODI",
            "_id": {
                "$oid": "68c8013b3ab6fdcd12604d33"
            }
        },
        {
            "referenceKey": "event",
            "referenceValue": "The Marsh Cup",
            "event": "One-Day Cup (Australia)"
        },
        {
            "referenceKey": "matchFormat",
            "referenceValue": "T20",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "type",
            "referenceValue": "international",
            "type": "international"
        },
        {
            "referenceKey": "event",
            "referenceValue": "England tour of Ireland",
            "event": "England Tour of Ireland"
        },
        {
            "referenceKey": "matchFormat",
            "referenceValue": "MDM",
            "matchFormat": "TEST"
        },
        {
            "referenceKey": "event",
            "referenceValue": "County Championship",
            "event": "County Championship"
        },
        {
            "referenceKey": "matchFormat",
            "referenceValue": "ODI",
            "matchFormat": "ODI"
        },
        {
            "referenceKey": "event",
            "referenceValue": "Australia Women tour of India",
            "event": "Australia Women tour of India"
        },
        {
            "referenceKey": "event",
            "referenceValue": "Men's T20 Asia Cup",
            "event": "Asia Cup"
        },
        {
            "referenceKey": "event",
            "referenceValue": "South Africa Women tour of Pakistan",
            "event": "South Africa Women tour of Pakistan"
        },
        {
            "referenceKey": "event",
            "referenceValue": "Namibia tour of Zimbabwe",
            "event": "Namibia tour of Zimbabwe"
        },
        {
            "referenceKey": "event",
            "referenceValue": "One-Day Cup (Australia)",
            "event": "One-Day Cup (Australia)"
        },
        {
            "referenceKey": "matchFormat",
            "referenceValue": "ODM",
            "matchFormat": "ODI"
        },
        {
            "referenceKey": "type",
            "referenceValue": "club",
            "type": "domestic"
        },
        {
            "referenceKey": "event",
            "referenceValue": "ICC Women's T20 World Cup East Asia Pacific Qualifier",
            "event": "ICC Women's T20 World Cup East Asia Pacific Qualifier"
        },
        {
            "referenceKey": "event",
            "referenceValue": "Luxembourg Women's T20I Tri-Series",
            "event": "Luxembourg Women's T20I Tri-Series"
        }
    ] as CachedInput[]
},
{
    "collectionName": "Umpire",
    "names": [],
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
    "names": Object.values(TournamentName),
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
            "type": "international",
            "event": "ICC Champions Trophy",
            "matchFormat": "ODI"
        },
        {
            "referenceKey": "event",
            "referenceValue": "Malta Tri-Nation T20I Series",
            "type": "international",
            "event": "Malta Tri-Nation T20I Series",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "ICC Women's World Cup",
            "type": "international",
            "event": "ICC Women's Cricket World Cup",
            "matchFormat": "ODI"
        },
        {
            "referenceKey": "event",
            "referenceValue": "ICC Men's T20 World Cup",
            "type": "international",
            "event": "ICC Men's T20 World Cup",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "World T20",
            "type": "domestic",
            "event": "ICC Men's T20 World Cup",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "Indian Premier League",
            "type": "domestic",
            "event": "Indian Premier League",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "NatWest T20 Blast",
            "type": "domestic",
            "event": "NatWest T20 Blast",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "Vitality Blast",
            "type": "domestic",
            "event": "Vitality Blast",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "Vitality Blast Men",
            "type": "domestic",
            "event": "Vitality Blast",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "International League T20",
            "type": "international",
            "event": "International League T20",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "Nepal Premier League",
            "type": "domestic",
            "event": "Nepal Premier League",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "Pakistan Super League",
            "type": "domestic",
            "event": "Pakistan Super League",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "ICC World Cup",
            "type": "international",
            "event": "ICC Men's Cricket World Cup",
            "matchFormat": "ODI"
        },
        {
            "referenceKey": "event",
            "referenceValue": "ICC Cricket World Cup",
            "type": "international",
            "event": "ICC Men's Cricket World Cup",
            "matchFormat": "ODI"
        },
        {
            "referenceKey": "event",
            "referenceValue": "World Cup",
            "type": "international",
            "event": "ICC Men's T20 World Cup",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "CG United Women's Super50",
            "type": "domestic",
            "event": "CG United Women's Super50",
            "matchFormat": "ODI"
        },
        {
            "referenceKey": "event",
            "referenceValue": "ICC World Cricket League Americas Region Division One Twenty20",
            "type": "international",
            "event": "ICC World Cricket League Americas Region Division One",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "Women's World T20",
            "type": "international",
            "event": "ICC Women's T20 World Cup",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "ICC Women's T20 World Cup",
            "type": "international",
            "event": "ICC Women's T20 World Cup",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "ICC Intercontinental Cup",
            "type": "international",
            "event": "ICC Intercontinental Cup",
            "matchFormat": "FirstClass"
        },
        {
            "referenceKey": "event",
            "referenceValue": "India tour of New Zealand",
            "type": "international",
            "event": TournamentName.IndiaTourOfNewZealand,
            "matchFormat": "ODI"
        },
        {
            "referenceKey": "event",
            "referenceValue": "Australia tour of West Indies",
            "type": "international",
            "event": TournamentName.AustraliaTourOfWestIndies,
            "matchFormat": "ODI"
        },
        {
            "referenceKey": "event",
            "referenceValue": "Big Bash League",
            "type": "domestic",
            "event": "Big Bash League",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "Women's T20 Blaze",
            "type": "domestic",
            "event": "Cricket West Indies Women's Twenty20 Blaze",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "T20 Blaze",
            "type": "domestic",
            "event": "Cricket West Indies Women's Twenty20 Blaze",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "Bangladesh Premier League",
            "type": "domestic",
            "event": "Bangladesh Premier League",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "Charlotte Edwards Cup",
            "type": "domestic",
            "event": "Charlotte Edwards Cup",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "Caribbean Premier League",
            "type": "domestic",
            "event": "Caribbean Premier League",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "The Hundred Men's Competition",
            "type": "domestic",
            "event": "The Hundred Men's Competition",
            "matchFormat": "TheHundred"
        },
        {
            "referenceKey": "event",
            "referenceValue": "The Hundred Women's Competition",
            "type": "domestic",
            "event": "The Hundred Women's Competition",
            "matchFormat": "TheHundred"
        },
        {
            "referenceKey": "event",
            "referenceValue": "Cricket Ireland Inter-Provincial Limited Over Cup",
            "type": "domestic",
            "event": "Cricket Ireland Inter‑Provincial Limited Over Cup",
            "matchFormat": "ODI"
        },
        {
            "referenceKey": "event",
            "referenceValue": "Cricket Ireland Inter-Provincial Twenty20 Trophy",
            "type": "domestic",
            "event": "Cricket Ireland Inter‑Provincial Twenty20 Trophy",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "Major Clubs T20 Tournament",
            "type": "domestic",
            "event": "Major Clubs T20 Sri Lanka",
            "matchFormat": "ListA"
        },
        {
            "referenceKey": "event",
            "referenceValue": "Lanka Premier League",
            "type": "domestic",
            "event": "Lanka Premier League",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "Major League Cricket",
            "type": "domestic",
            "event": "Major League Cricket",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "Rachael Heyhoe Flint Trophy",
            "type": "domestic",
            "event": "Rachael Heyhoe Flint Trophy",
            "matchFormat": "ODI"
        },
        {
            "referenceKey": "event",
            "referenceValue": "Royal London One-Day Cup",
            "type": "domestic",
            "event": "Metro Bank One Day Cup",
            "matchFormat": "ListA"
        },
        {
            "referenceKey": "event",
            "referenceValue": "SA20",
            "type": "domestic",
            "event": "Betway SA20",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "One-Day Cup",
            "type": "domestic",
            "event": "Metro Bank One Day Cup",
            "matchFormat": "ListA"
        },
        {
            "referenceKey": "event",
            "referenceValue": "HRV Cup",
            "type": "domestic",
            "event": "Super Smash",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "Syed Mushtaq Ali Trophy",
            "type": "domestic",
            "event": "Syed Mushtaq Ali Trophy",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "Women's Super Smash",
            "type": "domestic",
            "event": "Women's Super Smash",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "HRV Twenty20",
            "type": "domestic",
            "event": "Super Smash",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "New Zealand Cricket Women's Twenty20",
            "type": "domestic",
            "event": "Women's Super Smash",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "Women's Big Bash League",
            "type": "domestic",
            "event": "Women's Big Bash League",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "Super Smash",
            "type": "domestic",
            "event": "Super Smash",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "Women's Caribbean Premier League",
            "type": "domestic",
            "event": "Women's Caribbean Premier League",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "ECB Women's One-Day Cup",
            "type": "domestic",
            "event": "Metro Bank One Day Cup Women",
            "matchFormat": "ListA"
        },
        {
            "referenceKey": "event",
            "referenceValue": "Women's Premier League",
            "type": "domestic",
            "event": "Women's Premier League",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "Vitality Blast Women",
            "type": "domestic",
            "event": "Vitality Blast Female",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "Women's T20 Challenge Match",
            "type": "domestic",
            "event": "Women's Premier League",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "Women's T20 Challenge",
            "type": "domestic",
            "event": "Women's Premier League",
            "matchFormat": "T20"
        },
        {
            "referenceKey": "event",
            "referenceValue": "LV= County Championship",
            "type": "domestic",
            "event": "County Championship",
            "matchFormat": "FirstClass"
        },
        {
            "referenceKey": "event",
            "referenceValue": "Plunket Shield",
            "type": "domestic",
            "event": "Plunket Shield",
            "matchFormat": "FirstClass"
        },
        {
            "referenceKey": "event",
            "referenceValue": "Major League Tournament",
            "type": "domestic",
            "event": "Major League Tournament",
            "matchFormat": "T20"
        }
    ] as CachedInput[]
},
{
    "collectionName": "Team",
    "names": Object.values(TeamName),
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
    "names": [],
    "fields": {
        "innings": [
            "innings"
        ],
        "balls.ball": [
            "ball",
            "innings[?].overs[?].deliveries"
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
            "innings[?].overs[?].deliveries[?].runs.batter"
        ],
        "balls.extras.total": [
            "extras",
            "innings[?].overs[?].deliveries[?].runs.extras"
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
            "innings[?].team",
            "innings[?].overs[?].deliveries[?].runs",
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
            "innings[?].overs[?].deliveries[?].runs.total",
            "innings[?].overs[?].deliveries[?].runs.extras",
            "innings[?].overs[?].deliveries[?].wickets",
            "innings[?].overs[?].deliveries[?].wickets[?].fielders",
            "innings[?].overs[?].over",
            "innings[?].overs[?].deliveries[?].extras",
            "innings[?].overs[?].deliveries[?].runs.non_boundary",
            "innings[?].overs[?].deliveries[?].replacements",
            "innings[?].overs[?].deliveries[?].replacements.role",
            "innings[?].overs[?].deliveries[?].replacements.role[?].in",
            "innings[?].overs[?].deliveries[?].replacements.role[?].out",
            "innings[?].overs[?].deliveries[?].replacements.role[?].reason",
            "innings[?].overs[?].deliveries[?].replacements.match[?].reason",
            "innings[?].overs[?].deliveries[?].replacements.match[?].team",
            "innings[?].overs[?].deliveries[?].replacements.match[?].out",
            "innings[?].overs[?].deliveries[?].replacements.match[?].in",
            "innings[?].overs[?].deliveries[?].replacements.match",
            "innings[?].declared",
            "innings[?].absent_hurt[1]",
            "innings[?].absent_hurt[0]",
            "innings[?].absent_hurt",
            "innings[?].miscounted_overs",
            "innings[?].miscounted_overs.12",
            "innings[?].miscounted_overs.12.balls",
            "innings[?].overs[?].deliveries[?].replacements.role[?].role",
            "innings[?].overs[?].deliveries[?].wickets[?].fielders[?].substitute"
        ],
        "over": [
            "innings[?].overs"
        ]
    },
    "inputs": []
},
{
    "collectionName": "Player",
    "names": [],
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
    "names": [],
    "fields": {
        "name": [
            "match_referee",
            "match_referee1",
            "match_referee2"
        ]
    },
    "inputs": []
}];