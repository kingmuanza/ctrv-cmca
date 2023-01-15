import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProduitListComponent } from './pages/produit/produit-list/produit-list.component';
import { ProduitEditComponent } from './pages/produit/produit-edit/produit-edit.component';
import { ProduitViewComponent } from './pages/produit/produit-view/produit-view.component';
import { CommercialEditComponent } from './pages/commercial/commercial-edit/commercial-edit.component';
import { CommercialListComponent } from './pages/commercial/commercial-list/commercial-list.component';
import { CommercialViewComponent } from './pages/commercial/commercial-view/commercial-view.component';
import { ObjectifEditComponent } from './pages/objectif/objectif-edit/objectif-edit.component';
import { ObjectifListComponent } from './pages/objectif/objectif-list/objectif-list.component';
import { ObjectifViewComponent } from './pages/objectif/objectif-view/objectif-view.component';
import { ClientEditComponent } from './pages/client/client-edit/client-edit.component';
import { ClientListComponent } from './pages/client/client-list/client-list.component';
import { ClientViewComponent } from './pages/client/client-view/client-view.component';
import { ProformaEditComponent } from './pages/proforma/proforma-edit/proforma-edit.component';
import { ProformaListComponent } from './pages/proforma/proforma-list/proforma-list.component';
import { ProformaViewComponent } from './pages/proforma/proforma-view/proforma-view.component';
import { AccueilComponent } from './pages/accueil/accueil.component';
import { ProformavalideEditComponent } from './pages/proformavalide/proformavalide-edit/proformavalide-edit.component';
import { ProformavalideListComponent } from './pages/proformavalide/proformavalide-list/proformavalide-list.component';
import { ProformavalideViewComponent } from './pages/proformavalide/proformavalide-view/proformavalide-view.component';
import { ObjectifglobalEditComponent } from './pages/objectifglobal/objectifglobal-edit/objectifglobal-edit.component';
import { ObjectifglobalListComponent } from './pages/objectifglobal/objectifglobal-list/objectifglobal-list.component';
import { ObjectifglobalViewComponent } from './pages/objectifglobal/objectifglobal-view/objectifglobal-view.component';
import { RecouvrementEditComponent } from './pages/recouvrement/recouvrement-edit/recouvrement-edit.component';
import { RecouvrementListComponent } from './pages/recouvrement/recouvrement-list/recouvrement-list.component';
import { RecouvrementViewComponent } from './pages/recouvrement/recouvrement-view/recouvrement-view.component';
import { ConnexionComponent } from './pages/connexion/connexion.component';
import { AssistantEditComponent } from './pages/assistant/assistant-edit/assistant-edit.component';
import { AssistantListComponent } from './pages/assistant/assistant-list/assistant-list.component';
import { AssistantViewComponent } from './pages/assistant/assistant-view/assistant-view.component';
import { MonprofilComponent } from './pages/monprofil/monprofil.component';
import { ComptableEditComponent } from './pages/comptable/comptable-edit/comptable-edit.component';
import { ComptableListComponent } from './pages/comptable/comptable-list/comptable-list.component';
import { ComptableViewComponent } from './pages/comptable/comptable-view/comptable-view.component';
import { DepartementEditComponent } from './pages/departement/departement-edit/departement-edit.component';
import { DepartementListComponent } from './pages/departement/departement-list/departement-list.component';
import { DepartementViewComponent } from './pages/departement/departement-view/departement-view.component';

const routes: Routes = [

  { path: 'accueil', component: AccueilComponent},
  { path: 'connexion', component: ConnexionComponent},
  { path: 'monprofil', component: MonprofilComponent},

  { path: 'assistant', component: AssistantListComponent},
  { path: 'assistant/edit', component: AssistantEditComponent},
  { path: 'assistant/edit/:id', component: AssistantEditComponent},
  { path: 'assistant/view/:id', component: AssistantViewComponent},
  
  { path: 'produit', component: ProduitListComponent},
  { path: 'produit/edit', component: ProduitEditComponent},
  { path: 'produit/edit/:id', component: ProduitEditComponent},
  { path: 'produit/view/:id', component: ProduitViewComponent},
  
  { path: 'client', component: ClientListComponent},
  { path: 'client/edit', component: ClientEditComponent},
  { path: 'client/edit/:id', component: ClientEditComponent},
  { path: 'client/view/:id', component: ClientViewComponent},

  { path: 'commercial', component: CommercialListComponent},
  { path: 'commercial/edit', component: CommercialEditComponent},
  { path: 'commercial/edit/:id', component: CommercialEditComponent},
  { path: 'commercial/view/:id', component: CommercialViewComponent},

  { path: 'comptable', component: ComptableListComponent},
  { path: 'comptable/edit', component: ComptableEditComponent},
  { path: 'comptable/edit/:id', component: ComptableEditComponent},
  { path: 'comptable/view/:id', component: ComptableViewComponent},

  { path: 'departement', component: DepartementListComponent},
  { path: 'departement/edit', component: DepartementEditComponent},
  { path: 'departement/edit/:id', component: DepartementEditComponent},
  { path: 'departement/view/:id', component: DepartementViewComponent},

  { path: 'objectif', component: ObjectifListComponent},
  { path: 'objectif/edit', component: ObjectifEditComponent},
  { path: 'objectif/edit/:id', component: ObjectifEditComponent},
  { path: 'objectif/view/:id', component: ObjectifViewComponent},

  { path: 'objectifglobal', component: ObjectifglobalListComponent},
  { path: 'objectifglobal/edit', component: ObjectifglobalEditComponent},
  { path: 'objectifglobal/edit/:id', component: ObjectifglobalEditComponent},
  { path: 'objectifglobal/view/:id', component: ObjectifglobalViewComponent},

  { path: 'proforma', component: ProformaListComponent},
  { path: 'proforma/edit', component: ProformaEditComponent},
  { path: 'proforma/edit/:id', component: ProformaEditComponent},
  { path: 'proforma/view/:id', component: ProformaViewComponent},

  { path: 'proformavalide', component: ProformavalideListComponent},
  { path: 'proformavalide/edit', component: ProformavalideEditComponent},
  { path: 'proformavalide/edit/:id', component: ProformavalideEditComponent},
  { path: 'proformavalide/view/:id', component: ProformavalideViewComponent},

  { path: 'recouvrement', component: RecouvrementListComponent},
  { path: 'recouvrement/edit', component: RecouvrementEditComponent},
  { path: 'recouvrement/edit/:id', component: RecouvrementEditComponent},
  { path: 'recouvrement/view/:id', component: RecouvrementViewComponent},

  { path: '**', redirectTo: 'accueil'},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
