import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import{LoggedInUser} from '../model/LoggedInUser';
import { Router } from '@angular/router';
const APIEndpoint = environment.APIEndpoint;

@Injectable()
export class AuthenticationService { 
    visible: boolean;
    constructor(private http: HttpClient) { 
        this.visible = false;
    }
    hide() { this.visible = false; }
    show() { this.visible = true; }
   
    login(username: string, password: string) {       
        return this.http.post<any>(APIEndpoint+'/Login', { username: username, password: password })
            .pipe(map(user => {                
                // login successful if there's a jwt token in the response               
                if (user && user.Token) {                                       
                    // store user details and jwt token in local storage to keep user logged in between page refreshes                  
                    var pUser = new LoggedInUser();
                    pUser.Id = user.Id;
                    pUser.clientid=user.clientid;
                    pUser.firstname=user.firstname;
                    pUser.lastname=user.lastname;
                    pUser.LoggedInUserName = user.LoggedInUserName;
                    pUser.Menu = user.Menu;
                    pUser.Token = user.Token;
                    pUser.ParkingTypes = user.ParkingTypes;
                    var result:any[];
                    var array: any = user.Menu;
                    var groups = new Set(array.map(item => item.modulename));                  
                    result = [];                   
                    groups.forEach(                        
                        g =>        
                      result.push({                        
                        name: g, 
                        values: array.filter(i => i.modulename === g),
                        submenu:this.CheckHasChild(g,pUser.Menu)                  
                      }
                    ));
                    pUser.GroupMenu = result;
                    localStorage.setItem('PEMSUser', JSON.stringify(pUser));                 
                    pUser = null;
                    }      
                    console.log(user.Token)     
                return user;
            }));
            
    }

    private CheckHasChild(item:any,menu:any){
        var hc=true;
        menu.forEach(itm => { 
            if(item==itm.modulename){
              if(itm.childmenu===false) 
              {
                  hc=false;
                  return hc;
              }
            }
        });
        return hc;
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('PEMSUser');
    }
}