import { Component, OnInit, TemplateRef, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { DashboardService } from '../../service/dashboard.service';
import { CustomDropDown } from '../../model/CustomDropDown';
import { CustomGridHeader } from '../../model/CustomGridHeader';
import { ToastrService } from 'ngx-toastr';
import { Utility } from '../../helpers/utility';
import { OverlayService } from '../../service/overlay.service';
import { DashboardCameraDetail } from '../../model/DashboardCameraDetail';
import { jsonpCallbackContext } from '@angular/common/http/src/module';
import { HttpErrorResponse } from '@angular/common/http';
import { Chart } from 'chart.js';
import { parse } from 'querystring';
import { DashboardChart } from '../../model/DashboardChart';
import { debug } from 'util';
import { Router } from '@angular/router';


@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.css']
})
export class CameraComponent implements OnInit {
  mode: number;
  ChartSlotLabel: string
  isPushed: boolean = false;
  luser: any = JSON.parse(localStorage.getItem('PEMSUser'));
  CameraDetailBackup: DashboardCameraDetail[] = [];
  CameraDetail: DashboardCameraDetail[] = [];
  SlotDetail: DashboardCameraDetail[] = [];
  CameraEnf: DashboardCameraDetail = null;
  Clients: CustomDropDown[] = [];
  ClientId: number = 0;
  Zone: CustomDropDown[] = [];
  ZoneId: string = "0";
  Camera: CustomDropDown[] = [];
  CameraId: string = "0";
  LiveCam: any;
  modalRef: BsModalRef;
  pfrom: number;
  pto: number;
  psize: number = 10;
  poffset: number = 0;
  csortby: string = '';
  csortorder: string = 'desc';
  cfilter: string = null;
  TotalCount: number = 0;
  TotalPages: number = 0;
  CurrentPage: number = 1;
  CustomHeader: CustomGridHeader[] = [];
  LiveCamera: CustomDropDown[] = [];
  LiveCameraCounter: number;
  LiveCameraUrl: string = "";
  camstr: string = "";
  data = [];
  client_array: DashboardChart[] = [];
  location_array = [];
  ClientNameData = [];
  vacantcount = 0;
  occupiedcount = 0;
  Vacantcount = 0;
  Occupiedcount = 0;
  clientidchart = 0;
  clientname: string;
  zoneid: string;
  cameraid: string;
  newarray = [];
  newlocationarray = [];
  totaloccupied = [];
  totalvacant = [];
  indexdata: any;
  indextzonedata: any;
  SuperAdminLogin: boolean = null;
  ChartDetail: DashboardCameraDetail = null;
  Charts: any;
  cameraslidemain: DashboardCameraDetail = null;
  obj: any;

  ZoneChart: CustomDropDown[] = [];
  CameraChart: CustomDropDown[] = [];
  SlotDetailChart: DashboardCameraDetail[] = [];
  constructor(private api: DashboardService, private router: Router, private modalService: BsModalService, private toastr: ToastrService, private _overlay: OverlayService) {
    this.cameraslidemain = new DashboardCameraDetail();
    this.cameraslidemain.ClientId = 0;
    this.cameraslidemain.ClientName = "";
    this.cameraslidemain.ZoneId = "";
    this.cameraslidemain.CameraId = "";
    this.cameraslidemain.CameraUniqueId = "";
    this.cameraslidemain.LiveCam = "";
    this.cameraslidemain.total_slots = 0;
    this.cameraslidemain.total_occupied_slots = 0;
    this.cameraslidemain.total_vacant_slots = 0;
    this.cameraslidemain.currentindex = 0;
    this.cameraslidemain.show = false;
  }

