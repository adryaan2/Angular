import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class KeresesService {

  searchEvent: EventEmitter<string>=new EventEmitter();
  str: string="";

  constructor() { }
  get searchStr(): string{return this.str}

  set searchStr(uj: string){
    this.str = uj;
    this.searchEvent.emit(uj);
  }
}
