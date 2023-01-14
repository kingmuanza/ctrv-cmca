import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Comptable } from 'src/app/_models/comptable.model';
import { Utilisateur } from 'src/app/_models/utilisateur.model';
import { TraductionPipe } from 'src/app/_pipes/traduction.pipe';
import { AuthService } from 'src/app/_services/auth.service';
import { CrudService } from 'src/app/_services/crud.service';

@Component({
  selector: 'app-comptable-edit',
  templateUrl: './comptable-edit.component.html',
  styleUrls: ['./comptable-edit.component.scss']
})
export class ComptableEditComponent implements OnInit {

  comptable = new Comptable();
  isNewComptable = true;
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
    private comptableService: CrudService<Comptable>,
    private utilisateurService: CrudService<Utilisateur>,
    private authService: AuthService,
  ) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (id) {
        this.comptableService.get('comptable', id).then((data) => {
          this.comptable = data;
          this.isNewComptable = false;
          this.getUsersOfComptable(this.comptable);
        });
      }
    });
  }

  save() {
    console.log('saving');
    if (this.isNewComptable) {
      console.log('nouveau');
      console.log(this.comptable);
      this.comptableService.create('comptable', this.comptable).then((id) => {
        this.notifierService.notify('success', "saved successfully");
        // this.router.navigate(['comptable', 'view', this.comptable.id]);
        this.isNewComptable = false;
      });
    } else {
      this.comptableService.modify('comptable', this.comptable.id, this.comptable).then(() => {
        this.notifierService.notify('success', "saved successfully");
        this.router.navigate(['comptable', 'view', this.comptable.id]);
      });
    }
  }

  delete() {
    const phrase = this.traductionPipe.transform('Etes-vous sûr de vouloir supprimer cet élément ?');
    const oui = confirm(phrase);
    if (oui) {
      this.comptableService.delete('comptable', this.comptable.id).then(() => {
        this.router.navigate(['comptable']);
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
      utilisateur.profil = 'Comptable'.toUpperCase();
      utilisateur.comptable = this.comptable;
      this.authService.creerUtilisateur(utilisateur).then(() => {
        this.notifierService.notify('success', "Utilisateur créé avec succès");
        this.router.navigate(['comptable', 'view', this.comptable.id]);
      });
    }
  }

  getUsersOfComptable(comptable: Comptable) {
    this.utilisateurService.getAll('utilisateur').then((utilisateurs) => {
      this.utilisateurs = utilisateurs.filter((u) => {
        return u.comptable?.id === comptable.id;
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
        utilisateur.profil = 'Comptable'.toUpperCase();
        utilisateur.comptable = this.comptable;
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
