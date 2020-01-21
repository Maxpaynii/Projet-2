import { TestBed } from '@angular/core/testing';

import { AerosolService } from './aerosol.service';
import { Point2D } from './point-2d/point-2d.service';
import { Trace } from 'Trace';

describe('AerosolService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AerosolService = TestBed.get(AerosolService);
    expect(service).toBeTruthy();
  });

  it("Devrait creer un point a la position indiquer", () => {
    const service: AerosolService = TestBed.get(AerosolService);
    const EPAISSEUR_POINT = 1;
    let point2d: Point2D = new Point2D(25,25);
    service.traceCourante = new Trace(EPAISSEUR_POINT, "#000000", "#000000");
    service.tracerPoint(point2d);
    expect(service.traceCourante.instr).toBeDefined();
  });

  it("Devrait creer des points par rapport a son centre", () => {
    const service: AerosolService = TestBed.get(AerosolService);
    let spy = spyOn(service, "tracerPoint");
    service.traceCourante = new Trace(1, "#000000", "#000000");
    service.tracerAerosol(new Point2D(25,25), 10, 1);
    expect(spy).toHaveBeenCalled();
    expect(service.traceCourante.instr).toBeDefined();
  });

  it("Devrait set le boolean a false", () => {
    const service: AerosolService = TestBed.get(AerosolService);
    service.setActif(false);
    expect(service.actif).toBeFalsy();
  });

  it("Devrait set le boolean a true", () => {
    const service: AerosolService = TestBed.get(AerosolService);
    service.setActif(true);
    expect(service.actif).toBeTruthy();
  });

  it("Devrait retourner le boolean qui est defini", () => {
    const service: AerosolService = TestBed.get(AerosolService);
    expect(service.getActif()).toBeFalsy();
    service.setActif(true);
    expect(service.getActif()).toBeTruthy();
  });

  it("Devrait set une nouvelle position grace a setPosition()", () => {
    const service: AerosolService = TestBed.get(AerosolService);
    service.setPosition(25,25);
    expect(service.positionCourante).toBeDefined();
  });

  it("Devrait retourner une position grace a getPosition()", () =>{
    const service: AerosolService = TestBed.get(AerosolService);
    service.setPosition(25,25);
    expect(service.getPosition()).toEqual(new Point2D(25,25));
  });

  it("Devrait faire une gestion du gereClic avec spy sur les fonction a appeler", (done) => {
    const service: AerosolService = TestBed.get(AerosolService);
    let spySetPosition = spyOn(service, "setPosition");
    let spyGetActif = spyOn(service, "getActif");
    service.setActif(true);
    service.gereClic(25,25,10,1,"#000000","#000000");
    setTimeout(() => {
    expect(spyGetActif).toHaveBeenCalled();
    expect(spySetPosition).toHaveBeenCalled();
    done();
    }, 200);
    expect(service.traceCourante.instr).toBeDefined();
  });

  it("Devrait remplir lorsque l'aerosol se deplace", () => {
    const service: AerosolService = TestBed.get(AerosolService);
    let spyGetActif = spyOn(service, "getActif");
    service.setActif(true);
    service.traceCourante = new Trace(1, "#000000", "#000000");
    service.gereGlisse(25,25,10,1);
    expect(spyGetActif).toHaveBeenCalled();
    expect(service.positionCourante).toEqual(new Point2D(0,0));
  });
});
