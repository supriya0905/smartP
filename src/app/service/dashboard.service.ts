import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { DashboardCameraDetail } from '../model/DashboardCameraDetail'
import { BehaviorSubject } from 'rxjs';

const APIEndpoint = environment.APIEndpoint;

@Injectable()
export class DashboardService {
options: any;
lineChartData1 : any= [];

private messageSource = new BehaviorSubject(this.lineChartData1);
currentMessage = this.messageSource.asObservable();


  constructor(private http: HttpClient, private oservice: AuthService, private router: Router) {
    this.options = oservice.SetTokenHeader();
  }

  GetAllCamera(uid: number) {
    return this.http.get<DashboardCameraDetail[]>(APIEndpoint + '/DashboardCamera/' + uid, this.options);
  }

  changeMessage(data: any []) {
    
    this.messageSource = new BehaviorSubject(data);
    this.currentMessage = this.messageSource.asObservable();
    this.messageSource.next(data)
    // console.log("changeMessage : service");
    // console.log(data);
  }

  setLieChartData(data : any []){
    this.lineChartData1 = data;

  }

  getLieChartData(){
    return this.lineChartData1;
  }
}
