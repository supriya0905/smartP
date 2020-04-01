import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import{AuthService} from '../service/auth.service';
import { User } from '../model/User';
import{UserRole} from '../model/UserRole'
import {Router} from '@angular/router';

const APIEndpoint = environment.APIEndpoint;

@Injectable()
export class UserService {
  options: any;  

  constructor(private http:HttpClient,private oservice:AuthService,private router: Router) {       
     this.options=oservice.SetTokenHeader();
  }

  getAllUsers(lUser:string,sortcolby:string,sortorder:string,pagesize:number,rowoffset:number,filterstring:string)
  { 
    return this.http.get<User[]>(APIEndpoint+'/Users/'+lUser+'/'+pagesize+'/'+rowoffset+'/'+sortcolby+'/'+sortorder+'/'+filterstring,this.options);     
  }  

  getUserById(id:number)
  { 
    debugger;
    return this.http.get<any>(APIEndpoint+'/UserByUserName/'+id,this.options);
  } 

  getUserRoles(lUser:string){
    return this.http.get<UserRole[]>(APIEndpoint+'/UserRolesByLoggedInUser/'+lUser+'/1',this.options);     
  }

  IsUserExists(lUser:string,username:string)
  {
    return this.http.get(APIEndpoint+'/IsUserExists/'+lUser+'/'+username+'/1',this.options);    
  } 
  
  AddUser(user: User){
    return this.http.post<User>(APIEndpoint+"/AddUser", user,this.options);
  }

  UpdateUser(user: User){  
    return this.http.put<User>(APIEndpoint+"/UpdateUser", user,this.options);
  }
}
