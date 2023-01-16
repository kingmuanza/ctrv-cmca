import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DatatablesOptions } from 'src/app/_data/datatable.option';
import { ProduitType } from 'src/app/_models/produit.type.model';
import { CrudService } from 'src/app/_services/crud.service';

@Component({
  selector: 'app-produit-type-list',
  templateUrl: './produit-type-list.component.html',
  styleUrls: ['./produit-type-list.component.scss']
})
export class ProduitTypeListComponent implements OnInit {

  // Datatables
  dtOptions: any = DatatablesOptions;
  dtTrigger = new Subject<any>();
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  dtInstance!: Promise<DataTables.Api>;

  produitTypes = new Array<ProduitType>();

  constructor(
    private router: Router,
    private produitTypeService: CrudService<ProduitType>,
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

  edit(produitType?:ProduitType) {
    if (produitType) {
      this.router.navigate(['produit-type', 'view', produitType.id]);
    } else {
      this.router.navigate(['produit-type', 'edit']);
    }
  }

  ngOnInit(): void {
    this.dtOptions = this.initNouveau();
    this.produitTypeService.getAll('produitType').then((data) => {
      this.produitTypes = data.filter((d) => {
        return true;
      });
      this.dtTrigger.next('');
    });
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
