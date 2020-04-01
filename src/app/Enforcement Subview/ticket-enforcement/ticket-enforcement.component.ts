import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ticket-enforcement',
  templateUrl: './ticket-enforcement.component.html',
  styleUrls: ['./ticket-enforcement.component.css']
})
export class TicketEnforcementComponent implements OnInit {
obj:any;

  constructor(private router: Router) { }

  ngOnInit() {
    // var retrievedObject = localStorage.getItem('luser');
    // this.obj = JSON.parse(retrievedObject)
    // if (this.obj == null) {
    //   this.router.navigate(['login']);
    // }
  }

}
