import { TournamentName } from "@cricket-analysis-monorepo/constants";
import { CachedInput, MappingData } from "../../database/model/mapping.model";

export const MAPPED_SHEET_KEY_DATA: MappingData[] = [{
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
        "venue": [
            "venue"
        ],
        "tournamentId": [],
        "toss.winnerTeam": [
            "toss_winner"
        ],
        "toss.winnerTeamDecision": [
            "toss_decision"
        ],
        "result.playerOfMatch": [
            "player_of_match",
            "player_of_match1",
            "player_of_match2"
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
        "umpire.fourthUmpire": [
            "tv_umpire",
            "umpire3"
        ],
        "umpire.thirdUmpire": [
            "reserve_umpire",
            "reserve_umpire1",
            "reserve_umpire2"
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
            "match_referee",
            "match_referee1",
            "match_referee2"
        ],
        "start_date": [
            "date",
            "date1"
        ],
        "team1.playingEleven": [
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
            "winner_innings"
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
        }
    ] as CachedInput[]
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
    ] as CachedInput[],
    "names": Object.values(TournamentName)
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
            "striker"
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
        "other": [
            "season",
            "start_date",
            "venue",
            "batting_team",
            "bowling_team"
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
}];