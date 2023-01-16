import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { ProduitType } from 'src/app/_models/produit.type.model';
import { TraductionPipe } from 'src/app/_pipes/traduction.pipe';
import { CrudService } from 'src/app/_services/crud.service';

@Component({
  selector: 'app-produit-type-edit',
  templateUrl: './produit-type-edit.component.html',
  styleUrls: ['./produit-type-edit.component.scss']
})
export class ProduitTypeEditComponent implements OnInit {

  produitType = new ProduitType();
  isNewProduitType = true;

  constructor(
    private traductionPipe: TraductionPipe,
    private router: Router,
    private notifierService: NotifierService,
    private route: ActivatedRoute,
    private produitTypeService: CrudService<ProduitType>
  ) {    
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (id) {
        this.produitTypeService.get('produitType', id).then((data) => {
          this.produitType = data;
          this.isNewProduitType = false;
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
        this.router.navigate(['produit-type', 'view', this.produitType.id]);
      });
    } else {
      this.produitTypeService.modify('produitType', this.produitType.id, this.produitType).then(() => {
        this.notifierService.notify('success', "saved successfully");
        this.router.navigate(['produit-type', 'view', this.produitType.id]);
      });
    }
  }

  delete() {
    const phrase = this.traductionPipe.transform('Etes-vous sûr de vouloir supprimer cet élément ?');
    const oui = confirm(phrase);
    if (oui) {
      this.produitTypeService.delete('produitType', this.produitType.id).then(() => {
        this.router.navigate(['produitType']);
      });
    }
  }

}
