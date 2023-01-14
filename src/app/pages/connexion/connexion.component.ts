import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.scss']
})
export class ConnexionComponent implements OnInit {

  login = '';
  passe = '';

  error = ''

  constructor(
    private authservice: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.authservice.deconnexion();
  }

  connexion() {
    this.authservice.connexion(this.login, this.passe).then(() => {
      this.router.navigate(['accueil']);
    }).catch((e) => {
      this.error = e;
    });
  }

}
