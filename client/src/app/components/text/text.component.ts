import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {OutilTextService } from '../../services/outil-text.service';

const NONE = "none";
const BOLD = "bold";
const ITALIC = "italic";

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
})
export class TextComponent implements OnInit {
  @ViewChild("polices", {static: false}) polices: ElementRef;

  tailleText: number;

  constructor(public outilText: OutilTextService) { }
  afficherPolices() {
    this.polices.nativeElement.style.display = 'block';
  }
  changerPolice(stringId: string) {
    this.outilText.setPolice(stringId);
  }
  MetrreItalic() {
    if (this.outilText.italic.value === ITALIC) {
      this.outilText.setItalic(NONE);
    } else {
      this.outilText.setItalic(ITALIC);
    }
  }
  MettreGras() {
    if (this.outilText.gras.value === BOLD) {
      this.outilText.setGras(NONE);
    } else {
      this.outilText.setGras(BOLD);
    }
  }
  appliquer() {
    this.outilText.setTaille(this.tailleText);
  }
  alignerText(stringId: string) {
        this.outilText.setAlignement(stringId);
  }
  ngOnInit() {
    // vide
  }
}
