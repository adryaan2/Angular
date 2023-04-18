// To parse this data:
//
//   import { Convert, FixturesResponse } from "./file";
//
//   const fixturesResponse = Convert.toFixturesResponse(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface FixturesResponse {
    get:        string;
    parameters: Parameters;
    errors:     any[];
    results:    number;
    paging:     Paging;
    response:   Response[];
}

export interface Paging {
    current: number;
    total:   number;
}

export interface Parameters {
    id: string;
}

export interface Response {
    fixture:    Fixture;
    league:     League;
    teams:      Teams;
    goals:      Goals;
    score:      Score;
    events:     Event[];
    lineups:    Lineup[];
    statistics: ResponseStatistic[];
    players:    any[];
}

export interface Event {
    time:     Time;
    team:     EventTeam;
    player:   EventPlayer;
    assist:   Assist;
    type:     string;
    detail:   string;
    comments: null;
}

export interface Assist {
    id:   number | null;
    name: null | string;
}

export interface EventPlayer {
    id:   number;
    name: string;
}

export interface EventTeam {
    id:   number;
    name: string;
    logo: string;
}

export interface Time {
    elapsed: number;
    extra:   number | null;
}

export interface Fixture {
    id:        number;
    referee:   string;
    timezone:  string;
    date:      string;
    timestamp: number;
    periods:   Periods;
    venue:     Venue;
    status:    Status;
}

export interface Periods {
    first:  number;
    second: number;
}

export interface Status {
    long:    string;
    short:   string;
    elapsed: number;
}

export interface Venue {
    id:   number;
    name: string;
    city: string;
}

export interface Goals {
    home: number;
    away: number;
}

export interface League {
    id:      number;
    name:    string;
    country: string;
    logo:    string;
    flag:    string;
    season:  number;
    round:   string;
}

export interface Lineup {
    team:        LineupTeam;
    coach:       Coach;
    formation:   string;
    startXI:     StartXi[];
    substitutes: Substitute[];
}

export interface Coach {
    id:    number;
    name:  string;
    photo: string;
}

export interface StartXi {
    player: StartXiPlayer;
}

export interface StartXiPlayer {
    id:     number;
    name:   string;
    number: number;
    pos:    string;
    grid:   string;
}

export interface Substitute {
    player: SubstitutePlayer;
}

export interface SubstitutePlayer {
    id:     number;
    name:   string;
    number: number;
    pos:    null | string;
    grid:   null;
}

export interface LineupTeam {
    id:     number;
    name:   string;
    logo:   string;
    colors: Colors;
}

export interface Colors {
    player:     Goalkeeper;
    goalkeeper: Goalkeeper;
}

export interface Goalkeeper {
    primary: string;
    number:  string;
    border:  string;
}

export interface Score {
    halftime:  Goals;
    fulltime:  Goals;
    extratime: Extratime;
    penalty:   Extratime;
}

export interface Extratime {
    home: null;
    away: null;
}

export interface ResponseStatistic {
    team:       EventTeam;
    statistics: StatisticStatistic[];
}

export interface StatisticStatistic {
    type:  string;
    value: number | null;
}

export interface Teams {
    home: Away;
    away: Away;
}

export interface Away {
    id:     number;
    name:   string;
    logo:   string;
    winner: boolean;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toFixturesResponse(json: string): FixturesResponse {
        return cast(JSON.parse(json), r("FixturesResponse"));
    }

