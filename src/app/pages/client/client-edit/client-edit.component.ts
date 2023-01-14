import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Client } from 'src/app/_models/client.model';
import { TraductionPipe } from 'src/app/_pipes/traduction.pipe';
import { CrudService } from 'src/app/_services/crud.service';

@Component({
  selector: 'app-client-edit',
  templateUrl: './client-edit.component.html',
  styleUrls: ['./client-edit.component.scss']
})
export class ClientEditComponent implements OnInit {

  client = new Client();
  isNewClient = true;

  constructor(
    private traductionPipe: TraductionPipe,
    private router: Router,
    private notifierService: NotifierService,
    private route: ActivatedRoute,
    private clientService: CrudService<Client>
  ) {    
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (id) {
        this.clientService.get('client', id).then((data) => {
          this.client = data;
          this.isNewClient = false;
        }); 
      }
    });
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

  delete() {
    const phrase = this.traductionPipe.transform('Etes-vous sûr de vouloir supprimer cet élément ?');
    const oui = confirm(phrase);
    if (oui) {
      this.clientService.delete('client', this.client.id).then(() => {
        this.router.navigate(['client']);
      });
    }
  }

}
