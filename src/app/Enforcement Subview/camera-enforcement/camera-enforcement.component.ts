import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { EnforcementService } from '../../service/enforcement.service';
import { Enforcement } from '../../model/EnforcementDetails'
import { CustomGridHeader } from '../../model/CustomGridHeader';
import { CustomDropDown } from '../../model/CustomDropDown';
import { Utility } from '../../helpers/utility';
import { OverlayService } from '../../service/overlay.service';
import { jsonpCallbackContext } from '@angular/common/http/src/module';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { DashboardService } from '../../service/dashboard.service';
import { DashboardCameraDetail } from '../../model/DashboardCameraDetail';
import { denodeify } from 'q';
import { Router } from '@angular/router';


@Component({
  selector: 'app-camera-enforcement',
  templateUrl: './camera-enforcement.component.html',
  styleUrls: ['./camera-enforcement.component.css']
})
export class CameraEnforcementComponent implements OnInit {

  private rlid: number = 0;
  luser: any = JSON.parse(localStorage.getItem('PEMSUser'));
  modalRef: BsModalRef;
  pfrom: number;
  pto: number;
  psize: number = 10;
  poffset: number = 0;
  csortby: string = 'id';
  csortorder: string = 'desc';
  cfilter: string = null;
  TotalCount: number = 0;
  mode: number;
  TotalPages: number = 0;
  CurrentPage: number = 1;
  CustomHeader: CustomGridHeader[] = [];
  CameraLabel: string;
  EnforcementCameraDetails: any;
  CameraEnforcements: any;
  Clients: CustomDropDown[] = [];
  ClientLocation:CustomDropDown[] = [];
  Zone: CustomDropDown[] = [];
  ZoneId: string = "0";
  Camera: CustomDropDown[] = [];
  CameraId: string = "0";
  CameraEnf: Enforcement = null;
  CameraDetailBackup: DashboardCameraDetail[] = [];
  CameraDetail: DashboardCameraDetail[] = [];
  EnforcementTypes: CustomDropDown[] = [];
  obj:any;

  constructor(private api: EnforcementService, private router: Router,private dashboard_api: DashboardService, private modalService: BsModalService, private toastr: ToastrService, private _overlay: OverlayService, private formBuilder: FormBuilder) { }

