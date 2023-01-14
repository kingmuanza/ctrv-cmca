import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Client } from 'src/app/_models/client.model';
import { Proforma } from 'src/app/_models/proforma.model';
import { Recouvrement } from 'src/app/_models/recouvrement.model';
import { TraductionPipe } from 'src/app/_pipes/traduction.pipe';
import { CrudService } from 'src/app/_services/crud.service';

@Component({
  selector: 'app-recouvrement-edit',
  templateUrl: './recouvrement-edit.component.html',
  styleUrls: ['./recouvrement-edit.component.scss']
})
export class RecouvrementEditComponent implements OnInit {

  recouvrement = new Recouvrement();
  recouvrements = new Array<Recouvrement>();

  isNewRecouvrement = true;
  proformas = new Array<Proforma>();
  clients = new Array<Client>();
  montantRestant = 0;;

  constructor(
    private traductionPipe: TraductionPipe,
    private router: Router,
    private notifierService: NotifierService,
    private route: ActivatedRoute,
    private proformaService: CrudService<Proforma>,
    private clientService: CrudService<Client>,
    private recouvrementService: CrudService<Recouvrement>
  ) {
  }

  ngOnInit(): void {
    this.recouvrementService.getAll('recouvrement').then((data) => {
      this.recouvrements = data.filter((d) => {
        return true;
      });
    });
    this.proformaService.getAll('proforma').then((data) => {
      this.proformas = data.filter((d) => {
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

            this.proformas.forEach(element => {
              if (this.recouvrement.proforma && element.id === this.recouvrement.proforma.id) {
                this.recouvrement.proforma = element;
              }
            });
          });
        }
      });
    });
  }

  save() {
    console.log('saving');
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
      this.recouvrementService.delete('recouvrement', this.recouvrement.id).then(() => {
        this.router.navigate(['recouvrement']);
      });
    }
  }

}
