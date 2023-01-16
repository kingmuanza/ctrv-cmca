import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Objectif } from 'src/app/_models/objectif.model';
import { ProduitType } from 'src/app/_models/produit.type.model';
import { CrudService } from 'src/app/_services/crud.service';

@Component({
  selector: 'app-produit-type-view',
  templateUrl: './produit-type-view.component.html',
  styleUrls: ['./produit-type-view.component.scss']
})
export class ProduitTypeViewComponent implements OnInit {

  produitType = new ProduitType();
  isNewProduitType = true;

  objectifs = new Array<Objectif>();

  montrerFormulaire = false;

  constructor(
    private router: Router,
    private notifierService: NotifierService,
    private route: ActivatedRoute,
    private produitTypeService: CrudService<ProduitType>,
    private objectifService: CrudService<Objectif>,
  ) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (id) {
        this.produitTypeService.get('produitType', id).then((data) => {
          this.produitType = data;
          
          this.isNewProduitType = false;
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
    if (this.isNewProduitType) {
      console.log('nouveau');
      console.log(this.produitType);
      this.produitTypeService.create('produitType', this.produitType).then((id) => {
        this.notifierService.notify('success', "saved successfully");
        this.router.navigate(['produitType', 'view', this.produitType.id]);
      });
    } else {
      this.produitTypeService.modify('produitType', this.produitType.id, this.produitType).then(() => {
        this.notifierService.notify('success', "saved successfully");
        this.router.navigate(['produitType', 'view', this.produitType.id]);
      });
    }
  }

  getObjectif() {
    return this.objectifs.length > 0 ? this.objectifs[0] : new Objectif();
  }

}
