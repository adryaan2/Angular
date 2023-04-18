import { Component } from '@angular/core';
import { MatchService } from '../service/match.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(private matchService: MatchService){}
  keres(){
    
  }
}
