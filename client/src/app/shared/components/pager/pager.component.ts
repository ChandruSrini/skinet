import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-pager',
  templateUrl: './pager.component.html',
  styleUrls: ['./pager.component.scss']
})
export class PagerComponent implements OnInit {

  @Input() totalCount: number;
  @Input() pageSize: number;
  //output property cause emitting a event out a component (to shop) of type number
  @Output() pageChanged = new EventEmitter<number>()

  constructor() { }

  ngOnInit(): void {
  }

  onPagerChange(event: any){
    //emitting the page number
    this.pageChanged.emit(event.page)
  }

}
