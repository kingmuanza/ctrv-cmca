import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Subscription } from 'rxjs';
import { Client } from 'src/app/_models/client.model';
import { Commercial } from 'src/app/_models/commercial.model';
import { Proforma } from 'src/app/_models/proforma.model';
import { Utilisateur } from 'src/app/_models/utilisateur.model';
import { TraductionPipe } from 'src/app/_pipes/traduction.pipe';
import { AuthService } from 'src/app/_services/auth.service';
import { CrudService } from 'src/app/_services/crud.service';

@Component({
  selector: 'app-proformavalide-edit',
  templateUrl: './proformavalide-edit.component.html',
  styleUrls: ['./proformavalide-edit.component.scss']
})
export class ProformavalideEditComponent implements OnInit {

  utilisateur: Utilisateur | undefined;
  utilisateurSubscription!: Subscription;

  proforma = new Proforma();
  isNewProforma = true;
  commercials = new Array<Commercial>();
  clients = new Array<Client>();

  constructor(
    private traductionPipe: TraductionPipe,
    private router: Router,
    private authservice: AuthService,
    private notifierService: NotifierService,
    private route: ActivatedRoute,
    private commercialService: CrudService<Commercial>,
    private clientService: CrudService<Client>,
    private proformaService: CrudService<Proforma>
  ) {    
  }

  ngOnInit(): void {
    
    this.utilisateurSubscription = this.authservice.userSubject.subscribe((utilisateur) => {
      this.utilisateur = utilisateur;      
    });
    this.authservice.emit();

    this.commercialService.getAll('commercial').then((data) => {
      this.commercials = data.filter((d) => {
        return true;
      });
    });
    this.clientService.getAll('client').then((data) => {
      this.clients = data.filter((d) => {
        return true;
      });
    });
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (id) {
        this.proformaService.get('proforma', id).then((data) => {
          this.proforma = data;
          this.isNewProforma = false;
          if (!this.proforma.dateValidation) {
            this.proforma.dateValidation = new Date();
          }
          if (!this.proforma.montantValidee) {
            this.proforma.montantValidee = this.proforma.montant;
          }
        }); 
      }
    });
  }

  save() {
    console.log('saving');
    this.proforma.validee = Proforma.VALIDEE;
    this.proforma.validateur = this.utilisateur;
    if (this.isNewProforma) {
      console.log('nouveau');
      console.log(this.proforma);
      this.proformaService.create('proforma', this.proforma).then((id) => {
        this.notifierService.notify('success', "saved successfully");
        this.router.navigate(['proformavalide', 'view', this.proforma.id]);
      });
    } else {
      this.proformaService.modify('proforma', this.proforma.id, this.proforma).then(() => {
        this.notifierService.notify('success', "saved successfully");
        // window.location.reload();
      });
    }
  }

  unsave() {
    console.log('saving');
    this.proforma.validee = Proforma.INVALIDEE;
    this.proforma.validateur = this.utilisateur;
    if (this.isNewProforma) {
      console.log('nouveau');
      console.log(this.proforma);
      this.proformaService.create('proforma', this.proforma).then((id) => {
        this.notifierService.notify('success', "saved successfully");
        this.router.navigate(['proformavalide', 'view', this.proforma.id]);
      });
    } else {
      this.proformaService.modify('proforma', this.proforma.id, this.proforma).then(() => {
        this.notifierService.notify('success', "saved successfully");
        window.location.reload();
      });
    }
  }

  getNomValidateur(proforma: Proforma): string {
    let nom = '';
    if (proforma.validateur) {
      if(proforma.validateur.assistant) {
        nom = proforma.validateur.assistant.noms + ' ' + proforma.validateur.assistant.prenoms;
      }
    }
    return nom;
  }

  delete() {
    const phrase = this.traductionPipe.transform('Etes-vous sûr de vouloir supprimer cet élément ?');
    const oui = confirm(phrase);
    if (oui) {
      this.proformaService.delete('proforma', this.proforma.id).then(() => {
        this.router.navigate(['proforma']);
      });
    }
  }

}
