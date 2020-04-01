import { Injectable } from '@angular/core';
import { Overall } from '../model/All';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { OverallDashboardChart } from '../model/OverallDashboardChart';
const APIEndpoint = environment.APIEndpoint;
@Injectable({
  providedIn: 'root'
})
export class AllService {
  options: any;
  constructor(private http: HttpClient, private oservice: AuthService, private router: Router) {
    this.options = oservice.SetTokenHeader();
  }
  GetDashboardVehicleOccupancy(ClientId: number,IsFavourate:boolean) {
    return this.http.get<Overall>(APIEndpoint + '/DashboardVehicleOccupancy/' + ClientId+ '/'+IsFavourate, this.options);
  }
  GetDashboardVehicleOccupancyDetail(ClientLocationId: number) {
    return this.http.get<Overall>(APIEndpoint + '/DashboardVehicleOccupancyDetail/' + ClientLocationId, this.options);
  }
  GetAllChartDetail(ClientId: number, DisplayType: number) {
    return this.http.get<OverallDashboardChart>(APIEndpoint + '/DashboardChartData/' + ClientId + '/' + DisplayType, this.options);
  }
  GetAllClient(Username: any) {
    return this.http.post<any>(APIEndpoint + '/ClientsByLoggedInUser', { Username: Username }, this.options);
  }

  GetAllCameraURL(ClientLocId:number){

    return this.http.get(APIEndpoint + '/AllLiveCamera'+"?ClientLocationId="+ ClientLocId, this.options)
  }

}
