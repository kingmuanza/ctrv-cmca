import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Produit } from 'src/app/_models/produit.model';
import { CrudService } from 'src/app/_services/crud.service';

@Component({
  selector: 'app-produit-view',
  templateUrl: './produit-view.component.html',
  styleUrls: ['./produit-view.component.scss']
})
export class ProduitViewComponent implements OnInit {

  produit = new Produit();
  isNewProduit = true;

  constructor(
    private router: Router,
    private notifierService: NotifierService,
    private route: ActivatedRoute,
    private produitService: CrudService<Produit>
  ) {    
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (id) {
        this.produitService.get('produit', id).then((data) => {
          this.produit = data;
          this.isNewProduit = false;
        }); 
      }
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

}
