import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OutilActifService {

  outilActif = new BehaviorSubject<string>('Default') ;
  castO = this.outilActif.asObservable();

  constructor() {}

  setOutilActif(outil: string) {
    this.outilActif.next(outil);
  }
}
