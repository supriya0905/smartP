import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-enforcement',
  templateUrl: './enforcement.component.html',
  styleUrls: ['./enforcement.component.css']
})
export class EnforcementComponent implements OnInit {
  luser:any=JSON.parse(localStorage.getItem('PEMSUser'));
  constructor() { }

  ngOnInit() {
    console.log('dashboard');
  }
  CheckTabExists(pname:string){
    var chk=false;
    this.luser.ParkingTypes.forEach(itm => { 
      if(itm.datatext.toLowerCase( )==pname.toLowerCase( )){
        chk=true;         
      }
    });
  }
}
