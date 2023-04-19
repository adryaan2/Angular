import { Bet } from "./bet";

export class Match {
    fixtureId?: number = -1;
    timeStamp: number = -1;
    home: string = "NO_HOME";
    away: string = "NO_AWAY";
    goalsHome?: number = -1;
    goalsAway?: number = -1;
    imgSrcHome?: string;
    imgSrcAway?: string;
    unibet?: Bet;
    bet365?: Bet;
    bwin?: Bet;
}
