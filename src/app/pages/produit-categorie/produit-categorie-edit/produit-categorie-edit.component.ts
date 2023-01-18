import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { ProduitCategorie } from 'src/app/_models/produit.categorie.model';
import { ProduitType } from 'src/app/_models/produit.type.model';
import { TraductionPipe } from 'src/app/_pipes/traduction.pipe';
import { CrudService } from 'src/app/_services/crud.service';

@Component({
  selector: 'app-produit-categorie-edit',
  templateUrl: './produit-categorie-edit.component.html',
  styleUrls: ['./produit-categorie-edit.component.scss']
})
export class ProduitCategorieEditComponent implements OnInit {

  produitCategorie = new ProduitCategorie();
  isNewProduitCategorie = true;

  media = '';

  produitTypes = new Array<ProduitType>();

  constructor(
    private traductionPipe: TraductionPipe,
    private router: Router,
    private notifierService: NotifierService,
    private route: ActivatedRoute,
    private produitCategorieService: CrudService<ProduitCategorie>,
    private produitTypeService: CrudService<ProduitType>,
  ) {    
  }

  ngOnInit(): void {
    this.produitTypeService.getAll('produitType').then((data) => {
      this.produitTypes = data.filter((d) => {
        return true;
      });
    });
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (id) {
        this.produitCategorieService.get('produitCategorie', id).then((data) => {
          this.produitCategorie = data;
          this.isNewProduitCategorie = false;
          this.media = this.produitCategorie.type.support;
          this.produitTypes.forEach((element) => {
            if (this.produitCategorie.type && this.produitCategorie.type.id === element.id) {
              this.produitCategorie.type = element;
            }
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
        this.router.navigate(['produit-categorie', 'view', this.produitCategorie.id]);
      });
    } else {
      this.produitCategorieService.modify('produitCategorie', this.produitCategorie.id, this.produitCategorie).then(() => {
        this.notifierService.notify('success', "saved successfully");
        this.router.navigate(['produit-categorie', 'view', this.produitCategorie.id]);
      });
    }
  }

  delete() {
    const phrase = this.traductionPipe.transform('Etes-vous sûr de vouloir supprimer cet élément ?');
    const oui = confirm(phrase);
    if (oui) {
      this.produitCategorieService.delete('produitCategorie', this.produitCategorie.id).then(() => {
        this.router.navigate(['produitCategorie']);
      });
    }
  }

}
