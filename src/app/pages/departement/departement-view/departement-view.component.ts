import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Departement } from 'src/app/_models/departement.model';
import { Objectif } from 'src/app/_models/objectif.model';
import { CrudService } from 'src/app/_services/crud.service';

@Component({
  selector: 'app-departement-view',
  templateUrl: './departement-view.component.html',
  styleUrls: ['./departement-view.component.scss']
})
export class DepartementViewComponent implements OnInit {

  departement = new Departement();
  isNewDepartement = true;

  objectifs = new Array<Objectif>();

  montrerFormulaire = false;

  constructor(
    private router: Router,
    private notifierService: NotifierService,
    private route: ActivatedRoute,
    private departementService: CrudService<Departement>,
    private objectifService: CrudService<Objectif>,
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

  getObjectif() {
    return this.objectifs.length > 0 ? this.objectifs[0] : new Objectif();
  }

}
