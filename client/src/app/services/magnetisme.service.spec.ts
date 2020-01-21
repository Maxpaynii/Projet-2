import { TestBed } from '@angular/core/testing';

import { MagnetismeService } from './magnetisme.service';

describe('MagnetismeService', () => {
 let magnetisme: MagnetismeService;
  beforeEach(() => {
    magnetisme = new MagnetismeService();
  });//TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MagnetismeService = TestBed.get(MagnetismeService);
    expect(service).toBeTruthy();
  });
  it('should be created', () => {
    expect(magnetisme.trouverCadran(50, 50, 50).getX()).toBe(0);
  });
    it('should be created', () => {
    expect(magnetisme.trouverCadran(50, 78, 50).getX()).toBe(0);
  });
    it('should be created', () => {
    expect(magnetisme.trouverCadran(78, 50, 50).getX()).toBe(0);
  });
    it('should be created', () => {
    expect(magnetisme.trouverCadran(78, 78, 50).getX()).toBe(22);
  });
});
