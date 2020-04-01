import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { OverallReport } from '../model/Report';


const APIEndpoint = environment.APIEndpoint;

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  options: any;
  constructor(private http: HttpClient, private oservice: AuthService, private router: Router) {
    this.options = oservice.SetTokenHeader();
  }
  getAllReports(clid:number,clocid:number,btype:string,stdate:string,enddate:string,vtypeid:number,isfoc:number,lUser:string,sortcol:string,sortoby:string,pagesize:number,rowoffset:number,filterstring:string)
  {     
    return this.http.get<OverallReport>(APIEndpoint+'/OverallReport/'+clid+'/'+clocid+'/'+btype+'/'+stdate+'/'+enddate+'/'+vtypeid+'/'+isfoc+'/'+lUser+'/'+pagesize+'/'+rowoffset+'/'+sortcol+'/'+sortoby+'/'+filterstring,this.options);     
  }  

  getAllReportdDropdown()
  {
    return this.http.get<any>(APIEndpoint + "/OverallReportFilterOption", this.options);
  }

  getAllReportClientLocationByClientId(id:number)
  {
    return this.http.get<any>(APIEndpoint + "/ClientLocations/"+id, this.options);
  }
}
