import { Component, HostListener , OnInit} from '@angular/core';
import { RaccourcisClavierVueDessinService } from 'app/services/raccourcis-clavier-vue-dessin.service';
import { MatDialogService } from '../../services/mat-dialog.service';
import { OutilActifService } from '../../services/outil-actif.service';
import {AnnulRefaitService } from '../../services/annul-refait.service';
import {GrilleService } from '../../services/grille.service';
import { PressePapierService } from 'app/services/presse-papier.service';
import { TracesService } from 'app/services/traces.service';
import { Trace } from 'Trace';
import { ChangementAngleOutilService } from 'app/services/changement-angle-outil.service';
import { SelectionService } from 'app/services/selection.service';

// TODO: Renommer les variables globables
const KEY = "PageModal" ;
const COULEURBLANC = "#ffffff";
const COULEURNOIR = "#000000";
const DEUXSEPTCINQ = 275;
const DEFAUT = "Defaut";
const CRAYON = "Crayon";
const PIPETTE = "Pipette";
const GRILLE = "Grille";
const ETAMPE = "Etampe";
const ELLIPSE = "Ellipse";
const APPLICATEUR = "Applicateur";
const SELECTION = "Selection";
const TEXTE = "Texte";
const EFFACE = "Efface";
const FORMULAIRE = "Formulaire";
const SAUVEGARDER = "Sauvegarder";
const CHARGER = "Charger";
const PLUME = "Plume";
const MAGNETISME = "Magnetisme";
const AEROSOL = "Aerosol";

const EPAISSEUR_PLUME_INTIALE = 20;
const EPAISSEUR_EFFACE_INITIALE = 10;
const TEXTURE_ETAMPE_INTIALE = 'hashtag';
const MISE_A_ECHELLE_ETAMPE_INTIAL = 1;
const ANGLE_INITIAL = 0;
const DIAMETRE_AEROSOL_INITIALE = 10;
const EMISSION_AEROSOL_INITIALE = 1;

@Component({
  selector: 'app-vue-dessin',
  templateUrl: './vue-dessin.component.html',
  styleUrls: ['./vue-dessin.component.scss'],
  providers: [SelectionService, OutilActifService, MatDialogService, AnnulRefaitService],
})

export class VueDessinComponent implements OnInit {

  private curseurSurMenus = false;

  defaut: boolean;
  crayonOptions: boolean;
  pipetteOptions: boolean;
  grilleOptions: boolean;
  etampeOptions: boolean;
  ellipseOptions: boolean;
  applicateurOptions: boolean;
  selectionOptions: boolean;
  textOptions: boolean;
  annulerOptions: boolean;
  refaireOptions: boolean;
  effaceOptions: boolean;
  plumeOptions: boolean;
  magnetismeOptions: boolean;

  textureEtampe: string;
  tailleGrilleTemp: number;
  tailleGrille: number;

  pointChoisi: number;
  aerosolOptions: boolean;
  
  facteurMiseAEchelle: number;
  epaisseurEfface: number;
  angleEtampe: number;
  anglePlume: number;
  hauteur: number;
  largeur: number;
  epaisseurCrayon: number;
  couleur: string;
  couleurFond: string;
  outilActif: string;
  confirmation: boolean;
  vueModal: boolean = JSON.parse(localStorage[KEY] || true);
  raccourcisClavierActifs: boolean;
  couleurP: string;
  couleurS: string;
  TableauCouleurs: string[];
  epaisseurPlume: number;
  diametreAerosol: number;
  emissionAerosol: number;
  remplissageEllipse: boolean;
  contourEllipse: boolean;
  private traces: Trace[];
  selection: SelectionService;

  constructor(private outilActifService: OutilActifService, private matDialog: MatDialogService, public pressePapier: PressePapierService,
              public annulRefait: AnnulRefaitService, private raccourcisClavier: RaccourcisClavierVueDessinService,
              private grilleService: GrilleService) {
    this.couleur = COULEURBLANC;
    this.couleurFond = COULEURNOIR;
    this.hauteur = (window.innerHeight);
    this.largeur = (window.innerWidth) - DEUXSEPTCINQ; // CONSTANTE A ENLEVER
    this.angleEtampe = ANGLE_INITIAL;
    this.epaisseurEfface = EPAISSEUR_EFFACE_INITIALE;
    this.pressePapier = new PressePapierService(TracesService.Instance);
    this.selection = new SelectionService(TracesService.Instance);
    this.traces = TracesService.Instance.traces;
    this.anglePlume = ANGLE_INITIAL;
    this.angleEtampe = ANGLE_INITIAL;
    this.epaisseurPlume = EPAISSEUR_PLUME_INTIALE;
    this.textureEtampe = TEXTURE_ETAMPE_INTIALE;
    this.facteurMiseAEchelle = MISE_A_ECHELLE_ETAMPE_INTIAL;
    this.diametreAerosol = DIAMETRE_AEROSOL_INITIALE;
    this.emissionAerosol = EMISSION_AEROSOL_INITIALE;
    this.remplissageEllipse = true;
    this.contourEllipse = true;
  }

  verification(message: string): void {
    const tableauCommun = TracesService.Instance;
    if(!(tableauCommun.traces.length === 0)){
      this.matDialog.verifVide(message);
    } else {
      if (message === FORMULAIRE) {
        this.matDialog.ouvrirFormulaire();
      }
      if (message === CHARGER) {
        this.matDialog.ouvrirCharger();
      }
      if (message === SAUVEGARDER) {
        this.matDialog.ouvrirSauvegarder();
      }
    }
  }
  verificationAerosol(entree: number, estDiametre: boolean) {
    if(estDiametre && (entree < 1 || entree>50)){
      this.diametreAerosol = 10;
    } else if(!estDiametre && (entree < 1 || entree > 10)){
      this.emissionAerosol = 2;
    }
  }

