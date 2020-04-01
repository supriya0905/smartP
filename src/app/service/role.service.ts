import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import{AuthService} from '../service/auth.service';
import {Router} from '@angular/router';
import{Role}from '../model/Role'

const APIEndpoint = environment.APIEndpoint;

@Injectable()
export class RoleService { 
    options: any;
   
    constructor(private http:HttpClient,private oservice:AuthService,private router: Router) {       
       this.options=oservice.SetTokenHeader();
    }

    getAllRoles(lUser:string,sortcolby:string,sortorder:string,pagesize:number,rowoffset:number,filterstring:string)
    {      
      //console.log(APIEndpoint+'/Roles/'+lUser+'/'+pagesize+'/'+rowoffset+'/'+sortcolby+'/'+sortorder+'/'+filterstring);
      return this.http.get<Role[]>(APIEndpoint+'/Roles/'+lUser+'/'+pagesize+'/'+rowoffset+'/'+sortcolby+'/'+sortorder+'/'+filterstring,this.options);     
    }  

    getAllRoleModules(lUser:string,roleid:number)
    {
      return this.http.get(APIEndpoint+'/RoleModules/'+lUser+'/'+roleid,this.options);     
    } 
    
    IsRoleExists(lUser:string,rolename:string)
    {
      return this.http.get(APIEndpoint+'/IsRoleExists/'+lUser+'/'+rolename+'/1',this.options);    
    }   

    AddRole(role: Role){
      return this.http.post<Role>(APIEndpoint+"/AddRole", role,this.options);
    }

    UpdateRole(role: Role){     
      return this.http.put<Role>(APIEndpoint+"/UpdateRole", role,this.options);
    }
}