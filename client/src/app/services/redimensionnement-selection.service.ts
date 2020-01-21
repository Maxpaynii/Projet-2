import { Injectable } from '@angular/core';
import { Trace } from 'Trace';
import { Point2D } from './point-2d/point-2d.service';
import { TracesService } from './traces.service';

const INSTRUCTION_MOVE = 'M';
const INSTRUCTION_LIGNE = 'L';
const INSTRUCTION_ARC = 'A';
const HEMI_ELLIPSE_GAUCHE = '0 0, 1';
const HEMI_ELLIPSE_DROITE = '0 0, 0';
const SEPARATEUR_COORDONNEES = ',';
const ESPACE = ' ';

@Injectable({
  providedIn: 'root',
})
export class RedimensionnementSelectionService {
  private tracesDansCanvas: Trace[];
  private pointCentre: Point2D;
  private pointOppose: Point2D;
  private pointClic: Point2D;
  private indicesTracesOriginaux: number[];
  private redimensionnementVertical: boolean;
  private redimensionnementHorizontal: boolean;
  private nombreTracesOriginal: number;

  constructor() {
    this.tracesDansCanvas = TracesService.Instance.traces;
  }

  initialiserRedimensionnement(pointClic: Point2D, pointOppose: Point2D): void {
    this.indicesTracesOriginaux = [];
    this.nombreTracesOriginal = this.tracesDansCanvas.length;

    this.pointOppose = pointOppose;
    this.pointClic = pointClic;

    const POINT_CENTRE_X = (pointClic.getX() + pointOppose.getX()) / 2;
    const POINT_CENTRE_Y = (pointClic.getY() + pointOppose.getY()) / 2;
    this.pointCentre = new Point2D(POINT_CENTRE_X, POINT_CENTRE_Y);

    this.redimensionnementVertical = pointClic.getX() !== pointOppose.getX();
    this.redimensionnementHorizontal = pointClic.getY() !== pointOppose.getY();

    for (let i = 0; i < this.nombreTracesOriginal; i++) {
      const TRACE = this.tracesDansCanvas[i];
      if (TRACE.getSelect()) {
        const COPIE = new Trace(TRACE.epaisseur, TRACE.couleurP, TRACE.couleurS);
        COPIE.pointille = TRACE.pointille;
        COPIE.instr = TRACE.instr;

        COPIE.setSelect(true);
        TRACE.setSelect(false);

        this.tracesDansCanvas.push(COPIE);
        this.indicesTracesOriginaux.push(i);
      }
    }
  }

  effectuerRedimensionnement(pointClicCourant: Point2D, shiftAppuye: boolean, altAppuye: boolean): void {
    const POINT_REFERENCE = altAppuye ? this.pointCentre : this.pointOppose;

    let facteurHorizontal: number;
    let facteurVertical: number;

    if (this.pointClic.getX() === POINT_REFERENCE.getX()) {
      facteurHorizontal = 1;
    } else {
      facteurHorizontal = (pointClicCourant.getX() - POINT_REFERENCE.getX()) / (this.pointClic.getX() - POINT_REFERENCE.getX());
    }

    if (this.pointClic.getY() === POINT_REFERENCE.getY()) {
      facteurVertical = 1;
    } else {
      facteurVertical = (pointClicCourant.getY() - POINT_REFERENCE.getY()) / (this.pointClic.getY() - POINT_REFERENCE.getY());
    }

    if (shiftAppuye) {
      const FACTEUR = Math.min(Math.abs(facteurHorizontal), Math.abs(facteurVertical));
      facteurHorizontal = FACTEUR * Math.sign(facteurHorizontal);
      facteurVertical = FACTEUR * Math.sign(facteurVertical);
    }
    if (!this.redimensionnementHorizontal) {
      facteurHorizontal = 1;
    }
    if (!this.redimensionnementVertical) {
      facteurVertical = 1;
    }
    for (let i = this.nombreTracesOriginal; i < this.tracesDansCanvas.length; i++) {
      const INDICE_TRACE_ORIGINAL = this.indicesTracesOriginaux[i - this.nombreTracesOriginal];
      const INSTRUCTION_ORIGINALE = this.tracesDansCanvas[INDICE_TRACE_ORIGINAL].instr;
      this.tracesDansCanvas[i].instr = this.redimensionnementSurInstruction(INSTRUCTION_ORIGINALE, POINT_REFERENCE,
                                                                            facteurHorizontal, facteurVertical);
    }
  }
  redimensionnementSurInstruction(instruction: string, pointReference: Point2D,
                                  facteurHorizontal: number, facteurVertical: number): string {
    let instructionRedimensionnee = '';
    let compteA = false;
    while (instruction !== '') {
      const TYPE_INSTRUCTION: string = instruction[0];
      instruction = instruction.substr(1);
      switch (TYPE_INSTRUCTION) {
        case INSTRUCTION_MOVE: {
          const POINT_FINAL = this.redimensionnerPointDUneInstruction(instruction, pointReference, facteurHorizontal, facteurVertical);
          instructionRedimensionnee += (INSTRUCTION_MOVE + POINT_FINAL.getX().toString() +
                                        SEPARATEUR_COORDONNEES + POINT_FINAL.getY().toString());
          break;
        }
        case INSTRUCTION_LIGNE: {
          const POINT_FINAL = this.redimensionnerPointDUneInstruction(instruction, pointReference, facteurHorizontal, facteurVertical);
          instructionRedimensionnee += (INSTRUCTION_LIGNE + POINT_FINAL.getX().toString() +
                                        SEPARATEUR_COORDONNEES + POINT_FINAL.getY().toString());
          break;
        }
        case INSTRUCTION_ARC: {
          instructionRedimensionnee += TYPE_INSTRUCTION;
          instructionRedimensionnee += this.redimensionnementInstructionArc(instruction, pointReference,
                                                                            facteurHorizontal, facteurVertical, compteA);
          compteA = true;
          break;
        }
        default: {
          break;
        }
      }
    }
    return instructionRedimensionnee;
  }

