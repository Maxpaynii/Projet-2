import { Injectable} from '@angular/core';
import { CrayonService } from './crayon.service';
import { EffaceService } from './efface.service';
import { Trace } from '../../Trace';
import { BehaviorSubject } from 'rxjs';

const UN = 1;
const ZERO = 0;
const VIDE = "";
const SIGNALSTROKE = "signalAppliqueStroke";
const SIGNALFILL = "signalAppliqueFill";
const SIGNALCREER = "signalCreer";
const SIGNALTEXTE = "signalTexte";
const SIGNALEFFACE = "signalEfface";
const SIGNALEFFACECLICK = "signalEfface1";
const SIGNALEFFACEBROSSE = "signalEfface2";
const REFAITEFFACE = "refaitEfface";
const REFAITEFFACECLICK = "refaitEfface1";
const REFAITEFFACEBROSSE = "refaitEfface2";
const REFAITTEXTE = "refaitTexte";
const REFAITCREER = "refaitcreer";
const REFAITSTROKE = "refaitAppliqueStroke";
const REFAITFILL = "refaitAppliqueFill";



@Injectable({
  providedIn: 'root',
})
export class AnnulRefaitService {

  tableauSignaux: string[];
  tableauSignauxRefait: string[];
  signauxRefaitEfface: string[];
  tabTraceTemp: Trace[];
  tableauTrace = new BehaviorSubject<Trace[]>([]);
  castT = this.tableauTrace.asObservable();
  signalApplicateurStroke = new BehaviorSubject<number>(ZERO);
  signalApplicateurFill = new BehaviorSubject<number>(ZERO);
  signalCreer = new BehaviorSubject<number>(ZERO);
  signalEfface = new BehaviorSubject<number>(ZERO);
  signalTexte = new BehaviorSubject<number>(ZERO);
  couleurEnleverFill = new BehaviorSubject<string>(VIDE);
  couleurEnleverStroke = new BehaviorSubject<string>(VIDE);
  temp: number;
  temp2: number;
  temp3: number;
  bonfils: number[];
  refaitBonfils: number[];
  tempCouleurFill: string;
  tempCouleurStroke: string;

  signalAppliqueStroke = new BehaviorSubject<boolean>(false);
  signalAppliqueFill = new BehaviorSubject<boolean>(false);
  signalAnnulTexte =  new BehaviorSubject<boolean>(false);
  signalRefaitTexte =  new BehaviorSubject<boolean>(false);
  couleurStroke = new BehaviorSubject<string>(VIDE);
  couleurFill = new BehaviorSubject<string>(VIDE);
  fils = new BehaviorSubject<number>(ZERO);

  castAppliqueStroke = this.signalAppliqueStroke.asObservable();
  castAppliqueFill = this.signalAppliqueFill.asObservable();
  castAnnulTexte = this.signalAnnulTexte.asObservable();
  castRefaitTexte = this.signalRefaitTexte.asObservable();
  castStroke = this.couleurStroke.asObservable();
  castFill = this.couleurFill.asObservable();
  castFils = this.fils.asObservable();

