import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
@Injectable()
export class AuthService{
    LogUser = JSON.parse(localStorage.getItem('PEMSUser'));
    httpHeaders: HttpHeaders;
    options: any;
    constructor() { 
        if(this.LogUser==null||this.LogUser==''||this.LogUser=='undefined'){
this.options=null;
        }
        else
        {
            this.httpHeaders = new HttpHeaders({
                'Content-Type' : 'application/json',
                'Authorization' : 'Bearer '+this.LogUser.Token,
                'Accept': 'application/json'
                   });    
                   this.options = {
                headers: this.httpHeaders
                   };
        }
     
    }

    SetTokenHeader(){
        return this.options;
    }
}

   