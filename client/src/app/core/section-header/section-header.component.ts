import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BreadcrumbService } from 'xng-breadcrumb';

@Component({
  selector: 'app-section-header',
  templateUrl: './section-header.component.html',
  styleUrls: ['./section-header.component.scss']
})
export class SectionHeaderComponent implements OnInit {
  //breadc comes in []
  breadcrumb$: Observable<any[]>

  constructor(private bsService: BreadcrumbService) { }

  ngOnInit(): void {
    //this.bsService.breadcrumbs$ is of type observable
    this.breadcrumb$ = this.bsService.breadcrumbs$
  }

}
