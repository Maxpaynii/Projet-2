import { Component, OnInit } from '@angular/core';
import { CommunicationServeurService } from '../../services/communication-serveur.service';
import { Image, ImageVisible } from '../../../../../common/image';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { ChargementDataService } from '../../services/chargement-data.service';

const PASDEVIRGULE = "^[^,]+$";
const VIDE = "";
const MOINSUN = -1;
const ZERO = 0;
const INLINE = "style='height:50px;width:50px;' ";
const UNESEMAINE = 604800000;
const MILLE = 1000;
const SOIXANTE = 60;
const VINGT_QUATRE = 24;
const TROIS_CENT_SOIXANTE_CINQ = 365;
const TEXTE_IMAGE = "Le dessin a été créé depuis ";

interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

@Component({
  selector: 'app-charger-etiquette',
  templateUrl: './charger-etiquette.component.html',
  styleUrls: ['./charger-etiquette.component.scss'],

})

export class ChargerEtiquetteComponent implements OnInit {

  images: Image[];
  imagesVisible: ImageVisible[];
  imagesClone: ImageVisible[];
  etiquettes: string[];
  etiquettesVisible: string[];
  etiquettesSelectionnees: string[];
  imagesAvecEtiquette: ImageVisible[];
  premiereEtiquette: string;
  etiquetteSupprimee: boolean;
  recherche: string;
  imageFiltrer: ImageVisible[];
  fichier: Blob;
  imageCharger: Image;
  boutonLocal: boolean;
  constructor(private communicationServeur: CommunicationServeurService,
    public dialogRef: MatDialogRef<ChargerEtiquetteComponent>,
    private sanitizer: DomSanitizer, private chargement: ChargementDataService) {
    this.images = new Array<Image>();
    this.etiquettesVisible = new Array<string>();
    this.imagesVisible = new Array<ImageVisible>();
    this.etiquettes = new Array<string>();
    this.etiquettesSelectionnees = new Array<string>();
    this.imagesAvecEtiquette = new Array<ImageVisible>();
    this.imageFiltrer = new Array<ImageVisible>();
    this.imagesClone = new Array<ImageVisible>();
    this.etiquetteSupprimee = false;
    this.recherche = VIDE;
    this.imageCharger = {_id: "0",etiquette: [VIDE],titre:VIDE,svg:VIDE, date:VIDE};
    this.communicationServeur.getImages()
      .subscribe((resultat: Image[]) => {
        this.images = resultat;
        this.rendreVisible(this.images);
        this.etiquettes = this.getUneSeuleEtiquette(resultat);
      });
  }

  public formGroup = new FormGroup({
    recherche: new FormControl(this.recherche, [
      Validators.pattern(PASDEVIRGULE)
    ]),
  });

  validationRecherche() {
    this.imagesClone = this.images.slice();
    let imageFiltrer: ImageVisible[] = [];
    if (this.formGroup.value.recherche === VIDE) {
      this.imagesClone = new Array<ImageVisible>();
      this.rendreVisible(this.imagesClone);
    } else if (this.recherche && this.recherche !== VIDE) {
      for (let i = ZERO; i < this.imagesClone.length; i++) {
        if (this.imagesClone[i].titre.toLowerCase().search(this.recherche.toLowerCase()) !== MOINSUN) {
          imageFiltrer.push(this.imagesClone[i]);
        }
      }
      this.imagesClone = imageFiltrer.slice();
      this.rendreVisible(this.imagesClone);
    }
  }

  rendreVisible(images: any) {
    this.imagesVisible = new Array<ImageVisible>();
    if (images.length === ZERO) {
      images = this.images;
    }
    for (let i = ZERO; i < images.length; i++) {
      this.setViewBox(images[i]);
      this.verificationDate(images[i]);
      let svg = this.sanitizer.bypassSecurityTrustHtml(images[i].svg);
      let _id = images[i]._id
      let titre = images[i].titre;
      let date = images[i].date;
      let etiquette = new Array<string>();
      for (let j = ZERO; j < images[i].etiquette.length; j++) {
        etiquette.push(images[i].etiquette[j]);
      }
      this.imagesVisible.push({
        svg,
        titre,
        etiquette,
        _id,
        date
      });
    }
  }

