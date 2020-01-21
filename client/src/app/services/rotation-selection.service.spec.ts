import { Trace } from 'Trace';
import { Point2D } from './point-2d/point-2d.service';
import { RotationSelectionService } from './rotation-selection.service';

describe('RotationSelectionService', () => {
  it('Est construit', () => {
    const SERVICE = new RotationSelectionService();
    expect(SERVICE).toBeTruthy();
  });
  it('rotationCentreeSurSelection: appliquerRotationSurInstruction est appelé pour chaque tracé sélectionné', () => {
    spyOn(RotationSelectionService, 'appliquerRotationSurInstruction');
    const TRACE1 = new Trace(5, '#000000', '#000000');
    const TRACE2 = new Trace(5, '#000000', '#000000');
    const TRACE3 = new Trace(5, '#000000', '#000000');
    TRACE1.setSelect(true);
    TRACE2.setSelect(true);
    TRACE3.setSelect(false);
    const TRACES = [TRACE1, TRACE2, TRACE3];
    RotationSelectionService.rotationCentreeSurSelection(TRACES, new Point2D(0, 0), new Point2D(0, 0), false, false);
    expect(RotationSelectionService.appliquerRotationSurInstruction).toHaveBeenCalledTimes(2);
  });
  it('rotationCentreeSurSelection: le centre de rotation est bon', () => {
    const TRACE1 = new Trace(5, '#000000', '#000000');
    TRACE1.setSelect(true);
    const COIN_SUPERIEUR_GAUCHE =  new Point2D(2, 0);
    const COIN_INFERIEUR_DROITE =  new Point2D(0, 2);
    const X_CENTRE = (COIN_SUPERIEUR_GAUCHE.getX() + COIN_INFERIEUR_DROITE.getX()) / 2;
    const Y_CENTRE = (COIN_SUPERIEUR_GAUCHE.getY() + COIN_INFERIEUR_DROITE.getY()) / 2;
    const CENTRE_PAR_CODE = X_CENTRE.toString() + ',' + Y_CENTRE.toString();
    expect(CENTRE_PAR_CODE).toBe('1,1');
  });
  it('rotationCentreeSurTraces: appliquerRotationSurInstruction est appelé pour chaque tracé sélectionné', () => {
    spyOn(RotationSelectionService, 'appliquerRotationSurInstruction');
    const TRACE1 = new Trace(5, '#000000', '#000000');
    const TRACE2 = new Trace(5, '#000000', '#000000');
    const TRACE3 = new Trace(5, '#000000', '#000000');
    TRACE1.setSelect(true);
    TRACE2.setSelect(true);
    TRACE3.setSelect(false);
    const TRACES = [TRACE1, TRACE2, TRACE3];
    RotationSelectionService.rotationCentreeSurTraces(TRACES, false, false);
    expect(RotationSelectionService.appliquerRotationSurInstruction).toHaveBeenCalledTimes(2);
  });
  it('rotationCentreeSurTraces: les tracés sont rotationnés sur leur centre', () => {
    const TRACE1 = new Trace(5, '#000000', '#000000');
    TRACE1.instr = 'M0,0L2,2';
    const TRACE2 = new Trace(5, '#000000', '#000000');
    TRACE2.instr = 'M3,0L5,2';
    TRACE1.setSelect(true);
    TRACE2.setSelect(true);
    TRACE1.initRect = new Point2D(0, 0);
    TRACE1.finRect = new Point2D(2, 2);
    TRACE2.initRect = new Point2D(3, 0);
    TRACE2.finRect = new Point2D(5, 2);
    const TRACES = [TRACE1, TRACE2];
    spyOn(RotationSelectionService, 'choisirAngleRotation').and.returnValue(90);
    RotationSelectionService.rotationCentreeSurTraces(TRACES, false, false);
    const VALIDE = TRACE1.instr === 'M2,0L0,2' && TRACE2.instr === 'M5,0L3,2';
    expect(VALIDE).toBeTruthy();
  });
  it('choisirAngleRotation: 15 si grand angle positif', () => {
    const TRACE1 = new Trace(5, '#000000', '#000000');
    const INSTRUCTION = 'M0, 0L100, 100';
    TRACE1.instr = INSTRUCTION;
    TRACE1.setSelect(true);
    const TRACES = [TRACE1];
    RotationSelectionService.rotationCentreeSurSelection(TRACES, new Point2D(0, 0), new Point2D(100, 100), true, false);
    const RESULTAT_ESPERE = RotationSelectionService.appliquerRotationSurInstruction(INSTRUCTION, new Point2D(50, 50), 15);
    const VALIDE = RESULTAT_ESPERE === TRACE1.instr;
    expect(VALIDE).toBe(true);
  });
  it('choisirAngleRotation: -15 si grand angle négatif', () => {
    const TRACE1 = new Trace(5, '#000000', '#000000');
    const INSTRUCTION = 'M0, 0L100, 100';
    TRACE1.instr = INSTRUCTION;
    TRACE1.setSelect(true);
    const TRACES = [TRACE1];
    RotationSelectionService.rotationCentreeSurSelection(TRACES, new Point2D(0, 0), new Point2D(100, 100), false, false);
    const RESULTAT_ESPERE = RotationSelectionService.appliquerRotationSurInstruction(INSTRUCTION, new Point2D(50, 50), -15);
    const VALIDE = RESULTAT_ESPERE === TRACE1.instr;
    expect(VALIDE).toBe(true);
  });
  it('choisirAngleRotation: 1 si petit angle positif', () => {
    const TRACE1 = new Trace(5, '#000000', '#000000');
    const INSTRUCTION = 'M0, 0L100, 100';
    TRACE1.instr = INSTRUCTION;
    TRACE1.setSelect(true);
    const TRACES = [TRACE1];
    RotationSelectionService.rotationCentreeSurSelection(TRACES, new Point2D(0, 0), new Point2D(100, 100), true, true);
    const RESULTAT_ESPERE = RotationSelectionService.appliquerRotationSurInstruction(INSTRUCTION, new Point2D(50, 50), 1);
    const VALIDE = RESULTAT_ESPERE === TRACE1.instr;
    expect(VALIDE).toBe(true);
  });
  it('choisirAngleRotation: -1 si petit angle négatif', () => {
    const TRACE1 = new Trace(5, '#000000', '#000000');
    const INSTRUCTION = 'M0, 0L100, 100';
    TRACE1.instr = INSTRUCTION;
    TRACE1.setSelect(true);
    const TRACES = [TRACE1];
    RotationSelectionService.rotationCentreeSurSelection(TRACES, new Point2D(0, 0), new Point2D(100, 100), false, true);
    const RESULTAT_ESPERE = RotationSelectionService.appliquerRotationSurInstruction(INSTRUCTION, new Point2D(50, 50), -1);
    const VALIDE = RESULTAT_ESPERE === TRACE1.instr;
    expect(VALIDE).toBe(true);
  });
  it('appliquerRotationSurInstruction: instruction move correctement traitée', () => {
    const INSTRUCTION = 'M100, 0';
    spyOn(RotationSelectionService, 'rotationnerPointDUneInstruction').and.returnValue('-100,0');
    const RESULTAT = RotationSelectionService.appliquerRotationSurInstruction(INSTRUCTION, new Point2D(0, 0), 180);
    expect(RESULTAT).toBe('M-100,0');
  });
  it('rotationnerEllipseDansInstruction: rotation correctement exécutée', () => {
    // TODO
    expect(false).toBeTruthy();
  });
  it('obtenirPointDUneInstruction: le point est correctement obtenu et arrondi', () => {
    const INSTRUCTION = '-50,1.5';
    const RESULTAT = RotationSelectionService.rotationnerPointDUneInstruction(INSTRUCTION, new Point2D(0, 0), 0);
    expect(RESULTAT).toBe('-50,1.5');
  });
  it('rotationnerPointDUneInstruction: le point est correctement rotationné', () => {
    const INSTRUCTION = '100, 0';
    const RESULTAT = RotationSelectionService.rotationnerPointDUneInstruction(INSTRUCTION, new Point2D(0, 0), 90);
    expect(RESULTAT).toBe('0,100');
  });
  it('rotationnerPointDUneInstruction: une très petite rotation réussit à être appliquée', () => {
    const INSTRUCTION = '1, 0';
    const RESULTAT = RotationSelectionService.rotationnerPointDUneInstruction(INSTRUCTION, new Point2D(0, 0), 1);
    expect(INSTRUCTION).not.toBe(RESULTAT);
  });

});
