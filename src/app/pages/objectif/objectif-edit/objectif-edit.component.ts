import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Commercial } from 'src/app/_models/commercial.model';
import { Objectif } from 'src/app/_models/objectif.model';
import { TraductionPipe } from 'src/app/_pipes/traduction.pipe';
import { CrudService } from 'src/app/_services/crud.service';

@Component({
  selector: 'app-objectif-edit',
  templateUrl: './objectif-edit.component.html',
  styleUrls: ['./objectif-edit.component.scss']
})
export class ObjectifEditComponent implements OnInit {

  objectif = new Objectif();
  isNewObjectif = true;
  commercials = new Array<Commercial>();


  constructor(
    private traductionPipe: TraductionPipe,
    private router: Router,
    private notifierService: NotifierService,
    private route: ActivatedRoute,
    private commercialService: CrudService<Commercial>,
    private objectifService: CrudService<Objectif>
  ) {    
  }

  ngOnInit(): void {
    this.commercialService.getAll('commercial').then((data) => {
      this.commercials = data.filter((d) => {
        return true;
      });
      this.route.paramMap.subscribe((paramMap) => {
        const id = paramMap.get('id');
        if (id) {
          this.objectifService.get('objectif', id).then((data) => {
            this.objectif = data;
            this.isNewObjectif = false;
            this.commercials.forEach(element => {
              if (this.objectif.commercial && element.id === this.objectif.commercial.id) {
                this.objectif.commercial = element;
              }
            });
          }); 
        }
      });
    });
  }

  save() {
    console.log('saving');
    if (this.isNewObjectif) {
      console.log('nouveau');
      console.log(this.objectif);
      this.objectifService.create('objectif', this.objectif).then((id) => {
        this.notifierService.notify('success', "saved successfully");
        this.router.navigate(['objectif', 'view', this.objectif.id]);
      });
    } else {
      this.objectifService.modify('objectif', this.objectif.id, this.objectif).then(() => {
        this.notifierService.notify('success', "saved successfully");
        this.router.navigate(['objectif', 'view', this.objectif.id]);
      });
    }
  }

  delete() {
    const phrase = this.traductionPipe.transform('Etes-vous sûr de vouloir supprimer cet élément ?');
    const oui = confirm(phrase);
    if (oui) {
      this.objectifService.delete('objectif', this.objectif.id).then(() => {
        this.router.navigate(['objectif']);
      });
    }
  }

}
