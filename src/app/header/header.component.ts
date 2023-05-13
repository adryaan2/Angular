import { Component, inject } from '@angular/core';
import { KeresesService } from '../kereses.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  str: string="";
  keresService = inject(KeresesService);
  constructor(){}
  keres(str: string){
    this.keresService.searchStr=str;
  }
}
