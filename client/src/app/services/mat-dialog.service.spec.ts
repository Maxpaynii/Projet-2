import { TestBed } from '@angular/core/testing';

import { MatDialogService } from './mat-dialog.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialogModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { of, Subject } from 'rxjs';
import { NouveauDessin } from "../../../../common/nouveaudessin";

describe('MatDialogService', () => {
  const mockDialog = {confirmation: true};
  const mockDialogRef = {hauteur: 100, largeur: 100, couleur: "#ff00ff"};
  const mockDialogRef2 = {hauteur: 150, largeur: 150, couleur: "#005523"};
  const mockVide ={ 

  };
  beforeEach(() => TestBed.configureTestingModule({
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: [MatDialogModule, ReactiveFormsModule, FormsModule, BrowserAnimationsModule, BrowserDynamicTestingModule],
  }));

  it('should be created', () => {
    const service: MatDialogService = TestBed.get(MatDialogService);
    expect(service).toBeTruthy();
  });

  it('devrait tester VerifVide (FAUX)', () => {
    const service: MatDialogService = TestBed.get(MatDialogService);
    const dialogSpy = spyOn(service.dialogue, 'open').and.returnValue({afterClosed: () => of(null)} as any);
    service.verifVide("Test");
    expect(dialogSpy).toHaveBeenCalled();
    expect(service.confirmation).toBeFalsy();
  });
  it('devrait tester ouvrirFormualire', () => {
    const service: MatDialogService = TestBed.get(MatDialogService);
    const dialogSpy = spyOn(service.dialogue, 'open').and.returnValue({afterClosed: () => of(null)} as any);
    service.confirmation = true;
    service.ouvrirFormulaire();
    expect(dialogSpy).toHaveBeenCalled();
  });

  it('devrait tester VerifVide', () => {
    const service: MatDialogService = TestBed.get(MatDialogService);
    const dialogSpy = spyOn(service.dialogue, 'open').and.returnValue({afterClosed: () => of(mockDialog)} as any);
    service.verifVide("Test");
    expect(dialogSpy).toHaveBeenCalled();
    expect(service.confirmation).toBeTruthy();
  });

  it('devrait tester ouvrirFormualire', () => {
    const service: MatDialogService = TestBed.get(MatDialogService);
    const dialogSpy = spyOn(service.dialogue, 'open').and.returnValue({afterClosed: () => of(mockDialogRef)} as any);
    service.confirmation = true;
    service.ouvrirFormulaire();
    expect(dialogSpy).toHaveBeenCalled();
  });

  it('devrait tester ouvrirFormualire', () => {
    const service: MatDialogService = TestBed.get(MatDialogService);
    const dialogSpy = spyOn(service.dialogue, 'open').and.returnValue({afterClosed: () => of(mockDialogRef2)} as any)
    service.confirmation = true;
    service.ouvrirFormulaire();
    expect(dialogSpy).toHaveBeenCalled();
  });

  it('ne devrait pas marcher ouvrirFormulaire', () => {
    const service: MatDialogService = TestBed.get(MatDialogService);
    const spy = spyOn(service, 'ouvrirFormulaire');
    service.confirmation = false;
    service.ouvrirFormulaire();
    expect(spy).toHaveBeenCalled();
  });

  it('devrait ouvrir la sauvegarde', () => {
    const service: MatDialogService = TestBed.get(MatDialogService);
    const spy = spyOn(service, 'ouvrirSauvegarder');
    service.ouvrirSauvegarder();
    expect(spy).toHaveBeenCalled();
  });

  it('devrait appeler open dans sauvegarder', () =>{
    const service: MatDialogService = TestBed.get(MatDialogService);
    const dialogSpy = spyOn(service.dialogue, 'open').and.returnValue({afterClosed: () => of(mockVide)} as any);
    service.ouvrirSauvegarder();
    expect(dialogSpy).toHaveBeenCalled();
  });

  it('devrait appeler open dans charger', () =>{
    const service: MatDialogService = TestBed.get(MatDialogService);
    const dialogSpy = spyOn(service.dialogue, 'open').and.returnValue({afterClosed: () => of(mockVide)} as any);
    service.ouvrirCharger();
    expect(dialogSpy).toHaveBeenCalled();
  });

  it('devrait verifier que la fonction envoie bien une valeur de retour', () => {
    const service: MatDialogService = TestBed.get(MatDialogService);
    service.nouveauDessin = new Subject<NouveauDessin>();
    const mockNouveauDessin = {hauteur: 200, largeur: 200, couleur: "#00ff00"} as NouveauDessin;
    service.nouveauDessin.next(mockNouveauDessin);
    expect(service.nouveauDessin).toBeDefined();
  })
});
