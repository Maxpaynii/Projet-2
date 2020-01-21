import { Trace } from 'Trace';
import { EffaceService } from './efface.service';
import { Point2D } from './point-2d/point-2d.service';

describe('EffaceService', () => {
  let efface: EffaceService;
  let tracesDansCanvas: Trace[];
  let tracesEffaces: Trace[];
  let tracesEffaces2: Trace[];
  let signaux: string[];
  beforeEach(() => {
    efface = new EffaceService();
    tracesEffaces = [];
    tracesEffaces2 = [];
    tracesDansCanvas = [];
    signaux = [];
    efface.tracesEffaces = tracesEffaces;
    efface.tracesEffaces2 = tracesEffaces2;
    efface.signauxEfface = signaux;
  });

  it('Le constructeur fonctionne', () => {
    expect(efface).toBeTruthy();
  });

  it('gereClic: effacerPremierTrace appelé', () => {
    spyOn(efface, 'effacerPremierTrace');
    efface.gereClic(tracesDansCanvas, 0, 0, 5);
    expect(efface.effacerPremierTrace).toHaveBeenCalled();
  });
  it('gereGlisse: la méthode retirerTraces est appelée si clic actif', () => {
    spyOn(efface, 'retirerTraces');
    efface.gereGlisse(tracesDansCanvas, 0, 0, true, 5);
    expect(efface.retirerTraces).toHaveBeenCalled();
  });
  it('gereGlisse: la méthode trouverPremierTrace est appelée si clic pas actif', () => {
    spyOn(efface, 'trouverPremierTrace');
    efface.gereGlisse(tracesDansCanvas, 0, 0, false, 5);
    expect(efface.trouverPremierTrace).toHaveBeenCalled();
  });
  it('gereDeclic: le tableau de tracés effacés est retourné', () => {
    const VALIDE = efface.gereDeclic() === tracesEffaces;
    expect(VALIDE).toBeTruthy();
  });
  it('gereDeclic2: le tableau de tracés effacés 2 est retourné', () => {
    const VALIDE = efface.gereDeclic2() === tracesEffaces2;
    expect(VALIDE).toBeTruthy();
  });
  it('gereSignaux: le tableau de signaux est retourné', () => {
    const VALIDE = efface.gereSignaux() === signaux;
    expect(VALIDE).toBeTruthy();
  });
  it('trouverPremierTrace: un tracé est trouvé, il est alors sauvegardé', () => {
    const TRACE = new Trace(5, '#000000', '#000000');
    spyOn(efface, 'traceClique').and.returnValue(true);
    tracesDansCanvas.push(TRACE);
    efface.trouverPremierTrace(tracesDansCanvas, 0, 0, 5);
    const VALIDE = efface.traceAEffacer === TRACE;
    expect(VALIDE).toBeTruthy();
  });
  it('trouverPremierTrace: un tracé n\'est pas trouvé, traceAEffacer = undefined', () => {
    efface.traceAEffacer = new Trace(5, '#000000', '#000000');
    efface.trouverPremierTrace(tracesDansCanvas, 0, 0, 5); // Rien dans canvas, aucune détection
    const VALIDE = efface.traceAEffacer === undefined;
    expect(VALIDE).toBeTruthy();
  });
  it('trouverPremierTrace: s\'il y a remplacement du tracé à effacer, la couleur est restaurée', () => {
    spyOn(efface, 'restaurerTraceAEfface');
    efface.trouverPremierTrace(tracesDansCanvas, 0, 0, 5);
    expect(efface.restaurerTraceAEfface).toHaveBeenCalled();
  });
  it('restaurerTraceAEfface: la couleur est bien restaurée', () => {
    const TRACE_A_EFFACER = new Trace(5, '#000000', '#FF0000');
    efface.traceAEffacer = TRACE_A_EFFACER;
    efface.couleurOriginalTraceAEffacer = '#FFFFFF';
    efface.restaurerTraceAEfface();
    expect(TRACE_A_EFFACER.couleurS).toBe('#FFFFFF');
  });
  it('sauvegarderTraceAEfface: la couleur est bien sauvegardée', () => {
    const TRACE_A_EFFACER = new Trace(5, '#000000', '#FFFFFF');
    efface.sauvegarderTraceAEfface(TRACE_A_EFFACER);
    expect(efface.couleurOriginalTraceAEffacer).toBe('#FFFFFF');
  });
  it('sauvegarderTraceAEfface: la couleur du tracé est mise à rouge vif', () => {
    const TRACE_A_EFFACER = new Trace(5, '#000000', '#FFFFFF');
    efface.sauvegarderTraceAEfface(TRACE_A_EFFACER);
    expect(TRACE_A_EFFACER.couleurS).toBe('#FF0000');
  });
  it('sauvegarderTraceAEfface: le tracé est mis en mémoire', () => {
    const TRACE_A_EFFACER = new Trace(5, '#000000', '#FFFFFF');
    efface.sauvegarderTraceAEfface(TRACE_A_EFFACER);
    const VALIDE = TRACE_A_EFFACER === efface.traceAEffacer;
    expect(VALIDE).toBeTruthy();
  });
  it('effacerPremierTrace: le tracé est enlevé du canvas', () => {
    const TRACE = new Trace(5, '#000000', '#FF0000');
    tracesDansCanvas.push(TRACE);
    efface.traceAEffacer = TRACE;
    efface.couleurOriginalTraceAEffacer = '#FFFFFF';
    efface.effacerPremierTrace(tracesDansCanvas, 0, 0, 5);
    expect(tracesDansCanvas.length).toBe(0);
  });
  it('effacerPremierTrace: le tracé est ajouté dans la liste de tracés effacés du clic courant', () => {
    const TRACE = new Trace(5, '#000000', '#FF0000');
    tracesDansCanvas.push(TRACE);
    efface.traceAEffacer = TRACE;
    efface.couleurOriginalTraceAEffacer = '#FFFFFF';
    efface.effacerPremierTrace(tracesDansCanvas, 0, 0, 5);
    expect(efface.tracesEffaces.length).toBe(1);
  });
  it('retirerTraces: les tracés sont enlevés du canvas', () => {
    spyOn(efface, 'traceClique').and.returnValue(true);
    const TRACE = new Trace(5, '#000000', '#FFFFFF');
    tracesDansCanvas.push(TRACE);
    efface.retirerTraces(tracesDansCanvas, 0, 0, 5);
    expect(tracesDansCanvas.length).toBe(0);
  });
  it('effacerTraces: les tracés sont ajoutés au tracés effacés au cours d\'un clic', () => {
    spyOn(efface, 'traceClique').and.returnValue(true);
    const TRACE = new Trace(5, '#000000', '#FFFFFF');
    tracesDansCanvas.push(TRACE);
    efface.retirerTraces(tracesDansCanvas, 0, 0, 5);
    expect(efface.tracesEffaces2.length).toBe(1);
  });
  it('traceClique: le traitement d\'une instruction move fonctionne', () => {
    const TRACE = new Trace(5, '#000000', '#FFFFFF');
    TRACE.instr = 'M 100, 100';
    spyOn(efface, 'obtenirPointDUneInstruction');
    efface.traceClique(TRACE, 0, 0, 5);
    expect(efface.obtenirPointDUneInstruction).toHaveBeenCalled();
  });

  it('traceClique: le traitement d\'une instruction ligne fonctionne', () => {
    const TRACE = new Trace(5, '#000000', '#FFFFFF');
    TRACE.instr = 'L 100, 100';
    spyOn(efface, 'ligneSelectionnee');
    efface.traceClique(TRACE, 0, 0, 5);
    expect(efface.ligneSelectionnee).toHaveBeenCalled();
  });
  it('traceClique: retourne vrai si ligneSelectionnee retourne vrai', () => {
    const TRACE = new Trace(5, '#000000', '#FFFFFF');
    TRACE.instr = 'L 100, 100';
    spyOn(efface, 'ligneSelectionnee').and.returnValue(true);
    expect(efface.traceClique(TRACE, 0, 0, 5)).toBeTruthy();
  });
  it('traceClique: le traitement d\'une instruction arc fonctionne', () => {
    const TRACE = new Trace(5, '#000000', '#FFFFFF');
    TRACE.instr = 'A 100, 100';
    spyOn(efface, 'arcSelectionne');
    efface.traceClique(TRACE, 0, 0, 5);
    expect(efface.arcSelectionne).toHaveBeenCalled();
  });
  it('traceClique: retourne vrai si arcSelectionnee retourne vrai', () => {
    const TRACE = new Trace(5, '#000000', '#FFFFFF');
    TRACE.instr = 'A 100, 100';
    spyOn(efface, 'arcSelectionne').and.returnValue(true);
    expect(efface.traceClique(TRACE, 0, 0, 5)).toBeTruthy();
  });
  it('traceClique: retourne faux si aucune sous-fonction ne retourne vrai', () => {
    const TRACE = new Trace(5, '#000000', '#FFFFFF');
    TRACE.instr = 'A 100, 100L 100, 100';
    spyOn(efface, 'arcSelectionne').and.returnValue(false);
    spyOn(efface, 'ligneSelectionnee').and.returnValue(false);
    expect(efface.traceClique(TRACE, 0, 0, 5)).toBeFalsy();
  });
  it('ligneSelectionee: retourne faux si X trop bas ou trop élevé', () => {
    const INSTRUCTION = '100, 0';
    const POSITION_COURANTE = new Point2D(0, 0);
    const EPAISSEUR = 5;
    expect(efface.ligneSelectionnee(INSTRUCTION, 200, 0, POSITION_COURANTE, EPAISSEUR)).toBeFalsy();
  });
  it('ligneSelectionee: X et Y dans l\'intervale voulu, retourne faux si X de position de l\'instuction === X de position courante', () => {
    const INSTRUCTION = '100, 0';
    const POSITION_COURANTE = new Point2D(100, 100);
    const EPAISSEUR = 5;
    expect(efface.ligneSelectionnee(INSTRUCTION, 100, 50, POSITION_COURANTE, EPAISSEUR)).toBeTruthy();
  });
  it('ligneSelectionee: X et Y dans l\'intervale voulu, retourne vrai si la position du curseur fait partie de la ligne', () => {
    const INSTRUCTION = '100, 0';
    const POSITION_COURANTE = new Point2D(0, 100);
    const EPAISSEUR = 1;
    expect(efface.ligneSelectionnee(INSTRUCTION, 50, 50, POSITION_COURANTE, EPAISSEUR)).toBeTruthy();
  });

  it('obtenirPointDUneInstruction: retourne les bonne valeurs de X et Y', () => {
    const INSTRUCTION = '100.5, 99.5';
    const POINT = efface.obtenirPointDUneInstruction(INSTRUCTION);
    const VALIDE = POINT.getX() === 100.5 && POINT.getY() === 99.5;
    expect(VALIDE).toBeTruthy();
  });

});
