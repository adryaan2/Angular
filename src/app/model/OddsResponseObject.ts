//a szövegként megadott törtszám átalakítása:
// let tort = parseFloat('123.45');
export interface OddsResponseObject {
    get:        string;
    parameters: Parameters;
    errors:     any[];
    results:    number;
    paging:     Paging;
    response:   OddsResponse[];
}

export interface Paging {
    current: number;
    total:   number;
}

export interface Parameters {
    league: string;
    season: string;
}

export interface OddsResponse {
    league:     League;
    fixture:    Fixture;
    update:     string;
    bookmakers: Bookmaker[];
}

export interface Bookmaker {
    id:   number;
    name: string;
    bets: Bet[];
}

export interface Bet {
    id:     number;
    name:   string;
    values: ValueElement[];
}

export interface ValueElement {
    value:  string;
    odd:   string;
}

export interface Fixture {
    id:        number;
    timezone:  string;
    date:      string;
    timestamp: number;
}

export interface League {
    id:      number;
    name:    string;
    country: string;
    logo:    string;
    flag:    string;
    season:  number;
}
