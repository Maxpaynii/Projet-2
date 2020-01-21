
import {Point2D} from './app/services/point-2d/point-2d.service';
// import {TraceSelection} from './TraceSelection';
 

export class Trace {
    epaisseur: number;
    instr: string;
    couleurP: string;
    couleurS: string;
    initRect: Point2D;
    finRect: Point2D;
    initRectBas: Point2D;
    finRectHaut: Point2D;
    pointille = "";
    selectionne: boolean;
    type: string;
    constructor(epaisseur: number,  couleurP: string, couleurS: string) {
        this.epaisseur = epaisseur;
        this.couleurP = couleurP;
        this.couleurS = couleurS;
        this.selectionne = false;
        this.instr = "";
        this.initRect = new Point2D(666, 666);
        this.finRect = new Point2D(666, 666);
        this.initRectBas = new Point2D(777, 777);
        this.finRectHaut = new Point2D(777, 777);
    }
    setSelect(selection: boolean): void {
        this.selectionne = selection;
    }
    getSelect(): boolean {
        return this.selectionne;
    }
    setInit(initRect: Point2D): void {
        this.initRect = initRect;
    }
    setFin(finRect: Point2D): void {
        this.finRect = finRect;
    }
    estSelect(): boolean {
        return this.selectionne;
    }
    inverseSelect(): void {
        this.selectionne = !this.selectionne;
    }
    verifInclus(pointClique: Point2D): boolean {
        if (this.initRect.getX() <= this.finRect.getX()) {
            if (pointClique.getX() >= this.initRect.getX() && pointClique.getX() <= this.finRect.getX()) {
                if (this.initRect.getY() <= this.finRect.getY()) {
                    if (pointClique.getY() >= this.initRect.getY() && pointClique.getY() <= this.finRect.getY()) {
                        return true;
                    }
                } else {
                    if (pointClique.getY() >= this.finRect.getY() && pointClique.getY() <= this.initRect.getY()) {
                        return true;
                    }
                }
            }
        } else {
            if (pointClique.getX() >= this.finRect.getX() && pointClique.getX() <= this.initRect.getX()) {
                if (this.initRect.getY() <= this.finRect.getY()) {
                    if (pointClique.getY() >= this.initRect.getY() && pointClique.getY() <= this.finRect.getY()) {
                        return true;
                    }
                } else {
                    if (pointClique.getY() >= this.finRect.getY() && pointClique.getY() <= this.initRect.getY()) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    getCentre(): Point2D {
        const X = (this.initRect.getX() + this.finRect.getX()) / 2;
        const Y = (this.initRect.getY() + this.finRect.getY()) / 2;
        return new Point2D(X, Y);
    }
    verifTraverse(TraceComparee: Trace): boolean{
        let traverse = false;
        if(TraceComparee.initRect.getX() < this.initRect.getX() && TraceComparee.finRect.getX() > this.finRect.getX() &&
           TraceComparee.initRect.getY() > this.initRect.getY() && TraceComparee.finRect.getY() < this.finRect.getY()){
            traverse = true;
        } else if( TraceComparee.initRect.getX() > this.initRect.getX() && TraceComparee.finRect.getX() < this.finRect.getX() &&
                   TraceComparee.initRect.getY() < this.initRect.getY() && TraceComparee.finRect.getY() > this.finRect.getY()) {
            traverse = true;
        }
        return traverse;
    }
}
