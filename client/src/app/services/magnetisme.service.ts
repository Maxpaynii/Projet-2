import { Injectable} from '@angular/core';
import { Point2D } from './point-2d/point-2d.service';

const UN = 1;
const MILIEU = 0.5;
const ZERO = 0;

@Injectable({
  providedIn: 'root',
})
export class MagnetismeService {
  constructor(){}
  
  trouverCadran(x: number, y: number, taille: number): Point2D {
    let deplacementX = ZERO;
    let deplacementY = ZERO;
    const numCadreX = x / taille;
    const numCadreY = y / taille;
    if (numCadreX % UN <= MILIEU  &&  numCadreY % UN <= MILIEU) {
      deplacementX = Math.floor(numCadreX) * taille - x;
      deplacementY = Math.floor(numCadreY) * taille - y;
    } else if (numCadreX % UN > MILIEU  &&  numCadreY % UN <= MILIEU) {
      deplacementX = Math.floor(numCadreX + UN) * taille - x;
      deplacementY = Math.floor(numCadreY) * taille - y;
    } else if (numCadreX % UN <= MILIEU  &&  numCadreY % UN > MILIEU) {
      deplacementX = Math.floor(numCadreX) * taille - x;
      deplacementY = Math.floor(numCadreY + UN) * taille - y;
    } else {
      deplacementX = Math.floor(numCadreX + UN) * taille - x;
      deplacementY = Math.floor(numCadreY + UN) * taille - y;
    }
    const deplacement = new Point2D(deplacementX, deplacementY);
    return deplacement;
  }
}
