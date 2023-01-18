import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Client } from 'src/app/_models/client.model';
import { Ligne, Proforma } from 'src/app/_models/proforma.model';
import { CrudService } from 'src/app/_services/crud.service';

@Component({
  selector: 'app-proforma-view',
  templateUrl: './proforma-view.component.html',
  styleUrls: ['./proforma-view.component.scss']
})
export class ProformaViewComponent implements OnInit {

  proforma = new Proforma();
  isNewProforma = true;

  constructor(
    private router: Router,
    private notifierService: NotifierService,
    private route: ActivatedRoute,
    private proformaService: CrudService<Proforma>
  ) {    
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (id) {
        this.proformaService.get('proforma', id).then((data) => {
          this.proforma = data;
          this.isNewProforma = false;
          if (this.proforma.images) {
            this.initViewer();
          }
        }); 
      }
    });
  }

  initViewer() {
    
  }

  getPU(ligne: Ligne, client: Client): number {
    let resultat = 0;
    if (client.categorie === 'ONG') {
      return ligne.produit.prixCategorie.ONG;
    }
    if (client.categorie === 'Public') {
      return ligne.produit.prixCategorie.Public;
    }
    if (client.categorie === 'Privee') {
      return ligne.produit.prixCategorie.Privee;
    }
    return resultat;
  }

  getTotalLigne(ligne: Ligne, client: Client) {
    let resultat = 0;
    resultat = ligne.quantite * this.getPU(ligne, client)
    return resultat;
  }

  getTotal(client: Client) {
    let resultat = 0;
    this.proforma.lignes.forEach((ligne) => {
      resultat += this.getTotalLigne(ligne, client)
    });
    this.proforma.montant = resultat;
    return resultat;
  }
  save() {
    console.log('saving');
    if (this.isNewProforma) {
      console.log('nouveau');
      console.log(this.proforma);
      this.proformaService.create('proforma', this.proforma).then((id) => {
        this.notifierService.notify('success', "saved successfully");
        this.router.navigate(['proforma', 'view', this.proforma.id]);
      });
    } else {
      this.proformaService.modify('proforma', this.proforma.id, this.proforma).then(() => {
        this.notifierService.notify('success', "saved successfully");
        this.router.navigate(['proforma', 'view', this.proforma.id]);
      });
    }
  }

}
