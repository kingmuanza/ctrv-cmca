import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DatatablesOptions } from 'src/app/_data/datatable.option';
import { Departement } from 'src/app/_models/departement.model';
import { CrudService } from 'src/app/_services/crud.service';

@Component({
  selector: 'app-departement-list',
  templateUrl: './departement-list.component.html',
  styleUrls: ['./departement-list.component.scss']
})
export class DepartementListComponent implements OnInit {

  // Datatables
  dtOptions: any = DatatablesOptions;
  dtTrigger = new Subject<any>();
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  dtInstance!: Promise<DataTables.Api>;

  departements = new Array<Departement>();

  constructor(
    private router: Router,
    private departementService: CrudService<Departement>,
  ) {    
    
  }

  private initNouveau() {
    let dtOptions: any
    dtOptions = JSON.parse(JSON.stringify(DatatablesOptions));
    let that = this;
    let nouveau = {
      text: 'Nouveau',
      action: function (e: any, dt: any, node: any, config: any) {
        that.edit();
      },
      className: 'btn btn-primary nouveau',
    };
    dtOptions.buttons.unshift(nouveau);
    return dtOptions;
  }

  edit(departement?:Departement) {
    if (departement) {
      this.router.navigate(['departement', 'view', departement.id]);
    } else {
      this.router.navigate(['departement', 'edit']);
    }
  }

  ngOnInit(): void {
    this.dtOptions = this.initNouveau();
    this.departementService.getAll('departement').then((data) => {
      this.departements = data.filter((d) => {
        return true;
      });
      this.dtTrigger.next('');
    });
    setTimeout(() => {
    }, 1000);
  }

  getLibelleCategorie(categorie: string): string {
    if (categorie === 'Privee') {
      return "Entreprise privée"
    }
    if (categorie === 'Public') {
      return "Entreprise publique"
    }
    return categorie;
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
  
}
