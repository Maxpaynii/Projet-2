import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {OutilTextService } from '../../services/outil-text.service';
import { TextComponent } from './text.component';
import { FormsModule } from '@angular/forms';

describe('TextComponent', () => {
  let component: TextComponent;
  let fixture: ComponentFixture<TextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextComponent ],
      imports: [FormsModule],
      providers: [OutilTextService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('changer police fonctionne', () => {
    spyOn(component.outilText, 'setPolice');
    component.changerPolice('Calibri');
    expect(component.outilText.setPolice).toHaveBeenCalled();
  });
  it('mettreItalic met le texte en italique s\'il ne l\'est pas', () => {
    component.outilText.setItalic('none');
    component.MetrreItalic();
    expect(component.outilText.italic.getValue()).toBe('italic');
  });
  it('mettreItalic ne met pas le texte en italique s\'il l\'est', () => {
    component.outilText.setItalic('italic');
    component.MetrreItalic();
    expect(component.outilText.italic.getValue()).toBe('none');
  });
  it('mettreGras met le texte en gras s\'il ne l\'est pas', () => {
    component.outilText.setGras('none');
    component.MettreGras();
    expect(component.outilText.gras.getValue()).toBe('bold');
  });
  it('mettreGras ne met pas le texte en gras s\'il l\'est', () => {
    component.outilText.setGras('bold');
    component.MettreGras();
    expect(component.outilText.gras.getValue()).toBe('none');
  });
  it('appliquer applique le changement de taille de caractères', () => {
    spyOn(component.outilText, 'setTaille');
    component.appliquer();
    expect(component.outilText.setTaille).toHaveBeenCalled();
  });
  it('allignerText modifie la valeur de l\'allignement', () => {
    spyOn(component.outilText, 'setAlignement');
    component.alignerText('start');
    expect(component.outilText.setAlignement).toHaveBeenCalled();
  });
});
