import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject, Subscription } from 'rxjs';
import { DatatablesOptions } from 'src/app/_data/datatable.option';
import { Produit } from 'src/app/_models/produit.model';
import { Utilisateur } from 'src/app/_models/utilisateur.model';
import { AuthService } from 'src/app/_services/auth.service';
import { CrudService } from 'src/app/_services/crud.service';


@Component({
  selector: 'app-produit-list',
  templateUrl: './produit-list.component.html',
  styleUrls: ['./produit-list.component.scss']
})
export class ProduitListComponent implements OnInit, OnDestroy {
  
  utilisateur: Utilisateur | undefined;
  utilisateurSubscription!: Subscription;

  // Datatables
  dtOptions: any = DatatablesOptions;
  dtTrigger = new Subject<any>();
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  dtInstance!: Promise<DataTables.Api>;

  produits = new Array<Produit>();

  constructor(
    private router: Router,
    private authservice: AuthService,
    private produitService: CrudService<Produit>,
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

  edit(produit?:Produit) {
    if (produit) {
      this.router.navigate(['produit', 'view', produit.id]);
    } else {
      this.router.navigate(['produit', 'edit']);
    }
  }

  ngOnInit(): void {    
    this.utilisateurSubscription = this.authservice.userSubject.subscribe((utilisateur) => {
      this.utilisateur = utilisateur;
      if (utilisateur.profil === 'ADMIN') {
        this.dtOptions = this.initNouveau();
      }      
    });
    this.produitService.getAll('produit').then((data) => {
      this.produits = data.filter((d) => {
        return true;
      });
      this.dtTrigger.next('');
    });
    this.authservice.emit();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
  
}
