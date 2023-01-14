import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { Objectif } from 'src/app/_models/objectif.model';
import { Objectifglobal } from 'src/app/_models/objectifglobal.model';
import { Proforma } from 'src/app/_models/proforma.model';
import { Recouvrement } from 'src/app/_models/recouvrement.model';
import { Utilisateur } from 'src/app/_models/utilisateur.model';
import { AuthService } from 'src/app/_services/auth.service';
import { CrudService } from 'src/app/_services/crud.service';

@Component({
  selector: 'app-display-stats',
  templateUrl: './display-stats.component.html',
  styleUrls: ['./display-stats.component.scss']
})
export class DisplayStatsComponent implements OnInit, OnChanges {

  @Input() annee = 2022;
  @Input() recouvrements = new Array<Recouvrement>();
  @Input() proformas = new Array<Proforma>();

  proformasNonValidees = new Array<Proforma>();
  proformasValidees = new Array<Proforma>();

  totalProformasNonValidees = 0;
  totalProformasValidees = 0;
  totalObjectifs = 0;
  totalRecouvrements = 0;

  utilisateur: Utilisateur | undefined;
  utilisateurSubscription!: Subscription;
  objectifglobal = new Objectifglobal();


  constructor(
    private authservice: AuthService,
    private objectifglobalService: CrudService<Objectifglobal>,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.init();
  }

  ngOnInit(): void {
    this.init();
  }

  getInformations() {
    const recouvrements = this.recouvrements.filter((d) => {
      return new Date(d.date).getFullYear() == this.annee;
    });
    this.totalRecouvrements = this.getTotalRecouvrements(recouvrements);

    this.objectifglobalService.get('objectifglobal', this.annee + '').then((data) => {
      this.objectifglobal = data;
      this.totalObjectifs = data.montant;

      this.proformasNonValidees = this.proformas.filter((d) => {
        return !d.validee ;
      });
      this.proformasValidees = this.proformas.filter((d) => {
        return d.validee;
      });
      this.totalProformasNonValidees = this.getTotalProformas(this.proformasNonValidees);
      this.totalProformasValidees = this.getTotalProformasValidees(this.proformasValidees);
    });

  }

  private init() {
    this.getInformations();
    this.utilisateurSubscription = this.authservice.userSubject.subscribe((utilisateur) => {
      this.utilisateur = utilisateur;
    });
    this.authservice.emit();
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

  getTotalRecouvrements(recouvrements = new Array<Recouvrement>()): number {
    let total = 0;
    recouvrements.forEach((element) => {
      total += element.montant;
    });
    return total;
  }

}
