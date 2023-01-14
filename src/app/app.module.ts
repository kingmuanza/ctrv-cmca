import { LOCALE_ID, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { DataTablesModule } from "angular-datatables";
import { NotifierModule } from 'angular-notifier';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AccueilComponent } from './pages/accueil/accueil.component';
import { ProduitListComponent } from './pages/produit/produit-list/produit-list.component';
import { ProduitViewComponent } from './pages/produit/produit-view/produit-view.component';
import { ProduitEditComponent } from './pages/produit/produit-edit/produit-edit.component';
import { CommercialListComponent } from './pages/commercial/commercial-list/commercial-list.component';
import { CommercialEditComponent } from './pages/commercial/commercial-edit/commercial-edit.component';
import { CommercialViewComponent } from './pages/commercial/commercial-view/commercial-view.component';
import { ProformaListComponent } from './pages/proforma/proforma-list/proforma-list.component';
import { ProformaEditComponent } from './pages/proforma/proforma-edit/proforma-edit.component';
import { ClientEditComponent } from './pages/client/client-edit/client-edit.component';
import { ClientListComponent } from './pages/client/client-list/client-list.component';
import { ClientViewComponent } from './pages/client/client-view/client-view.component';
import { MenuGaucheComponent } from './_components/menu-gauche/menu-gauche.component';
import { MenuHautComponent } from './_components/menu-haut/menu-haut.component';
import { TraductionPipe } from './_pipes/traduction.pipe';
import { NombrePipe } from './_pipes/nombre.pipe';
import { CurrencyPipe } from '@angular/common';
import { ObjectifListComponent } from './pages/objectif/objectif-list/objectif-list.component';
import { ObjectifViewComponent } from './pages/objectif/objectif-view/objectif-view.component';
import { ObjectifEditComponent } from './pages/objectif/objectif-edit/objectif-edit.component';
import { ProformaViewComponent } from './pages/proforma/proforma-view/proforma-view.component';
import { ProformavalideListComponent } from './pages/proformavalide/proformavalide-list/proformavalide-list.component';
import { ProformavalideEditComponent } from './pages/proformavalide/proformavalide-edit/proformavalide-edit.component';
import { ProformavalideViewComponent } from './pages/proformavalide/proformavalide-view/proformavalide-view.component';
import { ObjectifglobalListComponent } from './pages/objectifglobal/objectifglobal-list/objectifglobal-list.component';
import { ObjectifglobalEditComponent } from './pages/objectifglobal/objectifglobal-edit/objectifglobal-edit.component';
import { ObjectifglobalViewComponent } from './pages/objectifglobal/objectifglobal-view/objectifglobal-view.component';
import { RecouvrementListComponent } from './pages/recouvrement/recouvrement-list/recouvrement-list.component';
import { RecouvrementEditComponent } from './pages/recouvrement/recouvrement-edit/recouvrement-edit.component';
import { RecouvrementViewComponent } from './pages/recouvrement/recouvrement-view/recouvrement-view.component';
import { ConnexionComponent } from './pages/connexion/connexion.component';
import { AssistantListComponent } from './pages/assistant/assistant-list/assistant-list.component';
import { AssistantEditComponent } from './pages/assistant/assistant-edit/assistant-edit.component';
import { AssistantViewComponent } from './pages/assistant/assistant-view/assistant-view.component';
import { MonprofilComponent } from './pages/monprofil/monprofil.component';
import { DisplayStatsComponent } from './_components/display-stats/display-stats.component';
import { DisplayRadialChartComponent } from './_components/display-radial-chart/display-radial-chart.component';
import { DisplayDoughnutChartComponent } from './_components/display-doughnut-chart/display-doughnut-chart.component';
import { DashboardCommercialComponent } from './_components/dashboard-commercial/dashboard-commercial.component';
import { DashboardAssistantComponent } from './_components/dashboard-assistant/dashboard-assistant.component';
import { ComptableListComponent } from './pages/comptable/comptable-list/comptable-list.component';
import { ComptableEditComponent } from './pages/comptable/comptable-edit/comptable-edit.component';
import { ComptableViewComponent } from './pages/comptable/comptable-view/comptable-view.component';

registerLocaleData(localeFr);

@NgModule({
  declarations: [
    AppComponent,
    AccueilComponent,
    ProduitListComponent,
    ProduitViewComponent,
    ProduitEditComponent,
    CommercialListComponent,
    CommercialEditComponent,
    CommercialViewComponent,
    ProformaListComponent,
    ProformaEditComponent,
    ClientEditComponent,
    ClientListComponent,
    ClientViewComponent,
    MenuGaucheComponent,
    MenuHautComponent,
    TraductionPipe,
    NombrePipe,
    ObjectifListComponent,
    ObjectifViewComponent,
    ObjectifEditComponent,
    ProformaViewComponent,
    ProformavalideListComponent,
    ProformavalideEditComponent,
    ProformavalideViewComponent,
    ObjectifglobalListComponent,
    ObjectifglobalEditComponent,
    ObjectifglobalViewComponent,
    RecouvrementListComponent,
    RecouvrementEditComponent,
    RecouvrementViewComponent,
    ConnexionComponent,
    AssistantListComponent,
    AssistantEditComponent,
    AssistantViewComponent,
    MonprofilComponent,
    DisplayStatsComponent,
    DisplayRadialChartComponent,
    DisplayDoughnutChartComponent,
    DashboardCommercialComponent,
    DashboardAssistantComponent,
    ComptableListComponent,
    ComptableEditComponent,
    ComptableViewComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    DataTablesModule,
    HttpClientModule,
    NotifierModule.withConfig({
      position: {
        horizontal: {
          position: 'right',
          distance: 12
        },
        vertical: {
          position: 'top',
          distance: 12,
          gap: 10,

        },
      }
    }),
  ],
  providers: [
    TraductionPipe,
    CurrencyPipe,
    { provide: LOCALE_ID, useValue: 'fr-FR'},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
