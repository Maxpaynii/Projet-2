import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AlertecreerComponent } from '../app/components/alertecreer/alertecreer.component';
import { ChoisirCouleurComponent } from '../app/components/choisir-couleur/choisir-couleur.component';
import { CreerNouveauDessinComponent } from '../app/components/creer-nouveau-dessin/creer-nouveau-dessin.component';
import { PageModalComponent } from '../app/components/page-modal/page-modal.component';
import {OutilCouleurService } from '../app/services/outil-couleur.service';
import {OutilActifService } from '../app/services/outil-actif.service';
import { TableCouleurComponent } from '../app/components/table-couleur/table-couleur.component';
import { TransparenceCouleurComponent } from '../app/components/transparence-couleur/transparence-couleur.component';
import { VueDessinComponent } from '../app/components/vue-dessin/vue-dessin.component';
import { ApplicateurCouleurService } from '../app/services/applicateur-couleur.service';
import { PipetteService } from '../app/services/pipette.service';
import { OutilTextService } from '../app/services/outil-text.service';
import { EtampeService } from '../app/services/etampe.service';
import {AnnulRefaitService} from '../app/services/annul-refait.service';
import { CanvasSpecialiseComponent } from './components/canvas-specialise/canvas-specialise.component';
import { ChargerEtiquetteComponent } from './components/charger-etiquette/charger-etiquette.component';
import { MatDialogService } from './services/mat-dialog.service';
import { CommunicationServeurService } from './services/communication-serveur.service';
import { TextComponent } from './components/text/text.component';
import { GrilleComponent } from './components/grille/grille.component';
import { GrilleService } from '../app/services/grille.service';
import { SauvegarderEtiquetteComponent } from './components/sauvegarder-etiquette/sauvegarder-etiquette.component';
import { EffaceService } from './services/efface.service';
import { MagnetismeService } from './services/magnetisme.service';
import { ChargementDataService } from './services/chargement-data.service';
import { AerosolService } from './services/aerosol.service';

@NgModule({
  entryComponents: [AlertecreerComponent, CreerNouveauDessinComponent, ChargerEtiquetteComponent, SauvegarderEtiquetteComponent, CanvasSpecialiseComponent],
  declarations: [
    AlertecreerComponent,
    PageModalComponent,
    VueDessinComponent,
    CreerNouveauDessinComponent,
    TableCouleurComponent,
    TransparenceCouleurComponent,
    ChoisirCouleurComponent,
    CanvasSpecialiseComponent,
    ChargerEtiquetteComponent,
    SauvegarderEtiquetteComponent,
    TextComponent,
    GrilleComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    BrowserAnimationsModule,
  ],
  exports: [
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
  ],
  providers: [OutilCouleurService, OutilActifService, GrilleService, OutilTextService, AnnulRefaitService, MatDialogService,
             CommunicationServeurService, ApplicateurCouleurService, PipetteService, EtampeService,
             EffaceService, ChargementDataService, MagnetismeService, AerosolService],
  bootstrap: [VueDessinComponent],
})
export class AppModule {
}
