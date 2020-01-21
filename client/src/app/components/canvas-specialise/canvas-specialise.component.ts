import { Component, HostListener, Input, OnInit, ViewChild, ElementRef} from '@angular/core';
import { CommunicationServeurService } from 'app/services/communication-serveur.service';
import { ChargementDataService } from '../../services/chargement-data.service';
import { Image, ImageCharger } from '../../../../../common/image';
import { NouveauDessin } from '../../../../../common/nouveaudessin';
import { Point2D } from 'app/services/point-2d/point-2d.service';
import { Trace } from '../../../Trace';
import {ApplicateurCouleurService} from '../../services/applicateur-couleur.service';
import { CrayonService } from '../../services/crayon.service';
import { EffaceService } from '../../services/efface.service';
import {OutilCouleurService } from '../../services/outil-couleur.service';
import {PipetteService } from '../../services/pipette.service';
import {EtampeService } from '../../services/etampe.service';
import {AnnulRefaitService } from '../../services/annul-refait.service';
import {OutilTextService } from '../../services/outil-text.service';
import {GrilleService } from '../../services/grille.service';
import { SelectionService } from 'app/services/selection.service';
import { TracesService } from 'app/services/traces.service';
import {EllipseService} from '../../services/ellipse.service';
import { MatDialogService } from 'app/services/mat-dialog.service';
import { PlumeService } from 'app/services/plume.service';
import { AerosolService } from "../../services/aerosol.service"

const CRAYON = "Crayon";
const PIPETTE = "Pipette";
const ETAMPE = "Etampe";
const ELLIPSE = "Ellipse";
const APPLICATEUR = "Applicateur";
const SELECTION = "Selection";
const AEROSOL = "Aerosol";
const VUEDESSIN = 'vuedessin';
const TEXTE = "Texte";
const EFFACE = "Efface";
const PLUME = 'Plume';
const ENTRERTEXT = "entrer texte ici";
const ZERO = 0;
const UN = 1;
const VIDE = "";
const MULTIPLICATEUR = 0.7;

const COULEUR_REMPLISSAGE_VIDE = 'none';

window.focus();
@Component({
  selector: 'app-canvas-specialise',
  templateUrl: './canvas-specialise.component.html',
  styleUrls: ['./canvas-specialise.component.scss'],
  providers: [CrayonService, EtampeService, ApplicateurCouleurService, EllipseService, Point2D, ChargementDataService],
})

export class CanvasSpecialiseComponent implements OnInit {
  @ViewChild("vraiText", {static: false}) vraiText: ElementRef;
  @ViewChild("vraiTspan", {static: false}) vraiTspan: ElementRef;
  @ViewChild("svg", {static: false}) svg: ElementRef;
  @ViewChild("pathTrace", {static: false}) pathTrace: ElementRef;
  @ViewChild(VUEDESSIN, {static: false}) vuedessin: ElementRef;

  @Input() largeur: number;
  @Input() hauteur: number;
  @Input() couleur: string;
  @Input() epaisseurCrayon: number;
  @Input() epaisseurEllipse: number;
  @Input() point: number;
  @Input() textureEtampe: string;
  @Input() outilActif: string;
  @Input() facteurMiseAEchelle: number;
  @Input() epaisseurEfface: number;
  @Input() editText: boolean ;
  @Input() angleEtampe: number = ZERO;
  @Input() anglePlume: number = ZERO;
  @Input() epaisseurPlume: number = ZERO;
  @Input() selection: SelectionService;
  @Input() diametreAerosol: number;
  @Input() emissionAerosol: number;
  @Input() remplissageEllipse: boolean;
  @Input() contourEllipse: boolean;
  transparenceGrille: number;
  tailleGrille: number;

  signalCreer: number = ZERO;
  signalTexte: number = ZERO;
  signalEfface: number = ZERO;
  signalAppliqueStroke: boolean;
  signalAppliqueFill: boolean;
  couleurStroke: string ;
  couleurFill: string ;
  fils: number;

  signalAnnulTexte: boolean;
  signalRefaitTexte: boolean ;
  tspan: SVGTSpanElement[];

  tailleText: number;
  policeText: string ;
  grasSVG: string ;
  italic: string;
  aligneText: string;

  toucheclick: boolean = false;
  clickPourText: boolean = false;
  firstMousedown: boolean = true;
  firstKeydown: boolean = true;
  couleurS: string;
  couleurP: string;
  traceCourante: Trace;
  traceEllipse: Trace;
  objetVise: any;
  x: number;
  y: number;
  yTemp: number;