  //chart code
  loadAllCharts() {
    this.api.GetAllCamera(this.luser.Id)
      .subscribe(slot => {
        let result: any = slot
        this.CameraDetail = result.listCameraDetail;
        for (let i = 0; i < this.CameraDetail.length; i++) {
          let dc = new DashboardChart();
          dc.ClientId = this.CameraDetail[i].ClientId;
          dc.ClientName = this.CameraDetail[i].ClientName;
          dc.total_occupied_slots = 0;
          dc.total_slots = 0;
          dc.total_vacant_slots = 0;
          if (!this.CheckClientArrayExists(this.client_array, this.CameraDetail[i].ClientId)) {
            this.client_array.push(dc);
            console.log(this.client_array)
          }
        }
        //Removing duplicate client id
        for (let i = 0; i < this.client_array.length; i++) {
          for (let j = i + 1; j < this.client_array.length; j++) {
            if (this.client_array[i] == this.client_array[j]) {
              // this.client_array.splice(j);
            }
          }
        }
        // calculating total on basis of client id
        for (let i = 0; i < this.client_array.length; i++) {
          for (let j = 0; j < this.CameraDetail.length; j++) {
            if (this.CameraDetail[j].ClientId == this.client_array[i].ClientId) {
              this.clientidchart = this.CameraDetail[j].ClientId;
              this.vacantcount += this.CameraDetail[j].total_vacant_slots;
              this.occupiedcount += this.CameraDetail[j].total_occupied_slots;
              this.clientname = this.CameraDetail[j].ClientName
            }
            //mapping to JSON format
          }
          this.indexdata = {
            "clientid": this.clientidchart,
            "vacantcount": this.vacantcount,
            "occupiedcount": this.occupiedcount,
            "clientname": this.clientname
          }
          //pushing to output array (final)
          this.newarray.push(this.indexdata);
          this.vacantcount = 0;
          this.occupiedcount = 0;
        }
        //removing duplicate Zoneid
        for (let i = 0; i < this.CameraDetailBackup.length; i++) {
          if (this.location_array.indexOf(this.CameraDetailBackup[i].ZoneId) === -1) {
            this.location_array.push(this.CameraDetailBackup[i].ZoneId)
          }
        }
        for (let i = 0; i < this.location_array.length; i++) {
        }
        //calculating total on the basis of zoneid
        for (let i = 0; i < this.location_array.length; i++) {
          for (let j = 0; j < this.CameraDetailBackup.length; j++) {
            if (this.CameraDetailBackup[j].ZoneId == this.location_array[i]) {
              this.Vacantcount += this.CameraDetailBackup[j].total_vacant_slots;
              this.Occupiedcount += this.CameraDetailBackup[j].total_occupied_slots;
              //this.ClientId = this.CameraDetailBackup[j].ClientId;
            }
            //mapping to JSON format
          }
          this.indextzonedata = {
            "ClientId": this.ClientId,
            "ZoneId": this.location_array[i],
            "Vacantcount": this.Vacantcount,
            "Occupiedcount": this.Occupiedcount,
          }
          //pushing to output array (final)
          this.newlocationarray.push(this.indextzonedata);
          this.Vacantcount = 0;
          this.Occupiedcount = 0;
        }
        this.data = [this.newarray && this.newlocationarray];
      });
  }

  private loadAllDashboardCamera() {
    this._overlay.activateOverlay(true, 'sk-circle');
    this.TotalCount = 0;
    this.TotalPages = 0;
    this.pfrom = 0;
    this.pto = 0;
    this.api.GetAllCamera(this.luser.Id)
      .subscribe(cam => {
        let result: any = cam
        this.SlotDetail = result.listSlot;
        this.CameraDetailBackup = result.listCameraDetail;
        this.CameraDetail = result.listCameraDetail;
        this.TotalCount = this.CameraDetail.length;
        this.BindClientDropDown();
        this.SetPaging();
        if (this.CameraDetail != null) {
          let idx = 0;
          this.CameraDetail.forEach(item => {
            if (this.cameraslidemain.LiveCam === "") {
              this.BindCameraSlide(item, idx);
              idx = idx + 1;
            }
            setTimeout(() => {
              this._overlay.activateOverlay(false, '');
            }, 200);
          });
        }
      });
  }

  CameraSlidePrev() {
    if (this.CameraDetail != null) {
      if (this.cameraslidemain != null) {
        let camdetailindex = this.cameraslidemain.currentindex;

        if (this.CameraDetail.length > 1) {
          if (camdetailindex == 0) {
            camdetailindex = this.CameraDetail.length - 1;
          }
          else if (camdetailindex <= this.CameraDetail.length - 1) {
            camdetailindex = camdetailindex - 1;
          }
          else {
            camdetailindex = camdetailindex - 1;
          }
        }
        else {
          camdetailindex = 0;
        }

        this.BindCameraSlide(this.CameraDetail[camdetailindex], camdetailindex);
      }
    }
  }

  CameraSlideNext() {
    if (this.CameraDetail != null) {
      if (this.cameraslidemain != null) {
        let camdetailindex = this.cameraslidemain.currentindex;

        if (this.CameraDetail.length > 1) {
          if (camdetailindex == 0) {
            camdetailindex = camdetailindex + 1;
          }
          else if (camdetailindex >= this.CameraDetail.length - 1) {
            camdetailindex = 0;
          }
          else {
            camdetailindex = camdetailindex + 1;
          }
        }
        else {
          camdetailindex = 0;
        }

        this.BindCameraSlide(this.CameraDetail[camdetailindex], camdetailindex);
      }
    }
  }

