import { Injectable } from '@angular/core';
import { Trace } from '../../Trace';
//import { OutilAbsService } from './outil-abs.service';
import { Point2D } from './point-2d/point-2d.service';
import { TracesService } from './traces.service';

const UN = 1;

@Injectable({
  providedIn: 'root',
})
export class CrayonService /*implements OutilAbsService*/ {
  protected readonly decalageFenetreGauche: number = 277;
  protected readonly decalageY = -3;
  epaisseur = 1;
  mouvementSouris = false;
  traces: Trace[];
  traceCourante: Trace;
  clique = false;
  constructor(tableauCommun: TracesService) {
    this.traces = tableauCommun.traces;
  }
  avantDernier(): number {
    return this.longueur() - UN;
  }
  longueur(): number {
    return this.traces.length - UN;
  }

  aller(destination: Point2D): string {
    const chaine = "M" + destination.getX() + "," + destination.getY();
    return chaine;
  }

  ligne(destination: Point2D): string {
    const chaine = 'L' + destination.getX() + ',' + destination.getY();
    return chaine;
  }
  rectangle(init: Point2D, destination: Point2D): string {
    let inter = new Point2D(init.getX(), destination.getY());
    let chaine = this.ligne(inter);
    chaine += this.aller(inter);
    chaine += this.ligne(destination);
    chaine += this.aller(destination);
    inter = new Point2D(destination.getX(), init.getY());
    chaine += this.ligne(inter);
    chaine += this.aller(inter);
    chaine += this.ligne(init);
    chaine += this.aller(init);
    return chaine;
  }
  gereSourisQuitte() {
    this.mouvementSouris = false;
    this.clique = false;
  }
  gereClique(x: number, y: number, couleurP: string, couleurS: string, epaisseur: number, point: number,
             listeDOM: HTMLCollectionOf<Element>, listeBoite: HTMLCollectionOf<Element>): void {
    this.mouvementSouris = false;
    this.clique = true;
    this.traceCourante = new Trace(epaisseur, couleurP, couleurS);
    this.traceCourante.instr = this.aller(new Point2D(x - this.decalageFenetreGauche, y + this.decalageY));
    this.traces.push(this.traceCourante);
  }
  gereCliqueEtGlisse(x: number, y: number, controlPresse: boolean, boiteDOM: HTMLCollectionOf<Element>): void {
    this.mouvementSouris = true;
    if (this.clique) {
      const point: Point2D = new Point2D(x - this.decalageFenetreGauche, y + this.decalageY);
      this.traces[this.longueur()].instr += this.ligne(point);
      this.traces[this.longueur()].instr += this.aller(point);
    }
  }
  gereCliqueFinit(x: number, y: number, listeDOM: HTMLCollectionOf<Element>, listeBoite: HTMLCollectionOf<Element>, elem:Element): void {
    if (!this.mouvementSouris) {
      this.traces[this.longueur()].instr += this.ligne(new Point2D(x - this.decalageFenetreGauche, y + this.decalageY));
    }
    this.clique = false;
  }
}