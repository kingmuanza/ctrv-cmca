import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Objectifglobal } from 'src/app/_models/objectifglobal.model';
import { TraductionPipe } from 'src/app/_pipes/traduction.pipe';
import { CrudService } from 'src/app/_services/crud.service';

@Component({
  selector: 'app-objectifglobal-edit',
  templateUrl: './objectifglobal-edit.component.html',
  styleUrls: ['./objectifglobal-edit.component.scss']
})
export class ObjectifglobalEditComponent implements OnInit {

  objectifglobal = new Objectifglobal();
  isNewObjectifglobal = true;

  constructor(
    private traductionPipe: TraductionPipe,
    private router: Router,
    private notifierService: NotifierService,
    private route: ActivatedRoute,
    private objectifglobalService: CrudService<Objectifglobal>
  ) {    
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (id) {
        this.objectifglobalService.get('objectifglobal', id).then((data) => {
          this.objectifglobal = data;
          this.isNewObjectifglobal = false;
        }); 
      }
    });
  }

  save() {
    this.objectifglobal.id = this.objectifglobal.annee + '';
    console.log('saving');
    if (this.isNewObjectifglobal) {
      console.log('nouveau');
      console.log(this.objectifglobal);
      this.objectifglobalService.create('objectifglobal', this.objectifglobal).then((id) => {
        this.notifierService.notify('success', "saved successfully");
        this.router.navigate(['objectifglobal']);
      });
    } else {
      this.objectifglobalService.modify('objectifglobal', this.objectifglobal.id, this.objectifglobal).then(() => {
        this.notifierService.notify('success', "saved successfully");
        this.router.navigate(['objectifglobal']);
      });
    }
  }

  delete() {
    const phrase = this.traductionPipe.transform('Etes-vous sûr de vouloir supprimer cet élément ?');
    const oui = confirm(phrase);
    if (oui) {
      this.objectifglobalService.delete('objectifglobal', this.objectifglobal.id).then(() => {
        this.router.navigate(['objectifglobal']);
      });
    }
  }

}
