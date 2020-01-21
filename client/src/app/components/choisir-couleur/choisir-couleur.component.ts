import { Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {OutilCouleurService } from '../../services/outil-couleur.service';

const PALETT = 'paletteCouleur';
const FERMER = 'none';
const OUVRIR = 'block';
const  PRINCIPALE = 'primaire';
const SECONDAIRE = 'secondaire';
const COULEUR_DEFAUT = '#666666';
const TRANSPARENCE_DEFAUT = 0xFF;
const BASE_HEXADECIMAL = 16;

@Component({
  selector: 'app-choisir-couleur',
  templateUrl: './choisir-couleur.component.html',
  styleUrls: ['./choisir-couleur.component.scss']
})

export class ChoisirCouleurComponent implements OnInit {

  @ViewChild(PALETT, {static: false}) palette: ElementRef;

  transparence: string;
  couleur: string;
  secondaireOptions: boolean;
  principaleOptions: boolean;

  transparenceCouleur: number;
  couleurComplete: string;

  couleurP: string;
  couleurS: string;
  TableauCouleurs: string[];

  constructor(private outilcouleurservice: OutilCouleurService) {
    this.couleur = COULEUR_DEFAUT;
    this.transparenceCouleur = TRANSPARENCE_DEFAUT;
  }

  ouvrirPalette(typeCouleur: string): void  {
    this.palette.nativeElement.style.display = OUVRIR;
    switch (typeCouleur) {
      case PRINCIPALE: {
        this.principaleOptions = true;
        this.secondaireOptions = false;
        break;
      }
      case SECONDAIRE: {
        this.principaleOptions = false;
        this.secondaireOptions = true;
        break;
      }
    }
  }
  setCoul(i: number): void  {
    if (this.principaleOptions === true) {
      this.outilcouleurservice.setCouleurPrimaire(this.TableauCouleurs[i]);
    }
    if (this.secondaireOptions === true) {
      this.outilcouleurservice.setCouleurSecondaire(this.TableauCouleurs[i]);
    }
  }
  setCouleur(): void  {
      this.palette.nativeElement.style.display = FERMER;
      if (this.principaleOptions === true) {
        this.outilcouleurservice.setCouleurPrimaire(this.couleurComplete);
        this.outilcouleurservice.setTableauxDixCouleurs(this.couleurComplete);
      }
      if (this.secondaireOptions === true) {
        this.outilcouleurservice.setCouleurSecondaire(this.couleurComplete);
        this.outilcouleurservice.setTableauxDixCouleurs(this.couleurComplete);
      }
      this.principaleOptions = false;
      this.secondaireOptions = false;
  }
  fermer(): void {
     this.palette.nativeElement.style.display = FERMER;
     this.principaleOptions = false;
     this.secondaireOptions = false;
  }
  intervertirCouleur(): void {
    let temp;
    temp = this.couleurP;
    this.outilcouleurservice.setCouleurPrimaire(this.couleurS);
    this.outilcouleurservice.setCouleurSecondaire(temp);
  }
  @HostListener('mousedown', ['$event'])
  clic(): void {
    this.miseAJourCouleur();
  }
  @HostListener('mousemove', ['$event'])
  glisse(): void {
    this.miseAJourCouleur();
  }
  miseAJourCouleur(): void {
    const TRANSPARENCE_STRING = this.transparenceCouleur.toString(BASE_HEXADECIMAL);
    if (TRANSPARENCE_STRING.length === 1) {
      this.couleurComplete = this.couleur + '0' + TRANSPARENCE_STRING;
    } else {
      this.couleurComplete = this.couleur + TRANSPARENCE_STRING;
    }
  }
  ngOnInit(): void {
    this.outilcouleurservice.castP.subscribe((CouleurPrimaire) => this.couleurP = CouleurPrimaire);
    this.outilcouleurservice.castS.subscribe((CouleurSecondaire) => this.couleurS = CouleurSecondaire);
    this.outilcouleurservice.castT.subscribe((TableauDixCouleurs) => this.TableauCouleurs = TableauDixCouleurs);
  }

}
