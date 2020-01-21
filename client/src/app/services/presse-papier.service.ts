import { Injectable } from '@angular/core';
import { Trace } from '../../Trace';
import { TracesService } from './traces.service';
import { Point2D } from './point-2d/point-2d.service';
const DECALAGE_PAR_COPIE = 30.0;
const INSTRUCTION_MOVE = 'M';
const INSTRUCTION_LIGNE = 'L';
const INSTRUCTION_ARC = 'A';
const HEMI_G = '0 0, 1';
const HEMI_D = '0 0, 0';
const ESPACE = ' ';
@Injectable({
  providedIn: 'root',
})
export class PressePapierService {
  private tracesAColler: Trace[];
  nombreCopies: number;
  nombreDuplications: number;
  private tracesDansCanvas: Trace[];

  constructor(tracesServiceDansCanvas: TracesService) {
    this.tracesAColler = [];
    this.nombreCopies = 0;
    this.nombreDuplications = 0;
    this.tracesDansCanvas = tracesServiceDansCanvas.traces;
  }

  estVide(): boolean {
    return this.tracesAColler.length === 0;
  }

  copier(): void {
    this.tracesAColler = [];

    this.tracesDansCanvas.forEach((trace) => {
      if (trace.getSelect()) {
        this.tracesAColler.push(this.copierUnTrace(trace));
      }
    });
    this.nombreCopies = 0;
  }

  private copierUnTrace(traceACopier: Trace): Trace {
    const COPIE = new Trace(traceACopier.epaisseur, traceACopier.couleurP, traceACopier.couleurS);
    COPIE.type = traceACopier.type;
    COPIE.pointille = traceACopier.pointille;
    COPIE.instr = traceACopier.instr;
    return COPIE;
  }

  couper(): void {
    this.tracesAColler = [];
    for (let i = 0; i < this.tracesDansCanvas.length; i++) {
      if (this.tracesDansCanvas[i].getSelect()) {
        this.tracesAColler.push(this.copierUnTrace(this.tracesDansCanvas[i]));
        this.tracesDansCanvas.splice(i, 1);
        i --;
      }
    }
    this.nombreCopies = -1;
  }

  coller(): void {
    // TODO: détection out of bounds
    this.tracesAColler.forEach((traceAColler) => {
      const COPIE = this.copierUnTrace(traceAColler);
      COPIE.instr = this.collerPath(COPIE.instr, this.nombreCopies);
      this.tracesDansCanvas.push(COPIE);
    });
    this.nombreCopies ++;
  }

  private collerPath(path: string, nombreFoisDecalage: number): string {
    // TODO: ajouter un décalage aux positions contenus dans path
    return (this.translationInstr(path, nombreFoisDecalage, new Point2D(DECALAGE_PAR_COPIE, DECALAGE_PAR_COPIE)));
  }

  translationInstr(instruction: string, nombreFoisDecalage: number, deplacement: Point2D): string {
    let coordTranslatee = "";
    let instructionTranslatee = "";
    let compteA = false;
    while (instruction !== '') {
      const TYPE_INSTRUCTION: string = instruction[0];
      instruction = instruction.substr(1);
      switch (TYPE_INSTRUCTION) {
        case INSTRUCTION_MOVE: {
          coordTranslatee = this.translateML(instruction, nombreFoisDecalage, deplacement);
          instructionTranslatee += TYPE_INSTRUCTION;
          instructionTranslatee += coordTranslatee;
          break;
        }
        case INSTRUCTION_LIGNE: {
          coordTranslatee = this.translateML(instruction, nombreFoisDecalage, deplacement);
          instructionTranslatee += TYPE_INSTRUCTION;
          instructionTranslatee += coordTranslatee;
          break;
        }
        case INSTRUCTION_ARC: {
          coordTranslatee = this.translateA(instruction, compteA, nombreFoisDecalage, deplacement);
          instructionTranslatee += TYPE_INSTRUCTION;
          instructionTranslatee += coordTranslatee;
          compteA = true;
          break;
        }
        default: {
          break;
        }
      }
    }
    return instructionTranslatee;
  }
  translateML(instruction: string, nombreFoisDecalage: number, deplacement: Point2D): string {
    const SEPARATEUR = ',';

    let X = parseFloat(instruction);
    instruction = instruction.substr(instruction.indexOf(SEPARATEUR) + 1);

    let Y = parseFloat(instruction);
    X += deplacement.getX() * (nombreFoisDecalage + 1);
    Y += deplacement.getY() * (nombreFoisDecalage + 1);
    return X + SEPARATEUR + Y + ESPACE;
  }
  translateA(instruction: string, compteA: boolean, nombreFoisDecalage: number, deplacement: Point2D): string { // TODO chiffre magique
    let res;
    const SEPARATEUR = ',';
    const RX = parseFloat(instruction);
    instruction = instruction.substr(instruction.indexOf(SEPARATEUR) + 2);
    const RY = parseFloat(instruction);
    instruction = instruction.substr(instruction.indexOf(SEPARATEUR) + 4);
    let x = parseFloat(instruction);
    instruction = instruction.substr(instruction.indexOf(ESPACE) + 1);
    let y = parseFloat(instruction);
    x += deplacement.getX() * (nombreFoisDecalage + 1);
    y += deplacement.getY() * (nombreFoisDecalage + 1);
    if (!compteA) {
      res = RX + ESPACE + SEPARATEUR + ESPACE + RY + ESPACE + HEMI_G + ESPACE + x + ESPACE + y + ESPACE;
    } else {
      res = RX + ESPACE + SEPARATEUR + ESPACE + RY + ESPACE + HEMI_D + ESPACE + x + ESPACE + y + ESPACE;
    }
    return res;
  }
  dupliquer(): void {
    // TODO: détection out of bounds
    const TAILLE_TRACES_DANS_CANVAS_ORIGINALE = this.tracesDansCanvas.length;
    for (let i = 0; i < TAILLE_TRACES_DANS_CANVAS_ORIGINALE; i++) {
      if (this.tracesDansCanvas[i].getSelect()) {
        this.tracesDansCanvas.push(this.copierUnTrace(this.tracesDansCanvas[i]));
        this.tracesDansCanvas[this.tracesDansCanvas.length - 1].instr =
          this.collerPath(this.tracesDansCanvas[this.tracesDansCanvas.length - 1].instr, this.nombreDuplications - 1);
      }
    }
    this.nombreDuplications ++;
  }

  notificationChangementSelection(): void {
    this.nombreDuplications = 0;
  }

  supprimer(): void {
    for (let i = 0; i < this.tracesDansCanvas.length; i++) {
      if (this.tracesDansCanvas[i].getSelect()) {
        this.tracesDansCanvas.splice(i, 1);
        i --;
      }
    }
  }

  selectionGlobale(): void {
    for (const trace of this.tracesDansCanvas) {
      trace.setSelect(true);
    }
  }
}
