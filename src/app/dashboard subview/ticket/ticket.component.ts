import { Component, OnInit, TemplateRef, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { TicketService } from '../../service/ticketingapp.service';
import { ticketingapp } from '../../model/ticketingapp';
import { CustomGridHeader } from '../../model/CustomGridHeader';
import { ToastrService } from 'ngx-toastr';
import { Utility } from '../../helpers/utility';
import { LoggedInUser } from '../../model/LoggedInUser';
import { OverlayService } from '../../service/overlay.service';
import { NgAnalyzeModulesHost } from '@angular/compiler';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css']
})
export class TicketComponent implements OnInit {
  luser: any = JSON.parse(localStorage.getItem('PEMSUser'));
  parkingdetail:ticketingapp[] = [];
  CheckinDetail: ticketingapp[] = [];
  CheckoutDetail: ticketingapp[] = [];
  VehicleDetail: ticketingapp[] = [];
  AppDashboard: any;
  TicketingAppDetail: ticketingapp = null
  ClocationId: number = 1
  modalRef: BsModalRef;
  pfrom: number;
  pto: number;
  psize: number = 10;
  poffset: number = 0;
  csortby: string = '';
  csortorder: string = 'desc';
  cfilter: string = null;
  TotalCount: number = 0;
  mode: number;
  TotalPages: number = 0;
  CurrentPage: number = 1;
  CustomHeader: CustomGridHeader[] = [];
  data = [];
  parkinglimit = [];
  caroccupancies = [];
  indextlimitdata:any;
  obj:any;
  constructor(private api: TicketService, private modalService: BsModalService,private router: Router, private toastr: ToastrService, private _overlay: OverlayService) { }

  loadAllAppDashboard() {
    this.api.GetAllTicketingAppDetails(this.ClocationId)
      .subscribe(m => {
        var result: any = m;
        this.parkingdetail = result;
        this.CheckinDetail = result.ActiveCheckInDetail;
        this.CheckoutDetail = result.TodayCheckOutDetail;
        this.VehicleDetail = result.VehicleType;
        this.parkinglimit.push(result);
         this.data = [this.parkinglimit];
        if (result.length > 0) {
          this.TotalCount = m[0].totalcount;
          this.AppDashboard = m;

          if (this.TotalCount > 0) {
            if (this.TotalCount >= this.psize) {
              var modres = this.TotalCount % this.psize;

              if (modres > 0) {
                this.TotalPages = Utility.FloatToInt(this.TotalCount / this.psize) + 1;
              }
              else {
                this.TotalPages = Utility.FloatToInt(this.TotalCount / this.psize);
              }
            }
            else {
              this.TotalPages = 1;
            }

            if (this.CurrentPage == 1) {
              this.pfrom = 1;
              this.pto = this.psize;
            }
            else {
              this.pfrom = ((this.CurrentPage - 1) * this.psize) + 1;
              this.pto = this.pfrom + (this.psize - 1);
            }
          }


        }
      });
  }



  private SetPaging() {
    if (this.TotalCount > 0) {
      if (this.TotalCount >= this.psize) {
        let modres = this.TotalCount % this.psize;
        if (modres > 0) {
          this.TotalPages = Utility.FloatToInt(this.TotalCount / this.psize) + 1;
        }
        else {
          this.TotalPages = Utility.FloatToInt(this.TotalCount / this.psize);
        }
      }
      else {
        this.TotalPages = 1;
      }

      if (this.CurrentPage == 1) {
        this.pfrom = 1;
        this.pto = this.psize;
      }
      else {
        this.pfrom = ((this.CurrentPage - 1) * this.psize) + 1;
        this.pto = this.pfrom + (this.psize - 1);
      }
    }
  }

  loadAllCameraByPageSize() {
    this.CurrentPage = 1;
    this.poffset = 0;
    this.loadAllAppDashboard();
  }
  ngOnInit() {
    this.loadAllAppDashboard();

  }

}