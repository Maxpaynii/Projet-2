import { Injectable } from '@angular/core';
import {OutilCouleurService } from './outil-couleur.service';

const COULEUR_VIDE = 'none';
const URL_GRILLE = 'url(#smallGrid)';
@Injectable({
  providedIn: 'root',
})
export class PipetteService {

  constructor(private outilcouleurservice: OutilCouleurService) { }
  appliquePipette(event: MouseEvent, objetVise: any) {
    objetVise = event.target;
    if (event.button === 0) {   //click gauche
      const COULEUR = objetVise.getAttribute('fill');
      if (COULEUR !== COULEUR_VIDE && COULEUR !== URL_GRILLE) { this.outilcouleurservice.setCouleurPrimaire(COULEUR); }
    }
    if (event.button === 2) {  //click droit
      const COULEUR = objetVise.getAttribute('stroke');
      if (COULEUR !== COULEUR_VIDE && COULEUR !== null) { this.outilcouleurservice.setCouleurSecondaire(COULEUR); }
    }
  }
}
