import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { Enforcement } from '../model/EnforcementDetails'

const APIEndpoint = environment.APIEndpoint;

@Injectable({
  providedIn: 'root'
})
export class EnforcementService {
  options: any;
  constructor(private http: HttpClient, private oservice: AuthService, private router: Router) {
    this.options = oservice.SetTokenHeader();
  }

  GetAllEnforcement(lUser: string, sortcolumn: string, sortby: string, pagesize: number, pageoffset: number, colfilter: string) {
    return this.http.get<Enforcement[]>(APIEndpoint + '/Enforcement/' + lUser + '/' + pagesize + '/' + pageoffset + '/' + sortcolumn + '/' + sortby + '/' + colfilter, this.options);
  }

  GetEnforcementById(id: number) {
    return this.http.get<Enforcement[]>(APIEndpoint + '/GetEnforcementById/' + id, this.options);
  }

  GetAllEnforcementType() {
    return this.http.get<Enforcement[]>(APIEndpoint + "/GetAllEnforcementType", this.options);
  }
  GetAllEnforcementTypeAndClient() {
    return this.http.get<Enforcement[]>(APIEndpoint + "/GetAllEnforcementTypeAndClient", this.options);
  }
  AddEnforcement(cameraenforcement: Enforcement) {
    return this.http.post<Enforcement[]>(APIEndpoint + "/AddEnforcement", cameraenforcement, this.options);
  }

  UpdateEnforcement(enforcement: Enforcement) {
    return this.http.put<Enforcement[]>(APIEndpoint + "/UpdateEnforcement", enforcement, this.options);
  }

  GetClientLocationByClientId(ClientId: number) {
    return this.http.get<Enforcement[]>(APIEndpoint + '/GetClientLocationByClientId/' + ClientId, this.options);
  }

  GetZoneCameraList(Clientid: number) {
    return this.http.get<Enforcement[]>(APIEndpoint + '/CameraZoneList/' + Clientid, this.options);
  }
  GetEnforcementAndClient() {
    return this.http.get<Enforcement[]>(APIEndpoint + "/GetAllEnforcementTypeAndClient", this.options);
  }

}
