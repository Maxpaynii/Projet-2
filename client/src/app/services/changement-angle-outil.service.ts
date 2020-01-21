import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ChangementAngleOutilService {
  static appliquerChangementAngle(angleInitial: number, changementPositif: boolean, petitChangementAngle: boolean): number {
    const PETIT_CHANGEMENT_ANGLE = 1;
    const GRAND_CHANGEMENT_ANGLE = 15;
    const DEGRES_PAR_CYCLE = 360;

    const CHANGEMENT_ANGLE = petitChangementAngle ? PETIT_CHANGEMENT_ANGLE : GRAND_CHANGEMENT_ANGLE;
    let angleFinal = changementPositif ? angleInitial + CHANGEMENT_ANGLE : angleInitial - CHANGEMENT_ANGLE;
    angleFinal += DEGRES_PAR_CYCLE;
    return angleFinal %= DEGRES_PAR_CYCLE;
  }
}
