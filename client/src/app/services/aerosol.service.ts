import { Injectable } from '@angular/core';
import { CrayonService } from '../services/crayon.service';
import { Trace } from '../../Trace';
import { Point2D } from '../services/point-2d/point-2d.service';
import { TracesService } from './traces.service';


const EPAISSEUR_POINT = 1;
const DEUX = 2;
const NBR_POINTS = 10;
const ZERO = 0;
@Injectable({
  providedIn: 'root'
})
export class AerosolService {
  public tracesDansCanvas: Trace[];
  public crayon: CrayonService;
  public traceCourante: Trace;
  public positionCourante: Point2D;
  public actif: boolean;

  constructor() {
    this.tracesDansCanvas = TracesService.Instance.traces;
    this.positionCourante = new Point2D(ZERO,ZERO);
    this.crayon = new CrayonService(TracesService.Instance);
    this.actif = false;
   }

   setActif(actif: boolean): void {
     this.actif = actif;
   }

   getActif(): boolean{
     return this.actif;
   }

   setPosition(x: number, y:number): void {
     this.positionCourante.setX(x);
     this.positionCourante.setY(y);
   }

   getPosition(): Point2D {
     return this.positionCourante
   }

   gereClic(x: number, y: number,diametre: number, emission: number, couleurPrimaire: string, couleurSecondaire: string) {
      this.setPosition(x,y);
      this.traceCourante = new Trace(EPAISSEUR_POINT, couleurPrimaire, couleurSecondaire);
      this.tracesDansCanvas.push(this.traceCourante);
      let interval = setInterval(() => {
        if(this.getActif()){
        this.tracerAerosol(this.getPosition(), diametre, emission);
      } else {
        clearInterval(interval);
        }
      }, 200);   
   }

   gereGlisse(x: number, y: number,diametre: number, emission: number): void {
    if(this.getActif()){
      this.tracerAerosol(this.getPosition(), diametre, emission);
    }
   } 

   tracerAerosol(positioncentre: Point2D, diametre: number, emission: number) {
     for(let i = ZERO; i<NBR_POINTS*emission ;i++){
       let cercle = Math.random() * DEUX * Math.PI;
       let rayon = diametre * Math.sqrt(Math.random());
       let xPoint = Math.ceil(rayon * Math.cos(cercle));
       let yPoint = Math.ceil(rayon * Math.sin(cercle));
       let pointFinal = new Point2D(Math.ceil(xPoint + positioncentre.getX()),Math.ceil(yPoint + positioncentre.getY()));
       this.tracerPoint(pointFinal);
     }
   }

   tracerPoint(position: Point2D): void {
     this.traceCourante.instr += this.crayon.aller(position);
     this.traceCourante.instr += this.crayon.ligne(position);
   }

}