  private readonly decalageFenetreGauche: number = 277;
  private readonly decalageY: number = -3;
  clique: boolean = false;
  crayon: CrayonService;
  ellipse: EllipseService;
  initRectangle: Point2D;
  preGlisse: boolean = false;
  controlPresse: boolean = false;
  image: Image;
  listeElements = document.getElementsByClassName('trace');
  boite = document.getElementsByClassName('boite');

  constructor(private dialogue: MatDialogService, private outilcouleurservice: OutilCouleurService, private pipetteService: PipetteService,
              private applicateurCouleurService: ApplicateurCouleurService, private etampeService: EtampeService,
              private communication: CommunicationServeurService,
              private chargementData: ChargementDataService, private annulrefait: AnnulRefaitService, private outilText: OutilTextService,
              private grilleService: GrilleService, private effaceService: EffaceService, private plumeService: PlumeService,
              private aerosolService: AerosolService) {
    const tableauCommun = TracesService.Instance;
    this.crayon = new CrayonService(tableauCommun);
    this.ellipse = new EllipseService(tableauCommun);
    this.dialogue.getNouveauDessin().subscribe((result: NouveauDessin) => {
      this.hauteur = result.hauteur;
      this.largeur = result.largeur;
      this.couleur = result.couleur;
      tableauCommun.setZero();
      this.crayon = new CrayonService(tableauCommun);
      this.ellipse = new EllipseService(tableauCommun);
      this.selection = new SelectionService(tableauCommun);
      this.supprimerTexte();
    });
    this.communication.getImage().subscribe(image => {
      this.supprimerTexte();
      this.image = image;
      this.setChargement(this.chargementData.setImage(this.image));
    });
    this.tspan = [];
  }

  supprimerTexte() {
    let element = this.svg.nativeElement.querySelectorAll('tspan');
    let taille = this.svg.nativeElement.querySelectorAll('tspan').length;
    for (let i = 2; i < taille; i++) {
      element[i].parentNode.removeChild(element[i]);
    }
    element[0].attributes[2].nodeValue = ZERO;
    element[0].attributes[3].nodeValue = ZERO;
  }

  @HostListener('window:keydown', ['$event'])
  ecrire(event: KeyboardEvent) {
    if (this.outilActif === TEXTE) {
      if (this.firstKeydown) {
        this.toucheclick = true;
        this.vraiText.nativeElement.children[ZERO].children[ZERO].textContent = event.key;
        this.firstKeydown = false;
       } else if (event.key !=="Shift" && event.key !=="Tab" && event.key !=="Alt" && event.key !=="Control" && event.key !=="ArrowLeft") {
          if (event.key === "Backspace") {
            if (this.vraiText.nativeElement.children[ZERO].lastChild.textContent === VIDE) {
              this.vraiText.nativeElement.children[ZERO].removeChild(this.vraiText.nativeElement.children[ZERO].lastChild);
            }
            const textTemp = this.vraiText.nativeElement.children[ZERO].lastChild.textContent;
            this.vraiText.nativeElement.children[ZERO].lastChild.textContent = textTemp.substr(ZERO, (textTemp.length - 1));
          } else if (event.key === "Enter") {
            this.yTemp = this.vraiText.nativeElement.children[ZERO].lastChild.y.animVal[0].value + (MULTIPLICATEUR * this.tailleText);
            this.vraiText.nativeElement.children[ZERO].appendChild(this.outilText.creerTspanReduit(VIDE, this.x, this.yTemp));
          } else {
        this.vraiText.nativeElement.children[ZERO].lastChild.textContent += event.key;
      }
    }
    }
  }

