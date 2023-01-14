import { Component, OnInit } from '@angular/core';
import { AuthService } from './_services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit  {
  title = 'crtv';
  user: any;
  userSubscription: any;
  
  constructor(
    private authservice: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.userSubscription = this.authservice.userSubject.subscribe((user) => {
      this.user = user;
      if (user) {
        // this.user = user;
      } else {
        this.router.navigate(['connexion']);
      }
    });
    this.authservice.emit();
  }

}
