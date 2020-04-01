import { Component, OnInit } from '@angular/core';
import{LoggedInUser} from '../model/LoggedInUser';
import {Router} from '@angular/router';
import {AuthenticationService} from '../service/login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit { 
  
  HeaderData:LoggedInUser=JSON.parse(localStorage.getItem('PEMSUser')); 
  constructor(private router: Router,private nav:AuthenticationService) { }
  ngOnInit() {
    this.nav.show();
  }

  logout(){
    localStorage.removeItem('PEMSUser');
    this.router.navigateByUrl('/login');
  }
}
