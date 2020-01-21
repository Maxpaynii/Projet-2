import { Component, OnInit } from '@angular/core';
import { CommunicationServeurService } from 'app/services/communication-serveur.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { Image } from "../../../../../common/image";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


const PASDEVIRGULE = "^[^,]+$";
const REGEXTEXTE = "[0-9A-Za-z]{1,}";
const VIDE = "";
const VIRGULE = ",";
const ZERO = 0;
const TYPE = 'application/octet-stream';

@Component({
  selector: 'app-sauvegarder-etiquette',
  templateUrl: './sauvegarder-etiquette.component.html',
  styleUrls: ['./sauvegarder-etiquette.component.scss'],
})
export class SauvegarderEtiquetteComponent implements OnInit {

  imagesAvecEtiquette: Image[];
  images: Image[];
  titre: string;
  etiquettes: string[];
  etiquettesImage: string[];
  imageReduite: string;
  selectionne: boolean;
  etiquettesSelectionnees: string[];
  etiquetteSupprimee: boolean;
  etiquetteSimple: string;
  pasEtiquette: boolean;
  pasEtiquetteSimple: boolean;
  titrePresent: boolean;
  fileUrl: SafeResourceUrl;
  constructor(private communicationServeur: CommunicationServeurService,
              public dialogRef: MatDialogRef<SauvegarderEtiquetteComponent>, private sanitizer: DomSanitizer) {
    this.titre =VIDE;
    this.etiquettes = new Array<string>();
    this.etiquettesImage = new Array<string>();
    this.etiquettesSelectionnees = new Array<string>();
    this.imageReduite = VIDE;
    this.selectionne = false;
    this.etiquetteSupprimee = false;
    this.etiquetteSimple = VIDE;
    this.pasEtiquette = true;
    this.pasEtiquetteSimple = true;
    this.titrePresent = false;
    this.communicationServeur.getImages()
      .subscribe( (resultat: Image[]) => {
      this.images = resultat;
      this.etiquettes = this.getUneSeuleEtiquette(resultat);
      });
   }

  public formGroup = new FormGroup({
    titre: new FormControl(this.titre, [
      Validators.pattern(PASDEVIRGULE && REGEXTEXTE), Validators.required
    ]),
    etiquetteSimple: new FormControl(this.etiquetteSimple, [
      Validators.pattern(PASDEVIRGULE && REGEXTEXTE)
    ]),
  });

  getUneSeuleEtiquette(images: Image[]): string[]{
    for(let i = ZERO; i < images.length; i++){
      for(let j = ZERO; j < images[i].etiquette.length; j++){
        this.etiquettes.push(images[i].etiquette[j]);
      }
    }
    this.etiquettes = this.etiquettes.filter(function(elem, index, self) {
      return index === self.indexOf(elem);
    });

    return this.etiquettes
  }

  setEtiquetteSelectionne(etiquette: string): void{
    this.imagesAvecEtiquette = new Array<Image>();
    this.selectionne = true;
    for(let i = ZERO; i < this.etiquettesSelectionnees.length; i++){
      if(etiquette === this.etiquettesSelectionnees[i]){
        this.etiquetteSupprimee = true;
        const index = this.etiquettesSelectionnees.indexOf(etiquette, ZERO);
        if (index > -1) {
          this.etiquettesSelectionnees.splice(index, 1);
        }
      }
    }
    if(!this.etiquetteSupprimee){
      this.pasEtiquette =false;
      this.etiquettesSelectionnees.push(etiquette);
    }
    this.etiquetteSupprimee = false;
    if(this.etiquettesSelectionnees.length === ZERO){
      this.pasEtiquette = true;
    }
  }

  annulation() {
    this.dialogRef.close();
  }

  setPasEtiquetteSimple() {
    (this.formGroup.value.etiquetteSimple.length === ZERO) ? this.pasEtiquetteSimple = true : this.pasEtiquetteSimple = false ;
  }

  setTitrePresent() {
    (this.formGroup.value.titre.length === ZERO) ? this.titrePresent = false : this.titrePresent = true;
  }

  setImageReduite(etiquettes: string[], etiquetteSimple: string ) {
    if(!this.pasEtiquetteSimple){
      this.imageReduite += etiquetteSimple;
      this.imageReduite += VIRGULE;
    }
    if(!this.pasEtiquette){
      for (let i =ZERO; i< etiquettes.length; i++){
        this.imageReduite += etiquettes[i];
        if (!(i === etiquettes.length-1)){
          this.imageReduite += VIRGULE;
        }
      }
    }
  }

  onSubmit(): void {
    this.setImageReduite(this.etiquettesSelectionnees, this.formGroup.value.etiquetteSimple);
    //this.communicationServeur.setNouvelleImage(this.imageReduite).subscribe();
    this.communicationServeur.setNouvelleImage2(this.formGroup.value.titre, this.imageReduite).subscribe();
    this.dialogRef.close();
  }

  onSubmitLocal():void {
    const blob = new Blob([this.communicationServeur.imageString], { type: TYPE });
    this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}
