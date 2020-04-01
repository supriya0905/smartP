import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare const $: any;
declare interface RouteInfo1 {
    path: string;

}
export const ROUTES1: RouteInfo1[] = [
  { path: '/Dashboard' },

];
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  luser:any=JSON.parse(localStorage.getItem('PEMSUser'));
  constructor(private router: Router) { }
  obj:any;
  menuItems: any[];
  
  ngOnInit() {
    // console.log('dashboard');
    // this.menuItems = ROUTES1.filter(menuItem => menuItem);
    // var retrievedObject = localStorage.getItem('PEMSUser');
    // this.obj = JSON.parse(retrievedObject)
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
