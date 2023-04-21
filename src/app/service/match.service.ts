import { Injectable } from '@angular/core';
import { Match } from '../model/match';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Convert, FixturesResponse } from '../model/FixturesResponse';
import { Observable } from 'rxjs';
import { OddsResponse } from '../model/OddsResponse';
@Injectable({
  providedIn: 'root'
})
export class MatchService {

  constructor(private http: HttpClient){}
  //http: HttpClient = inject(HttpClient);

  apiBaseUrl: string = "https://v3.football.api-sports.io/";
  private headerObj = new HttpHeaders().append('x-rapidapi-key','aa1beda9203dea8404b8275543aa18dd');

  list$: Match[] = [
    {timeStamp: 1681495200, home: "Paksi FC", away: "FTC", goalsHome: 3, goalsAway: 2},
    {timeStamp: 1681561800, away: "Paksi FC", home: "FTC", goalsHome: 1, goalsAway: 3},
    {timeStamp: 1681570800, away: "aaaaaaa", home: "bdfgdfb", goalsHome: 1, goalsAway: 1},
  ]

  getNextMatches(next: number): Observable<FixturesResponse>{
    let queryParams = new HttpParams();
    
    queryParams = queryParams.append("league",271);
    queryParams = queryParams.append("next",next);
    const requestOptions = {
      headers: this.headerObj,
      params: queryParams
    };
    return this.http.get<FixturesResponse>(this.apiBaseUrl+"fixtures", requestOptions);
  }

  getLastMatches(last: number): Observable<FixturesResponse>{
    let queryParams = new HttpParams();
    queryParams = queryParams.append("league",271);
    queryParams = queryParams.append("last",last);

    const requestOptions = {
      headers: this.headerObj,
      params: queryParams
    };
    return this.http.get<FixturesResponse>(this.apiBaseUrl+"fixtures", requestOptions);
  }

  getOdds(season: number): Observable<OddsResponse>{
    let queryParams = new HttpParams();
    queryParams = queryParams.append("league",271);
    queryParams = queryParams.append("season",season);
    queryParams = queryParams.append("bet",1);

    const requestOptions = {
      headers: this.headerObj,
      params: queryParams
    };
    return this.http.get<OddsResponse>(this.apiBaseUrl+"odds", requestOptions);
  }

}
