import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Commercial } from 'src/app/_models/commercial.model';
import { Utilisateur } from 'src/app/_models/utilisateur.model';
import { TraductionPipe } from 'src/app/_pipes/traduction.pipe';
import { CrudService } from 'src/app/_services/crud.service';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-commercial-edit',
  templateUrl: './commercial-edit.component.html',
  styleUrls: ['./commercial-edit.component.scss']
})
export class CommercialEditComponent implements OnInit {

  commercial = new Commercial();
  isNewCommercial = true;
  showErrors = false;

  id = '';
  login = '';
  passe = '';
  confirmation = ''; // Confirmatiion du mot de passe

  utilisateurs = new Array<Utilisateur>();

  constructor(
    private traductionPipe: TraductionPipe,
    private router: Router,
    private notifierService: NotifierService,
    private route: ActivatedRoute,
    private commercialService: CrudService<Commercial>,
    private utilisateurService: CrudService<Utilisateur>,
    private authService: AuthService,
  ) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (id) {
        this.commercialService.get('commercial', id).then((data) => {
          this.commercial = data;
          this.isNewCommercial = false;
          this.getUsersOfCommercial(this.commercial);
        });
      }
    });
  }

  save() {
    console.log('saving');
    if (this.isNewCommercial) {
      console.log('nouveau');
      console.log(this.commercial);
      this.commercialService.create('commercial', this.commercial).then((id) => {
        this.notifierService.notify('success', "saved successfully");
        this.router.navigate(['commercial', 'view', this.commercial.id]);
      });
    } else {
      this.commercialService.modify('commercial', this.commercial.id, this.commercial).then(() => {
        this.notifierService.notify('success', "saved successfully");
        this.router.navigate(['commercial', 'view', this.commercial.id]);
      });
    }
  }

  delete() {
    const phrase = this.traductionPipe.transform('Etes-vous sûr de vouloir supprimer cet élément ?');
    const oui = confirm(phrase);
    if (oui) {
      this.commercialService.delete('commercial', this.commercial.id).then(() => {
        this.router.navigate(['commercial']);
      });
    }
  }

  saveAuth() {
    this.createUser();
  }

  createUser() {
    this.showErrors = true;
    if (this.passe && this.confirmation && this.confirmation === this.passe) {
      const utilisateur = new Utilisateur();
      utilisateur.login = this.login;
      utilisateur.passe = this.passe;
      utilisateur.profil = 'Commercial'.toUpperCase();
      utilisateur.commercial = this.commercial;
      this.authService.creerUtilisateur(utilisateur).then(() => {
        this.notifierService.notify('success', "Utilisateur créé avec succès");
      });
    }
  }

  getUsersOfCommercial(commercial: Commercial) {
    this.utilisateurService.getAll('utilisateur').then((utilisateurs) => {
      this.utilisateurs = utilisateurs.filter((u) => {
        return u.commercial?.id === commercial.id;
      });
      if (this.utilisateurs.length > 0) {
        this.login = this.utilisateurs[0].login;
        this.id = this.utilisateurs[0].id;
      }
    });
  }

  reinitPasse() {
    const p = prompt("Entrez le nouveau mot de passe");
    console.log(p);
    setTimeout(() => {
      if(p) {
        console.log('creation de lutilisateur');
        const utilisateur = new Utilisateur();
        console.log('utilisateur');
        console.log(utilisateur);
        utilisateur.id = this.id;
        utilisateur.login = this.login;
        utilisateur.passe = p;
        utilisateur.profil = 'Commercial'.toUpperCase();
        utilisateur.commercial = this.commercial;
        utilisateur.doitChangerPasse = true;
        console.log('utilisateur');
        console.log(utilisateur);
        this.authService.reinitUtilisateur(utilisateur).then((u) => {
          console.log('u');
          console.log(u);
          this.notifierService.notify('success', "Mot de passe rénitialisé avec succès");
        });
      } else {
        this.notifierService.notify('error', "Veuillez entrer un mot de passe");
      }
    }, 1000);
  }

}
