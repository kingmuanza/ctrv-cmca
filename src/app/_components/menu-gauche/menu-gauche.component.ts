import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Utilisateur } from 'src/app/_models/utilisateur.model';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-menu-gauche',
  templateUrl: './menu-gauche.component.html',
  styleUrls: ['./menu-gauche.component.scss']
})
export class MenuGaucheComponent implements OnInit, OnChanges {

  utilisateur: Utilisateur | undefined;
  utilisateurSubscription!: Subscription;

  libelleProfil = '';

  access = {
    accueil: true,
    produits: true,
    commerciaux: true,
    assistants: true,
    objectifsCommerciaux: true,
    objectifsAnnuels: true,
    clients: true,
    proforma: true,
    proformaValidation: true,
    recouvrements: true,
  };

  constructor(
    private router: Router,
    private authservice: AuthService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.init();
  }

  ngOnInit(): void {
    this.init();
  }

  private init() {
    this.access = {
      accueil: true,
      produits: true,
      commerciaux: true,
      assistants: true,
      objectifsCommerciaux: true,
      objectifsAnnuels: true,
      clients: true,
      proforma: true,
      proformaValidation: true,
      recouvrements: true,
    };

    this.utilisateurSubscription = this.authservice.userSubject.subscribe((utilisateur) => {
      this.utilisateur = utilisateur;
      this.setAccess(utilisateur);
      if (utilisateur) {
        this.libelleProfil = Utilisateur.getLibelleProfil(utilisateur.profil);

      }
    });
    this.authservice.emit();
  }

  setAccess(utilisateur?: Utilisateur) {
    if (utilisateur) {
      if (utilisateur.profil) {
        if (utilisateur.profil === 'COMMERCIAL') {
          this.access.commerciaux = false;
          this.access.assistants = false;
          this.access.objectifsCommerciaux = false;
          this.access.objectifsAnnuels = false;
          this.access.proformaValidation = false;
          this.access.recouvrements = false;
        }
        if (utilisateur.profil === 'ASSISTANT') {
          this.access.commerciaux = false;
          this.access.assistants = false;
          this.access.objectifsCommerciaux = false;
          this.access.objectifsAnnuels = false;
          this.access.recouvrements = false;
          this.access.proforma = false;
        }
        if (utilisateur.profil === 'COMPTABLE') {
          this.access.commerciaux = false;
          this.access.assistants = false;
          this.access.objectifsCommerciaux = false;
          this.access.objectifsAnnuels = false;
          this.access.proforma = false;
        }
      } else {
        this.setNoAcess();
      }
    } else {
      this.setNoAcess();
    }
  }

  private setNoAcess() {
    this.access = {
      accueil: false,
      produits: false,
      commerciaux: false,
      assistants: false,
      objectifsCommerciaux: false,
      objectifsAnnuels: false,
      clients: false,
      proforma: false,
      proformaValidation: false,
      recouvrements: false,
    };
  }

  monprofil() {
    this.router.navigate(['monprofil']);
  }

  deconnexion() {
    const oui = confirm('Etes-vous sûr de vouloir vous déconnecter ?');
    if (oui) {
      this.authservice.deconnexion();
    }
  }

}