  constructor(private crayon: CrayonService, private efface: EffaceService) {
    this.tabTraceTemp = [];
    this.tableauSignaux = [];
    this.tableauSignauxRefait = [];
    this.signauxRefaitEfface = [];
    this.bonfils = [];
    this.refaitBonfils = [];
  }
  setTableauTrace(nouvelleTrace: Trace[]) {
      this.tableauTrace.next(nouvelleTrace);
      this.crayon.traces = this.tableauTrace.getValue();
  }
  setSignalAppliqueStroke(valeur: number, couleur: string, svgId: number, nouvelleAction: boolean) {
    this.signalApplicateurStroke.next(valeur);
    this.couleurEnleverStroke.next(couleur);
    this.bonfils.push(svgId);
    this.tempCouleurStroke = this.couleurEnleverStroke.getValue();
    this.tableauSignaux.push(SIGNALSTROKE);
    if (nouvelleAction) {
      this.supprimerRefait();
    }
    }
   setSignalAppliqueFill(valeur: number, couleur: string, svgId: number, nouvelleAction: boolean) {
    this.signalApplicateurFill.next(valeur);
    this.couleurEnleverFill.next(couleur);
    this.bonfils.push(svgId);
    this.tempCouleurFill = this.couleurEnleverFill.getValue();
    this.tableauSignaux.push(SIGNALFILL);
    if (nouvelleAction) {
      this.supprimerRefait();
    }
  }
  setSignalCreer(valeur: number, nouvelleAction: boolean) {
    this.signalCreer.next(valeur);
    this.temp2 = this.signalCreer.getValue();
    this.tableauSignaux.push(SIGNALCREER);
    if (nouvelleAction) {
      this.supprimerRefait();
    }
  }
  setSignalEfface(valeur: number, nouvelleAction: boolean) {
    this.signalEfface.next(valeur);
    this.temp = this.signalEfface.getValue();
    this.tableauSignaux.push(SIGNALEFFACE);
    if (nouvelleAction) {
      this.supprimerRefait();
    }
  }
  setSignalTexte(valeur: number, nouvelleAction: boolean) {
    this.signalTexte.next(valeur);
    this.temp3 = this.signalTexte.getValue();
    this.tableauSignaux.push(SIGNALTEXTE);
    if (nouvelleAction) {
      this.supprimerRefait();
    }
  }
  annulerDisponible(): boolean {
    let etat = true;
    if (this.tableauSignaux.length > ZERO )
      {  etat = false; }
    return etat;
  }
  refaireDisponible(): boolean {
    let etat = true;
    if (this.tableauSignauxRefait.length > ZERO) {
      etat = false;
    }
    return etat;
  }
  supprimerRefait() {
    const taille = this.tableauSignauxRefait.length;
    if (this.tableauSignauxRefait.length >= ZERO) {
      this.signauxRefaitEfface.pop();
      this.tabTraceTemp.pop();
    }
    for (let i = ZERO; i < taille; i++) {
      this.tableauSignauxRefait.pop();
    }
  }
  annuler() {

    if (this.tableauSignaux[this.tableauSignaux.length - UN] === SIGNALEFFACE) {
      if (this.temp !== undefined && this.temp !== ZERO) {
      if (this.efface.gereSignaux()[this.efface.gereSignaux().length - UN] === SIGNALEFFACECLICK) {
        this.efface.gereSignaux().pop();
        if (this.efface.gereDeclic().length !== ZERO) {
          this.crayon.traces.push(this.efface.gereDeclic()[this.efface.gereDeclic().length - UN]);
          this.efface.gereDeclic().pop();
          this.signauxRefaitEfface.push(REFAITEFFACECLICK);
        }
      } else if (this.efface.gereSignaux()[this.efface.gereSignaux().length - UN] === SIGNALEFFACEBROSSE) {
        if (this.efface.gereDeclic2().length !== ZERO) {
          while (this.efface.gereDeclic2().length > ZERO) {
            this.crayon.traces.push(this.efface.gereDeclic2()[this.efface.gereDeclic2().length - UN]);
            this.efface.gereDeclic2().pop();
            this.efface.gereSignaux().pop();
            this.signauxRefaitEfface.push(REFAITEFFACEBROSSE);
          }
        }
      }
      this.temp--;
      this.tableauSignaux.pop();
      this.tableauSignauxRefait.push(REFAITEFFACE);
    }
   } else if (this.tableauSignaux[this.tableauSignaux.length - UN] === SIGNALCREER) {
      if (this.temp2 !== undefined  && this.temp2 !== ZERO) {
        this.tabTraceTemp.push(this.crayon.traces[this.crayon.traces.length - UN] );
        this.crayon.traces.pop();
        this.tableauSignaux.pop();
        this.tableauSignauxRefait.push(REFAITCREER);
        this.temp2--;
      }
    } else if (this.tableauSignaux[this.tableauSignaux.length - UN] === SIGNALTEXTE) {
      //if (this.temp3 !== undefined  && this.temp3 !== ZERO) {
        this.signalAnnulTexte.next(true);
        this.tableauSignaux.pop();
        this.tableauSignauxRefait.push(REFAITTEXTE);
        //this.temp3--;
      //}

    } else if (this.tableauSignaux[this.tableauSignaux.length - UN] === SIGNALFILL) {
      this.signalAppliqueFill.next(true);
      this.couleurFill.next(this.tempCouleurFill);
      this.fils.next(this.bonfils[this.bonfils.length - UN]);
      this.refaitBonfils.push(this.bonfils[this.bonfils.length - UN]);
      this.bonfils.pop();
      this.tableauSignaux.pop();
      this.tableauSignauxRefait.push(REFAITFILL);
    } else if (this.tableauSignaux[this.tableauSignaux.length - UN] === SIGNALSTROKE) {
      this.signalAppliqueStroke.next(true);
      this.couleurStroke.next(this.tempCouleurStroke);
      this.fils.next(this.bonfils[this.bonfils.length - UN]);
      this.refaitBonfils.push(this.bonfils[this.bonfils.length - UN]);
      this.bonfils.pop();
      this.tableauSignaux.pop();
      this.tableauSignauxRefait.push(REFAITSTROKE);
    }
  }

