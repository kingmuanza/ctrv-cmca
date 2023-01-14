import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Chart } from 'chart.js';
import { Commercial } from 'src/app/_models/commercial.model';
import { Objectifglobal } from 'src/app/_models/objectifglobal.model';
import { Proforma } from 'src/app/_models/proforma.model';
import { Recouvrement } from 'src/app/_models/recouvrement.model';
import { CrudService } from 'src/app/_services/crud.service';

@Component({
  selector: 'app-display-doughnut-chart',
  templateUrl: './display-doughnut-chart.component.html',
  styleUrls: ['./display-doughnut-chart.component.scss']
})
export class DisplayDoughnutChartComponent implements OnInit {

  @Input() annee = 2022;
  @Input() recouvrements = new Array<Recouvrement>();
  @Input() proformas = new Array<Proforma>();

  commerciaux = new Array<Commercial>();

  proformasNonValidees = new Array<Proforma>();
  proformasValidees = new Array<Proforma>();

  totalProformasNonValidees = 0;
  totalProformasValidees = 0;
  totalObjectifs = 0;
  totalRecouvrements = 0;

  objectifglobal = new Objectifglobal();

  polarChart: any;

  constructor(
    private router: Router,
    private proformaService: CrudService<Proforma>,
    private recouvrementService: CrudService<Recouvrement>,
    private objectifglobalService: CrudService<Objectifglobal>,
  ) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.refreshAll();
  }

  ngAfterViewInit(): void {
    this.init();
  }

  private init() {
    const recouvrements = this.recouvrements.filter((d) => {
      return new Date(d.date).getFullYear() == this.annee;
    });
    this.totalRecouvrements = this.getTotalRecouvrements(recouvrements);
    this.objectifglobalService.get('objectifglobal', this.annee + '').then((data) => {
      this.objectifglobal = data;
      this.totalObjectifs = data.montant;

      this.proformasNonValidees = this.proformas.filter((d) => {
        return !d.validee;
      });
      this.proformasValidees = this.proformas.filter((d) => {
        return d.validee;
      });
      this.totalProformasNonValidees = this.getTotalProformas(this.proformasNonValidees);
      this.totalProformasValidees = this.getTotalProformasValidees(this.proformasValidees);
      this.dessinerGraphes(this.annee);
    });
  }

  refreshAll() {
    if (this.polarChart) {
      this.polarChart.clear();
      this.polarChart.destroy();
    }
    this.init();
  }

  private dessinerGraphes(annee: number) {
    const data2 = [
      { year: 'Objectif restant', count: this.totalObjectifs - this.totalProformasNonValidees - this.totalProformasValidees },
      { year: 'Proformas non validés', count: this.totalProformasNonValidees },
      { year: 'Proformas validés non recouvrées ', count: this.totalProformasValidees - this.totalRecouvrements },
      { year: 'Recouvrement', count: this.totalRecouvrements },
    ];

    let ctxRadial: any = document.getElementById('doughnut-chart');
    const colors = ['#878787', '#00AFF0', '#fa6800', '#60a917'];

    this.polarChart = new Chart(
      ctxRadial,
      {
        type: 'doughnut',
        data: {
          labels: data2.map(row => row.year),
          datasets: [
            {
              label: 'Objectif annuel',
              data: data2.map(row => row.count),
              backgroundColor: colors,
            }
          ]
        }
      }
    );
  }

  edit(proforma?: Proforma) {
    if (proforma) {
      this.router.navigate(['proforma', 'view', proforma.id]);
    } else {
      this.router.navigate(['proforma', 'edit']);
    }
  }

  ngOnInit(): void {
    // this.dtOptions = this.initNouveau();    
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

  getTotalRecouvrements(recouvrements = new Array<Recouvrement>()): number {
    let total = 0;
    recouvrements.forEach((element) => {
      total += element.montant;
    });
    return total;
  }

  getProformas(commercial: Commercial) {
    let total = 0;
    this.proformas.forEach((element) => {
      if (element.commercial.id === commercial.id)
        total += element.montant;
    });
    return total;
  }

  getProformasValidees(commercial: Commercial) {
    let total = 0;
    this.proformasValidees.forEach((element) => {
      if (element.commercial.id === commercial.id && element.validee)
        total += element.montantValidee;
    });
    return total;
  }

}
