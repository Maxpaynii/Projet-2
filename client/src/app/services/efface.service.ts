import { Injectable } from '@angular/core';
import { Trace } from 'Trace';
import { Point2D } from './point-2d/point-2d.service';

const ROUGE_VIF = '#FF0000';

const INSTRUCTION_MOVE = 'M';
const INSTRUCTION_LIGNE = 'L';
const INSTRUCTION_ARC = 'A';
@Injectable({
  providedIn: 'root',
})
export class EffaceService {
  signauxEfface: string[];
  tracesEffaces2: Trace[];
  tracesEffaces: Trace[];

  traceAEffacer?: Trace;
  couleurOriginalTraceAEffacer: string;

  constructor() {
    this.tracesEffaces = [];
    this.tracesEffaces2 = [];
    this.signauxEfface = [];
  }

  gereClic(tracesDansCanvas: Trace[], x: number, y: number, epaisseurEfface: number): void {
    this.effacerPremierTrace(tracesDansCanvas, x, y, epaisseurEfface);
  }

  gereGlisse(tracesDansCanvas: Trace[], x: number, y: number, estClique: boolean, epaisseurEfface?: number): void {
    if (epaisseurEfface === undefined) {
      return;
    }
    if (estClique) {
        this.retirerTraces(tracesDansCanvas, x, y, epaisseurEfface);
    } else {
      this.trouverPremierTrace(tracesDansCanvas, x, y, epaisseurEfface);
    }
  }
  gereSourisQuitte(): void {
    this.restaurerTraceAEfface();
    this.traceAEffacer = undefined;
  }
  gereDeclic(): Trace[] {
    return this.tracesEffaces;
  }
  gereDeclic2(): Trace[] {
    return this.tracesEffaces2;
  }
  gereSignaux(): string[] {
    return this.signauxEfface;
  }

  trouverPremierTrace(tracesDansCanvas: Trace[], x: number, y: number, epaisseurEfface: number): void {
    for (let i = tracesDansCanvas.length - 1; i >= 0; i--) {
      if(this.traceClique(tracesDansCanvas[i], x, y, epaisseurEfface)) {
        if (tracesDansCanvas[i] !== this.traceAEffacer) {
          this.restaurerTraceAEfface();
          this.sauvegarderTraceAEfface(tracesDansCanvas[i]);
        }
        return;
      }
    }
    this.restaurerTraceAEfface();
    this.traceAEffacer = undefined;
  }

  restaurerTraceAEfface(): void {
    if (this.traceAEffacer !== undefined) {
      this.traceAEffacer.couleurS = this.couleurOriginalTraceAEffacer;
    }
  }

  sauvegarderTraceAEfface(traceAEffacer: Trace): void {
    this.traceAEffacer = traceAEffacer;
    this.couleurOriginalTraceAEffacer = this.traceAEffacer.couleurS;
    this.traceAEffacer.couleurS = ROUGE_VIF;
  }

  effacerPremierTrace(tracesDansCanvas: Trace[], x: number, y: number, epaisseurEfface: number): void {
    if (this.traceAEffacer !== undefined) {
      this.restaurerTraceAEfface();
      this.tracesEffaces.push(this.traceAEffacer);
      this.signauxEfface.push("signalEfface1");
      const INDEX = tracesDansCanvas.indexOf(this.traceAEffacer);
      tracesDansCanvas.splice(INDEX, 1);

      this.traceAEffacer = undefined;
    }
  }

  retirerTraces(tracesDansCanvas: Trace[], x: number, y: number, epaisseurEfface: number): void {
    for (let i = 0; i < tracesDansCanvas.length; i++) {
      if (this.traceClique(tracesDansCanvas[i], x, y, epaisseurEfface)) {
          this.tracesEffaces2.push(tracesDansCanvas[i]);
          this.signauxEfface.push("signalEfface2");
          tracesDansCanvas.splice(i, 1);
      }
    }
  }

  traceClique(trace: Trace, x: number, y: number, epaisseurEfface: number): boolean {
    let instruction = trace.instr;
    let positionCourante = new Point2D(0, 0);
    while (instruction !== '') {
      const TYPE_INSTRUCTION: string = instruction[0];
      instruction = instruction.substr(1);
      switch (TYPE_INSTRUCTION) {
        case INSTRUCTION_MOVE: {
          positionCourante = this.obtenirPointDUneInstruction(instruction);
          break;
        }
        case INSTRUCTION_LIGNE: {
          if (this.ligneSelectionnee(instruction, x, y, positionCourante, epaisseurEfface)) {
            return true;
          }
          break;
        }
        case INSTRUCTION_ARC: {
          if (this.arcSelectionne(instruction, x, y, positionCourante, epaisseurEfface)) {
            return true;
          }
          break;
        }
      }
    }
    return false;
  }