  refaire() {

    if (this.tableauSignauxRefait[this.tableauSignauxRefait.length - UN] === REFAITEFFACE) {
      if (this.signauxRefaitEfface[this.signauxRefaitEfface.length - UN] === REFAITEFFACECLICK) {
        this.efface.tracesEffaces.push(this.crayon.traces[this.crayon.traces.length - UN]);
        this.crayon.traces.pop();
        this.setSignalEfface(this.efface.tracesEffaces.length, false);
        this.efface.signauxEfface.push(SIGNALEFFACECLICK);
        this.signauxRefaitEfface.pop();
      } else if (this.signauxRefaitEfface[this.signauxRefaitEfface.length - UN] === REFAITEFFACEBROSSE) {
          while (this.signauxRefaitEfface[this.signauxRefaitEfface.length - UN] === REFAITEFFACEBROSSE) {
            this.efface.tracesEffaces2.push(this.crayon.traces[this.crayon.traces.length - UN]);
            this.crayon.traces.pop();
            this.setSignalEfface(this.efface.tracesEffaces2.length, false);
            this.efface.signauxEfface.push(SIGNALEFFACEBROSSE);
            this.signauxRefaitEfface.pop();
          }
        }
      this.tableauSignauxRefait.pop();
    } else if (this.tableauSignauxRefait[this.tableauSignauxRefait.length - UN] === REFAITCREER) {
       this.crayon.traces.push(this.tabTraceTemp[this.tabTraceTemp.length - UN]);
       this.setSignalCreer(this.crayon.traces.length, false);
       this.tabTraceTemp.pop();
       this.tableauSignauxRefait.pop();
    }  else if (this.tableauSignauxRefait[this.tableauSignauxRefait.length - UN] === REFAITTEXTE) {
      this.setSignalTexte( this.temp3 +1, false);
      this.signalRefaitTexte.next(true);
      this.tableauSignauxRefait.pop();
    } else if (this.tableauSignauxRefait[this.tableauSignauxRefait.length - UN] === REFAITFILL) {
      this.setSignalAppliqueFill(UN, "#000000", this.refaitBonfils.length - UN, false);
      this.signalAppliqueFill.next(true);
      this.couleurFill.next(this.tempCouleurFill);
      this.fils.next(this.refaitBonfils[this.refaitBonfils.length - UN]);
      this.refaitBonfils.pop();
    } else if (this.tableauSignauxRefait[this.tableauSignauxRefait.length - UN] === REFAITSTROKE) {
      this.setSignalAppliqueStroke(UN, "#000000", this.refaitBonfils.length - UN, false);
      this.signalAppliqueStroke.next(true);
      this.couleurStroke.next(this.tempCouleurStroke);
      this.fils.next(this.refaitBonfils[this.refaitBonfils.length - UN]);
      this.refaitBonfils.pop();
    }
  }
}
