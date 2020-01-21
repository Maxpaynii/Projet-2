import { Trace } from 'Trace';
import { Point2D } from 'app/services/point-2d/point-2d.service';
export class TraceSelection extends Trace {
    milieuGauche: Point2D;
    milieuDroite: Point2D;
    milieuHaut: Point2D;
    milieuBas: Point2D;
    private ptControle: boolean;
    constructor(epaisseur: number, couleurP: string, couleurS: string, ptControle: boolean) {
        super(epaisseur, couleurP, couleurS);
        this.ptControle = ptControle;
    }
    estPtControle(): boolean{
        return this.ptControle;
    }
}
