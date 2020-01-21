import { Injectable } from '@angular/core';
import { Trace } from '../../Trace';
import { CrayonService } from './crayon.service';
import { MagnetismeService } from './magnetisme.service';
import { Point2D } from './point-2d/point-2d.service';
import { TracesService } from './traces.service';
import { PressePapierService } from './presse-papier.service';
import { BehaviorSubject } from 'rxjs';
import { TraceSelection } from 'TraceSelection';
@Injectable({
  providedIn: 'root',
})
// !!!! TODO: Comprendre ou se situe le push de trop dans boitesEnglobantes
// TODO Fix le une fois sur deux fonctionnel
// Probablement cause ↓ / effet ↑
// TODO Checker la reinitialisation de la variable boiteEnglobanteClique
// IFDONE: Enlever les iterations dans boitesEnglobantes si les points de controles ne sont finalement 
// pas push dans boitesEnglobantes
export class SelectionService extends CrayonService {
  initRectangle: Point2D;
  preGlisse = false;
  sourisQuitte = false;
  rectangleEnglobant: TraceSelection;
  boitesEnglobantes: TraceSelection[];
  premierDeplacement = true;
  extremums: Point2D[];
  initSelect: Point2D;
  finSelect: Point2D;
  aucunSelect = true;
  private magnetisme: MagnetismeService;
  positionBoiteX: Point2D;
  boiteEnglobanteClique = false;
  pressePapier: PressePapierService;
  readonly DIMENSIONMAX = 1536;
  readonly DIMENSIONCONTROLE = 2;
  private readonly pointille = "10,10";
  private readonly epaisseurRectangleSelection: number = 1;
  private readonly couleurRectangleSelection: string = "#000000";

  pointChoisi = new  BehaviorSubject<number>(0);
  activeMagnetisme = new  BehaviorSubject<boolean>(false);
  castPoint = this.pointChoisi.asObservable();
  castMagnetisme = this.activeMagnetisme.asObservable();
  taille =  new  BehaviorSubject<number>(20);
  castTaille = this.taille.asObservable();

  constructor(tableauCommun: TracesService) {
    super(tableauCommun);
    this.magnetisme = new MagnetismeService();
    this.pressePapier = new PressePapierService(tableauCommun);
    this.boitesEnglobantes = [];
    this.extremums = [];
  }
  setTaille(valeur: number) {
    this.taille.next(valeur);
  }
  setMagnetisme(valeur: boolean) {
    this.activeMagnetisme.next(valeur);
  }
  setPointChoisi(valeur: number) {
    this.pointChoisi.next(valeur);
  }
 
