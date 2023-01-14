import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Chart } from 'chart.js';
import { Commercial } from 'src/app/_models/commercial.model';
import { Objectif } from 'src/app/_models/objectif.model';
import { Objectifglobal } from 'src/app/_models/objectifglobal.model';
import { Proforma } from 'src/app/_models/proforma.model';
import { Recouvrement } from 'src/app/_models/recouvrement.model';
import { CrudService } from 'src/app/_services/crud.service';

@Component({
  selector: 'app-dashboard-commercial',
  templateUrl: './dashboard-commercial.component.html',
  styleUrls: ['./dashboard-commercial.component.scss']
})
export class DashboardCommercialComponent implements OnInit, OnChanges {

  @Input() id = '';

  commercial = new Commercial();
  isNewCommercial = true;

  objectifs = new Array<Objectif>();


  proformas = new Array<Proforma>();
  proformasValidees = new Array<Proforma>();
  recouvrements = new Array<Recouvrement>();

  totalProformasNonValidees = 0;
  totalProformasValidees = 0;
  totalObjectifs = 0;
  totalRecouvrements = 0;

  objectifglobal = new Objectifglobal();

  annee = 2022;
  barChart: any;
  polarChart: any;
  doughnut: any;

  constructor(
    private router: Router,
    private notifierService: NotifierService,
    private route: ActivatedRoute,
    private commercialService: CrudService<Commercial>,
    private objectifService: CrudService<Objectif>,
    private proformaService: CrudService<Proforma>,
    private recouvrementService: CrudService<Recouvrement>,
  ) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.refreshAll();
  }

  refreshAll() {
    if (this.barChart) {
      this.barChart.clear();
      this.barChart.destroy();
    }
    if (this.doughnut) {
      this.doughnut.clear();
      this.doughnut.destroy();
    }
    if (this.polarChart) {
      this.polarChart.clear();
      this.polarChart.destroy();
    }

    this.init();
  }

  private init() {
    const id = this.id;
    if (id) {
      this.commercialService.get('commercial', id).then((data) => {
        this.commercial = data;
        this.isNewCommercial = false;

        this.recouvrementService.getAll('recouvrement').then((data) => {
          this.recouvrements = data.filter((d) => {
            return new Date(d.date).getFullYear() == this.annee && d.proforma.commercial.id === id;
          });
          this.totalRecouvrements = this.getTotalRecouvrements();

          this.proformaService.getAll('proforma').then((data) => {

            data = data.filter((d) => {
              return d.commercial.id === id;
            });
            this.proformas = data.filter((d) => {
              return !d.validee && new Date(d.date).getFullYear() == this.annee;
            });
            this.proformasValidees = data.filter((d) => {
              return d.validee && new Date(d.date).getFullYear() == this.annee;;
            });
            this.totalProformasNonValidees = this.getTotalProformas(this.proformas);
            this.totalProformasValidees = this.getTotalProformasValidees(this.proformasValidees);
            this.objectifService.getAll('objectif').then((data) => {
              this.objectifs = data.filter((d) => {
                return d.annee && d.annee == this.annee && d.commercial.id === id;
              });
              this.totalObjectifs = this.getTotalObjectifs();
              this.dessinerGraphes(this.annee);
            });

          });
        });
      });
    }
  }

  ngAfterViewInit(): void {
    // this.init();
  }

  getProformaParMois(mois: number) {
    mois = mois - 1;
    let total = 0;
    this.proformas.forEach((element) => {
      if (new Date(element.date).getMonth() === mois)
        total += element.montant;
    });
    return total;
  }

  getProformaValideesParMois(mois: number) {
    mois = mois - 1;
    let total = 0;
    this.proformasValidees.forEach((element) => {
      if (new Date(element.date).getMonth() === mois)
        total += element.montant;
    });
    return total;
  }

  private dessinerGraphes(annee: number) {
    const data = [
      { year: 'Janvier', count: this.getProformaValideesParMois(1) },
      { year: 'Février', count: this.getProformaValideesParMois(2) },
      { year: 'Mars', count: this.getProformaValideesParMois(3) },
      { year: 'Avril', count: this.getProformaValideesParMois(4) },
      { year: 'Mai', count: this.getProformaValideesParMois(5) },
      { year: 'Juin', count: this.getProformaValideesParMois(6) },
      { year: 'Juillet', count: this.getProformaValideesParMois(7) },
      { year: 'Aout', count: this.getProformaValideesParMois(8) },
      { year: 'Septembre', count: this.getProformaValideesParMois(9) },
      { year: 'Octobre', count: this.getProformaValideesParMois(10) },
      { year: 'Novembre', count: this.getProformaValideesParMois(11) },
      { year: 'Décembre', count: this.getProformaValideesParMois(12) },
    ];

    const data1 = [
      { year: 'Janvier', count: this.getProformaParMois(1) },
      { year: 'Février', count: this.getProformaParMois(2) },
      { year: 'Mars', count: this.getProformaParMois(3) },
      { year: 'Avril', count: this.getProformaParMois(4) },
      { year: 'Mai', count: this.getProformaParMois(5) },
      { year: 'Juin', count: this.getProformaParMois(6) },
      { year: 'Juillet', count: this.getProformaParMois(7) },
      { year: 'Aout', count: this.getProformaParMois(8) },
      { year: 'Septembre', count: this.getProformaParMois(9) },
      { year: 'Octobre', count: this.getProformaParMois(10) },
      { year: 'Novembre', count: this.getProformaParMois(11) },
      { year: 'Décembre', count: this.getProformaParMois(12) },
    ];

    const data2 = [
      { year: 'Objectif restant', count: Math.max(0, this.totalObjectifs - this.totalProformasNonValidees - this.totalProformasValidees) },
      { year: 'Proformas non validés', count: this.totalProformasNonValidees },
      { year: 'Proformas validés non recouvrées ', count: Math.max(0, this.totalProformasValidees - this.totalRecouvrements) },
      { year: 'Recouvrement', count: this.totalRecouvrements },
    ];

    let ctx: any = document.getElementById('dashboard-commercial-bar');
    let ctxRadial: any = document.getElementById('dashboard-commercial-radial');
    let ctxCirculaire: any = document.getElementById('dashboard-commercial-circulaire');

    this.barChart = new Chart(
      ctx,
      {
        type: 'bar',
        data: {
          labels: data.map(row => row.year),
          datasets: [
            {
              label: 'Proformas validées',
              data: data.map(row => row.count)
            },
            {
              label: 'Proformas émises',
              data: data1.map(row => row.count)
            },
          ]
        }
      }
    );

    this.polarChart = new Chart(
      ctxRadial,
      {
        type: 'polarArea',
        data: {
          labels: data2.map(row => row.year),
          datasets: [
            {
              label: 'Acquisitions by year',
              data: data2.map(row => row.count)
            }
          ]
        }
      }
    );

    this.doughnut = new Chart(
      ctxCirculaire,
      {
        type: 'doughnut',
        data: {
          labels: data2.map(row => row.year),
          datasets: [
            {
              label: 'Acquisitions by year',
              data: data2.map(row => row.count)
            }
          ]
        }
      }
    );
  }

  save() {
    console.log('saving');
    if (this.isNewCommercial) {
      console.log('nouveau');
      console.log(this.commercial);
      this.commercialService.create('commercial', this.commercial).then((id) => {
        this.notifierService.notify('success', "saved successfully");
        this.router.navigate(['commercial', 'view', this.commercial.id]);
      });
    } else {
      this.commercialService.modify('commercial', this.commercial.id, this.commercial).then(() => {
        this.notifierService.notify('success', "saved successfully");
        this.router.navigate(['commercial', 'view', this.commercial.id]);
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

  getObjectif(commercial: Commercial) {
    let total = 0;
    this.objectifs.forEach((element) => {
      if (element.commercial.id === commercial.id)
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
