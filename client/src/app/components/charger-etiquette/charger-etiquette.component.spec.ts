import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChargerEtiquetteComponent } from './charger-etiquette.component';
import { CommunicationServeurService } from '../../services/communication-serveur.service';
import { MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { ReactiveFormsModule, FormsModule, FormControl, FormGroup } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {Image} from "../../../../../common/image";
import { of } from 'rxjs';


describe('ChargerEtiquetteComponent', () => {
  const mockDialogRef ={close: () => { } };
  const mockFormGroup ={ patchValue: () => { } };
  const mockPush ={push: () => {}};
  let component: ChargerEtiquetteComponent;
  let fixture: ComponentFixture<ChargerEtiquetteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: MatDialogRef, useValue: mockDialogRef }, FormControl
        , { provide: FormGroup, useValue: mockFormGroup }, CommunicationServeurService],
      declarations: [ ChargerEtiquetteComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [MatDialogModule, ReactiveFormsModule, FormsModule, BrowserAnimationsModule, BrowserDynamicTestingModule, HttpClientModule ]

    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargerEtiquetteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('La fonction getUneSeuleEtiquette a trier les etiquette', () => {
    let liste = new Array<Image>();
    liste.push({svg: "Test2",titre: "Olla", etiquette: ["A","C"], _id: "1", date:""});
    liste.push({svg: "Test",titre: "Allo", etiquette: ["A","B"], _id: "1", date:""});
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
    image.push({svg: "Test", titre: "Allo", etiquette: ["A","B"], _id: "1", date:""});
    image.push({svg: "Test2", titre: "Olla", etiquette: ["A","C"], _id: "2", date:""});
    component.getUneSeuleEtiquette(image);
    expect(component.etiquettes).toEqual(["A","B","C"]);
  });
  
  it("la fonction pop a ete apple lors du tri dans setImageGraceEtiquette", () => {
    component.images.push({svg: "Test", titre: "Allo", etiquette: ["A","B"], _id: "1", date:""});
    let etiquette: string[];
    etiquette = new Array<string>();
    etiquette.push("A");
    component.setImageGraceEtiquette(etiquette);
    expect(component.imagesAvecEtiquette).toEqual(component.images);
  });

  it("la fonction push a ete appelle dans setImageGraceEtiquette", () => {
    let spy = spyOn(component.imagesAvecEtiquette, "push").and.returnValue({push: () => of(mockPush)} as any);
    component.imagesAvecEtiquette.push({svg: "Test", titre: "Allo", etiquette: ["A","B"], _id: "1", date:""});
    component.imagesAvecEtiquette.push({svg: "Test2", titre: "Olla", etiquette: ["A","C"], _id: "2", date:""});
    let etiquette: string[];
    etiquette = new Array<string>();
    etiquette.push("C");
    let imageTest: Image[];
    imageTest = new Array<Image>();
    imageTest.push({svg: "Test2", titre: "Olla", etiquette: ["A","C"], _id: "2", date:""});
    component.setImageGraceEtiquette(etiquette);
    expect(spy).toHaveBeenCalled();
  });

  it("la fonction de Validation de recherche est fonctionnel", () => {
    let spy = spyOn (component, "rendreVisible");
    component.images.push({svg: "Test", titre: "Allo", etiquette: ["A","B"], _id: "1", date:""});
    component.images.push({svg: "Test2", titre: "Olla", etiquette: ["A","C"], _id: "2", date:""});
    component.formGroup.patchValue({ recherche: component.formGroup.value.recherche = "A"});
    component.validationRecherche();
    expect(spy).toHaveBeenCalled();
    component.formGroup.patchValue({ recherche: component.formGroup.value.recherche = ""});
    component.validationRecherche();
    expect(spy).toHaveBeenCalled();
  });

  it("devrait appeler la focntion dialogRef.close() dans le confirmation local de chargement", () => {
    let spy = spyOn(component.dialogRef, "close");
    component.chargementLocalConfirmation();
    expect(spy).toHaveBeenCalled();
  });

  it("devrait appeler la focntion dialogRef.close() dans chargementImage", () => {
    let spyDialog = spyOn(component.dialogRef, "close");
    component.chargementImage({svg: "Test2", titre: "Olla", etiquette: ["A","C"], _id: "2", date:""} as Image);
    expect(spyDialog).toHaveBeenCalled();
  });

  it("devrait tester le fonctionnement de chargementLocal avec une mauvaise extension", () => {
    const mockFile = new File([''], 'filename.txt', { type: 'text/html' });
    const mockEvt = { target: { files: [mockFile] } };
    component.chargementLocal(mockEvt as any);
    expect(component.imageCharger.titre).toEqual("filename.txt");
    expect(component.boutonLocal).toBeFalsy();
  });

  it("devrait verifier si l'extension est la bonne", () => {
    const mockFile = new File([''], 'filename.svg', { type: 'text/html'});
    const mockEvt = { target: { files: [mockFile] } };
    component.chargementLocal(mockEvt as any);
    expect(component.imageCharger.titre).toEqual("filename.svg");
    expect(component.boutonLocal).toBeTruthy();
  })
});