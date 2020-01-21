import { Injectable } from '@angular/core';
import { Trace } from 'Trace';
import { CrayonService } from './crayon.service';
import { Point2D } from './point-2d/point-2d.service';
import { TracesService } from './traces.service';

const EPAISSEUR_LIGNE = 2;
@Injectable({
  providedIn: 'root',

})
export class PlumeService {
  public tracesDansCanvas: Trace[];
  private positionCourante: Point2D;
  private traceCourant: Trace;
  private crayon: CrayonService;

  constructor() {
    this.tracesDansCanvas = TracesService.Instance.traces;
    this.positionCourante = new Point2D(0, 0);
    this.crayon = new CrayonService(TracesService.Instance);
  }
  gereClic(x: number, y: number, epaisseurPlume: number, anglePlume: number, couleurPrimaire: string, couleurSecondaire: string): void {
    this.positionCourante.setX(x);
    this.positionCourante.setY(y);
    this.traceCourant = new Trace(EPAISSEUR_LIGNE, couleurPrimaire, couleurSecondaire);
    this.tracesDansCanvas.push(this.traceCourant);
    this.tracerLigne(this.positionCourante, epaisseurPlume, anglePlume);
  }

  gereGlisse(x: number, y: number, epaisseurPlume: number, anglePlume: number): void {
    const POSITION_FINALE = new Point2D(x, y);
    const DISTANCE = Point2D.distanceEntreDeuxPoints(this.positionCourante, POSITION_FINALE);

    const DX = (POSITION_FINALE.getX() - this.positionCourante.getX()) / DISTANCE;
    const DY = (POSITION_FINALE.getY() - this.positionCourante.getY()) / DISTANCE;
    for (let i = 0; i <= DISTANCE; i++) {
      const CENTRE_LIGNE = new Point2D(this.positionCourante.getX() + i * DX, this.positionCourante.getY() + i * DY);
      this.tracerLigne(CENTRE_LIGNE, epaisseurPlume, anglePlume);
    }
    this.positionCourante = POSITION_FINALE;
  }

  private tracerLigne(positionCentre: Point2D, epaisseurPlume: number, anglePlume: number): void {
    let debutLigne = new Point2D(positionCentre.getX() + epaisseurPlume, positionCentre.getY());
    debutLigne = debutLigne.rotationAutourDUnPoint(positionCentre, anglePlume);
    let finLigne = new Point2D(positionCentre.getX() - epaisseurPlume, positionCentre.getY());
    finLigne = finLigne.rotationAutourDUnPoint(positionCentre, anglePlume);
    this.ecrireInstructionBouger(debutLigne);
    this.ecrireInstructionLigne(finLigne);
  }

  private ecrireInstructionBouger(position: Point2D): void {
    this.traceCourant.instr += this.crayon.aller(position);
  }
  private ecrireInstructionLigne(position: Point2D): void {
    this.traceCourant.instr += this.crayon.ligne(position);
  }
}
