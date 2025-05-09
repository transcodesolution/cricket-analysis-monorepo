export enum MatchFormat {
    T10 = 'T10',
    T20 = 'T20',
    ODI = 'ODI',
    TEST = 'TEST',
    LIST_A = 'ListA',
    FIRST_CLASS = 'FirstClass',
    THE_HUNDRED = 'TheHundred',
}

export enum TossResult {
    head = 'head',
    tail = 'tail',
}

export enum WinnerTeamDecision {
    bat = 'bat',
    field = 'field',
}

export enum MatchStatus {
    tie = 'Tie',
    draw = 'Draw',
    run = 'WinByRun',
    wicket = 'WinByWicket',
}

export enum BowlingStyleType {
    // Right-arm seam bowling
    RFM = "Right-arm fast-medium",
    RMF = "Right-arm medium-fast",
    RM = "Right-arm medium",
    RMS = "Right-arm medium-slow",
    RSM = "Right-arm slow-medium",
    RS = "Right-arm slow",

    // Left-arm seam bowling
    LF = "Left-arm fast",
    LFM = "Left-arm fast-medium",
    LMF = "Left-arm medium-fast",
    LM = "Left-arm medium",
    LMS = "Left-arm medium-slow",
    LSM = "Left-arm slow-medium",
    LS = "Left-arm slow",

    // Right-arm spin bowling
    OB = "Off break",
    LB = "Leg break",
    LBG = "Leg break googly",

    // Left-arm spin bowling
    S_LA = "Slow left-arm orthodox",
    S_LW = "Slow left-arm wrist spin",
    LAG = "Left-arm googly"
}  