import { Component, inject } from '@angular/core';
import { MatchService } from '../service/match.service';
import { Match } from '../model/match';
import { Convert, FixturesResponse } from "../model/FixturesResponse";
//import * as FixturesResponse from '../model/FixturesResponse'

@Component({
  selector: 'app-meccslista',
  templateUrl: './meccslista.component.html',
  styleUrls: ['./meccslista.component.scss']
})
export class MeccslistaComponent {
  constructor(){
    this.matchService.getLastMatches(20).subscribe(
      data=>{
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
          console.log(ujMeccs);
        }
      }
    )
  }

  matchService = inject(MatchService); //csak akkor hozza létre ha még sehol senki se inject()-elte
  nextMatchList: Match[] = Array();
  lastMatchList: Match[] = Array();

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
