import { Trace } from 'Trace';
import { Point2D } from './point-2d/point-2d.service';
import { RedimensionnementSelectionService } from './redimensionnement-selection.service';
import { TracesService } from './traces.service';

describe('RedimensionnementSelectionService', () => {
  let service: RedimensionnementSelectionService;
  const TRACES_DANS_CANVAS = TracesService.Instance.traces;

  beforeEach(() => {
    service = new RedimensionnementSelectionService();
    while (TRACES_DANS_CANVAS.length !== 0) {
      TRACES_DANS_CANVAS.pop();
    }
  });

  it('Est construit', () => {
    expect(service).toBeTruthy();
  });
  it('InitialiserRedimensionnement: seuls les tracés sélectionnés sont copiés', () => {
    const TRACE1 = new Trace(5, '#000000', '#000000');
    const TRACE2 = new Trace(5, '#000000', '#000000');
    const TRACE3 = new Trace(5, '#000000', '#000000');
    TRACE1.setSelect(true);
    TRACE2.setSelect(true);
    TRACE3.setSelect(false);
    TRACES_DANS_CANVAS.push(TRACE1, TRACE2, TRACE3);
    service.initialiserRedimensionnement(new Point2D(0, 0), new Point2D(0, 0));
    expect(TRACES_DANS_CANVAS.length).toBe(5);
  });
  it('InitialiserRedimensionnement: les tracés originaux sont désélectionnés', () => {
    const TRACE1 = new Trace(5, '#000000', '#000000');
    const TRACE2 = new Trace(5, '#000000', '#000000');
    TRACE1.setSelect(true);
    TRACE2.setSelect(true);
    TRACES_DANS_CANVAS.push(TRACE1, TRACE2);
    service.initialiserRedimensionnement(new Point2D(0, 0), new Point2D(0, 0));
    const VALIDE = !TRACE1.getSelect() && !TRACE2.getSelect();
    expect(VALIDE).toBe(true);
  });
  it('InitialiserRedimensionnement: les copies de tracés sont sélectionnées', () => {
    const TRACE1 = new Trace(5, '#000000', '#000000');
    const TRACE2 = new Trace(5, '#000000', '#000000');
    TRACE1.setSelect(true);
    TRACE2.setSelect(true);
    TRACES_DANS_CANVAS.push(TRACE1, TRACE2);
    service.initialiserRedimensionnement(new Point2D(0, 0), new Point2D(0, 0));
    const VALIDE = TRACES_DANS_CANVAS[2].getSelect() && TRACES_DANS_CANVAS[3].getSelect();
    expect(VALIDE).toBe(true);
  });
  it('effectuerRedimensionnement: redimensionnementSurInstruction est appelée pour chaque tracés sélectionnés', () => {
    const TRACE1 = new Trace(5, '#000000', '#000000');
    const TRACE2 = new Trace(5, '#000000', '#000000');
    const TRACE3 = new Trace(5, '#000000', '#000000');
    TRACE1.setSelect(true);
    TRACE2.setSelect(true);
    TRACE3.setSelect(false);
    TRACES_DANS_CANVAS.push(TRACE1, TRACE2, TRACE3);
    spyOn(service, 'redimensionnementSurInstruction');
    service.initialiserRedimensionnement(new Point2D(0, 0), new Point2D(2, 2));
    service.effectuerRedimensionnement(new Point2D(5, 5), false, false);
    expect(service.redimensionnementSurInstruction).toHaveBeenCalledTimes(2);
  });
  it('effectuerRedimensionnement: les instructions des tracés de l\'aperçu sont changés', () => {
    const TRACE1 = new Trace(5, '#000000', '#000000');
    const TRACE2 = new Trace(5, '#000000', '#000000');
    const TRACE3 = new Trace(5, '#000000', '#000000');
    TRACE1.setSelect(true);
    TRACE2.setSelect(true);
    TRACE3.setSelect(false);
    TRACES_DANS_CANVAS.push(TRACE1, TRACE2, TRACE3);
    const INSTRUCTION_CHANGEE = 'instruction changée';
    spyOn(service, 'redimensionnementSurInstruction').and.returnValue(INSTRUCTION_CHANGEE);
    service.initialiserRedimensionnement(new Point2D(0, 0), new Point2D(2, 2));
    service.effectuerRedimensionnement(new Point2D(5, 5), false, false);
    const VALIDE = TRACES_DANS_CANVAS[3].instr === INSTRUCTION_CHANGEE && TRACES_DANS_CANVAS[4].instr === INSTRUCTION_CHANGEE;
    expect(VALIDE).toBeTruthy();
  });
  it('effectuerRedimensionnement: la plus petit facteur de redimensionnement (valeur absolue) est utilisé si shift est appuyé', () => {
    const TRACE1 = new Trace(5, '#000000', '#000000');
    TRACE1.setSelect(true);
    TRACE1.instr = 'M1,1';
    TRACES_DANS_CANVAS.push(TRACE1);
    service.initialiserRedimensionnement(new Point2D(1, 1), new Point2D(0, 0));
    service.effectuerRedimensionnement(new Point2D(-100, 20), true, false);
    service.redimensionnementFini();
    expect(TRACES_DANS_CANVAS[TRACES_DANS_CANVAS.length - 1].instr).toBe('M-20,20');
  });

  it('effectuerRedimensionnement: alt appuyé, alors le redimensionnement se fait par rapport au centre du tracé', () => {
    const TRACE1 = new Trace(5, '#000000', '#000000');
    TRACE1.setSelect(true);
    TRACE1.instr = 'M1,1L-1,-1';
    TRACES_DANS_CANVAS.push(TRACE1);
    // centre tracé en (0,0)
    service.initialiserRedimensionnement(new Point2D(1, 1), new Point2D(-1, -1));
    service.effectuerRedimensionnement(new Point2D(2, 2), false, true);
    service.redimensionnementFini();
    expect(TRACES_DANS_CANVAS[TRACES_DANS_CANVAS.length - 1].instr).toBe('M2,2L-2,-2');
  });

  it('effectuerRedimensionnement: division par 0 corrigée dans le calcul de facteur', () => {
    const TRACE1 = new Trace(5, '#000000', '#000000');
    TRACE1.setSelect(true);
    TRACES_DANS_CANVAS.push(TRACE1);
    let valide = true;
    service.initialiserRedimensionnement(new Point2D(0, 0), new Point2D(0, 0));
    try {
      service.effectuerRedimensionnement(new Point2D(0, 0), false, false);
    } catch {
      valide = false;
    }
    expect(valide).toBeTruthy();
  });

  it('redimensionnementSurInstruction: une instruction move est redimensionnée correctement', () => {
    const INSTRUCTION = 'M2,0';
    const REFERENCE = new Point2D(1, 1);
    const FACTEUR_HORIZONTAL = 2;
    const FACTEUR_VERTICAL = -3;
    spyOn(service, 'redimensionnerPointDUneInstruction').and.returnValue(new Point2D(3, 2));
    const RESULTAT = service.redimensionnementSurInstruction(INSTRUCTION, REFERENCE, FACTEUR_HORIZONTAL, FACTEUR_VERTICAL);
    expect(RESULTAT).toBe('M3,2');
  });
  it('redimensionnementSurInstruction: une instruction ligne est redimensionnée correctement', () => {
    const INSTRUCTION = 'L2,0';
    const REFERENCE = new Point2D(1, 1);
    const FACTEUR_HORIZONTAL = 2;
    const FACTEUR_VERTICAL = -3;
    spyOn(service, 'redimensionnerPointDUneInstruction').and.returnValue(new Point2D(3, 2));
    const RESULTAT = service.redimensionnementSurInstruction(INSTRUCTION, REFERENCE, FACTEUR_HORIZONTAL, FACTEUR_VERTICAL);
    expect(RESULTAT).toBe('L3,2');
  });
  it('redimensionnementSurInstruction: une instruction arc est redimensionnée correctement', () => {
    spyOn(service, 'redimensionnementInstructionArc');
    const INSTRUCTION = 'A41 , 41 0 0, 1 149 268';
    service.redimensionnementSurInstruction(INSTRUCTION, new Point2D(0, 0), 4, 5);
    expect(service.redimensionnementInstructionArc).toHaveBeenCalled();
  });
  it('redimensionnementFini: les tracés sélectionnés originaux sont enlevés', () => {
    const TRACE1 = new Trace(5, '#000000', '#000000');
    const TRACE2 = new Trace(5, '#000000', '#000000');
    const TRACE3 = new Trace(5, '#000000', '#000000');
    TRACE1.setSelect(true);
    TRACE2.setSelect(true);
    TRACE3.setSelect(false);
    TRACES_DANS_CANVAS.push(TRACE1, TRACE2, TRACE3);
    service.initialiserRedimensionnement(new Point2D(0, 0), new Point2D(2, 2));
    service.redimensionnementFini();
    const VALIDE = TRACES_DANS_CANVAS.indexOf(TRACE1) === -1 && TRACES_DANS_CANVAS.indexOf(TRACE2) === -1
                   && TRACES_DANS_CANVAS.indexOf(TRACE3) !== -1;
    expect(VALIDE).toBe(true);
  });
  it('redimensionnementFini: les tracés présents dans le tableau sont les tracés redimensionnés', () => {
    const TRACE1 = new Trace(5, '#000000', '#000000');
    const TRACE2 = new Trace(5, '#000000', '#000000');
    TRACE1.instr = 'M1,1';
    TRACE2.instr = 'L1,1';
    TRACE1.setSelect(true);
    TRACE2.setSelect(true);
    TRACES_DANS_CANVAS.push(TRACE1, TRACE2);
    service.initialiserRedimensionnement(new Point2D(0, 0), new Point2D(1, 1));
    service.effectuerRedimensionnement(new Point2D(2, 3), false, false);
    service.redimensionnementFini();
    let valide = true;
    TRACES_DANS_CANVAS.forEach((trace) => {
      if (!trace.getSelect()) {
        valide = false;
      }
    });
    expect(valide).toBe(true);
  });

  it('redimensionnerPointDUneInstruction: les redimensionnement se font bien', () => {
    const INSTRUCTION = '2,0';
    const REFERENCE = new Point2D(1, 1);
    const FACTEUR_HORIZONTAL = 2;
    const FACTEUR_VERTICAL = -3;
    const RESULTAT = service.redimensionnerPointDUneInstruction(INSTRUCTION, REFERENCE, FACTEUR_HORIZONTAL, FACTEUR_VERTICAL);
    const VALIDE = RESULTAT.getX() === 3 && RESULTAT.getY() === 4;
    expect(VALIDE).toBe(true);
  });
});
