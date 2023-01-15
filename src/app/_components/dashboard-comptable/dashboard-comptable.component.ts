import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DatatablesOptions } from 'src/app/_data/datatable.option';
import { Recouvrement } from 'src/app/_models/recouvrement.model';
import { CrudService } from 'src/app/_services/crud.service';

@Component({
  selector: 'app-dashboard-comptable',
  templateUrl: './dashboard-comptable.component.html',
  styleUrls: ['./dashboard-comptable.component.scss']
})
export class DashboardComptableComponent implements OnInit {

  // Datatables
  dtOptions: any = DatatablesOptions;
  dtTrigger = new Subject<any>();
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  dtInstance!: Promise<DataTables.Api>;

  recouvrements = new Array<Recouvrement>();
  annee = new Date().getFullYear();

  constructor(
    private router: Router,
    private recouvrementService: CrudService<Recouvrement>,
  ) {    
    
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

  edit(recouvrement?:Recouvrement) {
    if (recouvrement) {
      this.router.navigate(['recouvrement', 'edit', recouvrement.id]);
    } else {
      this.router.navigate(['recouvrement', 'edit']);
    }
  }

  ngOnInit(): void {
    this.dtOptions = this.initNouveau();
    this.recouvrementService.getAll('recouvrement').then((data) => {
      this.recouvrements = data.filter((d) => {
        return true;
      });
      this.dtTrigger.next('');
    });
    setTimeout(() => {
    }, 1000);
  }

  refreshAll() {    
    this.recouvrementService.getAll('proforma').then((data) => {
      this.recouvrements = data.filter((d) => {
        return new Date(d.date).getFullYear() == this.annee;
      });
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dtTrigger.next('');
      });
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
  
}
