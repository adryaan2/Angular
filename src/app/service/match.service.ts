import { Injectable } from '@angular/core';
import { Match } from '../model/match';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { FixturesResponse } from '../model/FixturesResponse';
import { Observable } from 'rxjs';
import { OddsResponseObject, OddsResponse, Bookmaker } from '../model/OddsResponseObject';
import { Bet } from '../model/bet';
import { JsonPipe } from '@angular/common';
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

  getNextMatchesArray(next: number): Match[]{
    this.getNextMatches(next).subscribe(
      data=>{
        this.nextMatchList = []; //ha nem sikerül a json parse ne nullázza le a tömböt
        for(var aktMeccs of data.response){
          let ujMeccs: Match = new Match();
          ujMeccs.fixtureId=aktMeccs.fixture?.id;
          ujMeccs.timeStamp=aktMeccs.fixture?.timestamp;
          ujMeccs.goalsHome=aktMeccs.goals?.home;
          ujMeccs.goalsAway=aktMeccs.goals?.away;
          ujMeccs.home=aktMeccs.teams?.home?.name;
          ujMeccs.away=aktMeccs.teams?.away?.name;
          ujMeccs.imgSrcHome=aktMeccs.teams?.home?.logo;
          ujMeccs.imgSrcAway=aktMeccs.teams?.away?.logo;
          this.nextMatchList.push(ujMeccs);
          console.log(ujMeccs);
        }
      }
    )
    return this.nextMatchList;
  }

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

  /*getLastMatchesArray(last: number): Match[]{
    this.getLastMatches(last).subscribe(
      data=>{
        //let jsonPipe: JsonPipe = new JsonPipe(); //debug konzolhoz
        this.lastMatchList = [];
        for(var aktMeccs of data.response){
          let ujMeccs: Match = new Match();
          ujMeccs.fixtureId=aktMeccs.fixture?.id;
          ujMeccs.timeStamp=aktMeccs.fixture?.timestamp;
          ujMeccs.goalsHome=aktMeccs.goals?.home;
          ujMeccs.goalsAway=aktMeccs.goals?.away;
          ujMeccs.home=aktMeccs.teams?.home?.name;
          ujMeccs.away=aktMeccs.teams?.away?.name;
          ujMeccs.imgSrcHome=aktMeccs.teams?.home?.logo;
          ujMeccs.imgSrcAway=aktMeccs.teams?.away?.logo;
          this.lastMatchList.push(ujMeccs);
          //console.log(jsonPipe.transform(ujMeccs));
        }
        console.log(this.lastMatchList.length);
      }
    )
    return this.lastMatchList;
  }*/

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
/*
  getBets(season: number): Match[]{
    let temp: OddsResponse[] = Array();
    this.getOdds(season).subscribe(data => temp=data.response);

    //szűrjük ki hogy csak a jövőbeli meccsek legyenek meg
    let now = new Date().getTime(); //UTC másodpercek
    this.oddsResponses=temp;//.filter(x => x.fixture.timestamp>now); -------------------------------------------------
    this.nextMatchList = this.getNextMatchesArray(35);
    console.log("this.nextMatchList elemszám: "+this.nextMatchList.length);
    let matchesWithOdds: Match[] = Array();//a függvényben ide töltöm az eredményeket, majd az osztályszintű tömböt egyenlővé teszem ezzel
    for(let akt of this.nextMatchList){

      let id = akt.fixtureId;

      let aktOddsRe = this.oddsResponses.find(x=>x.fixture.id===id);
      if(aktOddsRe !== undefined){
        let ujMeccs = akt; //ebbe fogom a fogadási adatokat felvenni és ezt fogom tömbbe rakni
        let bookmakerUnibet = aktOddsRe.bookmakers.find(x=>x.name=="Unibet");
        if(bookmakerUnibet!==undefined){
          let valueElementHome=bookmakerUnibet.bets[0].values.find(x => x.value==="Home");
          let valueElementDraw=bookmakerUnibet.bets[0].values.find(x => x.value==="Draw");
          let valueElementAway=bookmakerUnibet.bets[0].values.find(x => x.value==="Away");
          if(valueElementHome!==undefined &&
            valueElementDraw!==undefined &&
            valueElementAway!==undefined){
            let home: string = valueElementHome.odd;
            let draw: string = valueElementDraw.odd;
            let away: string = valueElementAway.odd;
            let unibet : Bet = {
            bookmakerName: bookmakerUnibet.name,
            bookmakerId: bookmakerUnibet.id,
            home: home,
            away: away,
            draw: draw
            }
            akt.unibet=unibet;
          }
        }

        let bookmakerBet365 = aktOddsRe.bookmakers.find(x=>x.name=="Bet365");
        if(bookmakerBet365!==undefined){
          let valueElementHome=bookmakerBet365.bets[0].values.find(x => x.value==="Home");
          let valueElementDraw=bookmakerBet365.bets[0].values.find(x => x.value==="Draw");
          let valueElementAway=bookmakerBet365.bets[0].values.find(x => x.value==="Away");
          if(valueElementHome!==undefined &&
            valueElementDraw!==undefined &&
            valueElementAway!==undefined){
            let home: string = valueElementHome.odd;
            let draw: string = valueElementDraw.odd;
            let away: string = valueElementAway.odd;
            let bet365 : Bet = {
            bookmakerName: bookmakerBet365.name,
            bookmakerId: bookmakerBet365.id,
            home: home,
            away: away,
            draw: draw
            }
            akt.bet365=bet365;
          }
        }

        let bookmakerBwin = aktOddsRe.bookmakers.find(x=>x.name=="Bwin");
        if(bookmakerBwin!==undefined){
          let valueElementHome=bookmakerBwin.bets[0].values.find(x => x.value==="Home");
          let valueElementDraw=bookmakerBwin.bets[0].values.find(x => x.value==="Draw");
          let valueElementAway=bookmakerBwin.bets[0].values.find(x => x.value==="Away");
          if(valueElementHome!==undefined &&
            valueElementDraw!==undefined &&
            valueElementAway!==undefined){
            let home: string = valueElementHome.odd;
            let draw: string = valueElementDraw.odd;
            let away: string = valueElementAway.odd;
            let bwin : Bet = {
            bookmakerName: bookmakerBwin.name,
            bookmakerId: bookmakerBwin.id,
            home: home,
            away: away,
            draw: draw
            }
            akt.bwin=bwin;
          }
        }
        matchesWithOdds.push(ujMeccs);
      }
    }
    return matchesWithOdds;
  }*/


}
