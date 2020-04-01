import { Component, OnInit, TemplateRef, ViewChild, ElementRef, Input } from '@angular/core';
import { OverlayService } from '../service/overlay.service';
import { ToastrService } from 'ngx-toastr';
import { AllService } from '../service/all.service';
import { ReportService } from '../service/report.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { AuthenticationService } from '../service/login.service';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Overall } from '../model/All'
@Component({
  selector: 'app-all-occupancy',
  templateUrl: './all-occupancy.component.html',
  styleUrls: ['./all-occupancy.component.css']
})
export class AllOccupancyComponent implements OnInit {
  data: any;
  modalRef: BsModalRef;
  luser: any = JSON.parse(localStorage.getItem('PEMSUser'));
  clientid: number = 2;
  dataRefresher: any;
  dataitem: any;
  id:any;
  ClientLocation_array=[]
  ClientLocId:number;
  DetectionCamera:Overall[] = [];
  SurveillanceCamera:Overall[] = [];
  CamURL=[];
  Max=[];
  Now=[];
  percentage=[];
  MaxCamera=[];
  NowCamera=[];
  percentageCamera=[];


  constructor(private _api: ReportService, private modalService: BsModalService, private nav: AuthenticationService, private _overlay: OverlayService, private toastr: ToastrService, private router: Router, private api: AllService) { }

  ngOnInit() {
    this.nav.hide();
    this.AllOcccupancy();
    
  }

  ActiveNonFavLiveFeeds() {
    this._api.getAllReportClientLocationByClientId(this.clientid).subscribe(m => {
      let result: any = m;
      this.ClientLocation_array=result;
      console.log(this.ClientLocation_array)
      //this.LocationChange(this.ClientLocId)
    })
  }

LocationChange(ClientLocId:number){
this.api.GetAllCameraURL(ClientLocId).subscribe(m=>{
let camresult:any=m;
console.log(camresult)
this.DetectionCamera=camresult.detectionCameras;
this.SurveillanceCamera=camresult.surveillanceCameras
for(let i = 0; i<this.SurveillanceCamera.length; i++ ){
  this.CamURL.push(this.SurveillanceCamera[i].camurl);

}
})
  }

    AllOcccupancy() {
    this.api.GetDashboardVehicleOccupancy(this.clientid, false)
      .subscribe(data => {
        this.data = data;
        this.Max=[];
        this.Now=[];
        this.percentage=[];
        this.NowCamera=[];
        this.percentageCamera=[];
        for(let i=0; i<this.data.length; i++){
          this.Max.push(this.data[i].totallimit);
          this.Now.push(this.data[i].totalactivevehicle);
          this.NowCamera.push(this.data[i].totalactivevehiclecamera);
          this.percentage[i]=(this.Now[i])*100/(this.Max[i])
          this.percentageCamera[i]=(this.NowCamera[i])*100/(this.Max[i])
        }
        console.log(this.data)
        console.log()
      });
  }


  // AllOcccupancy() {
  //   this.api.GetDashboardVehicleOccupancy(this.clientid, false)
  //     .subscribe(data => {
  //       this.occupancyData = data;
  //       if (this.occupancyData == null || this.occupancyData == '' || this.occupancyData == undefined) {
  //         this.toastr.warning("no location found for particular client...", 'info', { positionClass: 'toast-center-center', closeButton: true, timeOut: 1000 });
  //         setTimeout(() => {
  //           this._overlay.activateOverlay(false, '');
  //         }, 100);
  //       }
  //     });
  // }

  // ActiveNonFavLiveFeeds() {
  //   //   alert("live feed modal works!!")
  // }

  CancelModal() {
    this.modalRef.hide();
  }
  openModalWithClass(template: TemplateRef<any>, id) {
    this.api.GetDashboardVehicleOccupancyDetail(id).subscribe(m => {
      let result = m;
      this.dataitem = result;
      this.modalRef = this.modalService.show(
        template,
        Object.assign({
        }, { class: 'gray modal-lg' })
      );
    })
  }

}
