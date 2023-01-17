import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Client } from 'src/app/_models/client.model';
import { Commercial } from 'src/app/_models/commercial.model';
import { Produit } from 'src/app/_models/produit.model';
import { Ligne, Proforma } from 'src/app/_models/proforma.model';
import { TraductionPipe } from 'src/app/_pipes/traduction.pipe';
import { CrudService } from 'src/app/_services/crud.service';

@Component({
  selector: 'app-proforma-edit',
  templateUrl: './proforma-edit.component.html',
  styleUrls: ['./proforma-edit.component.scss']
})
export class ProformaEditComponent implements OnInit {

  proforma = new Proforma();
  isNewProforma = true;
  commercials = new Array<Commercial>();
  clients = new Array<Client>();

  fichiers!: FileList;
  images = new Array<Blob>();

  produits = new Array<Produit>();
  produit = new Produit();
  quantite = 1;
  debut = new Date();
  fin = new Date();

  showErrors = false;

  constructor(
    private traductionPipe: TraductionPipe,
    private router: Router,
    private notifierService: NotifierService,
    private route: ActivatedRoute,
    private commercialService: CrudService<Commercial>,
    private clientService: CrudService<Client>,
    private produitService: CrudService<Produit>,
    private proformaService: CrudService<Proforma>
  ) {
  }

  ngOnInit(): void {

    this.produitService.getAll('produit').then((data) => {
      this.produits = data.filter((d) => {
        return true;
      });
    });
    this.commercialService.getAll('commercial').then((data) => {
      this.commercials = data.filter((d) => {
        return true;
      });
      this.clientService.getAll('client').then((data) => {
        this.clients = data.filter((d) => {
          return true;
        });
      });
      this.route.paramMap.subscribe((paramMap) => {
        const id = paramMap.get('id');
        if (id) {
          this.proformaService.get('proforma', id).then((data) => {
            this.proforma = data;
            this.isNewProforma = false;

            this.commercials.forEach(element => {
              if (this.proforma.commercial && element.id === this.proforma.commercial.id) {
                this.proforma.commercial = element;
              }
            });
            this.clients.forEach(element => {
              if (this.proforma.client && element.id === this.proforma.client.id) {
                this.proforma.client = element;
              }
            });
          });
        }
      });
    });
  }

  save() {
    this.showErrors = true;
    if (this.proforma.commercial.noms && this.proforma.client.nom && this.proforma.lignes.length > 0) {
      console.log('saving');
      this.saveFiles().then((urls) => {
        if (!this.proforma.images) {
          this.proforma.images = [];
        }
        this.proforma.images = this.proforma.images.concat(urls);
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
      });
    }
  }

  saveFiles(): Promise<Array<string>> {
    const urls = new Array<string>();
    return new Promise(async (resolve, reject) => {
      if (this.images.length) {
        for (let index = 0; index < this.images.length; index++) {
          const element = this.images[index];
          const url = await this.proformaService.saveFile(element);
          urls.push(url);
        }
      }
      resolve(urls);
    });
  }

  uploadFile(event: any) {
    console.log(event.target.files);
    this.fichiers = event.target.files;
    if (event.target.files && event.target.files[0]) {
      for (let i = 0; i < this.fichiers.length; i++) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const resultat = e.target.result;
          console.log('resultat ' + i);
          console.log(resultat);
          this.images.push(resultat);
        };
        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }

  supprimerImage(image: string) {
    const oui = confirm('Etes-vous sûre de vouloir supprimer cette image');
    if (oui) {
      console.log(image);
      this.proformaService.deleteFile(image).then(() => {
        this.notifierService.notify('success', "Image supprimée avec succès");
        const images = new Array<string>();
        this.proforma.images.forEach((element) => {
          if (element !== image) {
            images.push(element);
          }
        });
        this.proforma.images = images;
        this.proformaService.modify('proforma', this.proforma.id, this.proforma).then(() => {
          this.notifierService.notify('success', "saved successfully");
        });
      }).catch((e) => {
        this.notifierService.notify('error', "Impossible de supprimer l'image");
      });
    }
  }

  ajouterLigne() {
    const ligne = new Ligne();
    ligne.produit = this.produit;
    ligne.quantite = this.quantite;
    ligne.debut = new Date(this.debut);
    ligne.fin = new Date(this.fin);
    this.proforma.lignes.push(ligne);
    this.produit = new Produit();
    this.quantite = 1;
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

  delete() {
    const phrase = this.traductionPipe.transform('Etes-vous sûr de vouloir supprimer cet élément ?');
    const oui = confirm(phrase);
    if (oui) {
      this.proformaService.delete('proforma', this.proforma.id).then(() => {
        this.router.navigate(['proforma']);
      });
    }
  }

}
