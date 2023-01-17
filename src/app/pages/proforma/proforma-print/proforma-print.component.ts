import { Component, OnInit } from '@angular/core';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { ActivatedRoute, Router } from '@angular/router';
import { Ligne, Proforma } from 'src/app/_models/proforma.model';
import { CrudService } from 'src/app/_services/crud.service';
import { Client } from 'src/app/_models/client.model';

@Component({
  selector: 'app-proforma-print',
  templateUrl: './proforma-print.component.html',
  styleUrls: ['./proforma-print.component.scss']
})
export class ProformaPrintComponent implements OnInit {

  proforma = new Proforma();
  constructor(
    private route: ActivatedRoute,
    private proformaService: CrudService<Proforma>,
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (id) {
        this.proformaService.get('proforma', id).then((data) => {
          this.proforma = data;
        });
      }
    });
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

  exportAsPDF(divId: string) {
    let data : any;
    data = document.getElementById(divId);
    html2canvas(data, { scale: 14}).then(canvas => {
      const contentDataURL = canvas.toDataURL('image/jpeg')  // 'image/jpeg' 'image/png' for lower quality output.
      //let pdf = new jspdf('l', 'cm', 'a4'); //Generates PDF in landscape mode
      let pdf = new jspdf('p', 'cm', 'a4'); // Generates PDF in portrait mode
      pdf.addImage(contentDataURL, 'JPEG', 0, 0, 21, 21.0);
      pdf.save(this.proforma.id +'.pdf');
    });
  }
}
