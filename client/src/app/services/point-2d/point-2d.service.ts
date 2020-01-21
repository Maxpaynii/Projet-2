import { Injectable } from '@angular/core';

const RATIO_RADIAN_DEGRE = Math.PI / 180;
const DECIMALES_ARRONDISSEMENT = 3;
const BASE_NOMBRES = 10;
@Injectable({
  providedIn: 'root',
})
export class Point2D {

  private x: number;
  private y: number;

  static distanceEntreDeuxPoints(point1: Point2D, point2: Point2D): number {
    const DELTA_X = point2.x - point1.x;
    const DELTA_Y = point2.y - point1.y;
    return Math.sqrt(Math.pow(DELTA_X, 2) + Math.pow(DELTA_Y, 2));
  }

  constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
  }

  setX(x: number): void {
      this.x = x;
  }
  setY(y: number): void {
      this.y = y;
  }

  getX(): number {
      return this.x;
  }
  getY(): number {
      return this.y;
  }

  rotationAutourDUnPoint(centreDeRotation: Point2D, angleRotationDegre: number): Point2D {
    const DELTA_X_INITIAL = this.getX() - centreDeRotation.getX();
    const DELTA_Y_INITIAL = this.getY() - centreDeRotation.getY();

    const ANGLE_RADIAN = angleRotationDegre * RATIO_RADIAN_DEGRE;

    const DELTA_X_FINAL = DELTA_X_INITIAL * Math.cos(ANGLE_RADIAN) - DELTA_Y_INITIAL * Math.sin(ANGLE_RADIAN);
    const DELTA_Y_FINAL = DELTA_X_INITIAL * Math.sin(ANGLE_RADIAN) + DELTA_Y_INITIAL * Math.cos(ANGLE_RADIAN);

    const X_FINAL = this.arrondirCoordonnee(DELTA_X_FINAL + centreDeRotation.getX());
    const Y_FINAL = this.arrondirCoordonnee(DELTA_Y_FINAL + centreDeRotation.getY());

    return new Point2D(X_FINAL, Y_FINAL);
  }

  miseAEchelleAutourDUnPoint(pointDeReference: Point2D, facteurDeMiseAEchelle: number): Point2D {
    const DELTA_X_INITIAL = this.getX() - pointDeReference.getX();
    const DELTA_Y_INITIAL = this.getY() - pointDeReference.getY();

    const DELTA_X_FINAL = DELTA_X_INITIAL * facteurDeMiseAEchelle;
    const DELTA_Y_FINAL = DELTA_Y_INITIAL * facteurDeMiseAEchelle;

    const X_FINAL = this.arrondirCoordonnee(pointDeReference.getX() +  DELTA_X_FINAL);
    const Y_FINAL = this.arrondirCoordonnee(pointDeReference.getY() +  DELTA_Y_FINAL);
    return new Point2D(X_FINAL, Y_FINAL);
  }

  appliquerRotationEtMiseAEchelle(pointDeReference: Point2D, angleRotationDegre: number, facteurMiseAEchelle: number): Point2D {
      const POINT_ROTATIONNE =  this.rotationAutourDUnPoint(pointDeReference, angleRotationDegre);
      return POINT_ROTATIONNE.miseAEchelleAutourDUnPoint(pointDeReference, facteurMiseAEchelle);
  }

  translation(deltaX: number, deltaY: number): Point2D {
    const X_FINAL = this.arrondirCoordonnee(this.getX() + deltaX);
    const Y_FINAL = this.arrondirCoordonnee(this.getY() + deltaY);
    return new Point2D(X_FINAL, Y_FINAL);
  }

  redimensionnementVertical(pointDeReference: Point2D, facteur: number): Point2D {
    const X = this.x;
    const Y = this.arrondirCoordonnee((this.y - pointDeReference.getY()) * facteur) + pointDeReference.getY();
    return new Point2D(X, Y);
  }
  redimensionnementHorizontal(pointDeReference: Point2D, facteur: number): Point2D {
    const Y = this.y;
    const X = this.arrondirCoordonnee((this.x - pointDeReference.getX()) * facteur) + pointDeReference.getX();
    return new Point2D(X, Y);
  }
  private arrondirCoordonnee(coordonee: number): number {
    const FRACTION_ARRONDISSEMENT = Math.pow(BASE_NOMBRES, DECIMALES_ARRONDISSEMENT);
    return Math.floor(FRACTION_ARRONDISSEMENT * coordonee) / FRACTION_ARRONDISSEMENT;
  }
}
