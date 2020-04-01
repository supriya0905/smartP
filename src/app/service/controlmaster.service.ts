import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpErrorResponse  } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { CountryStateCity } from '../model/Region'

const APIEndpoint = environment.APIEndpoint;

@Injectable({
  providedIn: 'root'
})
export class ControlmasterService {
  options: any;

  constructor(private http: HttpClient, private oservice: AuthService, private router: Router) {
    this.options = oservice.SetTokenHeader();
  }

  // country
  GetAllCountry(loggedinuser: string, pagesize: number, pageoffset: number, sortcolumn: string, sortby: string, colfilter: string) {
    return this.http.get<CountryStateCity>(APIEndpoint + '/Countries/' + loggedinuser + '/' + pagesize + '/' + pageoffset + '/' + sortcolumn + '/' + sortby + '/' + colfilter, this.options);
  }

  IsCountryExists(name: string) {
    return this.http.get<CountryStateCity>(APIEndpoint + '/CheckCountryName/' + name, this.options)
  }

  GetCountryById(id: number) {
    return this.http.get<CountryStateCity>(APIEndpoint + '/CountryById/' + id, this.options);
  }

  AddCountry(countrystatecity: CountryStateCity) {
    return this.http.post<CountryStateCity>(APIEndpoint + "/AddCountry", countrystatecity, this.options);
  }

  UpdateCountry(countrystatecity: CountryStateCity) {
    return this.http.put<CountryStateCity>(APIEndpoint + "/UpdateCountry", countrystatecity, this.options);
  }


  //state
  GetAllState(loggedinuser: string, pagesize: number, pageoffset: number, sortcolumn: string, sortby: string, colfilter: string) {
    return this.http.get<CountryStateCity>(APIEndpoint + '/States/' + loggedinuser + '/' + pagesize + '/' + pageoffset + '/' + sortcolumn + '/' + sortby + '/' + colfilter, this.options);
  }

  GetStatesByCountry(CountryId: number) {

    return this.http.get<CountryStateCity>(APIEndpoint + '/StatesByCountry/' + CountryId, this.options);
  }

  IsStateExists(name: string, countryid: number) {
    return this.http.get<CountryStateCity>(APIEndpoint + '/CheckStateName' + '/' + name + '/' + countryid, this.options)
  }

  GetStateById(id: number) {
    return this.http.get<CountryStateCity>(APIEndpoint + '/StateById/' + id, this.options);
  }
  AddState(countrystatecity: CountryStateCity) {
    return this.http.post<CountryStateCity>(APIEndpoint + "/AddState", countrystatecity, this.options);
  }
  UpdateState(countrystatecity: CountryStateCity) {
    return this.http.put<CountryStateCity>(APIEndpoint + "/UpdateState", countrystatecity, this.options);

  }
  //city
  GetAllCity(loggedinuser: string, pagesize: number, pageoffset: number, sortcolumn: string, sortby: string, colfilter: string) {
    return this.http.get<CountryStateCity>(APIEndpoint + '/Cities/' + loggedinuser + '/' + pagesize + '/' + pageoffset + '/' + sortcolumn + '/' + sortby + '/' + colfilter, this.options);
  }
  GetCityByState(StateId: number) {
    return this.http.get<CountryStateCity>(APIEndpoint + '/CitiesByState/' + StateId, this.options);
  }
  IsCityExists(name: string, stateid: number) {
    return this.http.get<CountryStateCity>(APIEndpoint + '/CheckCityName' + '/' + name + '/' + stateid, this.options)
  }
  GetCityById(id: number) {
    return this.http.get<CountryStateCity>(APIEndpoint + '/CityById/' + id, this.options);

  }
  AddCity(countrystatecity: CountryStateCity) {
    return this.http.post<CountryStateCity>(APIEndpoint + "/AddCity", countrystatecity, this.options);
  }
  UpdateCity(countrystatecity: CountryStateCity) {
    return this.http.put<CountryStateCity>(APIEndpoint + "/UpdateCity", countrystatecity, this.options);
  }

}
