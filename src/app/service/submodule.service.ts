import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import{AuthService} from '../service/auth.service';
import { SubModule } from '../model/SubModule';
import{ModuleSubModuleValidity} from '../model/ModuleSubModuleValidity'
import {Router} from '@angular/router';

const APIEndpoint = environment.APIEndpoint;

@Injectable()
export class SubModuleService {
  options: any;  

  constructor(private http:HttpClient,private oservice:AuthService,private router: Router) {       
     this.options=oservice.SetTokenHeader();
  }

  GetAllSubModules(lUser:string,sortcolby:string,sortorder:string,pagesize:number,rowoffset:number,filterstring:string)
  { 
    return this.http.get<SubModule[]>(APIEndpoint+'/SubModules/'+lUser+'/'+pagesize+'/'+rowoffset+'/'+sortcolby+'/'+sortorder+'/'+filterstring,this.options);     
  } 
  
  GetAllActiveModules()
  { 
    return this.http.get<any>(APIEndpoint+'/GetAllActiveModules',this.options);     
  }  

  GetSubModuleById(id:number)
  { 
    return this.http.get<SubModule>(APIEndpoint+'/GetSubModuleById/'+id,this.options);
  } 

  IsSubModuleValid(moduleid:number,modulename:string){
    return this.http.get<ModuleSubModuleValidity>(APIEndpoint+'/CheckSubModuleName/'+moduleid+'/'+modulename,this.options);
  }
  
  AddSubModule(submodule: SubModule){
    return this.http.post<SubModule>(APIEndpoint+"/AddSubModule", submodule,this.options);
  }

  UpdateSubModule(submodule: SubModule){  
    return this.http.put<SubModule>(APIEndpoint+"/UpdateSubModule", submodule,this.options);
  }
}
