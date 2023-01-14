import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Comptable } from 'src/app/_models/comptable.model';
import { Objectif } from 'src/app/_models/objectif.model';
import { Objectifglobal } from 'src/app/_models/objectifglobal.model';
import { Proforma } from 'src/app/_models/proforma.model';
import { Recouvrement } from 'src/app/_models/recouvrement.model';
import { CrudService } from 'src/app/_services/crud.service';

@Component({
  selector: 'app-comptable-view',
  templateUrl: './comptable-view.component.html',
  styleUrls: ['./comptable-view.component.scss']
})
export class ComptableViewComponent implements OnInit {

  comptable = new Comptable();
  isNewComptable = true;

  objectifs = new Array<Objectif>();

  proformas = new Array<Proforma>();
  proformasValidees = new Array<Proforma>();
  recouvrements = new Array<Recouvrement>();

  totalProformasNonValidees = 0;
  totalProformasValidees = 0;
  totalObjectifs = 0;
  totalRecouvrements = 0;

  objectifglobal = new Objectifglobal();

  annee = new Date().getFullYear();
  barChart: any;
  polarChart: any;
  doughnut: any;


  constructor(
    private router: Router,
    private notifierService: NotifierService,
    private route: ActivatedRoute,
    private comptableService: CrudService<Comptable>,
  ) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (id) {        
        this.comptableService.get('comptable', id).then((data) => {
          this.comptable = data;
          this.isNewComptable = false;
        }); 
      }
    });
  }

  save() {
    console.log('saving');
    if (this.isNewComptable) {
      console.log('nouveau');
      console.log(this.comptable);
      this.comptableService.create('comptable', this.comptable).then((id) => {
        this.notifierService.notify('success', "saved successfully");
        this.router.navigate(['comptable', 'view', this.comptable.id]);
      });
    } else {
      this.comptableService.modify('comptable', this.comptable.id, this.comptable).then(() => {
        this.notifierService.notify('success', "saved successfully");
        this.router.navigate(['comptable', 'view', this.comptable.id]);
      });
    }
  }

  getTotalProformas(proformas: Array<Proforma>) {
    let total = 0;
    proformas.forEach((element) => {
      total += element.montant;
    });
    return total;
  }

  getTotalProformasValidees(proformas: Array<Proforma>) {
    let total = 0;
    proformas.forEach((element) => {
      total += element.montantValidee;
    });
    return total;
  }

  getTotalObjectifs(): number {
    let total = 0;
    this.objectifs.forEach((element) => {
      total += element.montant;
    });
    return total;
  }

  getTotalRecouvrements(): number {
    let total = 0;
    this.recouvrements.forEach((element) => {
      total += element.montant;
    });
    return total;
  }

}
