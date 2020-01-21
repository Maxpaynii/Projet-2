import { TestBed } from '@angular/core/testing';

import { EllipseService } from './ellipse.service';
import { Point2D } from './point-2d/point-2d.service';
import { TracesService } from './traces.service';
import { Trace } from 'Trace';

describe('EllipseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));
  const tableauCommun = TracesService.Instance;
  const service: EllipseService = new EllipseService(tableauCommun);
  it('should be created', () => {
    const serviceE: EllipseService = TestBed.get(EllipseService);
    expect(serviceE).toBeTruthy();
  });
  it('hemiEllipseGauche: devrait renvoyer la chaine de caracteres correspondant a l\'arc elliptique gauche (100, 100), (200,200) ', () => {
    const r = new Point2D(100, 100);
    const destArc = new Point2D(200, 200);
    expect(service.hemiEllipseGauche(r, destArc)).toBe(" A100 , 100 0 0, 0 200 200 ");
  });
  it('hemiEllipseDroite: devrait renvoyer la chaine de caracteres correspondant a l\'arc elliptique droite (100, 100), (250,200) ', () => {
    const r = new Point2D(100, 100);
    const destArc = new Point2D(200, 200);
    expect(service.hemiEllipseDroite(r, destArc)).toBe(" A100 , 100 0 0, 1 200 200 ");
  });
  it('ellipse: devrait renvoyer la chaine de caracteres correspondant a l\'ellipse (100, 100), (250,200) ', () => {
    const initRect = new Point2D(100, 100);
    const finRect = new Point2D(250, 200);
    expect(service.ellipse(initRect, finRect)).toBe("M175,100 A75 , 50 0 0, 1 175 200 M175,100 A75 , 50 0 0, 0 175 200 M100,100");
  });
  it('Premier test de cercle (100, 100), (200,200)' , () => {
    const initRect = new Point2D(100, 100);
    const finRect = new Point2D(200, 200);
    expect(service.cercle(initRect, finRect)).toBe("M150,100 A50 , 50 0 0, 1 150 200 M150,100 A50 , 50 0 0, 0 150 200 M100,100");
  });
  it('Deuxieme test de cercle (99, 80), (109, 88)', () => {
    // tslint:disable-next-line: max-line-length
    expect(service.cercle(new Point2D(99, 80), new Point2D(109, 88))).toBe("M104,80 A4 , 4 0 0, 1 104 88 M104,80 A4 , 4 0 0, 0 104 88 M99,80");
  });
  it('Premier test de gereSourisQuitte, devrait enlever un element de Traces et set clique:f et sourisQuitte:t', () => {
    service.clique = true;
    service.traces = [new Trace(1, "#000000", "#000000")];
    service.gereSourisQuitte();
    expect(service.clique).toBeFalsy();
    expect(service.sourisQuitte).toBeTruthy();
    expect(service.traces).toEqual([]);
  });
});