  ligneSelectionnee(instruction: string, curseurX: number, curseurY: number, positionCourante: Point2D, epaisseurEfface: number): boolean {

    const POSITION_FINALE = this.obtenirPointDUneInstruction(instruction);
    const POSITION_INITIALE = new Point2D(positionCourante.getX(), positionCourante.getY());
    if (curseurX < Math.min(POSITION_INITIALE.getX(), POSITION_FINALE.getX()) - epaisseurEfface ||
        curseurY < Math.min(POSITION_INITIALE.getY(), POSITION_FINALE.getY()) - epaisseurEfface ||
        curseurX > Math.max(POSITION_INITIALE.getX(), POSITION_FINALE.getX()) + epaisseurEfface ||
        curseurY > Math.max(POSITION_INITIALE.getY(), POSITION_FINALE.getY()) + epaisseurEfface)  {
        return false;
    }
    if (POSITION_INITIALE.getX() === POSITION_FINALE.getX()) { // ligne parfaitement verticale
      return true;
    }

    const PENTE_DROITE = (POSITION_FINALE.getY() - POSITION_INITIALE.getY()) / (POSITION_FINALE.getX() - POSITION_INITIALE.getX());
    const VALEUR_INITIALE_DROITE = POSITION_INITIALE.getY() - PENTE_DROITE * POSITION_INITIALE.getX();
    const POSITION_CLIC_Y_ATTENDU = curseurX * PENTE_DROITE + VALEUR_INITIALE_DROITE;

    return (Math.abs(POSITION_CLIC_Y_ATTENDU - curseurY) < epaisseurEfface);
  }

  arcSelectionne(instruction: string, curseurX: number, curseurY: number, positionCourante: Point2D, epaisseurEfface: number): boolean {

    const RAYON = this.obtenirPointDUneInstruction(instruction);

    const COIN_SUPERIEUR_GAUCHE = new Point2D(0, 0);
    if (RAYON.getY() > 0) {
      COIN_SUPERIEUR_GAUCHE.setY(positionCourante.getY());
    } else {
      COIN_SUPERIEUR_GAUCHE.setY(positionCourante.getY() + 2 * RAYON.getY());
    }

    if (RAYON.getX() > 0) {
      COIN_SUPERIEUR_GAUCHE.setX(positionCourante.getX() - RAYON.getX());
    } else {
      COIN_SUPERIEUR_GAUCHE.setX(positionCourante.getX() + RAYON.getX());
    }

    RAYON.setX(Math.abs(RAYON.getX()));
    RAYON.setY(Math.abs(RAYON.getY()));

    const CENTRE_ELLIPSE = new Point2D(COIN_SUPERIEUR_GAUCHE.getX() + RAYON.getX(), COIN_SUPERIEUR_GAUCHE.getY() + RAYON.getY());

    if (curseurX < COIN_SUPERIEUR_GAUCHE.getX() - epaisseurEfface ||
        curseurX > COIN_SUPERIEUR_GAUCHE.getX() + 2 * RAYON.getX() + epaisseurEfface) {
          return false;
    }

    let ecartCentreYAttendu: number;
    if (curseurX < COIN_SUPERIEUR_GAUCHE.getX() || curseurX > COIN_SUPERIEUR_GAUCHE.getX() +  2 * RAYON.getX()) {
      ecartCentreYAttendu = 0; // curseur légèrement à l'extérieur de l'ellipse
    } else {
      ecartCentreYAttendu = Math.sqrt((1 - Math.pow((curseurX - CENTRE_ELLIPSE.getX()) / RAYON.getX(), 2))
                            * Math.pow(RAYON.getY(), 2));
    }
    return Math.abs((curseurY - CENTRE_ELLIPSE.getY())) < ecartCentreYAttendu + epaisseurEfface;
  }

  obtenirPointDUneInstruction(instruction: string): Point2D {
    const SEPARATEUR = ',';

    const X = parseFloat(instruction);
    instruction = instruction.substr(instruction.indexOf(SEPARATEUR) + 1);

    const Y = parseFloat(instruction);
    return new Point2D(X, Y);
  }
}
