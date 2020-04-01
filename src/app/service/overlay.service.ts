import { Injectable } from '@angular/core';
import { Subject,Observable,Subscription }    from 'rxjs';
import { filter } from 'rxjs/operators';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OverlayService {

 // Observable string sources
 private overlay = new Subject<boolean>();
 private overlayType = new Subject<string>();

// Observable string streams
ovserlayStatus$ = this.overlay.asObservable();
 ovserlayType$ = this.overlayType.asObservable();

// Service message commands
activateOverlay(val,type) {
 this.overlay.next(val);
 if(val){this.overlayType.next(type);}
 else{this.overlayType.next('');}
 

}
}
