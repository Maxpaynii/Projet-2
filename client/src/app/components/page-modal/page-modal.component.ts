import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

const KEY = "PageModal";
const VIDE = 'none';
const BLOCK = 'block';
const MODAL = 'pageModal';
const CONTENUGUIDE = "contenuGuide";

@Component({
  selector: 'app-page-modal',
  templateUrl: './page-modal.component.html',
  styleUrls: ['./page-modal.component.scss'],
})


export class PageModalComponent implements OnInit {
  @ViewChild(MODAL, {static: false}) ModalContainer: ElementRef;
  @ViewChild(CONTENUGUIDE, {static: false}) contenuGuideContainer: ElementRef;
  fermeture: boolean;
  presenceModal: boolean;

  constructor() {
    this.fermeture = true;
  }

  ngOnInit() {}
  FermerpageModale() {
   this.ModalContainer.nativeElement.style.display = VIDE;
   this.presenceModal = false;
  }

  Ouvrirguide() {
    this.contenuGuideContainer.nativeElement.style.display = BLOCK;
    this.presenceModal = true;
  }

  Fermerguide() {
    this.contenuGuideContainer.nativeElement.style.display = VIDE;
    this.presenceModal = false;
  }

  fermetureComplete() {
    if (this.fermeture) {
      this.fermeture = false;
      localStorage[KEY] = this.fermeture;
    } else {
      this.fermeture = true;
      localStorage[KEY] = this.fermeture;
    }
  }
}