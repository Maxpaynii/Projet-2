import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TransparenceCouleurComponent } from './transparence-couleur.component';
describe('TransparenceCouleurComponent', () => {
  let component: TransparenceCouleurComponent;
  let fixture: ComponentFixture<TransparenceCouleurComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransparenceCouleurComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransparenceCouleurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('devrait resotir 0f ', () => {
    expect(component.rgbAHex(15)).toEqual('0f');
  });
  it('devrait resortir la couleur en hexadecimal', () => {
    expect(component.getColorAtPosition(0, 0)).toEqual('#fefefe');
  });
  it('devrait faire entrer la couleur de la position a tempcouleur', () => {
    component.emitColor(0, 0);
    expect(component.couleurTemp).toEqual('#fefefe');
  });
  it('devrait mettre la valeur de x de position choisie a event.offsetx', () => {
    component.mousedown = true;
    component.onMouseMove(component.evt);
    expect(component.PositionChoisie.x).toEqual(component.evt.offsetX) ;
  });
  it('devrait mettre la valeur du mousedown a true', () => {
    component.onMouseDown(component.evt);
    expect(component.mousedown).toEqual(true) ;
  });
  it('devrait mettre la valeur du mousedown a false', () => {
    component.onMouseUp(component.evt);
    expect(component.mousedown).toEqual(false) ;
  });
});
