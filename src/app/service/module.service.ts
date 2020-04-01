import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import{AuthService} from '../service/auth.service';
import { Module } from '../model/Module';
import{ModuleSubModuleValidity} from '../model/ModuleSubModuleValidity'
import {Router} from '@angular/router';

const APIEndpoint = environment.APIEndpoint;

@Injectable()
export class ModuleService {
  options: any;  

  constructor(private http:HttpClient,private oservice:AuthService,private router: Router) {       
     this.options=oservice.SetTokenHeader();
  }

  GetAllModules(lUser:string,sortcolby:string,sortorder:string,pagesize:number,rowoffset:number,filterstring:string)
  { 
    return this.http.get<any>(APIEndpoint+'/Modules/'+lUser+'/'+pagesize+'/'+rowoffset+'/'+sortcolby+'/'+sortorder+'/'+filterstring,this.options);     
  }  

  GetModuleById(id:number)
  { 
    return this.http.get<Module>(APIEndpoint+'/GetModuleById/'+id,this.options);
  } 

  IsModuleValid(modulename:string){
    return this.http.get<any>(APIEndpoint+'/CheckModuleName/'+modulename,this.options);
  }
  
  AddModule(module: Module){
    return this.http.post<Module>(APIEndpoint+"/AddModule", module,this.options);
  }

  UpdateModule(module: Module){  
    return this.http.put<Module>(APIEndpoint+"/UpdateModule", module,this.options);
  }

  RegenerateMenu(id:number)
  { 
    return this.http.get<any>(APIEndpoint+'/GenerateMenu/'+id,this.options);     
  } 
}
