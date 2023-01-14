import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Chart } from 'chart.js';
import { Assistant } from 'src/app/_models/assistant.model';
import { Objectif } from 'src/app/_models/objectif.model';
import { Objectifglobal } from 'src/app/_models/objectifglobal.model';
import { Proforma } from 'src/app/_models/proforma.model';
import { Recouvrement } from 'src/app/_models/recouvrement.model';
import { CrudService } from 'src/app/_services/crud.service';

@Component({
  selector: 'app-assistant-view',
  templateUrl: './assistant-view.component.html',
  styleUrls: ['./assistant-view.component.scss']
})
export class AssistantViewComponent implements OnInit {

  assistant = new Assistant();
  isNewAssistant = true;

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
    private assistantService: CrudService<Assistant>,
  ) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (id) {        
        this.assistantService.get('assistant', id).then((data) => {
          this.assistant = data;
          this.isNewAssistant = false;
        }); 
      }
    });
  }

  save() {
    console.log('saving');
    if (this.isNewAssistant) {
      console.log('nouveau');
      console.log(this.assistant);
      this.assistantService.create('assistant', this.assistant).then((id) => {
        this.notifierService.notify('success', "saved successfully");
        this.router.navigate(['assistant', 'view', this.assistant.id]);
      });
    } else {
      this.assistantService.modify('assistant', this.assistant.id, this.assistant).then(() => {
        this.notifierService.notify('success', "saved successfully");
        this.router.navigate(['assistant', 'view', this.assistant.id]);
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
