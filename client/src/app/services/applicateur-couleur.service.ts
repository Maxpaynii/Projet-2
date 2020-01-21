import { Injectable, ElementRef } from '@angular/core';
import { AnnulRefaitService } from './annul-refait.service';

@Injectable({
  providedIn: 'root',
})
export class ApplicateurCouleurService {
  signalFill: number = 0;
  signalStroke: number = 0;
  Bonfils: number;

  constructor(private annulRefait: AnnulRefaitService) { }

  appliqueCouleur(event: MouseEvent, couleurP: string, couleurS: string, couleur: string, svg: ElementRef) {
    for(let i = 0; i < svg.nativeElement.children.length - 1; i++) {
      if( event.target === svg.nativeElement.children[i].children[0]){
        this.Bonfils = i;
        i = svg.nativeElement.children.lenght;
      }
    }
    if (event.which === 1) {   // click gauche
      if (this.Bonfils === 0) {
        couleur = couleurP;
      } else {
      this.signalFill++;
      this.annulRefait.setSignalAppliqueFill(this.signalFill, svg.nativeElement.children[this.Bonfils].children[0].attributes[6].value, this.Bonfils, true);
      svg.nativeElement.children[this.Bonfils].children[0].setAttribute('fill', couleurP );
      }
    }
    if (event.which === 3) {  // click droit
      this.signalStroke++;
      this.annulRefait.setSignalAppliqueStroke(this.signalStroke, svg.nativeElement.children[this.Bonfils].children[0].attributes[5].value, this.Bonfils, true);
      svg.nativeElement.children[this.Bonfils].children[0].setAttribute('stroke', couleurS );
    }
  }
// objetVise.nativelement.children[i].childrenn[0].attributes[5].value //stroke
// objetVise.nativelement.children[i].childrenn[0].attributes[6].value //fill
}
