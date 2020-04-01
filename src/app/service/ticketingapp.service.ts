import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { ticketingapp } from '../model/ticketingapp';

const APIEndpoint = environment.APIEndpoint;

@Injectable()
export class TicketService {
  options: any;

  constructor(private http: HttpClient, private oservice: AuthService, private router: Router) {
    this.options = oservice.SetTokenHeader();
  }

  GetAllTicketingAppDetails(ClientLocationId: number) {
    return this.http.get<ticketingapp>(APIEndpoint + '/TicketingAppParkingDasboard/' + ClientLocationId, this.options);
  }
}