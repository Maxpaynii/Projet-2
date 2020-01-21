import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export abstract class OutilAbsService {
  abstract gereClique(x: number, y: number, couleurP: string, couleurS: string, epaisseur: number,
                      point: number, listeTraces: HTMLCollectionOf<Element>, listeBoite: HTMLCollectionOf<Element> ): void;
  abstract gereCliqueEtGlisse(x: number, y: number, controlPresse: boolean): void;
  abstract gereCliqueFinit(x: number, y: number, listeBoite: HTMLCollectionOf<Element> ): void;
}
