import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Commercial } from 'src/app/_models/commercial.model';
import { TraductionPipe } from 'src/app/_pipes/traduction.pipe';
import { CrudService } from 'src/app/_services/crud.service';

@Component({
  selector: 'app-assistant-edit',
  templateUrl: './assistant-edit.component.html',
  styleUrls: ['./assistant-edit.component.scss']
})
export class AssistantEditComponent implements OnInit {

  commercial = new Commercial();
  isNewCommercial = true;

  constructor(
    private traductionPipe: TraductionPipe,
    private router: Router,
    private notifierService: NotifierService,
    private route: ActivatedRoute,
    private commercialService: CrudService<Commercial>
  ) {    
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (id) {
        this.commercialService.get('commercial', id).then((data) => {
          this.commercial = data;
          this.isNewCommercial = false;
        }); 
      }
    });
  }

  save() {
    console.log('saving');
    if (this.isNewCommercial) {
      console.log('nouveau');
      console.log(this.commercial);
      this.commercialService.create('commercial', this.commercial).then((id) => {
        this.notifierService.notify('success', "saved successfully");
        this.router.navigate(['commercial', 'view', this.commercial.id]);
      });
    } else {
      this.commercialService.modify('commercial', this.commercial.id, this.commercial).then(() => {
        this.notifierService.notify('success', "saved successfully");
        this.router.navigate(['commercial', 'view', this.commercial.id]);
      });
    }
  }

  delete() {
    const phrase = this.traductionPipe.transform('Etes-vous sûr de vouloir supprimer cet élément ?');
    const oui = confirm(phrase);
    if (oui) {
      this.commercialService.delete('commercial', this.commercial.id).then(() => {
        this.router.navigate(['commercial']);
      });
    }
  }

}