  gereClique(x: number, y: number, couleurP: string,
             couleurS: string, epaisseur: number, point: number, listeDOM: HTMLCollectionOf<Element>,
             boiteDOM: HTMLCollectionOf<Element>): void {
    this.clique = true;
    this.preGlisse = false;
    this.boiteEnglobanteClique = false;
    this.sourisQuitte = false;
    this.mouvementSouris = false;
    this.aucunSelect = true;
    this.initSelect = new Point2D(x - this.decalageFenetreGauche, y + this.decalageY);
    if (this.boitesEnglobantes.length > 0) {
       // TODO A changer pour gerer interactions avec points de controle
      this.boitesEnglobantes.forEach((element) => {
        if (element.verifInclus(this.initSelect) && element.instr !== "" && !element.estPtControle()) {
          this.boiteEnglobanteClique = true;
        }
      });
      if (!this.boiteEnglobanteClique) {
        this.traceCourante = new Trace(this.epaisseurRectangleSelection, this.couleurRectangleSelection, this.couleurRectangleSelection);
        this.traceCourante.pointille = this.pointille;
        this.initRectangle = new Point2D(x - this.decalageFenetreGauche, y + this.decalageY);
        this.traces.push(this.traceCourante);
        this.rectangleEnglobant = new TraceSelection(this.epaisseurRectangleSelection,
                                                    this.couleurRectangleSelection, this.couleurRectangleSelection, false);
        this.boitesEnglobantes.push(this.rectangleEnglobant);
        this.domsToPath(listeDOM, this.traces);
      }
    } else {
      this.traceCourante = new Trace(this.epaisseurRectangleSelection, this.couleurRectangleSelection, this.couleurRectangleSelection);
      this.traceCourante.pointille = this.pointille;
      this.initRectangle = new Point2D(x - this.decalageFenetreGauche, y + this.decalageY);
      this.traces.push(this.traceCourante);
      this.rectangleEnglobant = new TraceSelection(this.epaisseurRectangleSelection,
                                                   this.couleurRectangleSelection, this.couleurRectangleSelection, false);
      this.boitesEnglobantes.push(this.rectangleEnglobant);
      this.domsToPath(listeDOM, this.traces);
    }
  }
  gereCliqueEtGlisse(x: number, y: number, controlPresse: boolean, boiteDOM: HTMLCollectionOf<Element>): void {
    if (this.clique) {
      this.mouvementSouris = true;
      if (this.boiteEnglobanteClique) {
        this.aucunSelect = false; // ptControlee
        this.finSelect = new Point2D(x - this.decalageFenetreGauche, y + this.decalageY);
        this.translationSelection(this.initSelect, this.finSelect);
        if (!this.premierDeplacement) {
          this.initSelect = this.finSelect;
        } else {
          this.premierDeplacement = false;
        }
      } else {
        this.aucunSelect = true;
        this.traceCourante.instr = this.aller(this.initRectangle);
        const finRectangle: Point2D = new Point2D(x - this.decalageFenetreGauche, y + this.decalageY);
        this.traceCourante.instr += this.rectangle(this.initRectangle, finRectangle);
        const initRectangleBas = new Point2D(this.initRectangle.getX(), finRectangle.getY());
        const finRectangleHaut = new Point2D(finRectangle.getX(), this.initRectangle.getY());
        this.traceCourante.initRect = this.initRectangle;
        this.traceCourante.finRect = finRectangle;
        this.traceCourante.initRectBas = initRectangleBas;
        this.traceCourante.finRectHaut = finRectangleHaut;
        this.domsToPathSelection(boiteDOM, this.boitesEnglobantes);
        for (const trace of this.traces) {
          if (trace.pointille === "" && (trace.verifInclus(this.initRectangle) || trace.verifInclus(finRectangle) ||
            trace.verifInclus(initRectangleBas) || trace.verifInclus(finRectangleHaut))) {
            trace.setSelect(true);
            this.aucunSelect = false;
          } else if (this.traceCourante.verifInclus(trace.initRect) || this.traceCourante.verifInclus(trace.finRect) ||
            this.traceCourante.verifInclus(trace.initRectBas) || this.traceCourante.verifInclus(trace.finRectHaut) || trace.verifTraverse(this.traceCourante)) {
            trace.setSelect(true);
            this.aucunSelect = false;
          } else {
            trace.setSelect(false);
          }
        }
        if (!this.aucunSelect) {
          this.obtenirExtremums();
          if(this.extremums[0].getX() === this.DIMENSIONMAX && this.extremums[0].getY() === this.DIMENSIONMAX && this.extremums[1].getX() === 0 && this.extremums[1].getY() === 0){
            this.setZero()
          } 
          else this.rectangleEnglobant.instr = this.aller(this.extremums[0]) + this.rectangle(this.extremums[0], this.extremums[1]);
        }
        if (!this.preGlisse) {
          this.preGlisse = true;
        } else if (this.preGlisse && this.traces[this.longueur()].pointille==this.pointille) { // Pt controle
          this.setZero(); // PtControle
          this.boitesEnglobantes.push(this.rectangleEnglobant);
          this.controleRectangleSelection();
          this.traces.pop();
          this.traces.push(this.traceCourante);
        }
      }
    }
  }
  translationSelection(init: Point2D, dest: Point2D) {
    const deplacement = new Point2D(this.finSelect.getX() - this.initSelect.getX(),
                                   this.finSelect.getY() - this.initSelect.getY());
    this.boitesEnglobantes.forEach((element) => {
      // nombreDeFoisDecalage est mis a 0, pour faire juste une translation simple
      element.instr = this.pressePapier.translationInstr(element.instr, 0, deplacement);
    });
    for (const trace of this.traces) {
      if (trace.selectionne) {
        trace.instr = this.pressePapier.translationInstr(trace.instr, 0, deplacement);
      }
    }
  }
  translationMagnetisme(deplacement: Point2D) {
    this.boitesEnglobantes.forEach((element) => {
      element.instr = this.pressePapier.translationInstr(element.instr, 0, deplacement);
    });
    for (const trace of this.traces) {
      if (trace.selectionne) {
        trace.instr = this.pressePapier.translationInstr(trace.instr, 0, deplacement);
      }
    }
  }
  // TODO Verifier le cas de gereSourisQuitte avec les deplacements de selection
  gereCliqueFinit(x: number, y: number, listeDOM: HTMLCollectionOf<Element> ,boiteDOM: HTMLCollectionOf<Element>, elem:Element) {
    if (!this.sourisQuitte && this.clique) {
      this.clique = false;
      if (!this.boiteEnglobanteClique) {
        if(!this.aucunSelect && this.traces[this.longueur()].pointille==this.pointille){
          this.traces.pop();
        } else if(this.aucunSelect){
          this.setZero();
        }
        if (!this.mouvementSouris) {
          for (const trace of this.traces) {
            if (trace.verifInclus(new Point2D(x - this.decalageFenetreGauche, y + this.decalageY))) {
              trace.setSelect(true);
              this.rectangleEnglobant = new TraceSelection(this.epaisseurRectangleSelection,
                                                  this.couleurRectangleSelection, this.couleurRectangleSelection, false);
              this.rectangleEnglobant.instr = this.aller(trace.initRect) + this.rectangle(trace.initRect, trace.finRect);
              this.boitesEnglobantes.push(this.rectangleEnglobant);
              this.clicSimpleDomToPath(elem);
              this.controleRectangleSelection();
              this.aucunSelect = false;
            } else {
              trace.setSelect(false);
            }
          }
          if (this.aucunSelect) {
            this.setZero();
          }
        }
      } else {
        // si magnetisme activé
        if (this.activeMagnetisme.value) {
          this.domsToPathSelection(boiteDOM, this.boitesEnglobantes);
          switch (this.pointChoisi.value) {
        case 0: {
          this.positionBoiteX = this.boitesEnglobantes[0].initRect;
          break;
        }
        case 1: {
          let temp = this.boitesEnglobantes[0].finRect.getX() - this.boitesEnglobantes[0].initRect.getX();
          this.positionBoiteX = new Point2D(this.boitesEnglobantes[0].initRect.getX() + temp , this.boitesEnglobantes[0].initRect.getY());
          break;
        }
        case 2: {
          this.positionBoiteX = this.boitesEnglobantes[0].finRectHaut;
          break;
        }
        case 3: {
          let temp = this.boitesEnglobantes[0].finRect.getY() - this.boitesEnglobantes[0].finRectHaut.getY();
          this.positionBoiteX = new Point2D(this.boitesEnglobantes[0].finRectHaut.getX() , this.boitesEnglobantes[0].finRectHaut.getY() + temp);
          break;
        }
        case 4: {
          this.positionBoiteX = this.boitesEnglobantes[0].finRect;
          break;
        }
        case 5: {
          let temp = this.boitesEnglobantes[0].finRect.getX() - this.boitesEnglobantes[0].initRectBas.getX();
          this.positionBoiteX = new Point2D(this.boitesEnglobantes[0].initRectBas.getX() + temp, this.boitesEnglobantes[0].finRect.getY());
          break;
        }
        case 6: {
          this.positionBoiteX = this.boitesEnglobantes[0].initRectBas;
          break;
        }
        case 7: {
          let temp = this.boitesEnglobantes[0].initRectBas.getY() - this.boitesEnglobantes[0].initRect.getY();
          this.positionBoiteX = new Point2D(this.boitesEnglobantes[0].initRectBas.getX() , this.boitesEnglobantes[0].initRect.getY() + temp);
          break;
        }
        case 8: {
          this.positionBoiteX = new Point2D(this.boitesEnglobantes[0].initRect.getX()/2 , this.boitesEnglobantes[0].finRect.getY()/2);
          break;
        }
      }
          const x = this.positionBoiteX.getX();
          const y = this.positionBoiteX.getY();
          this.translationMagnetisme(this.magnetisme.trouverCadran(x, y, this.taille.getValue()));
        }
        this.boiteEnglobanteClique = false;
        this.clique = false;
      }
    } else if (this.sourisQuitte) {
      this.clique = false;
    }
  }
  gereSourisQuitte(): void {
    if (!this.boiteEnglobanteClique && this.clique) {
      this.setZero();
      this.traces.pop();
    }
    if (this.clique) {
      this.clique = false;
      this.sourisQuitte = true;
    }
  }
  domsToPath(listeDOM: HTMLCollectionOf<Element>, traces: Trace[]): void {
    for (let i = 0; i < listeDOM.length; i++) {
      const currentRect = listeDOM[i].getBoundingClientRect();
      const init = new Point2D(Math.round(currentRect.left) - this.decalageFenetreGauche, Math.round(currentRect.top) + this.decalageY);
      const dest = new Point2D(Math.round(currentRect.right) - this.decalageFenetreGauche, Math.round(currentRect.bottom) + this.decalageY);
      traces[i].initRect = init;
      traces[i].finRect = dest;
      traces[i].initRectBas.setX(init.getX());
      traces[i].initRectBas.setY(dest.getY());
      traces[i].finRectHaut.setX(dest.getX());
      traces[i].finRectHaut.setY(init.getY());
    }
  }
  domsToPathSelection(listeDOM: HTMLCollectionOf<Element>, boites: TraceSelection[]): void {
    for (let i = 0; i < listeDOM.length; i++) {
      const currentRect = listeDOM[i].getBoundingClientRect();
      const init = new Point2D(Math.round(currentRect.left - this.decalageFenetreGauche), Math.round(currentRect.top + this.decalageY));
      const dest = new Point2D(Math.round(currentRect.right - this.decalageFenetreGauche), Math.round(currentRect.bottom + this.decalageY));
      boites[i].initRect = init;
      boites[i].finRect = dest;
      boites[i].initRectBas.setX(init.getX());
      boites[i].initRectBas.setY(dest.getY());
      boites[i].finRectHaut.setX(dest.getX());
      boites[i].finRectHaut.setY(init.getY());
      const LARGEUR = Math.round((boites[i].finRect.getX() - boites[i].initRect.getX()) / 2);
      const HAUTEUR = Math.round((boites[i].finRect.getY() - boites[i].initRect.getY()) / 2);
      boites[i].milieuBas = new Point2D(boites[i].finRect.getX() - LARGEUR, boites[i].finRect.getY() + 1);
      boites[i].milieuHaut = new Point2D(boites[i].initRect.getX() + LARGEUR, boites[i].initRect.getY());
      boites[i].milieuDroite = new Point2D(boites[i].finRect.getX(), boites[i].finRect.getY() - HAUTEUR);
      boites[i].milieuGauche = new Point2D(boites[i].initRect.getX(), boites[i].initRect.getY() + HAUTEUR);
    }
  }
  clicSimpleDomToPath(elem: Element): void{
    const CURRENTRECT = elem.getBoundingClientRect();
    const INIT = new Point2D(Math.round(CURRENTRECT.left - this.decalageFenetreGauche), Math.round(CURRENTRECT.top + this.decalageY));
    const DEST = new Point2D(Math.round(CURRENTRECT.right - this.decalageFenetreGauche), Math.round(CURRENTRECT.bottom + this.decalageY));
    this.boitesEnglobantes[0].initRect = INIT;
    this.boitesEnglobantes[0].finRect = DEST;
    this.boitesEnglobantes[0].initRectBas.setX(INIT.getX());
    this.boitesEnglobantes[0].initRectBas.setY(DEST.getY());
    this.boitesEnglobantes[0].finRectHaut.setX(DEST.getX());
    this.boitesEnglobantes[0].finRectHaut.setY(INIT.getY());
    const LARGEUR = Math.round((this.boitesEnglobantes[0].finRect.getX() - this.boitesEnglobantes[0].initRect.getX()) / 2);
    const HAUTEUR = Math.round((this.boitesEnglobantes[0].finRect.getY() - this.boitesEnglobantes[0].initRect.getY()) / 2);
    this.boitesEnglobantes[0].milieuBas = new Point2D(this.boitesEnglobantes[0].finRect.getX() - LARGEUR, 
                                                      this.boitesEnglobantes[0].finRect.getY() + 1);
    this.boitesEnglobantes[0].milieuHaut = new Point2D(this.boitesEnglobantes[0].initRect.getX() + LARGEUR, 
                                                       this.boitesEnglobantes[0].initRect.getY());
    this.boitesEnglobantes[0].milieuDroite = new Point2D(this.boitesEnglobantes[0].finRect.getX(),
                                                         this.boitesEnglobantes[0].finRect.getY() - HAUTEUR);
    this.boitesEnglobantes[0].milieuGauche = new Point2D(this.boitesEnglobantes[0].initRect.getX(),
                                                         this.boitesEnglobantes[0].initRect.getY() + HAUTEUR);
  }
  obtenirExtremums() {
    const MIN = new Point2D(this.DIMENSIONMAX, this.DIMENSIONMAX);
    const MAX = new Point2D(0, 0);
    this.extremums[0] = MIN;
    this.extremums[1] = MAX;
    for (let i = 0; i < this.traces.length; i++) {
      if (this.traces[i].getSelect() && this.traces[i].pointille === "") {
        if (this.traces[i].initRect.getX() < MIN.getX()) {
          MIN.setX(this.traces[i].initRect.getX());
        }
        if (this.traces[i].finRect.getX() < MIN.getX()) {
          MIN.setX(this.traces[i].finRect.getX());
        }
        if (this.traces[i].initRect.getY() < MIN.getY()) {
          MIN.setY(this.traces[i].initRect.getY());
        }
        if (this.traces[i].finRect.getY() < MIN.getY()) {
          MIN.setY(this.traces[i].finRect.getY());
        }
        if (this.traces[i].initRect.getX() > MAX.getX()) {
          MAX.setX(this.traces[i].initRect.getX());
        }
        if (this.traces[i].finRect.getX() > MAX.getX()) {
          MAX.setX(this.traces[i].finRect.getX());
        }
        if (this.traces[i].initRect.getY() > MAX.getY()) {
          MAX.setY(this.traces[i].initRect.getY());
        }
        if (this.traces[i].finRect.getY() > MAX.getY()) {
          MAX.setY(this.traces[i].finRect.getY());
        }
      }
      this.extremums[0] = MIN;
      this.extremums[1] = MAX;
    }
  }
  setZero(): void {
    for (let i = this.boitesEnglobantes.length; i > 0; i--) {
      this.boitesEnglobantes.pop();
    }
  }
  pointControle(milieu: Point2D): TraceSelection {
    const tracePtControle = new TraceSelection(1, "#000000", "#000000", true);
    const init = new Point2D(milieu.getX() - this.DIMENSIONCONTROLE, milieu.getY() - this.DIMENSIONCONTROLE);
    const fin = new Point2D(milieu.getX() + this.DIMENSIONCONTROLE, milieu.getY() + this.DIMENSIONCONTROLE);
    tracePtControle.instr = this.aller(init) + this.rectangle(init, fin);
    return tracePtControle;
  }
  controleRectangleSelection(): void {
    for (const boite of this.boitesEnglobantes) {
      if (!boite.estPtControle()) {
        let pointControleInit = this.pointControle(boite.initRect);
        let pointControleFin = this.pointControle(boite.finRect);
        let pointControleInitBas = this.pointControle(boite.initRectBas);
        let pointControleFinHaut = this.pointControle(boite.finRectHaut);
        let pointControleMilieuGauche = this.pointControle(boite.milieuGauche);
        let pointControleMilieuDroite = this.pointControle(boite.milieuDroite);
        let pointControleMilieuHaut = this.pointControle(boite.milieuHaut);
        let pointControleMilieuBas = this.pointControle(boite.milieuBas);
        this.boitesEnglobantes.push(pointControleInit);
        this.boitesEnglobantes.push(pointControleFin);
        this.boitesEnglobantes.push(pointControleInitBas);
        this.boitesEnglobantes.push(pointControleFinHaut);
        this.boitesEnglobantes.push(pointControleMilieuGauche);
        this.boitesEnglobantes.push(pointControleMilieuDroite);
        this.boitesEnglobantes.push(pointControleMilieuHaut);
        this.boitesEnglobantes.push(pointControleMilieuBas);
      }
    }
  }
}
