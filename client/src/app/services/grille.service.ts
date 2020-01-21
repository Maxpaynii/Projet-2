import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GrilleService {

  tailleGrille = new  BehaviorSubject<number>(20);
  transparenceGrille = new  BehaviorSubject<number>(0);
  castTaille = this.tailleGrille.asObservable();
  castTransparence = this.transparenceGrille.asObservable();

  constructor() { }
  setTaille(valeur: number) {
    this.tailleGrille.next(valeur);
  }
  setTransparence(valeur: number) {
    this.transparenceGrille.next(valeur);
  }
}