  @HostListener('mousedown', ['$event'])
  click(event: MouseEvent) {
    this.clique = true;
    this.gereClique(event.clientX, event.clientY);
    this.applicateurCouleur(event);
    this.appliquerPipette(event);
    this.construirecadre(event);
  }
  construirecadre(event: MouseEvent) {
    if (this.outilActif === TEXTE) {
      if (this.firstMousedown) {
        this.x = event.clientX - this.decalageFenetreGauche;
        this.y = event.clientY + this.decalageY;
        this.vraiText.nativeElement.children[ZERO].children[ZERO].textContent = ENTRERTEXT;
        this.clickPourText = true;
        this.firstMousedown = false;
    } else {
        if (!this.firstKeydown && this.vraiText.nativeElement.children[ZERO].textContent !== VIDE) {
            let ZoneText = false;
            for (let i = ZERO ;  i < this.vraiText.nativeElement.children[ZERO].children.length; i++) {
              if (event.target === this.vraiText.nativeElement.children[ZERO].children[i]) { ZoneText = true ; }
            }
            if (!ZoneText) {
            this.creerText();
            this.initialiserText(event);
            }
        } else {
            this.initialiserText(event);
          }
      }
    }
  }
  initialiserText(event: MouseEvent) {
    this.x = event.clientX - this.decalageFenetreGauche;
    this.y = event.clientY + this.decalageY;
    this.vraiText.nativeElement.children[ZERO].children[ZERO].textContent = ENTRERTEXT;
    this.clickPourText = true;
    this.firstKeydown = true;
  }
  creerText() {
    const tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
    for (let i = ZERO; i < this.vraiText.nativeElement.children[ZERO].children.length; i++) {
      const tspanContent = this.vraiText.nativeElement.children[ZERO].children[i].textContent;
      const x = this.vraiText.nativeElement.children[ZERO].children[i].x.animVal[ZERO].value ;
      const y = this.vraiText.nativeElement.children[ZERO].children[i].y.animVal[ZERO].value ;
      tspan.appendChild(this.outilText.creerTspan(tspanContent, x, y));
    }
    this.vraiText.nativeElement.appendChild(tspan);
    this.signalTexte++;
    this.annulrefait.setSignalTexte(this.signalTexte, true);
    const tailleMax = this.vraiText.nativeElement.children[ZERO].children.length;
    for (let i = ZERO; i < tailleMax; i++) {
      if (i === ZERO) {
        this.vraiText.nativeElement.children[ZERO].children[i].textContent = VIDE;
      } else {
        this.vraiText.nativeElement.children[ZERO].removeChild(this.vraiText.nativeElement.children[ZERO].lastChild);
      }
    }
    this.toucheclick = false;
  }
  applicateurCouleur(event: MouseEvent) {
    this.objetVise = event.target;
    if (this.outilActif === APPLICATEUR ) {
    this.applicateurCouleurService.appliqueCouleur(event, this.couleurP, this.couleurS, this.couleur, this.svg);
    }
  }
  appliquerPipette(event: MouseEvent) {
    this.objetVise = event.target;
    if (this.outilActif === PIPETTE) {
      this.pipetteService.appliquePipette(event, this.objetVise);
    }
  }
  gereClique(x: number, y: number): void {
    if (this.outilActif === CRAYON) { /* CRAYON */
      this.crayon.gereClique(x, y, this.couleurP, this.couleurS, this.epaisseurCrayon, this.point, this.listeElements, this.boite);
      this.signalCreer++;
      this.annulrefait.setSignalCreer(this.signalCreer, true);
    } else if (this.outilActif === SELECTION) { /* SELECTION */
      this.selection.gereClique(x, y, this.couleurP, this.couleurS, this.epaisseurCrayon, this.point, this.listeElements, this.boite);
    } else if (this.outilActif === ELLIPSE) { /* ELLIPSE */
      if (!this.contourEllipse && !this.remplissageEllipse) { return; }
      const COULEUR_REMPLISSAGE = this.remplissageEllipse ? this.couleurP : COULEUR_REMPLISSAGE_VIDE;
      const COULEUR_CONTOUR = this.contourEllipse ? this.couleurS : COULEUR_REMPLISSAGE_VIDE;
      this.ellipse.gereClique(x, y, COULEUR_REMPLISSAGE, COULEUR_CONTOUR, this.epaisseurEllipse, this.point, this.listeElements, this.boite);
      this.signalCreer++;
      this.annulrefait.setSignalCreer(this.signalCreer, true);
    } else if (this.outilActif === ETAMPE) {
      this.gereClicEtampe(x, y);
      this.signalCreer++;
      this.annulrefait.setSignalCreer(this.signalCreer, true);
    } else if (this.outilActif === EFFACE) {
      this.gereClicEfface(x, y);
      this.signalEfface++;
      this.annulrefait.setSignalEfface(this.signalEfface, true);
    } else if (this.outilActif === PLUME) {
      this.plumeService.gereClic(x - this.decalageFenetreGauche, y, this.epaisseurPlume, this.anglePlume, this.couleurP, this.couleurS);
      this.signalCreer++;
      this.annulrefait.setSignalCreer(this.signalCreer, true);
    } else if (this.outilActif === AEROSOL) {
      this.aerosolService.setActif(true);
      this.aerosolService.gereClic(x - this.decalageFenetreGauche, y ,this.diametreAerosol, this.emissionAerosol, this.couleurP, this.couleurS);
      this.signalCreer++;
      this.annulrefait.setSignalCreer(this.signalCreer, true);
    }
  }
  @HostListener('mousemove', ['$event'])
  clicEtGlisse(event: MouseEvent) {
    this.gereCliqueEtGlisse(event.clientX, event.clientY);
  }
  gereCliqueEtGlisse(x: number, y: number): void {
    if (this.outilActif === CRAYON) {
      this.crayon.gereCliqueEtGlisse(x, y, this.controlPresse, this.boite);
    } else if (this.outilActif === SELECTION) {
      this.selection.gereCliqueEtGlisse(x, y, this.controlPresse, this.boite);
    } else if (this.outilActif === ELLIPSE) {
      this.ellipse.gereCliqueEtGlisse(x, y, this.controlPresse, this.boite);
    } else if (this.outilActif === ETAMPE) {
      // Rien ne se passe
    } else if (this.outilActif === EFFACE) {
      this.effaceService.gereGlisse(this.crayon.traces, x - this.decalageFenetreGauche, y, this.clique, this.epaisseurEfface);
    } else if (this.outilActif === PLUME && this.clique) {
      this.plumeService.gereGlisse(x - this.decalageFenetreGauche, y, this.epaisseurPlume, this.anglePlume);
    } else if (this.outilActif === AEROSOL){
      this.aerosolService.setPosition(x - this.decalageFenetreGauche, y);
      this.aerosolService.gereGlisse(x - this.decalageFenetreGauche, y ,this.diametreAerosol, this.emissionAerosol);
    }
  }
  @HostListener('mouseup', ['$event'])
  clicfinit(event: MouseEvent) {
    /* console.log((event.target as Element).getBoundingClientRect());
    this.boite[0] = (event.target as Element); */
    this.gereCliqueFinit(event.clientX, event.clientY, (event.target as Element));
  }
  gereCliqueFinit(x: number, y: number, elem: Element): void {
    if (this.outilActif === CRAYON) {
      this.crayon.gereCliqueFinit(x, y, this.listeElements, this.boite, elem);
    } else if (this.outilActif === SELECTION) {
      this.selection.gereCliqueFinit(x, y, this.listeElements,this.boite, elem);
    } else if (this.outilActif === ELLIPSE) {
      this.ellipse.gereCliqueFinit(x, y, this.boite);
    } else if (this.outilActif === ETAMPE) {
      // Rien ne se passe
    } else if (this.outilActif === AEROSOL) {
      this.aerosolService.setActif(false); 
    }
    this.clique = false;
  }
  @HostListener('mouseleave', ['$event'])
  sourisQuitte(event: MouseEvent) {
    if (this.outilActif === CRAYON) {
      this.crayon.gereSourisQuitte();
    } else if (this.outilActif === SELECTION) {
      this.selection.gereSourisQuitte();
    } else if (this.outilActif === ELLIPSE) {
      this.ellipse.gereSourisQuitte();
    } else if (this.outilActif === EFFACE) {
      this.effaceService.gereSourisQuitte();
      this.clique = false;
    }
    
  }
  gereClicEtampe(x: number, y: number) {
    this.etampeService.gereClicEtampe(x, y, this.textureEtampe, this.angleEtampe, this.couleurP, this.couleurS,
      this.traceCourante, this.crayon, this.facteurMiseAEchelle);
  }
  gereClicEfface(x: number, y: number) {
    this.effaceService.gereClic(this.crayon.traces, x - this.decalageFenetreGauche, y, this.epaisseurEfface);
  }
  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.gereKeyDown(event.key, event.shiftKey);
  }
  gereKeyDown(eventKey: string, shiftKey: boolean) {
    if (eventKey === "Shift") {
      this.controlPresse = shiftKey;
    }
  }

  @HostListener('document:keyup', ['$event']) onKeyupHandler(event: KeyboardEvent) {
    this.gereKeyUp(event.key, event.shiftKey);
  }
  gereKeyUp(eventKey: string, shiftKey: boolean) {
    if (eventKey === "Shift") {
      this.controlPresse = shiftKey;
    }
  }

  setChargement(image: ImageCharger) {
    this.hauteur = ZERO;
    this.largeur = ZERO;
    const tableauCommun = TracesService.Instance;
    tableauCommun.setZero();
    for(let i = image.trace.length; i> ZERO; i--){
      const trace = image.trace.pop();
      if(trace !== undefined){
        tableauCommun.push(trace);
      }
    }
    this.crayon = new CrayonService(tableauCommun);
    this.ellipse = new EllipseService(tableauCommun);
    this.selection = new SelectionService(tableauCommun);
    this.hauteur =+ image.hauteur;
    this.largeur =+ image.largeur;
    this.couleur = image.couleur;
    for(let i = ZERO; i<image.texte.length; i++){
     this.vraiText.nativeElement.appendChild(this.outilText.creerTspan(image.texte[i].texte, +image.texte[i].x, +image.texte[i].y))
    }
  }
  annulRefaitApplicateur() {
   while (this.signalAppliqueStroke) {
      this.svg.nativeElement.children[this.fils].children[ZERO].setAttribute('stroke', this.couleurStroke);
      this.signalAppliqueStroke = false;
    }
   while (this.signalAppliqueFill) {
      this.svg.nativeElement.children[this.fils].children[ZERO].setAttribute('fill', this.couleurFill);
      this.signalAppliqueFill = false;
    }
  }
  annulRefaitTexte() {
    while (this.signalRefaitTexte) {
      this.vraiText.nativeElement.appendChild(this.tspan[this.tspan.length - UN]);
      this.tspan.pop();
      this.signalRefaitTexte = false;
    }
    while (this.signalAnnulTexte) {
      let taille = this.tspan.length;
      this.tspan[taille] = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
      for (let i = ZERO; i < this.vraiText.nativeElement.lastChild.children.length; i++) {
        const tspanContent = this.vraiText.nativeElement.lastChild.children[i].textContent;
        const x = this.vraiText.nativeElement.lastChild.children[i].x.animVal[ZERO].value ;
        const y = this.vraiText.nativeElement.lastChild.children[i].y.animVal[ZERO].value ;
        this.tspan[taille].appendChild(this.outilText.creerTspan(tspanContent, x, y));
      }
      this.vraiText.nativeElement.removeChild(this.vraiText.nativeElement.lastChild);
      this.signalAnnulTexte = false;
    }
  }
  
  ngOnInit() {
    this.outilcouleurservice.castP.subscribe((CouleurPrimaire) => this.couleurP = CouleurPrimaire);
    this.outilcouleurservice.castS.subscribe((CouleurSecondaire) => this.couleurS = CouleurSecondaire);
    this.grilleService.castTaille.subscribe((tailleGrille) => this.tailleGrille = tailleGrille);
    this.grilleService.castTransparence.subscribe((transparenceGrille) => this.transparenceGrille = transparenceGrille);
    this.outilText.castAlign.subscribe((alignement) => this. aligneText = alignement);
    this.outilText.castItalic.subscribe((italic) => this.italic = italic);
    this.outilText.castPolice.subscribe((police) => this.policeText = police);
    this.outilText.castTaille.subscribe((tailleText) => this.tailleText = tailleText);
    this.outilText.gras.subscribe((gras) => this.grasSVG = gras);
    this.annulrefait.setTableauTrace(this.crayon.traces);
    this.annulrefait.castStroke.subscribe((couleurStroke) => this.couleurStroke = couleurStroke );
    this.annulrefait.castFill.subscribe((couleurFill) => this.couleurFill = couleurFill);
    this.annulrefait.castFils.subscribe((fils) => this.fils = fils);
    this.annulrefait.castAppliqueStroke.subscribe((signalAppliqueStroke) => this.signalAppliqueStroke = signalAppliqueStroke);
    this.annulrefait.castAppliqueFill.subscribe((signalAppliqueFill) => this.signalAppliqueFill = signalAppliqueFill);
    this.annulrefait.castAnnulTexte.subscribe((signalAnnulTexte) => this.signalAnnulTexte = signalAnnulTexte);
    this.annulrefait.castRefaitTexte.subscribe((signalRefaitTexte) => this.signalRefaitTexte = signalRefaitTexte);
  }
  ngAfterViewChecked() {
    this.communication.setEtGetImage(this.vuedessin.nativeElement.innerHTML);
    while (this.toucheclick && this.outilActif !== TEXTE) {
      this.creerText();
    }
    while (this.clickPourText && this.outilActif !== TEXTE) {
      this.vraiText.nativeElement.children[ZERO].children[ZERO].textContent = VIDE;
      this.clickPourText = false;
    }
    this.annulRefaitApplicateur();
    this.annulRefaitTexte();
  }
}
