import { Component, OnInit } from '@angular/core';
import { OverlayService } from '../service/overlay.service';


@Component({
  selector: 'app-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.css']
})
export class OverlayComponent implements OnInit {
  public overlay;
  private overlayType;
  constructor(private _overlay: OverlayService) { }

  ngOnInit() {
             //this._overlay.activateOverlay(true,'sk-rotating-plane');
    
             this._overlay.ovserlayStatus$.subscribe(
              ovserlayStatus => { 
                //alert(ovserlayStatus);
                 this.overlay=ovserlayStatus;
              });
  
        this._overlay.ovserlayType$.subscribe(
              overlayType => {
                 this.overlayType=overlayType;
              });
  }

}
