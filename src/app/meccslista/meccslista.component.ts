import { Component, inject } from '@angular/core';
import { MatchService } from '../service/match.service';
import { Match } from '../model/match';
import { KeresesService } from '../kereses.service';
//import * as FixturesResponse from '../model/FixturesResponse'

@Component({
  selector: 'app-meccslista',
  templateUrl: './meccslista.component.html',
  styleUrls: ['./meccslista.component.scss']
})
export class MeccslistaComponent {
  matchService = inject(MatchService); //csak akkor hozza létre ha még sehol senki se inject()-elte
  keresService = inject(KeresesService);
  nextMatchList: Match[] = Array();
  lastMatchList: Match[] = Array(); //összeset tárolja amit lekértünk
  filteredLastMatchList: Match[] = Array(); //ezt írjuk ki

  constructor(){
    this.keresService.searchEvent.subscribe(str=>this.searchFilter(str))
    //this.lastMatchList = this.matchService.getLastMatchesArray(20);
    this.matchService.getNextMatches(20).subscribe(
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
        // filteredLastMatchList-be leklónozom a lastMatchList-et
        this.filteredLastMatchList=Object.assign([], this.lastMatchList);
      }
    )
  }

  searchFilter(str: string):void{
    str=str.toLowerCase();
    this.filteredLastMatchList=this.lastMatchList.filter(x=>(x.home.toLowerCase().includes(str)) || (x.away.toLowerCase().includes(str)))
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
