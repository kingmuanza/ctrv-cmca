import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Departement } from 'src/app/_models/departement.model';
import { TraductionPipe } from 'src/app/_pipes/traduction.pipe';
import { CrudService } from 'src/app/_services/crud.service';

@Component({
  selector: 'app-departement-edit',
  templateUrl: './departement-edit.component.html',
  styleUrls: ['./departement-edit.component.scss']
})
export class DepartementEditComponent implements OnInit {

  departement = new Departement();
  isNewDepartement = true;

  constructor(
    private traductionPipe: TraductionPipe,
    private router: Router,
    private notifierService: NotifierService,
    private route: ActivatedRoute,
    private departementService: CrudService<Departement>
  ) {    
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (id) {
        this.departementService.get('departement', id).then((data) => {
          this.departement = data;
          this.isNewDepartement = false;
        }); 
      }
    });
  }

  save() {
    console.log('saving');
    if (this.isNewDepartement) {
      console.log('nouveau');
      console.log(this.departement);
      this.departementService.create('departement', this.departement).then((id) => {
        this.notifierService.notify('success', "saved successfully");
        this.router.navigate(['departement', 'view', this.departement.id]);
      });
    } else {
      this.departementService.modify('departement', this.departement.id, this.departement).then(() => {
        this.notifierService.notify('success', "saved successfully");
        this.router.navigate(['departement', 'view', this.departement.id]);
      });
    }
  }

  delete() {
    const phrase = this.traductionPipe.transform('Etes-vous sûr de vouloir supprimer cet élément ?');
    const oui = confirm(phrase);
    if (oui) {
      this.departementService.delete('departement', this.departement.id).then(() => {
        this.router.navigate(['departement']);
      });
    }
  }

}