  redimensionnementFini(): Trace[] {
    const ANCIENS_TRACES: Trace[] = [];
    while (this.indicesTracesOriginaux.length !== 0) {
      const INDICE = this.indicesTracesOriginaux.pop();
      if (INDICE !== undefined) {
        ANCIENS_TRACES.concat(this.tracesDansCanvas.splice(INDICE, 1));
      }
    }
    return ANCIENS_TRACES;
  }

  private obtenirPointDUneInstruction(instruction: string): Point2D {
    const X = parseFloat(instruction);
    instruction = instruction.substr(instruction.indexOf(SEPARATEUR_COORDONNEES) + 1);

    const Y = parseFloat(instruction);
    return new Point2D(X, Y);
  }

  redimensionnerPointDUneInstruction(instruction: string, pointReference: Point2D,
                                     facteurHorizontal: number, facteurVertical: number): Point2D {
    let point = this.obtenirPointDUneInstruction(instruction);
    point = point.redimensionnementHorizontal(pointReference, facteurHorizontal);
    return point.redimensionnementVertical(pointReference, facteurVertical);
  }

  redimensionnementInstructionArc(instruction: string, pointReference: Point2D,
                                  facteurHorizontal: number, facteurVertical: number, compteA: boolean): string {
    let res;
    const SEPARATEUR = ',';
    const RX = parseFloat(instruction);
    instruction = instruction.substr(instruction.indexOf(SEPARATEUR) + 2);
    const RY = parseFloat(instruction);
    instruction = instruction.substr(instruction.indexOf(SEPARATEUR) + 4);
    let x = parseFloat(instruction);
    instruction = instruction.substr(instruction.indexOf(ESPACE) + 1);
    let y = parseFloat(instruction);

    let rayon = new Point2D(RX, RY);
    let centre = new Point2D(x, y);

    rayon = rayon.redimensionnementHorizontal(pointReference, facteurHorizontal);
    rayon = rayon.redimensionnementVertical(pointReference, facteurVertical);

    centre = centre.redimensionnementHorizontal(pointReference, facteurHorizontal);
    centre = centre.redimensionnementVertical(pointReference, facteurVertical);

    if (!compteA) {
      res = rayon.getX() + ESPACE + SEPARATEUR + ESPACE + rayon.getY() + ESPACE + HEMI_ELLIPSE_GAUCHE
            + ESPACE + centre.getX() + ESPACE + centre.getY() + ESPACE;
    } else {
      res = rayon.getX() + ESPACE + SEPARATEUR + ESPACE + rayon.getY() + ESPACE + HEMI_ELLIPSE_DROITE
      + ESPACE + centre.getX() + ESPACE + centre.getY() + ESPACE;
    }
    return res;
  }

}
