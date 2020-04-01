import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import{AuthService} from '../service/auth.service';
import{Client} from '../model/Client';
import {Router} from '@angular/router';

const APIEndpoint = environment.APIEndpoint;

@Injectable()
export class ClientService {
  options: any;  

  constructor(private http:HttpClient,private oservice:AuthService,private router: Router) {       
     this.options=oservice.SetTokenHeader();
  }

  GetAllClients(lUser:string,sortcolby:string,sortorder:string,pagesize:number,rowoffset:number,filterstring:string)
  { 
    return this.http.get<Client>(APIEndpoint+'/Clients/'+lUser+'/'+pagesize+'/'+rowoffset+'/'+sortcolby+'/'+sortorder+'/'+filterstring,this.options);     
  }  

  GetClientById(id:number)
  { 
    return this.http.get<Client>(APIEndpoint+'/GetClientById/'+id,this.options);
  } 

  IsClientEmailExists(clientemail:string){
    return this.http.post<Client>(APIEndpoint+'/CheckClientEmail', { username: clientemail },this.options)   
  }
  
  AddClient(client: Client){
    return this.http.post<Client>(APIEndpoint+"/AddClient", client,this.options);
  }

  UpdateClient(client: Client){  
    return this.http.put<Client>(APIEndpoint+"/UpdateClient", client,this.options);
  }
}
