import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-server-error',
  templateUrl: './server-error.component.html',
  styleUrls: ['./server-error.component.scss']
})
export class ServerErrorComponent implements OnInit {
  error: any

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation()
    // {state: {error: error.error}} = state?.error from interceptor
    this.error = navigation?.extras?.state?.error
   }

  ngOnInit(): void {
  }

}