  private BindCameraSlide(item: DashboardCameraDetail, idx: number) {
    this.cameraslidemain = new DashboardCameraDetail();
    this.cameraslidemain.ClientId = item.ClientId;
    this.cameraslidemain.ClientName = item.ClientName;
    this.cameraslidemain.ZoneId = item.ZoneId;
    this.cameraslidemain.CameraId = item.CameraId;
    this.cameraslidemain.CameraUniqueId = item.CameraUniqueId;
    this.cameraslidemain.LiveCam = item.LiveCam;
    this.cameraslidemain.total_slots = item.total_slots;
    this.cameraslidemain.total_occupied_slots = item.total_occupied_slots;
    this.cameraslidemain.total_vacant_slots = item.total_vacant_slots;
    this.cameraslidemain.currentindex = idx;
    this.cameraslidemain.show = true;
  }


  private CheckClientExists(cdd: CustomDropDown, list: CustomDropDown[]) {
    var chk = false;
    list.forEach(item => {
      if (item.datavalue == cdd.datavalue) {
        chk = true;
        return chk;
      }
    });
    return chk;
  }

  private CheckZoneExists(cdd: CustomDropDown, list: CustomDropDown[]) {
    var chk = false;
    list.forEach(item => {
      if (item.datatext == cdd.datatext) {
        chk = true;
        return chk;
      }
    });
    return chk;
  }

  private CheckCameraExists(cdd: CustomDropDown, list: CustomDropDown[]) {
    var chk = false;
    list.forEach(item => {
      if (item.dataitem == cdd.dataitem) {
        chk = true;
        return chk;
      }
    });
    return chk;
  }

  private CheckClientArrayExists(ca: DashboardChart[], cid: number) {
    var chk = false;
    ca.forEach(item => {
      if (item.ClientId === cid) {
        chk = true;
        return chk;
      }
    });
    return chk;
  }

  private InitializeHeader() {
    let cgh = new CustomGridHeader();
    cgh.ColumnId = 1;
    cgh.ColumnNameLabel = "Client";
    cgh.ColumnName = "ClientName";
    cgh.ColumnSortClass = "fa fa-sort";
    cgh.IsSortable = true;
    this.CustomHeader.push(cgh);

    cgh = new CustomGridHeader();
    cgh.ColumnId = 2;
    cgh.ColumnNameLabel = "Location";
    cgh.ColumnName = "ZoneId";
    cgh.ColumnSortClass = "fa fa-sort";
    cgh.IsSortable = true;
    this.CustomHeader.push(cgh);

    cgh = new CustomGridHeader();
    cgh.ColumnId = 3;
    cgh.ColumnNameLabel = "Camera";
    cgh.ColumnName = "CameraId";
    cgh.ColumnSortClass = "fa fa-sort";
    cgh.IsSortable = true;
    this.CustomHeader.push(cgh);

    cgh = new CustomGridHeader();
    cgh.ColumnId = 4;
    cgh.ColumnNameLabel = "Vacant";
    cgh.ColumnName = "total_vacant_slots";
    cgh.ColumnSortClass = "";
    cgh.IsSortable = false;
    this.CustomHeader.push(cgh);

    cgh = new CustomGridHeader();
    cgh.ColumnId = 5;
    cgh.ColumnNameLabel = "Occupied";
    cgh.ColumnName = "total_occupied_slots";
    cgh.ColumnSortClass = "";
    cgh.IsSortable = false;
    this.CustomHeader.push(cgh);

    cgh = new CustomGridHeader();
    cgh.ColumnId = 6;
    cgh.ColumnNameLabel = "Total";
    cgh.ColumnName = "total_slots";
    cgh.ColumnSortClass = "";
    cgh.IsSortable = false;
    this.CustomHeader.push(cgh);
  }

  openModalWithClass(template: TemplateRef<any>, cn: string, cid: number, zid: string) {
    this.CameraEnf = new DashboardCameraDetail();
    this.CameraEnf.ClientId = cid;
    this.CameraEnf.ClientName = cn;
    this.CameraEnf.ZoneId = zid;
    this.CameraEnf.CameraId = "0";
    let slotCD = this.CameraDetailBackup.filter(data => data.ClientId == this.CameraEnf.ClientId);
    this.ZoneChart = [];
    slotCD.forEach((element, index) => {
      let cddZone = new CustomDropDown();
      cddZone.datatext = element.ZoneId;
      if (!this.CheckZoneExists(cddZone, this.ZoneChart)) {
        this.ZoneChart.push(cddZone);
      }
    });


    this.modalRef = this.modalService.show(
      template,
      Object.assign({
      }, { class: 'gray modal-lg ' })
    );

  }

  ZoneChangeChart() {
    this.CameraChart = [];
    this.SlotDetailChart = [];
    if (this.CameraEnf.ZoneId !== "0") {
      this.BindCameraChart();
    }
  }

  private BindCameraChart() {
    this.Camera = [];
    this.SlotDetailChart = [];
    let slotCD = this.CameraDetailBackup.filter(data => data.ClientId == this.CameraEnf.ClientId && data.ZoneId == this.CameraEnf.ZoneId);
    slotCD.forEach((element, index) => {
      let cddCam = new CustomDropDown();
      cddCam.datatext = element.CameraId;
      cddCam.dataitem = element.CameraUniqueId;
      if (!this.CheckCameraExists(cddCam, this.CameraChart)) {
        this.CameraChart.push(cddCam);
      }
    });
  }

