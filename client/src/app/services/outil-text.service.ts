import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Trace } from '../../Trace';
import { ImageCharger } from '../../../../common/image';

@Injectable({
  providedIn: 'root',
})
export class OutilTextService {

  traces: Trace[];

  tailleText = new BehaviorSubject<number>(25);
  gras = new BehaviorSubject<string>('bold');
  police = new BehaviorSubject<string>('Ink Free');
  italic = new BehaviorSubject<string>('italic');
  alignement = new BehaviorSubject<string>('start');

  castTaille = this.tailleText.asObservable();
  castgras = this.gras.asObservable();
  castPolice = this.police.asObservable();
  castItalic = this.italic.asObservable();
  castAlign = this.alignement.asObservable();

  setTaille(valeur: number) {
    this.tailleText.next(valeur);
  }
  setGras(valeur: string) {
    this.gras.next(valeur);
  }
  setPolice(valeur: string) {
    this.police.next(valeur);
  }
  setItalic(valeur: string) {
    this.italic.next(valeur);
  }
  setAlignement(valeur: string) {
    this.alignement.next(valeur);
  }

  creerTspan(tspanContent: string, x: number, y: number ) {
    const tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
    tspan.setAttribute("x", x.toString());
    tspan.setAttribute("y", y.toString());
    tspan.setAttribute("font-size", this.tailleText.getValue().toString());
    tspan.setAttribute("font-weight", this.gras.getValue().toString());
    tspan.setAttribute("font-family", this.police.getValue().toString());
    tspan.setAttribute("font-style", this.italic.getValue().toString());
    tspan.setAttribute("text-anchor", this.alignement.getValue().toString());
    tspan.setAttribute("fill", "black");
    tspan.textContent = tspanContent;
    return tspan;
  }
  creerTspanReduit(tspanContent: string, x: number, y: number ) {
    const tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
    tspan.setAttribute("x", x.toString());
    tspan.setAttribute("y", y.toString());
    tspan.textContent = tspanContent;
    return tspan;
  }
  creerTextCharger(imageCharger: ImageCharger, i: number) {
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", imageCharger.texte[i].x);
    text.setAttribute("y", imageCharger.texte[i].y);
    text.setAttribute("font-size", imageCharger.texte[i].size);
    text.setAttribute("font-weight", imageCharger.texte[i].weight);
    text.setAttribute("font-family", imageCharger.texte[i].family);
    text.setAttribute("font-style", imageCharger.texte[i].style);
    text.setAttribute("text-anchor", imageCharger.texte[i].anchor);
    text.setAttribute("fill", "black");
    text.textContent = imageCharger.texte[i].texte;
    return text;
  }
}
