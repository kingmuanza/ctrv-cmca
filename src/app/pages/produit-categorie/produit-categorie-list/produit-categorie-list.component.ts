import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DatatablesOptions } from 'src/app/_data/datatable.option';
import { ProduitCategorie } from 'src/app/_models/produit.categorie.model';
import { CrudService } from 'src/app/_services/crud.service';

@Component({
  selector: 'app-produit-categorie-list',
  templateUrl: './produit-categorie-list.component.html',
  styleUrls: ['./produit-categorie-list.component.scss']
})
export class ProduitCategorieListComponent implements OnInit {

  // Datatables
  dtOptions: any = DatatablesOptions;
  dtTrigger = new Subject<any>();
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  dtInstance!: Promise<DataTables.Api>;

  produitCategories = new Array<ProduitCategorie>();

  constructor(
    private router: Router,
    private produitCategorieService: CrudService<ProduitCategorie>,
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

  edit(produitCategorie?:ProduitCategorie) {
    if (produitCategorie) {
      this.router.navigate(['produit-categorie', 'view', produitCategorie.id]);
    } else {
      this.router.navigate(['produit-categorie', 'edit']);
    }
  }

  ngOnInit(): void {
    this.dtOptions = this.initNouveau();
    this.produitCategorieService.getAll('produitCategorie').then((data) => {
      this.produitCategories = data.filter((d) => {
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
