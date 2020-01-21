import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {GrilleService } from '../../services/grille.service';

const BLOCK = "block";
const NONE = "none";

@Component({
  selector: 'app-grille',
  templateUrl: './grille.component.html',
  styleUrls: ['./grille.component.scss'],
})
export class GrilleComponent implements OnInit {
  @ViewChild("modifGrille", {static: false}) paramsGrille: ElementRef;

  transparenceGrille: number ;
  transparenceGrilleTemp: number ;

  constructor(private grilleService: GrilleService ){}

  afficherGrille() {
    this.grilleService.setTaille(20);
    this.grilleService.setTransparence(0.5);
    this.paramsGrille.nativeElement.style.display = BLOCK;
  }
  appliquer() {
    this.transparenceGrilleTemp = this.transparenceGrille ;
    this.grilleService.setTransparence(this.transparenceGrille);
  }
  enleverGrille() {
    this.grilleService.setTaille(0);
    this.grilleService.setTransparence(0);
    this.paramsGrille.nativeElement.style.display = NONE;
  }
  ngOnInit() {}
}