  private loadAllEnforcementCamera() {
    this.TotalCount = 0;
    this.CameraEnforcements = null;
    this.TotalPages = 0;
    this.pfrom = 0;
    this.pto = 0;
    this.api.GetAllEnforcement(this.luser.LoggedInUserName, this.csortby, this.csortorder, this.psize, this.poffset, this.cfilter)
      .subscribe(r => {
        var result: any = r;
console.log(r)
        if (result.length > 0) {
          this.TotalCount = r[0].totalcount;
          this.CameraEnforcements = r;

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

  openModalWithClass(template: TemplateRef<any>) {
    debugger;
    this.api.GetAllEnforcementTypeAndClient().subscribe(m => {
      var result: any = m;
      this.Clients = result.lstClient;
      this.EnforcementTypes = result.lstEnforcementType;
      this.ClientLocation = result.clientlocation;
      this.CameraEnf = new Enforcement();
      this.CameraEnf.clientid = 0;
      this.CameraEnf.clientname = '';
      this.CameraEnf.zoneid = '0';
      this.CameraEnf.cameraid = '0';
      this.CameraEnf.title = '';
      this.CameraEnf.description = '';
      this.CameraEnf.id = 0;
      this.CameraEnf.enforcementtypeid = 0;
      this.CameraEnf.clientlocationid = 0;
      this.CameraEnf.clientlocationdescription='';
      this.CameraEnf.isfixed = false;
      this.CameraEnf.createdby = this.luser.LoggedInUserName;
      this.CameraEnf.isactive = true;
      this.mode = 1;
      this.CameraLabel = "Create Enforcement";
      this.modalRef = this.modalService.show(
        template,
        Object.assign({
        }, { class: 'gray modal-lg' })
      );
    });
  }

  ClientChange(){
     this.api.GetClientLocationByClientId(this.luser.clientid)
      .subscribe(m => {
        let clientbylocation: any = m;
        console.log(clientbylocation )
      });
    }

  // .subscribe(st => {
  //   let resultcty: any = st;
  //   let cddlist: CustomDropDown[] = [];
  //   resultcty.forEach(itm => {
  //     let cdd: CustomDropDown = new CustomDropDown();
  //     cdd.datatext = itm.name;
  //     cdd.datavalue = itm.id;
  //     cddlist.push(cdd);
  //   });
  //   this.LocationDetail.states = cddlist;

  openModalWithClassEdit(template: TemplateRef<any>,id) {
    debugger;
    this.api.GetEnforcementById(id).subscribe(m => {
          let  result: any = m;
          this.CameraEnf = new Enforcement();
          this.CameraEnf.clientid = result.clientid;
          this.CameraEnf.clientname = result.clientname;
          this.CameraEnf.zoneid = result.zoneid;
          this.CameraEnf.cameraid = result.cameraid;
          this.CameraEnf.title = result.title;
          this.CameraEnf.description = result.description;
          this.CameraEnf.id = result.id;
          this.CameraEnf.enforcementtypeid = result.enforcementtypeid;
          this.CameraEnf.isfixed = false;
          this.CameraEnf.createdby = this.luser.LoggedInUserName;
          this.CameraEnf.isactive = true;
          this.api.GetEnforcementAndClient().subscribe(r => {
          let drpresult: any=r
          this.Clients = drpresult.lstClient;
          this.EnforcementTypes = drpresult.lstEnforcementType;
          this.api.GetZoneCameraList(this.CameraEnf.clientid).subscribe(data => {       
            var result: any = data;
            this.CameraDetail = result;
            this.BindZone();
            this.BindCamera(); 
            this.mode=2;
            this.CameraLabel = "Edit Enforcement";
            this.modalRef = this.modalService.show(
              template,
              Object.assign({
              }, { class: 'gray modal-lg' })
            );
        });
      });
    });
  }

  openModalWIthClassDelete(template: TemplateRef<any>, id) {
    debugger;
    this.api.GetEnforcementById(id)
      .subscribe(cty => {
        let result: any = cty;
        this.CameraEnf = new Enforcement();
        this.CameraEnf.clientid = result.clientid;
        this.CameraEnf.clientname = result.clientname;
        this.CameraEnf.zoneid = result.zoneid;
        this.CameraEnf.cameraid = result.cameraid;
        this.CameraEnf.title = result.title;
        this.CameraEnf.description = result.description;
        this.CameraEnf.id = result.id;
        this.CameraEnf.enforcementtypeid = result.enforcementtypeid;
        this.CameraEnf.isfixed = false;
        this.CameraEnf.modifiedby = this.luser.LoggedInUserName;
        this.CameraEnf.isactive = false;
        this.CameraLabel = "Delete Enforcement"
        this.modalRef = this.modalService.show(
          template,
          Object.assign({
          }, { class: 'gray modal-sm' })
        );
      });
  }


  ngOnInit() {
    this.ClientChange()
    this.mode = 0;
    var cgh = new CustomGridHeader();
    cgh.ColumnId = 1;
    cgh.ColumnNameLabel = "Client";
    cgh.ColumnName = "clientname";
    cgh.ColumnSortClass = "fa fa-sort";
    cgh.IsSortable = true;
    this.CustomHeader.push(cgh);

    cgh = new CustomGridHeader();
    cgh.ColumnId = 2;
    cgh.ColumnNameLabel = "Title";
    cgh.ColumnName = "title";
    cgh.ColumnSortClass = "";
    cgh.IsSortable = false;
    this.CustomHeader.push(cgh);

    cgh = new CustomGridHeader();
    cgh.ColumnId = 3;
    cgh.ColumnNameLabel = "Description";
    cgh.ColumnName = "description";
    cgh.ColumnSortClass = "";
    cgh.IsSortable = false;
    this.CustomHeader.push(cgh);

    cgh = new CustomGridHeader();
    cgh.ColumnId = 4;
    cgh.ColumnNameLabel = "CreatedBy";
    cgh.ColumnName = "CreatedBy";
    cgh.ColumnSortClass = "";
    cgh.IsSortable = false;
    this.CustomHeader.push(cgh);

    cgh = new CustomGridHeader();
    cgh.ColumnId = 5;
    cgh.ColumnNameLabel = "IsFixed";
    cgh.ColumnName = "isfixed";
    cgh.ColumnSortClass = "";
    cgh.IsSortable = false;
    this.CustomHeader.push(cgh);

    cgh = new CustomGridHeader();
    cgh.ColumnId = 6;
    cgh.ColumnNameLabel = "";
    cgh.ColumnSortClass = "";
    cgh.IsSortable = false;
    this.CustomHeader.push(cgh);
    this.loadAllEnforcementCamera();
    // var retrievedObject = localStorage.getItem('luser');
    // this.obj = JSON.parse(retrievedObject)
    // if (this.obj == null) {
    //   this.router.navigate(['login']);
    // }
  }

  ClientChangeEnf() {
    this.Zone = [];
    this.Camera = [];
    if (this.CameraEnf.clientid > 0) {
      this.api.GetZoneCameraList(this.CameraEnf.clientid).subscribe(m => {
        var result: any = m;
        this.CameraDetail = result;
        this.BindZone();
      });
    }
  }

  private BindZone() {
    this.CameraDetail.forEach((element, index) => {
      let cddZone = new CustomDropDown();
      cddZone.datatext = element.ZoneId;
      if (!this.CheckZoneExists(cddZone, this.Zone)) {
        this.Zone.push(cddZone);
      }
    });
  }

  ZoneChange() {
    this.Camera = [];
    if (this.CameraEnf.zoneid !== "0") {
      this.BindCamera();
    }
  }

  private BindCamera() {
    this.CameraDetail.forEach((element, index) => {
      if (element.ZoneId == this.CameraEnf.zoneid) {
        let cddCam = new CustomDropDown();
        cddCam.datatext = element.CameraId;
        cddCam.dataitem = element.CameraId;
        if (!this.CheckCameraExists(cddCam, this.Camera)) {
          this.Camera.push(cddCam);
        }
      }
    });
  }

  ValidateMandatoryField() {
    var msg = "";
    var chk = true;
    if (this.CameraEnf.title == null || this.CameraEnf.title == '' || this.CameraEnf.title == undefined) {
      msg = msg + "Title,";
      chk = false;
    }
    msg = msg.substring(0, msg.length - 1);

    if (chk == false) {
      this.toastr.warning(msg + ' are mandatory fields.', 'MindTeckSmartParking');
    }
    return chk;
  }

  GetRoleByFilterOption() {
    if (this.cfilter != null && this.cfilter != "" && this.cfilter != undefined) {
      this.cfilter = this.cfilter.trim();
    }
    else {
      this.cfilter = null;
    }
    this.loadAllEnforcementCamera();
  }

  RefreshGrid() {
    for (let i = 0; i < this.CustomHeader.length; i++) {
      this.CustomHeader[i].ColumnSortClass = 'fa fa-sort';
    }
    this.loadAllEnforcementCamera();
  }


  SortColumn(cn: string, ccls: string, idx: number) {
    this.csortby = cn;
    if (ccls == 'fa fa-sort' || ccls == 'fa fa-sort-asc') {
      this.CustomHeader[idx].ColumnSortClass = 'fa fa-sort-desc';
      this.csortorder = 'desc';
    }
    else {
      this.CustomHeader[idx].ColumnSortClass = 'fa fa-sort-asc';
      this.csortorder = 'asc';
    }
    this.loadAllEnforcementCamera();
  }

  DeleteCameraEnforcement() {
    debugger;
    this.api.UpdateEnforcement(this.CameraEnf)
      .subscribe(
        r => {
          this.CancelModal();
          this.toastr.success('Record removed successfully!', 'MindTeckSmartParking');
          this.loadAllEnforcementCamera();
        },
        r => {
          this.toastr.error('Server Error', 'MindTeckSmartParking');
        });
  }

  loadAllEnforcementCameraByPageSize() {
    this.CurrentPage = 1;
    this.poffset = 0;
    this.loadAllEnforcementCamera();
  }
  CheckPaginationFirst() {
    var chk = true;
    if (this.TotalPages > 0 && this.CurrentPage > 1) {
      chk = false;
    }
    return chk;
  }

  CheckPaginationPrev() {
    var chk = true;
    if (this.TotalPages > 0 && this.CurrentPage > 1) {
      chk = false;
    }
    return chk;
  }

  CheckPaginationNext() {
    var chk = true;
    if (this.TotalPages > 0 && this.CurrentPage < this.TotalPages) {
      chk = false;
    }
    return chk;
  }

  CheckPaginationLast() {
    var chk = true;
    if (this.TotalPages > 0 && this.CurrentPage < this.TotalPages) {
      chk = false;
    }
    return chk;
  }

  GoToPage(prmvalue: number) {

    if (prmvalue == 1) {
      this.CurrentPage = 1;
      this.poffset = 0;
      this.loadAllEnforcementCamera();
    }
    else if (prmvalue == 2) {
      if (this.CurrentPage > 1) {
        this.CurrentPage = this.CurrentPage - 1;
        this.poffset = (this.CurrentPage - 1) * this.psize;
        this.loadAllEnforcementCamera();
      }
    }
    else if (prmvalue == 3) {
      this.poffset = this.CurrentPage * this.psize;
      this.CurrentPage = this.CurrentPage + 1;
      this.loadAllEnforcementCamera();
    }
    else if (prmvalue == 4) {
      this.CurrentPage = this.TotalPages;
      this.poffset = (this.TotalPages - 1) * this.psize;
      this.loadAllEnforcementCamera();
    }
    else {

    }
  }
  onCheck(rm, item) {
    for (var i = 0; i < rm.values.length; i++) {
      if (item.ischecked == 1) {
        if (rm.values[i].id != item.id) {
          rm.values[i].ischecked = 0;
        }
      }
    }
  }
  CancelModal() {
    this.modalRef.hide();
  }

  UpdateCameraEnforcement() {
    if (this.ValidateMandatoryField()) {
        this._overlay.activateOverlay(true, 'sk-circle');
        this.api.UpdateEnforcement(this.CameraEnf)
        .subscribe(
          r => {  
            if(r){
              this.CancelModal();
              this.toastr.success('Record updated successfully!', 'MindTeckSmartParking');
              this.loadAllEnforcementCamera();
              setTimeout(() => {
                this._overlay.activateOverlay(false,'');
                },200);
            }
          },
          r => {
            if(r){
            this.toastr.error('Server Error', 'MindTeckSmartParking');
            setTimeout(() => {
              this._overlay.activateOverlay(false,'');
              },200);
            }
          });
    }
  }

  SaveCameraEnforcement() {   
    debugger;
    this._overlay.activateOverlay(true, 'sk-circle');
    if (this.ValidateMandatoryField()) {
      this.api.AddEnforcement(this.CameraEnf)
        .subscribe(
          r => {
            if (r) {
              this.CancelModal();
              this.toastr.success('Record saved successfully!', 'MindTeckSmartParking');
              this.loadAllEnforcementCamera();
              setTimeout(() => {
                this._overlay.activateOverlay(false, '');
              }, 500);
            }
          },
          r => {
            if (r) {
              this.toastr.error('Server Error', 'MindTeckSmartParking');
              setTimeout(() => {
                this._overlay.activateOverlay(false, '');
              }, 500);
            }
          });
    }
    else {
      setTimeout(() => {
        this._overlay.activateOverlay(false, '');
      }, 500);
    }
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
      if (item.datatext == cdd.datatext) {
        chk = true;
        return chk;
      }
    });
    return chk;
  }
}