  verificationDate(image: Image) {
    let dateAuj: Date = new Date();
    let dateImage = new Date(image.date);
    let comparaison = dateAuj.getTime() - dateImage.getTime();
    if(comparaison <= UNESEMAINE) {
      let sec = (comparaison / MILLE) % SOIXANTE;
      let min = (comparaison / (MILLE*SOIXANTE)) % SOIXANTE;
      let heure = (comparaison / (MILLE*SOIXANTE*SOIXANTE)) % VINGT_QUATRE;
      let jour = (comparaison / (MILLE*VINGT_QUATRE*SOIXANTE*SOIXANTE)) %TROIS_CENT_SOIXANTE_CINQ;
      let dateModifie: Date = new Date();
      dateModifie.setSeconds(sec);
      dateModifie.setMinutes(min);
      dateModifie.setHours(heure);
      dateModifie.setDate(jour);

      image.date = TEXTE_IMAGE + dateModifie.toLocaleTimeString('en-US', {hour12: false});
    }
    
  }

  setViewBox(image: Image) {
    image.svg = [image.svg.slice(0,5), INLINE, image.svg.slice(5)].join('');
  }

  getUneSeuleEtiquette(images: Image[]): string[] {
    for (let i = 0; i < images.length; i++) {
      for (let j = 0; j < images[i].etiquette.length; j++) {
        this.etiquettes.push(images[i].etiquette[j]);
      }
    }
    this.etiquettes = this.etiquettes.filter(function (elem, index, self) {
      return index === self.indexOf(elem);
    });

    return this.etiquettes
  }

  annulation() {
    this.dialogRef.close();
  }

  setEtiquetteSelectionne(etiquette: string): void {
    this.imagesAvecEtiquette = new Array<Image>();
    for (let i = 0; i < this.etiquettesSelectionnees.length; i++) {
      if (etiquette === this.etiquettesSelectionnees[i]) {
        this.etiquetteSupprimee = true;
        const index = this.etiquettesSelectionnees.indexOf(etiquette, ZERO);
        if (index > -1) {
          this.etiquettesSelectionnees.splice(index, 1);
        }
      }
    }
    if (!this.etiquetteSupprimee) {
      this.etiquettesSelectionnees.push(etiquette);
    }
    this.etiquetteSupprimee = false;
    this.setImageGraceEtiquette(this.etiquettesSelectionnees);
  }

  setImageGraceEtiquette(etiquettes: string[]) {
    for (let i = ZERO; i < this.images.length; i++) {
      for (let j = ZERO; j < this.images[i].etiquette.length; j++) {
        for (let k = ZERO; k < etiquettes.length; k++) {
          if (this.images[i].etiquette[j] === etiquettes[k]) {
            this.imagesAvecEtiquette.push(this.images[i]);
          }
        }
      }
    }
    this.imagesAvecEtiquette = this.images.filter(f => this.imagesAvecEtiquette.includes(f));
    if (etiquettes.length === ZERO) {
      let taille = this.imagesAvecEtiquette.length
      for (let i = ZERO; i < taille; i++) {
        this.imagesAvecEtiquette.pop();
      }
    }
    this.rendreVisible(this.imagesAvecEtiquette);
  }

  chargementImage(image: Image) {
    this.communicationServeur.setImage(image._id);
    this.dialogRef.close();
  }

  supprimerImage(image: Image) {
    this.communicationServeur.supprimerImageServeur(image._id).subscribe(() => {
      this.communicationServeur.getImages()
      .subscribe((resultat: Image[]) => {
        this.images = resultat;
        this.rendreVisible(this.images);
        this.etiquettes = this.getUneSeuleEtiquette(resultat);
      });
    });
  }

  chargementLocal(event: HTMLInputEvent) {
    this.fichier = event === undefined || event === null ? new Blob([VIDE]) :event.target.files![ZERO];
    this.imageCharger.titre = event.target.files![0].name;
    this.boutonLocal = this.chargement.verificationExtension(this.imageCharger.titre);
    if(!this.boutonLocal) return;
    let fileReader = new FileReader();
    fileReader.onload = (event) => {
      this.imageCharger._id = ZERO.toString();
      this.imageCharger.etiquette = new Array<string>();
      this.imageCharger.svg = fileReader.result === undefined || fileReader.result === null ? VIDE: fileReader.result as string;
      this.boutonLocal = this.chargement.verificationContenu(this.imageCharger.svg);
    }
    fileReader.readAsText(this.fichier);
  }
  chargementLocalConfirmation() {
    this.communicationServeur.setImageCharger(this.imageCharger);
    this.dialogRef.close();
  }

  ngOnInit() {
  }
}