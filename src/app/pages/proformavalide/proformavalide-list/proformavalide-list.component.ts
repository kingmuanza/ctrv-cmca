import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DatatablesOptions } from 'src/app/_data/datatable.option';
import { Proforma } from 'src/app/_models/proforma.model';
import { CrudService } from 'src/app/_services/crud.service';

@Component({
  selector: 'app-proformavalide-list',
  templateUrl: './proformavalide-list.component.html',
  styleUrls: ['./proformavalide-list.component.scss']
})
export class ProformavalideListComponent implements OnInit {

  // Datatables
  dtOptions: any = DatatablesOptions;
  dtTrigger = new Subject<any>();
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  dtInstance!: Promise<DataTables.Api>;

  proformas = new Array<Proforma>();

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
        return true;
      });
      this.dtTrigger.next('');
    });
    setTimeout(() => {
    }, 1000);
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
  
}
