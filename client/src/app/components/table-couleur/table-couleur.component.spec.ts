import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableCouleurComponent } from './table-couleur.component';

describe('TableCouleurComponent', () => {
  let component: TableCouleurComponent;
  let fixture: ComponentFixture<TableCouleurComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableCouleurComponent],
      imports: [],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableCouleurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('devrait mettre le Mousedown a true', () => {
    component.onMouseDown(component.evt);
    expect(component.mousedown).toEqual(true);
  });
  it('devrait mettre le Mousedown a true', () => {
    component.onMouseUp(component.evt);
    expect(component.mousedown).toEqual(false);
  });
  it('devrait mettre la valuer du point selectionner a la hauteur choisie', () => {
    component.onMouseDown(component.evt);
    component.onMouseMove(component.evt);
    expect(component.Hauteurchoisie).toEqual(component.evt.offsetY);
  });
  it('devrait mettre strokestyle a white', () => {
    component.Hauteurchoisie = 1;
    component.afficher();
    expect(component.ctx.strokeStyle).toEqual('#ffffff');
  });
  it('devrait mettre la valuer du point selectionner a la hauteur choisie', () => {
    component.mousedown = false;
    component.onMouseMove(component.evt);
    expect(component.Hauteurchoisie).toEqual(component.Hauteurchoisie);
  });
});