  CameraChangeChart() {
    this.SlotDetailChart = [];
    this.SlotDetailChart = this.SlotDetail.filter(data => data.UniqueCameraId == this.CameraEnf.CameraId);

  }

  CancelModal() {
    this.modalRef.hide();
  }

  ngOnInit() {
    this.InitializeHeader();
    this.loadAllDashboardCamera();
    // var retrievedObject = localStorage.getItem('luser');
    // this.obj = JSON.parse(retrievedObject)
    // if (this.obj == null) {
    //   this.router.navigate(['Dashboard']);
    // }
    this.loadAllCharts();
    if (this.luser.clientid === 0) {
      this.SuperAdminLogin = true;
    } else {
      this.SuperAdminLogin = false;
    }

  }

  ClientChange() {
    this.cameraslidemain.LiveCam = "";
    this.CameraDetail = [];
    this.Zone = [];
    this.Camera = [];
    if (this.ClientId == 0) {
      this.CameraDetail = this.CameraDetailBackup;
    }
    else {
      this.CameraDetail = this.CameraDetailBackup.filter(data => data.ClientId == this.ClientId);
      this.BindZone();
    }
    this.ZoneId = "0";
    this.CameraId = "0";
    this.TotalCount = this.CameraDetail.length;

    if (this.CameraDetail != null) {
      let idx = 0;
      this.CameraDetail.forEach(item => {
        if (this.cameraslidemain.LiveCam === "") {
          this.BindCameraSlide(item, idx);
          idx = idx + 1;
        }
      });
    }
  }

  ZoneChange() {
    this.cameraslidemain.LiveCam = "";
    this.CameraDetail = [];
    this.Camera = [];
    if (this.ZoneId == "0") {
      this.CameraDetail = this.CameraDetailBackup.filter(data => data.ClientId == this.ClientId);
    }
    else {
      this.CameraDetail = this.CameraDetailBackup.filter(data => data.ClientId == this.ClientId && data.ZoneId == this.ZoneId);
      this.BindCamera();
    }
    this.TotalCount = this.CameraDetail.length;

    if (this.CameraDetail != null) {
      let idx = 0;
      this.CameraDetail.forEach(item => {
        if (this.cameraslidemain.LiveCam === "") {
          this.BindCameraSlide(item, idx);
          idx = idx + 1;
        }
      });
    }
  }

  CameraChange() {
    this.cameraslidemain.LiveCam = "";
    this.CameraDetail = [];
    if (this.CameraId == "0") {
      this.CameraDetail = this.CameraDetailBackup.filter(data => data.ClientId == this.ClientId && data.ZoneId == this.ZoneId);
    }
    else {
      this.CameraDetail = [];
      this.CameraDetail = this.CameraDetailBackup.filter(data => data.ClientId == this.ClientId && data.ZoneId == this.ZoneId && data.CameraUniqueId == this.CameraId);
    }
    this.TotalCount = this.CameraDetail.length;

    if (this.CameraDetail != null) {
      let idx = 0;
      this.CameraDetail.forEach(item => {
        if (this.cameraslidemain.LiveCam === "") {
          this.BindCameraSlide(item, idx);
          idx = idx + 1;
        }
      });
    }
  }

  private BindCamera() {
    this.Camera = [];
    this.CameraDetail.forEach((element, index) => {
      let cddCam = new CustomDropDown();
      cddCam.datatext = element.CameraId;
      cddCam.dataitem = element.CameraUniqueId;
      if (!this.CheckCameraExists(cddCam, this.Camera)) {
        this.Camera.push(cddCam);
      }
    });
  }

  private BindZone() {
    this.Zone = [];
    this.CameraDetail.forEach((element, index) => {
      let cddZone = new CustomDropDown();
      cddZone.datatext = element.ZoneId;
      if (!this.CheckZoneExists(cddZone, this.Zone)) {
        this.Zone.push(cddZone);
      }
    });
  }

  private BindClientDropDown() {
    this.Clients = [];
    this.CameraDetail.forEach((element, index) => {
      let cddClient = new CustomDropDown();
      cddClient.datatext = element.ClientName;
      cddClient.datavalue = element.ClientId;
      if (!this.CheckClientExists(cddClient, this.Clients)) {
        this.Clients.push(cddClient);
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
    this.loadAllDashboardCameraLocal();
  }

  private loadAllDashboardCameraLocal() {
    this.CameraDetail = this.CameraDetailBackup;
    this.TotalCount = this.CameraDetail.length;
    this.BindClientDropDown();
    this.SetPaging();
  }
}