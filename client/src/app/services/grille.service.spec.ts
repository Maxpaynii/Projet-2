import { TestBed } from '@angular/core/testing';

import { GrilleService } from './grille.service';

describe('GrilleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));
  const service: GrilleService = new GrilleService();
  it('should be created', () => {
    const service: GrilleService = TestBed.get(GrilleService);
    expect(service).toBeTruthy();
  });
  it('devrait reset la police', () => {
    service.setTaille(100);
    expect(service.tailleGrille.getValue()).toBe(100);
  });
  it('devrait enlever le text gras', () => {
    service.setTransparence(1);
    expect(service.transparenceGrille.getValue()).toBe(1);
  });
});
