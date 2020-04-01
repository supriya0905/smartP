import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { CountryStateCity } from '../model/Region';
import { Location } from '../model/Location';

const APIEndpoint = environment.APIEndpoint;


@Injectable({
  providedIn: 'root'
})
export class LocationService {
  options: any;

  constructor(private http: HttpClient, private oservice: AuthService, private router: Router) {
    this.options = oservice.SetTokenHeader();
  }
  //location
  GetAllLocation(lUser: string, pagesize: number, pageoffset: number, sortcolumn: string, sortby: string, colfilter: string) {
    return this.http.get<Location>(APIEndpoint + '/ClientLocations/' + lUser + '/' + pagesize + '/' + pageoffset + '/' + sortcolumn + '/' + sortby + '/' + colfilter, this.options);
  }
  //locationById
  
  GetLocationById(id: number) {
    return this.http.get<Location>(APIEndpoint + '/ClientLocationById/' + id, this.options);
  }
   //locationById
   GetLocationOption(id: number) {
    return this.http.get<Location>(APIEndpoint + '/ClientLocationOptions/' + id, this.options);
  }
  //add location
  AddLocation(location: Location) {
    debugger;
    return this.http.post<Location>(APIEndpoint + "/AddClientLocation", location, this.options);
  }
  GetClientParkingTypes(id:number){
    return this.http.post<Location>(APIEndpoint + "/ClientParkingTypes/"+id, this.options);
  }
  UpdateLocation(location: Location) {
    return this.http.put<Location>(APIEndpoint + "/UpdateClientLocation", location, this.options);
  }

}

