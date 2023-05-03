import { Component, inject } from '@angular/core';
import { MatchService } from '../service/match.service';
import { Match } from '../model/match';
import { OddsResponse } from '../model/OddsResponseObject';
import { Bet } from '../model/bet';

@Component({
  selector: 'app-fogadas',
  templateUrl: './fogadas.component.html',
  styleUrls: ['./fogadas.component.scss']
})
export class FogadasComponent {
  matchService = inject(MatchService);

  matchesWithOdds: Match[] = Array();
  nextMatchList: Match[] = Array();
  oddsResponses: OddsResponse[]=Array(); //a válasz egy nagy objektum, ebbe szedem ki a kicsit értelmesebb részét
  
  constructor(){
    //this.matchList = matchService.getBets(2022);
    this.feltolt(2022);
    
    console.log('matchesWithOdds elemszáma: '+this.matchesWithOdds.length);
  }

  feltolt(season: number): void{
    let temp: OddsResponse[] = Array();
    this.matchService.getOdds(season).subscribe(data => temp=data.response);
    console.log('temp elemszáma: '+temp.length);
    //szűrjük ki hogy csak a jövőbeli meccsek legyenek meg
    let now = new Date().getTime(); //UTC másodpercek
    this.oddsResponses=temp.filter(x => x.fixture.timestamp>now); //-------------------------------------------------
    
    //kövi meccsek tömb feltöltése
    //kód a meccslista componentből másolva
    this.matchService.getLastMatches(20).subscribe(data=>{
      //let jsonPipe: JsonPipe = new JsonPipe(); //debug konzolhoz
      this.nextMatchList = [];
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
        //console.log(jsonPipe.transform(ujMeccs));
      }
    });
    console.log("this.nextMatchList elemszám: "+this.nextMatchList.length);

    //NAGY LEVEGŐ
    //megvannak a fogadások (meccs azonosító és az odds-ok) this.oddsResponses
    //és a következő 35 meccs adata this.nextMatchList
    //ezeket kell most összefésülnöm
    let matchesWithOdds: Match[] = Array();//a függvényben ide töltöm az eredményeket, majd az osztályszintű tömböt egyenlővé teszem ezzel
    //végigmegyek a következő meccseken
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
            //az adatokat a saját struktúrámba rakom
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
    this.matchesWithOdds=matchesWithOdds;
  }
  


  getFormattedDate(timeStamp: number): string{
    return new Intl.DateTimeFormat("hu-HU").format(timeStamp*1000);
  }

  getFormattedTime(timeStamp: number): string{
    const date = new Date(timeStamp*1000);
    const hh = date.getHours();
    const mm = date.getMinutes();
    //return `${hh}:${mm}`;
    let res = date.toLocaleTimeString("hu-HU").substring(0,5);
    return res=='2:00:' ? "Még nem elérhető" : res;
  }

}
