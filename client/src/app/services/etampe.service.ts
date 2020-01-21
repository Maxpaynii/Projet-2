import { Injectable } from '@angular/core';
import { Point2D } from 'app/services/point-2d/point-2d.service';
import { Trace } from '../../Trace';
import { CrayonService } from './crayon.service';

const DECALAGE_FENETRE_GAUCHE = 277;
const EPAISSEUR_LIGNES_ETAMPE = 3;

@Injectable({
  providedIn: 'root',
})
export class EtampeService {

  bougerCurseurVirtuel(position: Point2D, crayonService: CrayonService): void {
    crayonService.traces[crayonService.longueur()].instr += crayonService.aller(position);
  }
  tracerLigne(positionFinale: Point2D, crayonService: CrayonService): void {
    crayonService.traces[crayonService.longueur()].instr += crayonService.ligne(positionFinale);
  }

  gereClicEtampe(x: number, y: number, textureEtampe: string, angleOutil: number, couleurPrimaire: string,
                 couleurSecondaire: string, traceCourant: Trace, crayonService: CrayonService, facteurMiseAEchelle: number ) {
    const PATRON_ETAMPE: Point2D[] = [];
    const POSITION_CLIC = new Point2D(x - DECALAGE_FENETRE_GAUCHE, y);
    switch (textureEtampe) {
      case 'hashtag': { // hashtag
        const POINT1 = new Point2D(-20, -10);
        const POINT2 = new Point2D(20, -10);
        const POINT3 = new Point2D(-20, 10);
        const POINT4 = new Point2D(20, 10);
        const POINT5 = new Point2D(-10, 20);
        const POINT6 = new Point2D(-10, -20);
        const POINT7 = new Point2D(10, 20);
        const POINT8 = new Point2D(10, -20);
        PATRON_ETAMPE.push(POINT1, POINT2, POINT3, POINT4, POINT5, POINT6, POINT7, POINT8);

        this.debutTrace(PATRON_ETAMPE, traceCourant, crayonService,
                        angleOutil, POSITION_CLIC, EPAISSEUR_LIGNES_ETAMPE, couleurSecondaire, couleurPrimaire, facteurMiseAEchelle);

        this.tracerLigne(PATRON_ETAMPE[1], crayonService);
        this.bougerCurseurVirtuel(PATRON_ETAMPE[2], crayonService);
        this.tracerLigne(PATRON_ETAMPE[3], crayonService);
        this.bougerCurseurVirtuel(PATRON_ETAMPE[4], crayonService);
        this.tracerLigne(PATRON_ETAMPE[5], crayonService);
        this.bougerCurseurVirtuel(PATRON_ETAMPE[6], crayonService);
        this.tracerLigne(PATRON_ETAMPE[7], crayonService);
        break;
        }
      case 'diamant': { // diamant
        const POINT1 = new Point2D(0, 0);
        const POINT2 = new Point2D(20, -25);
        const POINT3 = new Point2D(10, -35);
        const POINT4 = new Point2D(-10, -35);
        const POINT5 = new Point2D(-20, -25);
        PATRON_ETAMPE.push(POINT1, POINT2, POINT3, POINT4, POINT5);

        this.debutTrace(PATRON_ETAMPE, traceCourant, crayonService,
                        angleOutil, POSITION_CLIC, EPAISSEUR_LIGNES_ETAMPE, couleurSecondaire, couleurPrimaire, facteurMiseAEchelle);

        this.tracerLigne(PATRON_ETAMPE[1], crayonService);
        this.tracerLigne(PATRON_ETAMPE[2], crayonService);
        this.tracerLigne(PATRON_ETAMPE[3], crayonService);
        this.tracerLigne(PATRON_ETAMPE[4], crayonService);
        this.tracerLigne(PATRON_ETAMPE[0], crayonService);
        this.bougerCurseurVirtuel(PATRON_ETAMPE[4], crayonService);
        this.tracerLigne(PATRON_ETAMPE[1], crayonService);
        break;
      }
      case 'maison': { // maison
        const POINT1 = new Point2D(10, 0);
        const POINT2 = new Point2D(15, 0);
        const POINT3 = new Point2D(0, -15);
        const POINT4 = new Point2D(-15, 0);
        const POINT5 = new Point2D(10, 20);
        const POINT6 = new Point2D(-10, 20);
        const POINT7 = new Point2D(-10, 0);
        PATRON_ETAMPE.push(POINT1, POINT2, POINT3, POINT4, POINT5, POINT6, POINT7);

        this.debutTrace(PATRON_ETAMPE, traceCourant, crayonService,
                        angleOutil, POSITION_CLIC, EPAISSEUR_LIGNES_ETAMPE, couleurSecondaire, couleurPrimaire, facteurMiseAEchelle);

        this.tracerLigne(PATRON_ETAMPE[1], crayonService);
        this.tracerLigne(PATRON_ETAMPE[2], crayonService);
        this.tracerLigne(PATRON_ETAMPE[3], crayonService);
        this.tracerLigne(PATRON_ETAMPE[0], crayonService);
        this.tracerLigne(PATRON_ETAMPE[4], crayonService);
        this.tracerLigne(PATRON_ETAMPE[5], crayonService);
        this.tracerLigne(PATRON_ETAMPE[6], crayonService);
        break;
      }
      case 'lettre': { // lettre
        const POINT1 = new Point2D(0, 0);
        const POINT2 = new Point2D(20, -20);
        const POINT3 = new Point2D(20, 10);
        const POINT4 = new Point2D(-20, 10);
        const POINT5 = new Point2D(-20, -20);
        PATRON_ETAMPE.push(POINT1, POINT2, POINT3, POINT4, POINT5);

        this.debutTrace(PATRON_ETAMPE, traceCourant, crayonService,
                        angleOutil, POSITION_CLIC, EPAISSEUR_LIGNES_ETAMPE, couleurSecondaire, couleurPrimaire, facteurMiseAEchelle);

        this.tracerLigne(PATRON_ETAMPE[1], crayonService);
        this.tracerLigne(PATRON_ETAMPE[2], crayonService);
        this.tracerLigne(PATRON_ETAMPE[3], crayonService);
        this.tracerLigne(PATRON_ETAMPE[4], crayonService);
        this.tracerLigne(PATRON_ETAMPE[1], crayonService);
        this.bougerCurseurVirtuel(PATRON_ETAMPE[4], crayonService);
        this.tracerLigne(PATRON_ETAMPE[0], crayonService);
        break;
      }
      case 'crayon': { // crayon
        const POINT1 = new Point2D(-20, 0);
        const POINT2 = new Point2D(0, 20);
        const POINT3 = new Point2D(-20, 20);
        const POINT4 = new Point2D(20, -40);
        const POINT5 = new Point2D(40, -20);
        PATRON_ETAMPE.push(POINT1, POINT2, POINT3, POINT4, POINT5);

        this.debutTrace(PATRON_ETAMPE, traceCourant, crayonService,
                        angleOutil, POSITION_CLIC, EPAISSEUR_LIGNES_ETAMPE, couleurSecondaire, couleurPrimaire, facteurMiseAEchelle);

        this.tracerLigne(PATRON_ETAMPE[1], crayonService);
        this.tracerLigne(PATRON_ETAMPE[2], crayonService);
        this.tracerLigne(PATRON_ETAMPE[0], crayonService);
        this.tracerLigne(PATRON_ETAMPE[3], crayonService);
        this.tracerLigne(PATRON_ETAMPE[4], crayonService);
        this.tracerLigne(PATRON_ETAMPE[1], crayonService);
        break;
      }
      default: { // Aucune étampe choisie
        return;
      }
    }
  }

  debutTrace(patron: Point2D[], traceCourant: Trace, crayon: CrayonService, angleOutil: number, positionClic: Point2D,
             epaisseurLigne: number, couleurSecondaire: string, couleurPrimaire: string, facteurMiseAEchelle: number): void {
    for (let i = 0; i < patron.length; i++) {
      patron[i] = patron[i].translation(positionClic.getX(), positionClic.getY());
      patron[i] = patron[i].rotationAutourDUnPoint(positionClic, angleOutil);
      patron[i] = patron[i].miseAEchelleAutourDUnPoint(positionClic, facteurMiseAEchelle);
    }

    traceCourant = new Trace(EPAISSEUR_LIGNES_ETAMPE, couleurSecondaire, couleurPrimaire);
    traceCourant.instr = crayon.aller(patron[0]);
    crayon.traces.push(traceCourant);
  }

}
