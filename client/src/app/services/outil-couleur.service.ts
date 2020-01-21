import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

const NOMBRE_COULEURS_HISTORIQUE = 10;
const MIN = 1;
const VALEUR_COULEUR_DEFAUT = '#00FFFFFF';
@Injectable({
  providedIn: 'root',
})
export class OutilCouleurService {
  tableauTemp: string[];
  private tableauDixCouleurs: BehaviorSubject<string[]>;
  couleurPrimaire: BehaviorSubject<string>;
  couleurSecondaire: BehaviorSubject<string>;
  castP: Observable<string>;
  castS: Observable<string>;
  castT: Observable<string[]>;
  couleur: string;

  constructor() {

    this.tableauTemp = [];
    const TABLEAU_BEHAVIOR: string[] = [];
    for (let i = 0; i < NOMBRE_COULEURS_HISTORIQUE; i++) {
      this.tableauTemp.push(VALEUR_COULEUR_DEFAUT);
      TABLEAU_BEHAVIOR.push(VALEUR_COULEUR_DEFAUT);
    }
    this.tableauDixCouleurs = new BehaviorSubject<string[]>(TABLEAU_BEHAVIOR);
    this.couleurPrimaire = new BehaviorSubject<string>(VALEUR_COULEUR_DEFAUT);
    this.couleurSecondaire = new BehaviorSubject<string>(VALEUR_COULEUR_DEFAUT);

    this.castP = this.couleurPrimaire.asObservable();
    this.castS = this.couleurSecondaire.asObservable();
    this.castT = this.tableauDixCouleurs.asObservable();
    this.couleur = VALEUR_COULEUR_DEFAUT;
  }

  setCouleurPrimaire(nouvelleCouleur: string) {
    this.couleurPrimaire.next(nouvelleCouleur);
  }
  setCouleurSecondaire(nouvelleCouleur: string) {
    this.couleurSecondaire.next(nouvelleCouleur);
  }
  setTableauxDixCouleurs(nouvelleCouleur: string) {
    for (let compteur = this.tableauTemp.length - MIN; compteur >= MIN; compteur--) {
      this.tableauTemp[compteur] = this.tableauTemp[compteur - MIN];
    }
    this.tableauTemp[0] = nouvelleCouleur;
    this.tableauDixCouleurs.next(this.tableauTemp);
  }
}
