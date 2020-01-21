import { Injectable } from '@angular/core';
import { CrayonService } from 'app/services/crayon.service';
import { Point2D } from 'app/services/point-2d/point-2d.service';
import { Trace } from 'Trace';
import { TracesService } from './traces.service';

@Injectable({
  providedIn: 'root',
})
export class EllipseService extends CrayonService {
  point = false;
  traceEllipse: Trace;
  sourisQuitte = false;
  initRectangle: Point2D;
  preGlisse = false;
  controlPresse = false;
  private readonly pointille = "10,10";
  private readonly epaisseurRectangleSelection: number = 1;
  private readonly couleurRectangleSelection: string = "#000000";
  constructor(tableauCommun: TracesService) {
    super(tableauCommun);
  }
  hemiEllipseDroite(r: Point2D, destArc: Point2D): string {
    const chaine = " A" + r.getX() + " , " + r.getY() + " 0 0, 1 " + destArc.getX() + " " + destArc.getY() + " ";
    return chaine;
  }

  hemiEllipseGauche(r: Point2D, destArc: Point2D ): string {
    const chaine = " A" + r.getX() + " , " + r.getY() + " 0 0, 0 " + destArc.getX() + " " + destArc.getY() + " ";
    return chaine;
  }
  ellipse(init: Point2D, dest: Point2D): string {
    const rayonX = (dest.getX() - init.getX()) / 2;
    const rayonY = (dest.getY() - init.getY()) / 2;
    let chaine = this.aller(new Point2D(init.getX() + rayonX, init.getY()));
    chaine += this.hemiEllipseDroite(new Point2D(rayonX, rayonY), new Point2D(dest.getX() - rayonX, dest.getY()));
    chaine += this.aller(new Point2D(init.getX() + rayonX, init.getY()));
    chaine += this.hemiEllipseGauche(new Point2D(rayonX, rayonY), new Point2D(dest.getX() - rayonX, dest.getY()));
    chaine += this.aller(init);
    return chaine;
  }
  cercle(init: Point2D, dest: Point2D): string {
    const rayonX = (dest.getX() - init.getX()) / 2;
    const rayonY = (dest.getY() - init.getY()) / 2;
    let chaine = "";
    const rayon = new Point2D(0, 0);
    const debutArc = new Point2D(0, 0);
    const finArc =  new Point2D(0, 0);
    if (Math.abs(rayonX) <= Math.abs(rayonY)) {
      rayon.setX(Math.abs(rayonX));
      rayon.setY(Math.abs(rayonX));
      debutArc.setX(init.getX() + rayonX);
      debutArc.setY(init.getY() + rayonY - rayonX);
      finArc.setX(dest.getX() - rayonX);
      finArc.setY(dest.getY() - rayonY + rayonX);
      chaine = this.aller(debutArc);
      chaine += this.hemiEllipseDroite(rayon, finArc);
      chaine += this.aller(debutArc);
      chaine += this.hemiEllipseGauche(rayon, finArc);
    } else if (Math.abs(rayonY) < Math.abs(rayonX)) {
      rayon.setX(rayonY);
      rayon.setY(rayonY);
      chaine = this.aller(new Point2D(init.getX() + rayonX, init.getY()));
      chaine += this.hemiEllipseDroite(rayon, new Point2D(dest.getX() - rayonX, dest.getY()));
      chaine += this.aller(new Point2D(init.getX() + rayonX, init.getY()));
      chaine += this.hemiEllipseGauche(rayon, new Point2D(dest.getX() - rayonX, dest.getY()));
    }
    chaine += this.aller(init);
    return chaine;
  }
  gereClique(x: number, y: number, couleurP: string, couleurS: string, epaisseur: number, point: number,
             listeDOM: HTMLCollectionOf<Element>, listeBoite: HTMLCollectionOf<Element>) {
    this.sourisQuitte = false;
    this.clique = true;
    this.traceCourante = new Trace(this.epaisseurRectangleSelection, couleurP, this.couleurRectangleSelection);
    this.traceCourante.pointille = this.pointille;
    this.traceEllipse = new Trace(epaisseur, couleurP, couleurS);
    if (point === 1) {
      this.traceEllipse.pointille = this.pointille;
    }
    this.initRectangle = new Point2D(x - this.decalageFenetreGauche, y + this.decalageY);
    this.traces.push(this.traceEllipse);
    this.traces.push(this.traceCourante); // Changed
  }
  gereCliqueEtGlisse(x: number, y: number, controlPresse: boolean, boiteDOM: HTMLCollectionOf<Element>) {
    if (this.clique) {
      this.traceCourante.instr = this.aller(this.initRectangle);
      this.traceEllipse.instr = this.aller(this.initRectangle);
      const finRectangle: Point2D = new Point2D(x - this.decalageFenetreGauche, y + this.decalageY);
      if (!this.preGlisse) {
        this.preGlisse = true;
      } else {
        this.traces.pop();
        this.traces.pop(); // Ellipse
        this.traceCourante.instr += this.rectangle(this.initRectangle, finRectangle);
        if (controlPresse) {
          this.traceEllipse.instr += this.cercle(this.initRectangle, finRectangle);
        } else {
          this.traceEllipse.instr += this.ellipse(this.initRectangle, finRectangle);
        }
        this.traces.push(this.traceEllipse);
        this.traces.push(this.traceCourante);
        this.traces[this.avantDernier()].instr = this.aller(this.initRectangle);
        if (controlPresse) {
          this.traces[this.avantDernier()].instr += this.cercle(this.initRectangle, finRectangle);
        } else {
          this.traces[this.avantDernier()].instr += this.ellipse(this.initRectangle, finRectangle);
        }
      }
    }
  }
  gereCliqueFinit(x: number, y: number, boite: HTMLCollectionOf<Element>) {
    if (!this.sourisQuitte && this.clique) {
      this.traces.pop();
      this.clique = false;
    }
  }
  gereSourisQuitte(): void {
    if (this.clique) {
      this.traces.pop();
      this.clique = false;
      this.sourisQuitte = true;
    }
  }
}
