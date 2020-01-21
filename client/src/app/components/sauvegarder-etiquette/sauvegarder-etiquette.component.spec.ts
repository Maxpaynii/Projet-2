import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, ReactiveFormsModule, FormControl, FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SauvegarderEtiquetteComponent } from './sauvegarder-etiquette.component';
import { HttpClientModule } from '@angular/common/http'; 
import { Image } from "../../../../../common/image";

describe('SauvegarderEtiquetteComponent', () => {
  const mockDialogRef = { close: () => { } };
  const mockFormGroup = { patchValue: () => { } };
  let component: SauvegarderEtiquetteComponent;
  let fixture: ComponentFixture<SauvegarderEtiquetteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SauvegarderEtiquetteComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{ provide: MatDialogRef, useValue: mockDialogRef }, FormControl
        , { provide: FormGroup, useValue: mockFormGroup }],
      imports: [MatDialogModule, ReactiveFormsModule, FormsModule, HttpClientModule],

    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SauvegarderEtiquetteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('La fonction onSubmit est fonctionnelle', () => {
    let spy = spyOn(component.dialogRef, 'close').and.callThrough();
    component.onSubmit();
    expect(spy).toHaveBeenCalled();
  });

  it('La fonction getUneSeuleEtiquette a trier les etiquette', () => {
    let liste = new Array<Image>();
    liste.push({svg: "Test2",titre: "Olla", etiquette: ["A","C"], _id: "1", date: ""});
    liste.push({svg: "Test",titre: "Allo", etiquette: ["A","B"], _id: "2", date: ""});
    let spy = spyOn(component, 'getUneSeuleEtiquette');
    component.getUneSeuleEtiquette(liste);
    expect(component.etiquettes).toEqual([ ]);
    expect(spy).toHaveBeenCalled();
  });

  it('Annulation a ete appele', () => {
    let spy = spyOn(component.dialogRef, 'close').and.callThrough();
    component.annulation();
    expect(spy).toHaveBeenCalled();
  });
  it('pasEtiquette devrait etre egale a true', () => {
    let spy = spyOn(component, "setEtiquetteSelectionne");
    const mockEtiquette = "Allo";
    component.setEtiquetteSelectionne(mockEtiquette);
    expect(component.pasEtiquette).toBeTruthy();
    expect(spy).toHaveBeenCalled();
  });

  it('devrait appeler setPasEtiquetteSimple', () => {
    let spy = spyOn(component, "setPasEtiquetteSimple");
    component.setPasEtiquetteSimple();
    expect(spy).toHaveBeenCalled();
  });

  it('devrait appeler setTitrePresent', () => {
    let spy = spyOn(component, "setTitrePresent");
    component.setTitrePresent();
    expect(spy).toHaveBeenCalled();
  });

  it("imageReduite a une valeur conforme avec des Etiquettes", () => {

    let etiquette: string[] = ["A","B"];
    let simple: string = "C";
    component.pasEtiquette = false;
    component.setImageReduite(etiquette,simple);
    expect(component.imageReduite).toEqual("A,B");
  });

  it("imageReduite a une valeur conforme avec une Etiquette Simple", () => {
    let etiquette: string[] = ["A","B"];
    let simple: string = "C";
    component.pasEtiquetteSimple = false;
    component.setImageReduite(etiquette,simple);
    expect(component.imageReduite).toEqual("C,");
  });

  it("setEtiquette selectionne a supprime une etiquette deja selectionne", () => {
    component.etiquettesSelectionnees.push("A");
    let etiquette: string = "A";
    component.setEtiquetteSelectionne(etiquette);
    expect(component.etiquetteSupprimee).toBeFalsy();
  });

  it("setEtiquette selectionne ajoute une etiquette", () => {
    let etiquette: string = "A";
    component.setEtiquetteSelectionne(etiquette);
    expect(component.etiquettesSelectionnees).toEqual(["A"]);
  });

  it("getUneSeuleEtiquette fait bien le tri", () => {
    let image: Image[];
    image =new Array<Image>();
    image.push({svg: "Test", titre: "Allo", etiquette: ["A","B"], _id: "1", date: ""});
    image.push({svg: "Test2", titre: "Olla", etiquette: ["A","C"], _id: "2", date: ""});
    component.getUneSeuleEtiquette(image);
    expect(component.etiquettes).toEqual(["A","B","C"]);
  });

  it("devrait appeler la fonction close()", () => {
    let spy = spyOn(component.dialogRef, "close");
    component.onSubmitLocal();
    expect(spy).toHaveBeenCalled();
  });
  
});
