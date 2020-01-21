import { PlumeService } from './plume.service';
import { TracesService } from './traces.service';

describe('PlumeService', () => {
  let plume: PlumeService;
  const TABLEAU_TRACES = TracesService.Instance.traces;
  beforeEach(() => {
    plume = new PlumeService();
    while (TABLEAU_TRACES.length !== 0) {
      TABLEAU_TRACES.pop();
    }
  });

  it('Est construit', () => {
    expect(plume).toBeTruthy();
  });
  it('gereClic: ajoute un tracé dans canvas', () => {
    plume.gereClic(0, 0, 5, 0, '#000000', '#000000');
    expect(TABLEAU_TRACES.length).toBe(1);
  });
  it('gereClic: trace une ligne sur le curseur', () => {
    plume.gereClic(0, 0, 5, 0, '#000000', '#000000');
    expect(TABLEAU_TRACES[0].instr).toBe('M5,0L-5,0');
  });
  it('gereClic: tracer une ligne rotationnée fonctionne', () => {
    plume.gereClic(0, 0, 5, 90, '#000000', '#000000');
    expect(TABLEAU_TRACES[0].instr).toBe('M0,5L-0.001,-5');
  });
  it('gereGlisse: trace une ligne centrée sur chaque point qui sépare la position courante de la position finale', () => {
    // position courante à (0,0)
    plume.gereClic(0, 0, 5, 0, '#000000', '#000000');
    TABLEAU_TRACES[0].instr = '';
    // position finale à (5, 0)
    plume.gereGlisse(5, 0, 5, 0);

    let instructionEsperee = '';
    for (let i = 0; i <= 5; i++) {
      instructionEsperee += 'M' + (i + 5) + ',' + 0 + 'L' + (i - 5) + ',' + 0;
    }
    expect(TABLEAU_TRACES[0].instr).toBe(instructionEsperee);
  });
});
