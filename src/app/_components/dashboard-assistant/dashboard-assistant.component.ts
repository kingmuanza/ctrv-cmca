import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DatatablesOptions } from 'src/app/_data/datatable.option';
import { Proforma } from 'src/app/_models/proforma.model';
import { CrudService } from 'src/app/_services/crud.service';

@Component({
  selector: 'app-dashboard-assistant',
  templateUrl: './dashboard-assistant.component.html',
  styleUrls: ['./dashboard-assistant.component.scss']
})
export class DashboardAssistantComponent implements OnInit {

  // Datatables
  dtOptions: any = DatatablesOptions;
  dtTrigger = new Subject<any>();
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  dtInstance!: Promise<DataTables.Api>;

  proformas = new Array<Proforma>();
  annee = new Date().getFullYear();

  constructor(
    private router: Router,
    private proformaService: CrudService<Proforma>,
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

  edit(proforma?:Proforma) {
    if (proforma) {
      this.router.navigate(['proformavalide', 'edit', proforma.id]);
    } else {
      this.router.navigate(['proformavalide', 'edit']);
    }
  }

  ngOnInit(): void {
    this.dtOptions = this.initNouveau();
    this.proformaService.getAll('proforma').then((data) => {
      this.proformas = data.filter((d) => {
        return new Date(d.date).getFullYear() == this.annee;
      });
      this.dtTrigger.next('');
    });
    setTimeout(() => {
    }, 1000);
  }

  refreshAll() {    
    this.proformaService.getAll('proforma').then((data) => {
      this.proformas = data.filter((d) => {
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
