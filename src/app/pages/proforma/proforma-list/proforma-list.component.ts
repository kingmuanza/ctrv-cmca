import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject, Subscription } from 'rxjs';
import { DatatablesOptions } from 'src/app/_data/datatable.option';
import { Proforma } from 'src/app/_models/proforma.model';
import { Utilisateur } from 'src/app/_models/utilisateur.model';
import { AuthService } from 'src/app/_services/auth.service';
import { CrudService } from 'src/app/_services/crud.service';

@Component({
  selector: 'app-proforma-list',
  templateUrl: './proforma-list.component.html',
  styleUrls: ['./proforma-list.component.scss']
})
export class ProformaListComponent implements OnInit {

  utilisateur: Utilisateur | undefined;
  utilisateurSubscription!: Subscription;

  // Datatables
  dtOptions: any = DatatablesOptions;
  dtTrigger = new Subject<any>();
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  dtInstance!: Promise<DataTables.Api>;

  proformas = new Array<Proforma>();

  constructor(
    private router: Router,
    private proformaService: CrudService<Proforma>,
    private authservice: AuthService,
  ) {

  }

  private init() {
    this.utilisateur = this.authservice.user;
    this.utilisateurSubscription = this.authservice.userSubject.subscribe((utilisateur) => {
      this.utilisateur = utilisateur;
    });
    this.authservice.emit();
  }

  private initNouveau() {
    let dtOptions: any
    dtOptions = JSON.parse(JSON.stringify(DatatablesOptions));
    let that = this;
    let nouveau = {
      text: 'Nouveau',
      action: function (e: any, dt: any, node: any, config: any) {
        that.edit();
      },
      className: 'btn btn-primary nouveau',
    };
    dtOptions.buttons.unshift(nouveau);
    return dtOptions;
  }

  ngOnInit(): void {
    this.init();
    this.dtOptions = this.initNouveau();
    this.proformaService.getAll('proforma').then((data) => {
      this.proformas = data.filter((d) => {
        const resultat = this.isAffichable(d, this.utilisateur);
        return resultat;
      });
      this.dtTrigger.next('');
    });
    setTimeout(() => {
    }, 1000);
  }

  isAffichable(proforma: Proforma, utilisateur: Utilisateur | undefined): boolean {
    if (utilisateur) {
      if (utilisateur.profil === 'COMMERCIAL') {
        if (proforma.commercial && utilisateur.commercial) {
          if (proforma.commercial.id === utilisateur.commercial.id) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      } else if (utilisateur.profil === 'ADMIN') {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  edit(proforma?: Proforma) {
    if (proforma) {
      this.router.navigate(['proforma', 'view', proforma.id]);
    } else {
      this.router.navigate(['proforma', 'edit']);
    }
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

}
