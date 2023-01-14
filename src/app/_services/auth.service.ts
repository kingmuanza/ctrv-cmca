import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import { Utilisateur } from '../_models/utilisateur.model';
import { CrudService } from './crud.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: Utilisateur | undefined;
  userSubject = new Subject<any>();

  constructor(
    private router: Router,
    private utilisateurService: CrudService<Utilisateur>,
  ) {
    this.autoConnexion();
  }

  emit() {
    this.userSubject.next(this.user);
  }

  autoConnexion() {
    const resultat = localStorage.getItem('CMCAUser');
    if (resultat) {
      this.user = JSON.parse(resultat);
      this.emit();
    }
  }

  connexion(l: string, p: string): Promise<Utilisateur> {
    let thereIsUser = false;
    let user: any;
    return new Promise((resolve, reject) => {
      if (l === 'admin' && p === 'admin') {
        this.user = new Utilisateur();
        this.user.login = 'admin';
        this.user.passe = 'admin';
        this.user.profil = 'admin'.toUpperCase();
        this.emit();
        localStorage.setItem('CMCAUser', JSON.stringify(this.user));
        resolve(this.user!);
      }
      this.utilisateurService.getAll('utilisateur').then((utilisateurs) => {
        utilisateurs.forEach((utilisateur) => {
          if (utilisateur.login === l) {
            thereIsUser = true;
            user = utilisateur;
          }
        });
        if (thereIsUser) {
          this.user = user;

          this.decrypterPasse(user.passe, p).then((resultat) => {
            if (resultat) {
              this.emit();
              localStorage.setItem('CMCAUser', JSON.stringify(this.user));
              resolve(this.user!);
            } else {
              reject('INCORRECT');
            }
          }).catch((e) => {
            reject(e)
          });
        } else {
          reject('NOUSER');
        }
      });
    });
  }

  deconnexion() {
    this.user = undefined;
    localStorage.removeItem('CMCAUser');
    this.emit();
    this.router.navigate(['connexion']);
  }

  creerUtilisateur(utilisateur: Utilisateur) {
    return new Promise((resolve, reject) => {
      this.crypterPasse(utilisateur.passe).then((passe) => {
        utilisateur.passe = passe;
        this.utilisateurService.create('utilisateur', utilisateur).then(() => {
          resolve(utilisateur);
        });
      });
    });
  }

  reinitUtilisateur(utilisateur: Utilisateur) {
    return new Promise((resolve, reject) => {
      this.crypterPasse(utilisateur.passe).then((passe) => {
        utilisateur.passe = passe;
        this.utilisateurService.modify('utilisateur', utilisateur.id, utilisateur).then(() => {
          resolve(utilisateur);
        });
      });
    });
  }

  crypterPasse(passe: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const encrypted = CryptoJS.AES.encrypt('MUANZA', passe)
      resolve(encrypted.toString())
    });
  }

  decrypterPasse(encrypted: string, passe: string): Promise<boolean> {
    console.log('encrypted');
    console.log(encrypted);
    console.log('passe');
    console.log(passe);
    return new Promise((resolve, reject) => {
      const decrypted = CryptoJS.AES.decrypt(encrypted, passe);
      console.log('decrypted');
      console.log(decrypted);
      console.log(decrypted.toString());
      if (decrypted.toString()) {
        resolve(true);
      } else {
        reject('INCORRECT')
      }
    });
  }
}
