import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DatatablesOptions } from 'src/app/_data/datatable.option';
import { Comptable } from 'src/app/_models/comptable.model';
import { CrudService } from 'src/app/_services/crud.service';

@Component({
  selector: 'app-comptable-list',
  templateUrl: './comptable-list.component.html',
  styleUrls: ['./comptable-list.component.scss']
})
export class ComptableListComponent implements OnInit {

  // Datatables
  dtOptions: any = DatatablesOptions;
  dtTrigger = new Subject<any>();
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  dtInstance!: Promise<DataTables.Api>;

  comptables = new Array<Comptable>();

  constructor(
    private router: Router,
    private comptableService: CrudService<Comptable>,
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

  edit(comptable?:Comptable) {
    if (comptable) {
      this.router.navigate(['comptable', 'view', comptable.id]);
    } else {
      this.router.navigate(['comptable', 'edit']);
    }
  }

  ngOnInit(): void {
    this.dtOptions = this.initNouveau();
    this.comptableService.getAll('comptable').then((data) => {
      this.comptables = data.filter((d) => {
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
