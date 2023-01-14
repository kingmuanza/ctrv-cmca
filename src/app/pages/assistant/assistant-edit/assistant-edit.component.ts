import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Assistant } from 'src/app/_models/assistant.model';
import { Utilisateur } from 'src/app/_models/utilisateur.model';
import { TraductionPipe } from 'src/app/_pipes/traduction.pipe';
import { AuthService } from 'src/app/_services/auth.service';
import { CrudService } from 'src/app/_services/crud.service';

@Component({
  selector: 'app-assistant-edit',
  templateUrl: './assistant-edit.component.html',
  styleUrls: ['./assistant-edit.component.scss']
})
export class AssistantEditComponent implements OnInit {

  assistant = new Assistant();
  isNewAssistant = true;
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
    private assistantService: CrudService<Assistant>,
    private utilisateurService: CrudService<Utilisateur>,
    private authService: AuthService,
  ) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (id) {
        this.assistantService.get('assistant', id).then((data) => {
          this.assistant = data;
          this.isNewAssistant = false;
          this.getUsersOfAssistant(this.assistant);
        });
      }
    });
  }

  save() {
    console.log('saving');
    if (this.isNewAssistant) {
      console.log('nouveau');
      console.log(this.assistant);
      this.assistantService.create('assistant', this.assistant).then((id) => {
        this.notifierService.notify('success', "saved successfully");
        // this.router.navigate(['assistant', 'view', this.assistant.id]);
        this.isNewAssistant = false;
      });
    } else {
      this.assistantService.modify('assistant', this.assistant.id, this.assistant).then(() => {
        this.notifierService.notify('success', "saved successfully");
        this.router.navigate(['assistant', 'view', this.assistant.id]);
      });
    }
  }

  delete() {
    const phrase = this.traductionPipe.transform('Etes-vous sûr de vouloir supprimer cet élément ?');
    const oui = confirm(phrase);
    if (oui) {
      this.assistantService.delete('assistant', this.assistant.id).then(() => {
        this.router.navigate(['assistant']);
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
      utilisateur.profil = 'Assistant'.toUpperCase();
      utilisateur.assistant = this.assistant;
      this.authService.creerUtilisateur(utilisateur).then(() => {
        this.notifierService.notify('success', "Utilisateur créé avec succès");
        this.router.navigate(['assistant', 'view', this.assistant.id]);
      });
    }
  }

  getUsersOfAssistant(assistant: Assistant) {
    this.utilisateurService.getAll('utilisateur').then((utilisateurs) => {
      this.utilisateurs = utilisateurs.filter((u) => {
        return u.assistant?.id === assistant.id;
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
        utilisateur.profil = 'Assistant'.toUpperCase();
        utilisateur.assistant = this.assistant;
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
