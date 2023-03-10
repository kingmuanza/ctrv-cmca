import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DatatablesOptions } from 'src/app/_data/datatable.option';
import { Assistant } from 'src/app/_models/assistant.model';
import { CrudService } from 'src/app/_services/crud.service';

@Component({
  selector: 'app-assistant-list',
  templateUrl: './assistant-list.component.html',
  styleUrls: ['./assistant-list.component.scss']
})
export class AssistantListComponent implements OnInit {

  // Datatables
  dtOptions: any = DatatablesOptions;
  dtTrigger = new Subject<any>();
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  dtInstance!: Promise<DataTables.Api>;

  assistants = new Array<Assistant>();

  constructor(
    private router: Router,
    private assistantService: CrudService<Assistant>,
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

  edit(assistant?:Assistant) {
    if (assistant) {
      this.router.navigate(['assistant', 'view', assistant.id]);
    } else {
      this.router.navigate(['assistant', 'edit']);
    }
  }

  ngOnInit(): void {
    this.dtOptions = this.initNouveau();
    this.assistantService.getAll('assistant').then((data) => {
      this.assistants = data.filter((d) => {
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
