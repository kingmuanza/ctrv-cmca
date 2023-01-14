import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Subscription } from 'rxjs';
import { Client } from 'src/app/_models/client.model';
import { Objectif } from 'src/app/_models/objectif.model';
import { Utilisateur } from 'src/app/_models/utilisateur.model';
import { AuthService } from 'src/app/_services/auth.service';
import { CrudService } from 'src/app/_services/crud.service';

@Component({
  selector: 'app-monprofil',
  templateUrl: './monprofil.component.html',
  styleUrls: ['./monprofil.component.scss']
})
export class MonprofilComponent implements OnInit {

  
  utilisateur: Utilisateur | undefined;
  utilisateurSubscription!: Subscription;

  libelleProfil = '';

  constructor(
    private router: Router,
    private notifierService: NotifierService,
    private route: ActivatedRoute,
    private authservice: AuthService,
  ) {    
  }

  ngOnInit(): void {
    this.init();
  }

  private init() {
    this.utilisateurSubscription = this.authservice.userSubject.subscribe((utilisateur) => {
      this.utilisateur = utilisateur;
      if (utilisateur) {
        this.libelleProfil = Utilisateur.getLibelleProfil(utilisateur.profil);
      }
    });
    this.authservice.emit();
  }

}