  ouvrirColonneOptions(stringId: string): void {
    this.defaut = false;
    this.crayonOptions = false;
    this.pipetteOptions = false;
    this.grilleOptions =  false;
    this.etampeOptions = false;
    this.ellipseOptions  = false;
    this.applicateurOptions = false;
    this.selectionOptions  = false;
    this.textOptions = false;
    this.effaceOptions = false;
    this.plumeOptions = false;
    this.magnetismeOptions = false;
    this.aerosolOptions = false;

    switch (stringId) {
      case CRAYON: {
        this.selection.setZero();
        this.crayonOptions = true;
        this.outilActifService.setOutilActif(stringId);
        break;
      }
      case PIPETTE: {
        this.selection.setZero();
        this.pipetteOptions = true;
        this.outilActifService.setOutilActif(stringId);
        break;
      }
      case GRILLE: {
        this.selection.setZero();
        this.grilleOptions =  true;
        this.outilActifService.setOutilActif(stringId);
        break;
      }
      case ETAMPE: {
        this.selection.setZero();
        this.etampeOptions = true;
        this.outilActifService.setOutilActif(stringId);
        break;
      }
      case ELLIPSE: {
        this.selection.setZero();
        this.ellipseOptions  = true;
        this.outilActifService.setOutilActif(stringId);
        break;
      }
      case APPLICATEUR: {
        this.selection.setZero();
        this.applicateurOptions = true;
        this.outilActifService.setOutilActif(stringId);
        break;
      }
      case SELECTION: {
        this.selectionOptions  = true;
        this.outilActifService.setOutilActif(stringId);
        break;
      }
      case EFFACE: {
        this.selection.setZero();
        this.effaceOptions  = true;
        this.outilActifService.setOutilActif(stringId);
        break;
      }
      case MAGNETISME: {
        this.magnetismeOptions  = true;
        this.outilActifService.setOutilActif(stringId);
        break;
      }
      case TEXTE: {
        this.selection.setZero();
        this.textOptions  = true;
        this.outilActifService.setOutilActif(stringId);
        break;
      }
      case PLUME: {
        this.plumeOptions  = true;
        this.outilActifService.setOutilActif(stringId);
        break;
      }
      case AEROSOL: {
        this.aerosolOptions = true;
        this.outilActifService.setOutilActif(stringId);
        break;
      }
      case DEFAUT: {
        this.selection.setZero();
        this.defaut = true;
        this.outilActifService.setOutilActif(stringId);
        break;
      }
    }
  }
  appliquerGrille() {
    this.tailleGrilleTemp =  this.tailleGrille;
    this.grilleService.setTaille(this.tailleGrille);
    this.selection.setTaille(this.tailleGrille);
  }
  activerMagnetisme() {
    this.selection.setMagnetisme(true);
  }
  desActiverMagnetisme() {
    this.selection.setMagnetisme(false);
  }
  appliquer() {
    this.selection.setPointChoisi(this.pointChoisi);
  }
  OutilAnnulerDiponible(): boolean {
    return this.annulRefait.annulerDisponible();
  }
  OutilRefaireDiponible(): boolean {
    return this.annulRefait.refaireDisponible();
  }
  pressePapierDisponible(): boolean {
    let resultat = true;
    this.traces.forEach((trace) => {
      if (trace.getSelect()) {
        resultat = false;
      }
    });
    return resultat;
  }
  @HostListener('mousedown', ['$event'])
  desactiverRaccourcisClavier(event: MouseEvent): void {
    this.raccourcisClavierActifs = false;
  }

  @HostListener('mouseup', ['$event'])
  activerRaccourcisClavier(event: MouseEvent): void {
    this.raccourcisClavierActifs = false;
    if (!this.textOptions) {
      this.raccourcisClavierActifs = false;
    }
  }

  @HostListener('mousemove', ['$event'])
  gereMouvementSouris(event: MouseEvent): void {
    this.curseurSurMenus = event.clientX >= DEUXSEPTCINQ;
  }

  @HostListener('document:keydown', ['$event'])
  gereAppuiTouche(event: KeyboardEvent) {
    if (!this.curseurSurMenus || this.raccourcisClavierActifs === false) { return; }
    event.stopPropagation();
    event.preventDefault();
    this.raccourcisClavier.gereRaccourcis(this, event.key, event.ctrlKey, event.shiftKey);
  }

  @HostListener('mousewheel', ['$event'])
    gereMovementMolette(event: WheelEvent) {
      if (this.etampeOptions) {
        this.angleEtampe = ChangementAngleOutilService.appliquerChangementAngle(this.angleEtampe, event.deltaY > 0, event.altKey);
      } else if (this.plumeOptions) {
        this.anglePlume = ChangementAngleOutilService.appliquerChangementAngle(this.anglePlume, event.deltaY > 0, event.altKey);
      }
  }

  ngOnInit() {
    this.couleur = COULEURBLANC;
    this.couleurFond = COULEURNOIR;
    this.defaut = true;
    this.outilActifService.castO.subscribe((outilActif) => this.outilActif = outilActif);
    this.matDialog.castHauteur.subscribe((hauteurService) => this.hauteur = hauteurService);
    this.matDialog.castLargeur.subscribe((largeurService) => this.largeur = largeurService);
    this.matDialog.castCouleur.subscribe((couleurService) => this.couleur = couleurService);
  }
}
