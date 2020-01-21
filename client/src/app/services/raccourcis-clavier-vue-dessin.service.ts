import { Injectable } from '@angular/core';
import { VueDessinComponent } from 'app/components/vue-dessin/vue-dessin.component';

const TOUCHE_CRAYON = 'c';
const TOUCHE_ETAMPE = undefined; // TOUCHE manquant dans les instructions?
const TOUCHE_SELECTION = 's';
const TOUCHE_ELLIPSE = '2';
const TOUCHE_OUVRIR_DESSIN = 'o';
const TOUCHE_CHARGER = 'g';
const TOUCHE_SAUVEGARDER = 's';
const TOUCHE_COPIER = 'c';
const TOUCHE_COLLER = 'v';
const TOUCHE_COUPER = 'x';
const TOUCHE_DUPLIQUER = 'd';
const TOUCHE_SUPPRIMER = 'Delete';
const TOUCHE_TOUT_SELECTIONNER = 'a';
const TOUCHE_TEXTE = 't';
const TOUCHE_EFFACE = 'e';
const TOUCHE_ANNULER = 'z';
const TOUCHE_REFAIRE = 'Z';
const TOUCHE_PLUME = 'p';
const TOUCHE_AEROSOL = 'a';
const TOUCHE_MAGNETISME = 'm';
const TOUCHE_AUGMENTER_TAILLE_GRILLE = '+';
const TOUCHE_DIMINUER_TAILLE_GRILLE = '-';

const CRAYON = "Crayon";
const SELECTION = "Selection";
const ELLIPSE = "Ellipse";
const ETAMPE = 'Etampe';
const TEXTE = 'Texte';
const EFFACE = 'Efface';
const FORMULAIRE = "Formulaire";
const SAUVEGARDER = "Sauvegarder";
const CHARGER = "Charger";
const PLUME = 'Plume';
const AEROSOL = 'Aerosol';

@Injectable({
  providedIn: 'root',
})
export class RaccourcisClavierVueDessinService {

  constructor() { /* vide */ }

  gereRaccourcis(vueDessin: VueDessinComponent, toucheAppuyee: string, ctrlAppuye: boolean, shiftAppuye: boolean): void {
    if (ctrlAppuye) {
      this.gereCasCtrl(vueDessin, toucheAppuyee);
    } else {
    this.gereCasSansCtrl(vueDessin, toucheAppuyee);
    }
  }

  gereCasCtrl(vueDessin: VueDessinComponent, toucheAppuyee: string): void {
    switch (toucheAppuyee) {
      case TOUCHE_OUVRIR_DESSIN: {
        vueDessin.raccourcisClavierActifs = false;
        vueDessin.verification(FORMULAIRE);
        break;
      }
      case TOUCHE_COPIER: {
        vueDessin.pressePapier.copier();
        break;
      }
      case TOUCHE_COLLER: {
        vueDessin.pressePapier.coller();
        break;
      }
      case TOUCHE_COUPER: {
        vueDessin.pressePapier.couper();
        break;
      }
      case TOUCHE_DUPLIQUER: {
        vueDessin.pressePapier.dupliquer();
        break;
      }
      case TOUCHE_TOUT_SELECTIONNER: {
        // TODO: tout sélectionner
        break;
      }
      case TOUCHE_ANNULER: {
        vueDessin.annulRefait.annuler();
        break;
      }
      case TOUCHE_REFAIRE: {
        vueDessin.annulRefait.refaire();
        break;
      }
      case TOUCHE_SAUVEGARDER: {
        vueDessin.raccourcisClavierActifs = false;
        vueDessin.verification(SAUVEGARDER);
        break;
      }
      case TOUCHE_CHARGER: {
        vueDessin.raccourcisClavierActifs = false;
        vueDessin.verification(CHARGER);
        break;
      }
      default: {
        // touche qui ne fait rien.
        break;
      }
    }
  }

  gereCasSansCtrl(vueDessin: VueDessinComponent, toucheAppuyee: string): void {
    switch (toucheAppuyee) {
      case TOUCHE_CRAYON: {
        vueDessin.ouvrirColonneOptions(CRAYON);
        break;
      }
      case TOUCHE_ELLIPSE: {
        vueDessin.ouvrirColonneOptions(ELLIPSE);
        break;
      }
      case TOUCHE_SELECTION: {
        vueDessin.ouvrirColonneOptions(SELECTION);
        break;
      }
      case TOUCHE_ETAMPE: {
        vueDessin.ouvrirColonneOptions(ETAMPE);
        break;
      }
      case TOUCHE_TEXTE: {
        vueDessin.ouvrirColonneOptions(TEXTE);
        break;
      }
      case TOUCHE_EFFACE: {
        vueDessin.ouvrirColonneOptions(EFFACE);
        break;
      }
      case TOUCHE_SUPPRIMER: {
        vueDessin.pressePapier.supprimer();
        break;
      }
      case TOUCHE_PLUME: {
        vueDessin.ouvrirColonneOptions(PLUME);
        break;
      }
      case TOUCHE_AEROSOL: {
        vueDessin.ouvrirColonneOptions(AEROSOL);
        break;
      }
      case TOUCHE_MAGNETISME: {
        // TODO: magnétisme
        break;
      }
      case TOUCHE_AUGMENTER_TAILLE_GRILLE: {
        // TODO: augmenter taille grille
        break;
      }
      case TOUCHE_DIMINUER_TAILLE_GRILLE: {
        // TODO: diminuer taille grille
        break;
      }
      default: {
        // touche qui ne fait rien.
        break;
      }
    }
  }
}
