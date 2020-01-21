import { Injectable } from '@angular/core';
import { Trace } from 'Trace';
import { Point2D } from './point-2d/point-2d.service';

const INSTRUCTION_MOVE = 'M';
const INSTRUCTION_LIGNE = 'L';
const INSTRUCTION_ARC = 'A';

const SEPARATEUR_COORDONNEES = ',';

@Injectable({
  providedIn: 'root',
})
export class RotationSelectionService {

  static rotationCentreeSurSelection(tracesDansCanvas: Trace[], coinSuperieurGauche: Point2D, coinInferieurDroite: Point2D,
                                     angleRotationPositif: boolean, petiteRotation: boolean): void {
    const ANGLE_ROTATION = this.choisirAngleRotation(angleRotationPositif, petiteRotation);
    const X_CENTRE = (coinSuperieurGauche.getX() + coinInferieurDroite.getX()) / 2;
    const Y_CENTRE = (coinSuperieurGauche.getY() + coinInferieurDroite.getY()) / 2;
    const CENTRE = new Point2D (X_CENTRE, Y_CENTRE);
    tracesDansCanvas.forEach((trace) => {
      if (trace.getSelect()) {
        trace.instr =  this.appliquerRotationSurInstruction(trace.instr, CENTRE, ANGLE_ROTATION);
      }
    });
  }
  static rotationCentreeSurTraces(tracesDansCanvas: Trace[], angleRotationPositif: boolean, petiteRotation: boolean): void {
    const ANGLE_ROTATION = this.choisirAngleRotation(angleRotationPositif, petiteRotation);
    tracesDansCanvas.forEach((trace) => {
      if (trace.getSelect()) {
        trace.instr =  this.appliquerRotationSurInstruction(trace.instr, trace.getCentre(), ANGLE_ROTATION);
      }
    });
  }

  static choisirAngleRotation(angleRotationPositif: boolean, petiteRotation: boolean): number {
    const GRAND_ANGLE = 15;
    const PETIT_ANGLE = 1;
    let angle = petiteRotation ? PETIT_ANGLE : GRAND_ANGLE;
    if (!angleRotationPositif) {
      angle *= -1;
    }
    return angle;
  }
  static appliquerRotationSurInstruction(instruction: string, centreRotation: Point2D, angleRotation: number): string {
    let instructionRotationnee = '';
    while (instruction !== '') {
      const TYPE_INSTRUCTION: string = instruction[0];
      instruction = instruction.substr(1);
      switch (TYPE_INSTRUCTION) {
        case INSTRUCTION_MOVE: {
          instructionRotationnee += (INSTRUCTION_MOVE + this.rotationnerPointDUneInstruction(instruction, centreRotation, angleRotation));
          break;
        }
        case INSTRUCTION_LIGNE: {
          instructionRotationnee += (INSTRUCTION_LIGNE + this.rotationnerPointDUneInstruction(instruction, centreRotation, angleRotation));
          break;
        }
        case INSTRUCTION_ARC: {
          instructionRotationnee += this.rotationnerEllipseDansInstruction(instruction, centreRotation, angleRotation);
          break;
        }
      }
    }
    return instructionRotationnee;
  }

  private static rotationnerEllipseDansInstruction(instruction: string, centreRotation: Point2D, angleRotation: number): string {
    // TODO: ça va être compliqué
    return instruction;
  }
  private static obtenirPointDUneInstruction(instruction: string): Point2D {

    const X = parseFloat(instruction);
    instruction = instruction.substr(instruction.indexOf(SEPARATEUR_COORDONNEES) + 1);

    const Y = parseFloat(instruction);
    return new Point2D(X, Y);
  }
  static rotationnerPointDUneInstruction(instruction: string, centreRotation: Point2D, angleRotation: number): string {
    const POINT_INITIAL = this.obtenirPointDUneInstruction(instruction);
    const POINT_ROTATIONNE = POINT_INITIAL.rotationAutourDUnPoint(centreRotation, angleRotation);
    return POINT_ROTATIONNE.getX().toString() + SEPARATEUR_COORDONNEES + POINT_ROTATIONNE.getY().toString();
  }
}
