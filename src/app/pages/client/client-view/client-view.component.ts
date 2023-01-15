import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Client } from 'src/app/_models/client.model';
import { ClientPersonne } from 'src/app/_models/client.personne.model';
import { Objectif } from 'src/app/_models/objectif.model';
import { CrudService } from 'src/app/_services/crud.service';

@Component({
  selector: 'app-client-view',
  templateUrl: './client-view.component.html',
  styleUrls: ['./client-view.component.scss']
})
export class ClientViewComponent implements OnInit {

  client = new Client();
  isNewClient = true;

  objectifs = new Array<Objectif>();

  personne = new ClientPersonne();
  montrerFormulaire = false;

  constructor(
    private router: Router,
    private notifierService: NotifierService,
    private route: ActivatedRoute,
    private clientService: CrudService<Client>,
    private objectifService: CrudService<Objectif>,
  ) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (id) {
        this.clientService.get('client', id).then((data) => {
          this.client = data;
          if (!this.client.personnes) {
            this.client.personnes = new Array<ClientPersonne>();
          }
          this.isNewClient = false;
          this.objectifService.getAll('objectif').then((data) => {
            this.objectifs = data.filter((d) => {
              return true
            });
          });
        });
      }
    });
  }

  ajouter(personne: ClientPersonne) {
    this.client.personnes.push(personne);
    this.clientService.modify('client', this.client.id, this.client).then(() => {
      this.notifierService.notify('success', "saved successfully");
      this.personne = new ClientPersonne();
      this.montrerFormulaire = false;
    });
  }

  supprimer(personne: ClientPersonne) {
    const oui = confirm('Etes-vous sûr de vouloir supprimer cette personne ?');
    if (oui) {
      const personnes = new Array<ClientPersonne>();
      this.client.personnes.forEach((p) => {
        if (p.id !== personne.id) {
          personnes.push(p);
        }
      });
      this.client.personnes = personnes;
      this.clientService.modify('client', this.client.id, this.client).then(() => {
        this.notifierService.notify('success', "saved successfully");
        this.personne = new ClientPersonne();
        this.montrerFormulaire = false;
      });
    }
  }

  save() {
    console.log('saving');
    if (this.isNewClient) {
      console.log('nouveau');
      console.log(this.client);
      this.clientService.create('client', this.client).then((id) => {
        this.notifierService.notify('success', "saved successfully");
        this.router.navigate(['client', 'view', this.client.id]);
      });
    } else {
      this.clientService.modify('client', this.client.id, this.client).then(() => {
        this.notifierService.notify('success', "saved successfully");
        this.router.navigate(['client', 'view', this.client.id]);
      });
    }
  }

  getObjectif() {
    return this.objectifs.length > 0 ? this.objectifs[0] : new Objectif();
  }

}
