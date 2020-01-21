import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PageModalComponent } from './page-modal.component';

describe('PageModalComponent', () => {
  let component: PageModalComponent;
  let fixture: ComponentFixture<PageModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageModalComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('devrait fonctionner', () => {
    component.fermeture = true;
    component.fermetureComplete();
    expect(component.fermeture).toEqual(false);
  });

  it('devrait fonctionner', () => {
    component.fermeture = false;
    component.fermetureComplete();
    expect(component.fermeture).toEqual(true);
  });
  it('devrait fonctionner', () => {
    component.FermerpageModale();
    expect(component.presenceModal).toEqual(false);
  });
  it('devrait fonctionner', () => {
    component.Ouvrirguide();
    expect(component.presenceModal).toEqual(true);
  });
  it('devrait fonctionner', () => {
    component.Fermerguide();
    expect(component.presenceModal).toEqual(false);
  });

});
