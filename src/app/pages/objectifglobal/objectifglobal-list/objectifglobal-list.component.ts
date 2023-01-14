import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DatatablesOptions } from 'src/app/_data/datatable.option';
import { Objectifglobal } from 'src/app/_models/objectifglobal.model';
import { CrudService } from 'src/app/_services/crud.service';

@Component({
  selector: 'app-objectifglobal-list',
  templateUrl: './objectifglobal-list.component.html',
  styleUrls: ['./objectifglobal-list.component.scss']
})
export class ObjectifglobalListComponent implements OnInit {

  // Datatables
  dtOptions: any = DatatablesOptions;
  dtTrigger = new Subject<any>();
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  dtInstance!: Promise<DataTables.Api>;

  objectifglobals = new Array<Objectifglobal>();

  constructor(
    private router: Router,
    private objectifglobalService: CrudService<Objectifglobal>,
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

  edit(objectifglobal?:Objectifglobal) {
    if (objectifglobal) {
      this.router.navigate(['objectifglobal', 'edit', objectifglobal.id]);
    } else {
      this.router.navigate(['objectifglobal', 'edit']);
    }
  }

  ngOnInit(): void {
    this.dtOptions = this.initNouveau();
    this.objectifglobalService.getAll('objectifglobal').then((data) => {
      this.objectifglobals = data.filter((d) => {
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
