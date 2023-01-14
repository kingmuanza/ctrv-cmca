import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Objectif } from 'src/app/_models/objectif.model';
import { CrudService } from 'src/app/_services/crud.service';

@Component({
  selector: 'app-objectif-view',
  templateUrl: './objectif-view.component.html',
  styleUrls: ['./objectif-view.component.scss']
})
export class ObjectifViewComponent implements OnInit {

  objectif = new Objectif();
  isNewObjectif = true;

  constructor(
    private router: Router,
    private notifierService: NotifierService,
    private route: ActivatedRoute,
    private objectifService: CrudService<Objectif>
  ) {    
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (id) {
        this.objectifService.get('objectif', id).then((data) => {
          this.objectif = data;
          this.isNewObjectif = false;
        }); 
      }
    });
  }

  save() {
    console.log('saving');
    if (this.isNewObjectif) {
      console.log('nouveau');
      console.log(this.objectif);
      this.objectifService.create('objectif', this.objectif).then((id) => {
        this.notifierService.notify('success', "saved successfully");
        this.router.navigate(['objectif', 'view', this.objectif.id]);
      });
    } else {
      this.objectifService.modify('objectif', this.objectif.id, this.objectif).then(() => {
        this.notifierService.notify('success', "saved successfully");
        this.router.navigate(['objectif', 'view', this.objectif.id]);
      });
    }
  }

}
