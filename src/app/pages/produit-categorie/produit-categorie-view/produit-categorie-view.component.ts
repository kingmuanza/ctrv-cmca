import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Objectif } from 'src/app/_models/objectif.model';
import { ProduitCategorie } from 'src/app/_models/produit.categorie.model';
import { CrudService } from 'src/app/_services/crud.service';

@Component({
  selector: 'app-produit-categorie-view',
  templateUrl: './produit-categorie-view.component.html',
  styleUrls: ['./produit-categorie-view.component.scss']
})
export class ProduitCategorieViewComponent implements OnInit {

  produitCategorie = new ProduitCategorie();
  isNewProduitCategorie = true;

  objectifs = new Array<Objectif>();

  montrerFormulaire = false;

  constructor(
    private router: Router,
    private notifierService: NotifierService,
    private route: ActivatedRoute,
    private produitCategorieService: CrudService<ProduitCategorie>,
    private objectifService: CrudService<Objectif>,
  ) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (id) {
        this.produitCategorieService.get('produitCategorie', id).then((data) => {
          this.produitCategorie = data;
          
          this.isNewProduitCategorie = false;
          this.objectifService.getAll('objectif').then((data) => {
            this.objectifs = data.filter((d) => {
              return true
            });
          });
        });
      }
    });
  }

  save() {
    console.log('saving');
    if (this.isNewProduitCategorie) {
      console.log('nouveau');
      console.log(this.produitCategorie);
      this.produitCategorieService.create('produitCategorie', this.produitCategorie).then((id) => {
        this.notifierService.notify('success', "saved successfully");
        this.router.navigate(['produitCategorie', 'view', this.produitCategorie.id]);
      });
    } else {
      this.produitCategorieService.modify('produitCategorie', this.produitCategorie.id, this.produitCategorie).then(() => {
        this.notifierService.notify('success', "saved successfully");
        this.router.navigate(['produitCategorie', 'view', this.produitCategorie.id]);
      });
    }
  }

  getObjectif() {
    return this.objectifs.length > 0 ? this.objectifs[0] : new Objectif();
  }

}
