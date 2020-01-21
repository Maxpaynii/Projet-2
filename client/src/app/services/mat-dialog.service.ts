import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AlertecreerComponent } from 'app/components/alertecreer/alertecreer.component';
import { ChargerEtiquetteComponent } from 'app/components/charger-etiquette/charger-etiquette.component';
import { CreerNouveauDessinComponent } from 'app/components/creer-nouveau-dessin/creer-nouveau-dessin.component';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { AlerteCreer, NouveauDessin } from '../../../../common/nouveaudessin';
import { Image } from '../../../../common/image';
import { SauvegarderEtiquetteComponent } from 'app/components/sauvegarder-etiquette/sauvegarder-etiquette.component';

const COULEURBLANC = "#ffffff";
const DEUXCINQZEROPX = "250px";
const AUTO = "auto";
const DEUXSEPTCINQ = 275;
const FORMULAIRE = "Formulaire";
const SAUVEGARDER = "Sauvegarder";
const CHARGER = "Charger";

@Injectable({
  providedIn: 'root',
})
export class MatDialogService {

  confirmation: boolean;
  image: Image;
  nouveauDessin = new Subject<NouveauDessin>();
  hauteurService = new BehaviorSubject<number>(innerHeight);
  largeurService = new BehaviorSubject<number>(innerWidth);
  couleurService = new BehaviorSubject<string>(COULEURBLANC);
  castHauteur = this.hauteurService.asObservable();
  castLargeur = this.largeurService.asObservable();
  castCouleur = this.couleurService.asObservable();

  constructor(public dialogue: MatDialog) { 
    this.confirmation = false;
  }
  verifVide(message: string) {
    const dialogRef = this.dialogue.open(AlertecreerComponent, {
      width: DEUXCINQZEROPX,
      data: {confirmation: this.confirmation }
    });
    dialogRef.afterClosed().subscribe((result: AlerteCreer) => {
      if (result) {
        this.confirmation = result.confirmation;
        if (message === FORMULAIRE) {
          this.ouvrirFormulaire();
        }
        if (message === CHARGER) {
          this.ouvrirCharger();
        }
        if (message === SAUVEGARDER) {
          this.ouvrirSauvegarder();
        }
      } else {
        this.confirmation = false;
      }
    });
  }

ouvrirFormulaire(): void {
  const dialogRef = this.dialogue.open(CreerNouveauDessinComponent, {
    width: DEUXCINQZEROPX,
    data: { hauteur: (window.innerHeight), largeur: (window.innerWidth) - DEUXSEPTCINQ, couleur: COULEURBLANC }
  });
  dialogRef.afterClosed().subscribe((result: NouveauDessin) => {
    if (result) {
      this.hauteurService.next(result.hauteur);
      this.largeurService.next(result.largeur);
      this.couleurService.next(result.couleur);
      this.nouveauDessin.next(result);
    }
  });
  this.confirmation = false;
}
ouvrirCharger(): void {
  const dialogRef = this.dialogue.open(ChargerEtiquetteComponent, {
    width: AUTO,
    data: {}
  });
  dialogRef.afterClosed().subscribe((result) => {
  });
}
ouvrirSauvegarder(): void {
  const dialogRef = this.dialogue.open(SauvegarderEtiquetteComponent, {
    width: AUTO,
  });
  dialogRef.afterClosed().subscribe((result) => {
  });
}

public getNouveauDessin(): Observable<NouveauDessin> {
  return this.nouveauDessin.asObservable()
}
}