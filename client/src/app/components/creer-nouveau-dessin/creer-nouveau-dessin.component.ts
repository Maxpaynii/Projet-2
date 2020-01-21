import { Component, OnInit, Inject, HostListener } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NouveauDessin } from '../../../../../common/nouveaudessin';
import { FormControl, Validators, FormGroup } from '@angular/forms';

const PATERNE_HAUTEUR_ET_LARGEUR = "^[0-9]{3,4}$";
const PATERNE_COULEUR = "^#[A-Fa-f0-9]{6}$";
const REDIMMENSIONNEMENT = "window:resize";
const EVENT = "$event";
const DEUXZEROZERO = 200;

@Component({
  selector: 'app-creer-nouveau-dessin',
  templateUrl: './creer-nouveau-dessin.component.html',
  styleUrls: ['./creer-nouveau-dessin.component.scss'],
})
export class CreerNouveauDessinComponent implements OnInit {
  protected couleur: string;
  bloque: boolean;
  hue: string;
  color: string;

  formGroup = new FormGroup({
    hauteur: new FormControl(this.data.hauteur, [
      Validators.pattern(PATERNE_HAUTEUR_ET_LARGEUR),
    ]),
    largeur: new FormControl(this.data.largeur, [
      Validators.pattern(PATERNE_HAUTEUR_ET_LARGEUR),
    ]),
    couleur: new FormControl(this.data.couleur, [
      Validators.pattern(PATERNE_COULEUR),
    ]),
  });

  constructor(public dialogRef: MatDialogRef<CreerNouveauDessinComponent>, @Inject(MAT_DIALOG_DATA) public data: NouveauDessin) {
    this.bloque = false;

  }

  ngOnInit() {
    this.couleur = this.data.couleur;
  }

  @HostListener(REDIMMENSIONNEMENT, [EVENT])
  onResize(event: { target: { innerWidth: number; innerHeight: number; }; }) {
    if (!this.bloque) {
      this.formGroup.patchValue({
        hauteur: event.target.innerHeight,
        largeur: event.target.innerWidth - DEUXZEROZERO,
      });
    }
  }

  setBloque(): void {
    this.bloque = true;
  }
  annulation() {
    this.dialogRef.close();
  }
  onSubmit(): void {
    this.dialogRef.close({
      hauteur: this.formGroup.value.hauteur,
      largeur: this.formGroup.value.largeur,
      couleur: this.formGroup.value.couleur,
    });
  }

}
