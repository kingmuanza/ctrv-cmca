import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Subscription } from 'rxjs';
import { Client } from 'src/app/_models/client.model';
import { Proforma } from 'src/app/_models/proforma.model';
import { Recouvrement } from 'src/app/_models/recouvrement.model';
import { Utilisateur } from 'src/app/_models/utilisateur.model';
import { TraductionPipe } from 'src/app/_pipes/traduction.pipe';
import { AuthService } from 'src/app/_services/auth.service';
import { CrudService } from 'src/app/_services/crud.service';

@Component({
  selector: 'app-recouvrement-edit',
  templateUrl: './recouvrement-edit.component.html',
  styleUrls: ['./recouvrement-edit.component.scss']
})
export class RecouvrementEditComponent implements OnInit {

  utilisateur: Utilisateur | undefined;
  utilisateurSubscription!: Subscription;

  recouvrement = new Recouvrement();
  recouvrements = new Array<Recouvrement>();

  isNewRecouvrement = true;
  proformas = new Array<Proforma>();
  clients = new Array<Client>();
  montantRestant = 0;;

  constructor(
    private traductionPipe: TraductionPipe,
    private router: Router,
    private authservice: AuthService,
    private notifierService: NotifierService,
    private route: ActivatedRoute,
    private proformaService: CrudService<Proforma>,
    private clientService: CrudService<Client>,
    private recouvrementService: CrudService<Recouvrement>
  ) {
  }

  ngOnInit(): void {
    this.utilisateurSubscription = this.authservice.userSubject.subscribe((utilisateur) => {
      this.utilisateur = utilisateur;
    });
    this.authservice.emit();

    this.recouvrementService.getAll('recouvrement').then((data) => {
      this.recouvrements = data.filter((d) => {
        return true;
      });
    });

    this.proformaService.getAll('proforma').then((proformas) => {
      this.proformas = proformas.filter((d) => {
        return d.validee;
      });
      this.clientService.getAll('client').then((data) => {
        this.clients = data.filter((d) => {
          return true;
        });
      });
      this.route.paramMap.subscribe((paramMap) => {
        const id = paramMap.get('id');
        if (id) {
          this.recouvrementService.get('recouvrement', id).then((data) => {
            this.recouvrement = data;
            this.isNewRecouvrement = false;

            proformas.forEach(element => {
              if (this.recouvrement.proforma && element.id === this.recouvrement.proforma.id) {
                this.recouvrement.proforma = element;
              }
            });
          });
        }
      });
    });
  }

  getLibelle(recouvrement: Recouvrement) {
    // return 'Mua nz';
    return recouvrement.proforma.id + ' ' + recouvrement.proforma.client.nom + ' ' + (recouvrement.proforma.montantValidee) + ' ' + (recouvrement.proforma.date)
  }

  save() {
    console.log('saving');
    this.recouvrement.validateur = this.utilisateur;
    if (this.recouvrement.montant <= this.montantRestant) {
      if (this.isNewRecouvrement) {
        console.log('nouveau');
        console.log(this.recouvrement);
        this.recouvrementService.create('recouvrement', this.recouvrement).then((id) => {
          this.notifierService.notify('success', "saved successfully");
          this.saveProforma();
          this.router.navigate(['recouvrement']);
        });
      } else {
        this.recouvrementService.modify('recouvrement', this.recouvrement.id, this.recouvrement).then(() => {
          this.notifierService.notify('success', "saved successfully");
          this.saveProforma();
          this.router.navigate(['recouvrement']);
        });
      }
    } else {
      this.notifierService.notify('error', "Le montant est supérieur au montant restant");
    }
  }

  private saveProforma() {
    if (this.recouvrement.montant === this.montantRestant) {
      this.recouvrement.proforma.statut = Proforma.PAYEE;
      this.proformaService.modify('proforma', this.recouvrement.proforma.id, this.recouvrement.proforma).then(() => {
        this.notifierService.notify('success', "Proforma update");
      });
    }
  }

  updateMontant(proforma: Proforma) {
    this.recouvrement.montant = proforma.montant;
    this.recouvrements.forEach((element) => {
      if (element.proforma.id === proforma.id) {
        this.recouvrement.montant -= element.montant;
      }
    });
    this.montantRestant = this.recouvrement.montant;
  }
  delete() {
    const phrase = this.traductionPipe.transform('Etes-vous sûr de vouloir supprimer cet élément ?');
    const oui = confirm(phrase);
    if (oui) {
      this.recouvrement.proforma.statut = Proforma.IMPAYEE;
      this.proformaService.modify('proforma', this.recouvrement.proforma.id, this.recouvrement.proforma).then(() => {
        this.notifierService.notify('success', "Proforma update");
        this.recouvrementService.delete('recouvrement', this.recouvrement.id).then(() => {
          this.router.navigate(['recouvrement']);
        });
      });
    }
  }

}
