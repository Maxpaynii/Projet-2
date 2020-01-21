
/*import { PressePapierService } from './presse-papier.service';
import { Trace } from 'Trace';
import { TracesService } from './traces.service';

describe('PressePapierService', () => {
  let pressePapier = new PressePapierService(TracesService.Instance);
  const TABLEAU_TRACES = TracesService.Instance.traces;
  beforeEach(() => {
    while (TABLEAU_TRACES.length !== 0) {
      TABLEAU_TRACES.pop();
    }
    pressePapier = new PressePapierService(TracesService.Instance);
  });

  it('Est construit', () => {
    const VALIDE = pressePapier !== undefined;
    expect(VALIDE).toBeTruthy();
  });
  it('Copier met les tracés sélectionnés dans tracesAColler', () => {
    const TRACE = new Trace(5, '#000000', '#FFFFFF');
    TRACE.setSelect(true);
    TABLEAU_TRACES.push(TRACE);
    pressePapier.copier();
    expect(pressePapier.estVide()).toBeFalsy();
  });
  it('Copier ne met pas les tracés non-sélectionnés dans tracesAColler', () => {
    const TRACE = new Trace(5, '#000000', '#FFFFFF');
    TRACE.setSelect(false);
    TABLEAU_TRACES.push(TRACE);
    pressePapier.copier();
    expect(pressePapier.estVide()).toBeTruthy();
  });
  it('CopierUnTrace copie bien les attribut d\'un tracé', () => {
    const TRACE = new Trace(5, '#000000', '#FFFFFF');
    TRACE.setSelect(true);
    TABLEAU_TRACES.push(TRACE);
    pressePapier.copier();
    pressePapier.coller();
    const COPIE = TABLEAU_TRACES[0];
    const VALIDE = TRACE.epaisseur === COPIE.epaisseur &&
                   TRACE.pointille === COPIE.pointille &&
                   TRACE.couleurP === COPIE.couleurP &&
                   TRACE.couleurS === COPIE.couleurS;
    expect(VALIDE).toBeTruthy();
  });

  it('Le décalage se fait pour coller', () => {
<<<<<<< HEAD
<<<<<<< HEAD
    // TODO: faire le test
    pressePapier.nombreCopies = -1;
    pressePapier.coller();
    expect(pressePapier.nombreCopies).toEqual(0);
  });

  it('Le décalage se fait pour dupliquer', () => {
    // TODO: faire le test
    pressePapier.nombreDuplications = -1;
    pressePapier.dupliquer();
    expect(pressePapier.nombreCopies).toEqual(0);
=======
=======
>>>>>>> c54f2b51d021eafc9e5e6898c3fe39122ed0a236
    const TRACE1 = new Trace(5, '#000000', '#FFFFFF');
    TRACE1.setSelect(true);
    TRACE1.instr = 'M0,0L15,15';
    TABLEAU_TRACES.push(TRACE1);
    pressePapier.copier();
    pressePapier.coller();
    const NOUVEAU_INSTR = TABLEAU_TRACES[1].instr;
    expect(NOUVEAU_INSTR).toBe('M30,30L45,45');
  });
  it('Le décalage 2 fois plus grand se fait pour coller 2me fois', () => {
    const TRACE1 = new Trace(5, '#000000', '#FFFFFF');
    TRACE1.setSelect(true);
    TRACE1.instr = 'M0,0L15,15';
    TABLEAU_TRACES.push(TRACE1);
    pressePapier.copier();
    pressePapier.coller();
    pressePapier.coller();
    const NOUVEAU_INSTR = TABLEAU_TRACES[2].instr;
    expect(NOUVEAU_INSTR).toBe('M60,60L75,75');
  });
  it('Le décalage ne se fait pas pour la premiere duplication', () => {
    const TRACE1 = new Trace(5, '#000000', '#FFFFFF');
    TRACE1.setSelect(true);
    TRACE1.instr = 'M0,0L15,15';
    TABLEAU_TRACES.push(TRACE1);
    pressePapier.dupliquer();
    const NOUVEAU_INSTR = TABLEAU_TRACES[1].instr;
    expect(NOUVEAU_INSTR).toBe('M0,0L15,15');
  });
  it('Le décalage se fait pour la deuxième duplication', () => {
    const TRACE1 = new Trace(5, '#000000', '#FFFFFF');
    TRACE1.setSelect(true);
    TRACE1.instr = 'M0,0L15,15';
    TABLEAU_TRACES.push(TRACE1);
    pressePapier.dupliquer();
    pressePapier.dupliquer();
    const NOUVEAU_INSTR = TABLEAU_TRACES[2].instr;
    expect(NOUVEAU_INSTR).toBe('M30,30L45,45');
  });
  it('dupliquer copie directement les tracés sélectionnés', () => {
    const TRACE1 = new Trace(5, '#000000', '#FFFFFF');
    TRACE1.setSelect(true);
    const TRACE2 = new Trace(5, '#000000', '#FFFFFF');
    TRACE2.setSelect(true);
    const TRACE3 = new Trace(5, '#000000', '#FFFFFF');
    TRACE3.setSelect(false);
    TABLEAU_TRACES.push(TRACE1, TRACE2, TRACE3);
    pressePapier.dupliquer();
    expect(TABLEAU_TRACES.length).toBe(5);
  });
  it('dupliquer supprime seulement les tracés sélectionnés', () => {
    const TRACE1 = new Trace(5, '#000000', '#FFFFFF');
    TRACE1.setSelect(true);
    const TRACE2 = new Trace(5, '#000000', '#FFFFFF');
    TRACE2.setSelect(true);
    const TRACE3 = new Trace(5, '#000000', '#FFFFFF');
    TRACE3.setSelect(false);
    TABLEAU_TRACES.push(TRACE1, TRACE2, TRACE3);
    pressePapier.supprimer();
    expect(TABLEAU_TRACES.length).toBe(1);
  });
  it('devrait retourner l\'ellipse avec un decalage dans les coordonnees d\'interet', () => {
    let ellipseOrig = "M181,71M311.5,71 A130.5 , 86 0 0, 1 311.5 243 M311.5,71 A130.5 , 86 0 0, 0 311.5 243 M181,71";
    const RES = pressePapier.translationInstr(ellipseOrig, 1);
    expect(RES).toEqual("M241,131 M371.5,131 A130.5 , 86 0 0, 1 371.5 303 M371.5,131 A130.5 , 86 0 0, 0 371.5 303 M241,131 ");
  });
  it('devrait retourner la ligne avec un decalage dans les coordonnees d\'interet', () => {
    let ligneOrig = "M173,63L216,59M216,59L265,53M265,53L309,51M309,51L358,55M358,55L389,60M389,60L413,71M413,71L437,86M437,86L461,103M461,103L489,131M489,131L507,158M507,158L526,180M526,180L540,199M540,199L564,236M564,236L577,255M577,255L587,268M587,268L602,281M602,281L623,288M623,288L637,286M637,286L657,279M657,279L693,265M693,265L740,240M740,240L774,219M774,219L802,201M802,201L820,188M820,188L822,186M822,186";
    const RES = pressePapier.translationInstr(ligneOrig, 1);
    expect(RES).toEqual("M233,123 L276,119 M276,119 L325,113 M325,113 L369,111 M369,111 L418,115 M418,115 L449,120 M449,120 L473,131 M473,131 L497,146 M497,146 L521,163 M521,163 L549,191 M549,191 L567,218 M567,218 L586,240 M586,240 L600,259 M600,259 L624,296 M624,296 L637,315 M637,315 L647,328 M647,328 L662,341 M662,341 L683,348 M683,348 L697,346 M697,346 L717,339 M717,339 L753,325 M753,325 L800,300 M800,300 L834,279 M834,279 L862,261 M862,261 L880,248 M880,248 L882,246 M882,246 ");
  });
});*/