    public static fixturesResponseToJson(value: FixturesResponse): string {
        return JSON.stringify(uncast(value, r("FixturesResponse")), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ''): never {
    const prettyTyp = prettyTypeName(typ);
    const parentText = parent ? ` on ${parent}` : '';
    const keyText = key ? ` for key "${key}"` : '';
    throw Error(`Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`);
}

function prettyTypeName(typ: any): string {
    if (Array.isArray(typ)) {
        if (typ.length === 2 && typ[0] === undefined) {
            return `an optional ${prettyTypeName(typ[1])}`;
        } else {
            return `one of [${typ.map(a => { return prettyTypeName(a); }).join(", ")}]`;
        }
    } else if (typeof typ === "object" && typ.literal !== undefined) {
        return typ.literal;
    } else {
        return typeof typ;
    }
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = '', parent: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key, parent);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val, key, parent);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases.map(a => { return l(a); }), val, key, parent);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue(l("Date"), val, key, parent);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue(l(ref || "object"), val, key, parent);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, key, ref);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key, ref);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val, key, parent);
    }
    if (typ === false) return invalidValue(typ, val, key, parent);
    let ref: any = undefined;
    while (typeof typ === "object" && typ.ref !== undefined) {
        ref = typ.ref;
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val, key, parent);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
    return { literal: typ };
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "FixturesResponse": o([
        { json: "get", js: "get", typ: "" },
        { json: "parameters", js: "parameters", typ: r("Parameters") },
        { json: "errors", js: "errors", typ: a("any") },
        { json: "results", js: "results", typ: 0 },
        { json: "paging", js: "paging", typ: r("Paging") },
        { json: "response", js: "response", typ: a(r("Response")) },
    ], false),
    "Paging": o([
        { json: "current", js: "current", typ: 0 },
        { json: "total", js: "total", typ: 0 },
    ], false),
    "Parameters": o([
        { json: "id", js: "id", typ: "" },
    ], false),
    "Response": o([
        { json: "fixture", js: "fixture", typ: r("Fixture") },
        { json: "league", js: "league", typ: r("League") },
        { json: "teams", js: "teams", typ: r("Teams") },
        { json: "goals", js: "goals", typ: r("Goals") },
        { json: "score", js: "score", typ: r("Score") },
        { json: "events", js: "events", typ: a(r("Event")) },
        { json: "lineups", js: "lineups", typ: a(r("Lineup")) },
        { json: "statistics", js: "statistics", typ: a(r("ResponseStatistic")) },
        { json: "players", js: "players", typ: a("any") },
    ], false),
    "Event": o([
        { json: "time", js: "time", typ: r("Time") },
        { json: "team", js: "team", typ: r("EventTeam") },
        { json: "player", js: "player", typ: r("EventPlayer") },
        { json: "assist", js: "assist", typ: r("Assist") },
        { json: "type", js: "type", typ: "" },
        { json: "detail", js: "detail", typ: "" },
        { json: "comments", js: "comments", typ: null },
    ], false),
    "Assist": o([
        { json: "id", js: "id", typ: u(0, null) },
        { json: "name", js: "name", typ: u(null, "") },
    ], false),
    "EventPlayer": o([
        { json: "id", js: "id", typ: 0 },
        { json: "name", js: "name", typ: "" },
    ], false),
    "EventTeam": o([
        { json: "id", js: "id", typ: 0 },
        { json: "name", js: "name", typ: "" },
        { json: "logo", js: "logo", typ: "" },
    ], false),
    "Time": o([
        { json: "elapsed", js: "elapsed", typ: 0 },
        { json: "extra", js: "extra", typ: u(0, null) },
    ], false),
    "Fixture": o([
        { json: "id", js: "id", typ: 0 },
        { json: "referee", js: "referee", typ: "" },
        { json: "timezone", js: "timezone", typ: "" },
        { json: "date", js: "date", typ: "" },
        { json: "timestamp", js: "timestamp", typ: 0 },
        { json: "periods", js: "periods", typ: r("Periods") },
        { json: "venue", js: "venue", typ: r("Venue") },
        { json: "status", js: "status", typ: r("Status") },
    ], false),
    "Periods": o([
        { json: "first", js: "first", typ: 0 },
        { json: "second", js: "second", typ: 0 },
    ], false),
    "Status": o([
        { json: "long", js: "long", typ: "" },
        { json: "short", js: "short", typ: "" },
        { json: "elapsed", js: "elapsed", typ: 0 },
    ], false),
    "Venue": o([
        { json: "id", js: "id", typ: 0 },
        { json: "name", js: "name", typ: "" },
        { json: "city", js: "city", typ: "" },
    ], false),
    "Goals": o([
        { json: "home", js: "home", typ: 0 },
        { json: "away", js: "away", typ: 0 },
    ], false),
    "League": o([
        { json: "id", js: "id", typ: 0 },
        { json: "name", js: "name", typ: "" },
        { json: "country", js: "country", typ: "" },
        { json: "logo", js: "logo", typ: "" },
        { json: "flag", js: "flag", typ: "" },
        { json: "season", js: "season", typ: 0 },
        { json: "round", js: "round", typ: "" },
    ], false),
    "Lineup": o([
        { json: "team", js: "team", typ: r("LineupTeam") },
        { json: "coach", js: "coach", typ: r("Coach") },
        { json: "formation", js: "formation", typ: "" },
        { json: "startXI", js: "startXI", typ: a(r("StartXi")) },
        { json: "substitutes", js: "substitutes", typ: a(r("Substitute")) },
    ], false),
    "Coach": o([
        { json: "id", js: "id", typ: 0 },
        { json: "name", js: "name", typ: "" },
        { json: "photo", js: "photo", typ: "" },
    ], false),
    "StartXi": o([
        { json: "player", js: "player", typ: r("StartXiPlayer") },
    ], false),
    "StartXiPlayer": o([
        { json: "id", js: "id", typ: 0 },
        { json: "name", js: "name", typ: "" },
        { json: "number", js: "number", typ: 0 },
        { json: "pos", js: "pos", typ: "" },
        { json: "grid", js: "grid", typ: "" },
    ], false),
    "Substitute": o([
        { json: "player", js: "player", typ: r("SubstitutePlayer") },
    ], false),
    "SubstitutePlayer": o([
        { json: "id", js: "id", typ: 0 },
        { json: "name", js: "name", typ: "" },
        { json: "number", js: "number", typ: 0 },
        { json: "pos", js: "pos", typ: u(null, "") },
        { json: "grid", js: "grid", typ: null },
    ], false),
    "LineupTeam": o([
        { json: "id", js: "id", typ: 0 },
        { json: "name", js: "name", typ: "" },
        { json: "logo", js: "logo", typ: "" },
        { json: "colors", js: "colors", typ: r("Colors") },
    ], false),
    "Colors": o([
        { json: "player", js: "player", typ: r("Goalkeeper") },
        { json: "goalkeeper", js: "goalkeeper", typ: r("Goalkeeper") },
    ], false),
    "Goalkeeper": o([
        { json: "primary", js: "primary", typ: "" },
        { json: "number", js: "number", typ: "" },
        { json: "border", js: "border", typ: "" },
    ], false),
    "Score": o([
        { json: "halftime", js: "halftime", typ: r("Goals") },
        { json: "fulltime", js: "fulltime", typ: r("Goals") },
        { json: "extratime", js: "extratime", typ: r("Extratime") },
        { json: "penalty", js: "penalty", typ: r("Extratime") },
    ], false),
    "Extratime": o([
        { json: "home", js: "home", typ: null },
        { json: "away", js: "away", typ: null },
    ], false),
    "ResponseStatistic": o([
        { json: "team", js: "team", typ: r("EventTeam") },
        { json: "statistics", js: "statistics", typ: a(r("StatisticStatistic")) },
    ], false),
    "StatisticStatistic": o([
        { json: "type", js: "type", typ: "" },
        { json: "value", js: "value", typ: u(0, null) },
    ], false),
    "Teams": o([
        { json: "home", js: "home", typ: r("Away") },
        { json: "away", js: "away", typ: r("Away") },
    ], false),
    "Away": o([
        { json: "id", js: "id", typ: 0 },
        { json: "name", js: "name", typ: "" },
        { json: "logo", js: "logo", typ: "" },
        { json: "winner", js: "winner", typ: true },
    ], false),
};
