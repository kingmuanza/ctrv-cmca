import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Produit } from 'src/app/_models/produit.model';
import { ProduitType } from 'src/app/_models/produit.type.model';
import { TraductionPipe } from 'src/app/_pipes/traduction.pipe';
import { CrudService } from 'src/app/_services/crud.service';

@Component({
  selector: 'app-produit-edit',
  templateUrl: './produit-edit.component.html',
  styleUrls: ['./produit-edit.component.scss']
})
export class ProduitEditComponent implements OnInit {

  produit = new Produit();
  isNewProduit = true;

  media = '';

  produitTypes = new Array<ProduitType>();

  constructor(
    private traductionPipe: TraductionPipe,
    private router: Router,
    private notifierService: NotifierService,
    private route: ActivatedRoute,
    private produitTypeService: CrudService<ProduitType>,
    private produitService: CrudService<Produit>
  ) {    
  }

  ngOnInit(): void {
    
    this.produitTypeService.getAll('produitType').then((data) => {
      this.produitTypes = data.filter((d) => {
        return true;
      });
      this.route.paramMap.subscribe((paramMap) => {
        const id = paramMap.get('id');
        if (id) {
          this.produitService.get('produit', id).then((data) => {
            this.produit = data;
            this.isNewProduit = false;
            this.media = this.produit.type.support;
            this.produitTypes.forEach((produitType) => {
              if(this.produit.type && this.produit.type.id === produitType.id) {
                this.produit.type = produitType;
              }
            });
            if (!this.produit.prixCategorie) {
              this.produit.prixCategorie = {
                ONG: 0,
                Public: 0,
                Privee: 0,
            }
            }
          }); 
        }
      });
    });
  }

  save() {
    console.log('saving');
    if (this.isNewProduit) {
      console.log('nouveau');
      console.log(this.produit);
      this.produitService.create('produit', this.produit).then((id) => {
        this.notifierService.notify('success', "saved successfully");
        this.router.navigate(['produit', 'view', this.produit.id]);
      });
    } else {
      this.produitService.modify('produit', this.produit.id, this.produit).then(() => {
        this.notifierService.notify('success', "saved successfully");
        this.router.navigate(['produit', 'view', this.produit.id]);
      });
    }
  }

  delete() {
    const phrase = this.traductionPipe.transform('Etes-vous sûr de vouloir supprimer cet élément ?');
    const oui = confirm(phrase);
    if (oui) {
      this.produitService.delete('produit', this.produit.id).then(() => {
        this.router.navigate(['produit']);
      });
    }
  }

}
