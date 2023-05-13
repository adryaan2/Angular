import { Injectable } from '@angular/core';
import { Match } from '../model/match';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { FixturesResponse } from '../model/FixturesResponse';
import { Observable } from 'rxjs';
import { OddsResponseObject } from '../model/OddsResponseObject';
@Injectable({
  providedIn: 'root'
})
export class MatchService {

  constructor(private http: HttpClient){}
  //http: HttpClient = inject(HttpClient);

  apiBaseUrl: string = "https://v3.football.api-sports.io/";
  private headerObj = new HttpHeaders().append('x-rapidapi-key','aa1beda9203dea8404b8275543aa18dd');

  nextMatchList: Match[] = Array();
  lastMatchList: Match[] = Array();
  matchesWithOdds: Match[] = Array();

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

  
  getOdds(season: number, page: number): Observable<OddsResponseObject>{
    let queryParams = new HttpParams();
    queryParams = queryParams.append("league",271);
    queryParams = queryParams.append("season",season);
    queryParams = queryParams.append("bet",1);
    queryParams = queryParams.append("page",page);
    const requestOptions = {
      headers: this.headerObj,
      params: queryParams
    };
    return this.http.get<OddsResponseObject>(this.apiBaseUrl+"odds", requestOptions);
  }

}
