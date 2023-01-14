import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject, Subscription } from 'rxjs';
import { DatatablesOptions } from 'src/app/_data/datatable.option';
import { Proforma } from 'src/app/_models/proforma.model';
import { CrudService } from 'src/app/_services/crud.service';

import Chart from 'chart.js/auto';
import { Objectif } from 'src/app/_models/objectif.model';
import { Commercial } from 'src/app/_models/commercial.model';
import { Objectifglobal } from 'src/app/_models/objectifglobal.model';
import { Recouvrement } from 'src/app/_models/recouvrement.model';
import { Utilisateur } from 'src/app/_models/utilisateur.model';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss']
})
export class AccueilComponent implements OnInit, AfterViewInit {

  utilisateur: Utilisateur | undefined;
  utilisateurSubscription!: Subscription;

  // Datatables
  dtOptions: any = DatatablesOptions;
  dtTrigger = new Subject<any>();
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  dtInstance!: Promise<DataTables.Api>;

  commerciaux = new Array<Commercial>();

  proformas = new Array<Proforma>();
  proformasNonValidees = new Array<Proforma>();
  proformasValidees = new Array<Proforma>();
  recouvrements = new Array<Recouvrement>();
  objectifs = new Array<Objectif>();

  totalProformasNonValidees = 0;
  totalProformasValidees = 0;
  totalObjectifs = 0;
  totalRecouvrements = 0;

  objectifglobal = new Objectifglobal();

  annee = new Date().getFullYear();
  barChart: any;
  meilleursCommerciaux= new Array<Commercial>();

  constructor(
    private router: Router,
    private authservice: AuthService,
    private proformaService: CrudService<Proforma>,
    private commercialService: CrudService<Commercial>,
    private objectifService: CrudService<Objectif>,
    private recouvrementService: CrudService<Recouvrement>,
    private objectifglobalService: CrudService<Objectifglobal>,
  ) {

  }

  ngOnInit(): void {
    // this.dtOptions = this.initNouveau(); 
    
    this.utilisateurSubscription = this.authservice.userSubject.subscribe((utilisateur) => {
      this.utilisateur = utilisateur;
    });
    this.authservice.emit();   
  }

  ngAfterViewInit(): void {
    this.recouvrementService.getAll('recouvrement').then((data) => {
      this.recouvrements = data.filter((d) => {
        return new Date(d.date).getFullYear() == this.annee;
      });
      this.totalRecouvrements = this.getTotalRecouvrements();
      this.objectifglobalService.get('objectifglobal', this.annee + '').then((data) => {
        this.objectifglobal = data;
        this.totalObjectifs = data.montant;
        this.proformaService.getAll('proforma').then((data) => {
          this.decoupage(data);    
          this.commercialService.getAll('commercial').then((data) => {
            this.commerciaux = data.sort((a, b) => {
              return this.getProformasValidees(a) - this.getProformasValidees(b) > 0 ? -1: 1
            });
            this.meilleursCommerciaux = this.commerciaux.slice(0, Math.min(5, this.commerciaux.length));
            this.dtTrigger.next('');
          });
        });
      });
    });
  }

  refreshAll() {
    if (this.barChart) {
      this.barChart.clear();
      this.barChart.destroy();
    }
    
    this.recouvrementService.getAll('recouvrement').then((data) => {
      this.recouvrements = data.filter((d) => {
        return new Date(d.date).getFullYear() == this.annee;
      });
      this.totalRecouvrements = this.getTotalRecouvrements();
      this.objectifglobalService.get('objectifglobal', this.annee + '').then((data) => {
        this.objectifglobal = data;
        this.totalObjectifs = data.montant;
        this.proformaService.getAll('proforma').then((data) => {
          
          this.decoupage(data);
    
          this.commercialService.getAll('commercial').then((data) => {
            this.commerciaux = data;
    
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              dtInstance.destroy();
              this.dtTrigger.next('');
            });
          });
        });
      });
    });
  }

  private decoupage(data: Proforma[]) {
    this.proformas = data.filter((d) => {
      return new Date(d.date).getFullYear() == this.annee;
    });
    this.proformasNonValidees = data.filter((d) => {
      return !d.validee && new Date(d.date).getFullYear() == this.annee;
    });
    this.proformasValidees = data.filter((d) => {
      return d.validee && new Date(d.date).getFullYear() == this.annee;;
    });
    this.totalProformasNonValidees = this.getTotalProformas(this.proformasNonValidees);
    this.totalProformasValidees = this.getTotalProformasValidees(this.proformasValidees);
    this.objectifService.getAll('objectif').then((data) => {
      this.objectifs = data.filter((d) => {
        return d.annee && d.annee == this.annee;
      });
      // this.totalObjectifs = this.getTotalObjectifs();
      this.dessinerGraphes(this.annee);
    });
  }

  getProformaParMois(mois: number) {
    mois = mois - 1;
    let total = 0;
    this.proformasNonValidees.forEach((element) => {
      if (new Date(element.date).getMonth() === mois)
        total += element.montant;
    });
    return total;
  }

  getRecouvrementParMois(mois: number) {
    mois = mois - 1;
    let total = 0;
    this.recouvrements.forEach((element) => {
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
      { year: 'Janvier', count: this.getRecouvrementParMois(1) },
      { year: 'Février', count: this.getRecouvrementParMois(2) },
      { year: 'Mars', count: this.getRecouvrementParMois(3) },
      { year: 'Avril', count: this.getRecouvrementParMois(4) },
      { year: 'Mai', count: this.getRecouvrementParMois(5) },
      { year: 'Juin', count: this.getRecouvrementParMois(6) },
      { year: 'Juillet', count: this.getRecouvrementParMois(7) },
      { year: 'Aout', count: this.getRecouvrementParMois(8) },
      { year: 'Septembre', count: this.getRecouvrementParMois(9) },
      { year: 'Octobre', count: this.getRecouvrementParMois(10) },
      { year: 'Novembre', count: this.getRecouvrementParMois(11) },
      { year: 'Décembre', count: this.getRecouvrementParMois(12) },
    ];

   
    let ctx: any = document.getElementById('acquisitions');

    this.barChart = new Chart(
      ctx,
      {
        type: 'bar',
        data: {
          labels: data.map(row => row.year),
          datasets: [
            {
              label: 'Proformas validées',
              data: data.map(row => row.count),
              backgroundColor: '#fa6800',
            },
            {
              label: 'Proformas émises',
              data: data1.map(row => row.count),
              backgroundColor: '#00AFF0',
            },
            {
              label: 'Recouvrements',
              data: data2.map(row => row.count),
              backgroundColor: '#60a917',
            },
          ],
          
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

  getTotalProformas(proformasNonValidees: Array<Proforma>) {
    let total = 0;
    proformasNonValidees.forEach((element) => {
      total += element.montant;
    });
    return total;
  }

  getTotalProformasValidees(proformasNonValidees: Array<Proforma>) {
    let total = 0;
    proformasNonValidees.forEach((element) => {
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
    this.proformasNonValidees.forEach((element) => {
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

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

}
