import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Utility } from '../helpers/utility'
import { CustomGridHeader } from '../model/CustomGridHeader';
import { ToastrService } from 'ngx-toastr';
import { OverlayService } from '../service/overlay.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ControlmasterService } from '../service/controlmaster.service';
import { CountryStateCity } from '../model/Region';
import { LocationService } from './../service/location.service';
import { Location } from '../model/location'
import { debug } from 'util';
import { CustomDropDown } from '../model/CustomDropDown';
import { Router } from '@angular/router';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit {

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
  LocationLabel: string;
  LocationDetail: Location = null;
  Countries: any;
  States: any;
  Cities: any;
  Locations: Location[] = [];
  isPushed: boolean = false;
  obj:any;
  constructor(private api: ControlmasterService,private router: Router, private _api: LocationService, private modalService: BsModalService, private toastr: ToastrService, private _overlay: OverlayService, private formBuilder: FormBuilder) { }

  private ValidateMandatoryField() {
    let msg = "";
    let chk = true;

    if (this.LocationDetail.countryid == 0 || this.LocationDetail.countryid == null || this.LocationDetail.countryid == undefined) {
      msg = msg + " country,";
      chk = false;
    }

    if (this.LocationDetail.stateid == 0 || this.LocationDetail.stateid == null || this.LocationDetail.stateid == undefined) {
      msg = msg + " State,";
      chk = false;
    }

    if (this.LocationDetail.cityid == 0 || this.LocationDetail.cityid == null || this.LocationDetail.cityid == undefined) {
      msg = msg + "city,";
      chk = false;
    }

    if (this.LocationDetail.latitude == null || this.LocationDetail.latitude == '' || this.LocationDetail.latitude == undefined) {
      msg = msg + "Latitude,";
      chk = false;
    }

    if (this.LocationDetail.longitude == null || this.LocationDetail.longitude == '' || this.LocationDetail.longitude == undefined) {
      msg = msg + "Longitude,";
      chk = false;
    }

    if (this.LocationDetail.zip == null || this.LocationDetail.zip == '' || this.LocationDetail.zip == undefined) {
      msg = msg + "ZIP,";
      chk = false;
    }

    if (this.LocationDetail.clientparkingtypeid == null || this.LocationDetail.clientparkingtypeid == 0 || this.LocationDetail.clientparkingtypeid == undefined) {
      msg = msg + "Parking Type,";
      chk = false;
    }

    msg = msg.substring(0, msg.length - 1);

    if (chk == false) {
      this.toastr.warning(msg + ' are mandatory fields.', 'MindTeckSmartParking');
    }

    return chk;
  }

  private ValidateFieldValue() {

    let chk = true;
    let msg = "";
    //LATITUDE_PATTERN
    let regexpemail = new RegExp(/"^(\\+|-)?(?:90(?:(?:\\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\\.[0-9]{1,6})?))$"/);
    if (!regexpemail.test(this.LocationDetail.latitude)) {
      chk = false;
      msg = msg + "Latitude ,";
    }
    //LONGITUDE_PATTERN
    let regcontact = new RegExp(/"^(\\+|-)?(?:180(?:(?:\\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\\.[0-9]{1,6})?))$"/);
    if (!regcontact.test(this.LocationDetail.longitude)) {
      chk = false;
      msg = msg + "Longitude,";
    }


    msg = msg.substring(0, msg.length - 1);

    if (chk == false) {
      this.toastr.warning(msg + ' are invalid fields.', 'MindTeckSmartParking');
    }
    return chk;
  }

  SaveLocation() {
    this._overlay.activateOverlay(true, 'sk-circle');
    if (this.ValidateMandatoryField()) {
   //if (this.ValidateFieldValue()) {
      this._api.AddLocation(this.LocationDetail)
        .subscribe(r => {
          if (r) {
            this.CancelModal();
            this.toastr.success('Record saved successfully!', 'MindTeckSmartParking');
            this.loadAllLocation();
            setTimeout(() => {
              this._overlay.activateOverlay(false, '');
            }, 200);
          }
        },
          r => {
            if (r) {
              this.toastr.error('Server Error', 'MindTeckSmartParking');
              setTimeout(() => {
                this._overlay.activateOverlay(false, '');
              }, 200);
            }
          });
    }
    else {
      setTimeout(() => {
        this._overlay.activateOverlay(false, '');
      }, 500);
    }
 // }
  }

  UpdateLocation() {
    if (this.ValidateMandatoryField()) {
     //if (this.ValidateFieldValue()) {
      this.isPushed = true;
      this._overlay.activateOverlay(true, 'sk-circle');
      this._api.UpdateLocation(this.LocationDetail)
        .subscribe(
          r => {
            if (r) {
              this.CancelModal();
              this.toastr.success('Record saved successfully!', 'MindTeckSmartParking');
              this.loadAllLocation();
              setTimeout(() => {
                this._overlay.activateOverlay(false, '');
              }, 200);
            }
          },
          r => {
            if (r) {
              this.toastr.error('Server Error', 'MindTeckSmartParking');
              setTimeout(() => {
                this._overlay.activateOverlay(false, '');
              }, 200);
            }
          });
        }
   // }
  }
  openModalWithClass(template: TemplateRef<any>) {
    debugger;
    this._api.GetLocationOption(this.luser.clientid)
      .subscribe(lo => {
        let result: any = lo;
        this.LocationDetail = new Location();
        this.LocationDetail.clients = result.clients;
        this.LocationDetail.clientparkingtypes = result.clientparkingtypes;
        this.LocationDetail.countries = result.countries;
        this.LocationDetail.states = result.states;
        this.LocationDetail.cities = result.cities;
        this.LocationDetail.clientparkingtypeid = 0;
        this.LocationDetail.clientid = 0;
        this.LocationDetail.countryid = 0;
        this.LocationDetail.stateid = 0;
        this.LocationDetail.cityid = 0;
        this.LocationDetail.clientname='';
        this.LocationDetail.description = '';
        this.LocationDetail.countryname = '';
        this.LocationDetail.statename = '';
        this.LocationDetail.cityname = '';
        this.LocationDetail.latitude = '';
        this.LocationDetail.longitude = '';
        this.LocationDetail.zip = '';
        this.LocationDetail.parkingtype = '';
        this.LocationDetail.createdby = this.luser.LoggedInUserName;
        this.LocationDetail.onlinebooking = false;
        this.LocationDetail.isactive = true;
        this.LocationLabel = "Create Location";
        this.mode = 1;
        this.modalRef = this.modalService.show(
          template,
          Object.assign({
          }, { class: 'gray modal-lg' })
        );
      });
  }
  openModalWithClassEdit(template: TemplateRef<any>, id) {
    debugger
    this._api.GetLocationById(id)
      .subscribe(loc => {
        let resultloc: any = loc;
        this.LocationDetail = new Location();
        this.LocationDetail.cities = resultloc.cities;
        this.LocationDetail.clientparkingtypes = resultloc.clientparkingtypes;
        this.LocationDetail.clients = resultloc.clients;
        this.LocationDetail.countries = resultloc.countries;
        this.LocationDetail.states = resultloc.states;
        this.LocationDetail.clientparkingtypeid = resultloc.clientparkingtypeid;
        this.LocationDetail.clientid = resultloc.clientid;
        this.LocationDetail.countryid = resultloc.countryid;
        this.LocationDetail.stateid = resultloc.stateid;
        this.LocationDetail.cityid = resultloc.cityid;
        this.LocationDetail.id = resultloc.id;
        this.LocationDetail.description = resultloc.description;
        this.LocationDetail.latitude = resultloc.latitude;
        this.LocationDetail.longitude = resultloc.longitude;
        this.LocationDetail.zip = resultloc.zip;
        this.LocationDetail.modifiedby = this.luser.LoggedInUserName;
        this.LocationDetail.onlinebooking = false;
        this.LocationDetail.isactive = true;
        this.mode = 2;
        this.LocationLabel = "Edit Location";
        this.modalRef = this.modalService.show(
          template,
          Object.assign({
          }, { class: 'gray modal-lg' })
        );
      });
  }

  openModalWIthClassDelete(template: TemplateRef<any>, id) {
    this._api.GetLocationById(id)
      .subscribe(loc => {
        let resultloc: any = loc;
        console.log(loc)
        this.LocationDetail = new Location();
        this.LocationDetail.cities = resultloc.cities;
        this.LocationDetail.clientparkingtypes = resultloc.clientparkingtypes;
        this.LocationDetail.clients = resultloc.clients;
        this.LocationDetail.countries = resultloc.countries;
        this.LocationDetail.states = resultloc.states;
        this.LocationDetail.clientparkingtypeid = resultloc.clientparkingtypeid;
        this.LocationDetail.clientid = resultloc.clientid;
        this.LocationDetail.clientname = resultloc.clientname
        this.LocationDetail.countryid = resultloc.countryid;
        this.LocationDetail.stateid = resultloc.stateid;
        this.LocationDetail.cityid = resultloc.cityid;
        this.LocationDetail.id = resultloc.id;
        this.LocationDetail.description = resultloc.description;
        this.LocationDetail.latitude = resultloc.latitude;
        this.LocationDetail.longitude = resultloc.longitude;
        this.LocationDetail.zip = resultloc.zip;
        this.LocationDetail.modifiedby = this.luser.LoggedInUserName;
        this.LocationDetail.onlinebooking = false;
        this.LocationDetail.isactive = false;
        this.modalRef = this.modalService.show(
          template,
          Object.assign({
          }, { class: 'gray modal-sm' })
        );
      });
  }

  DeleteLocation() {
    this._api.UpdateLocation(this.LocationDetail)
      .subscribe(
        r => {
          this.CancelModal();
          this.toastr.success('Record removed successfully!', 'MindTeckSmartParking');
          this.loadAllLocation();
        },
        r => {
          this.toastr.error('Server Error', 'MindTeckSmartParking');
        });
  }

  CancelModal() {
    this.modalRef.hide();
  }

  CountryChange() {
    this.api.GetStatesByCountry(this.LocationDetail.countryid)
      .subscribe(st => {
        let resultcty: any = st;
        let cddlist: CustomDropDown[] = [];
        resultcty.forEach(itm => {
          let cdd: CustomDropDown = new CustomDropDown();
          cdd.datatext = itm.name;
          cdd.datavalue = itm.id;
          cddlist.push(cdd);
        });
        this.LocationDetail.states = cddlist;
        this.LocationDetail.cities = [];
        this.LocationDetail.stateid = 0;
        this.LocationDetail.cityid = 0;
      },
        st => {
          this.LocationDetail.states = [];
          this.LocationDetail.cities = [];
          this.LocationDetail.stateid = 0;
          this.LocationDetail.cityid = 0;
        }
      );
  }

  StateChange() {
    this.api.GetCityByState(this.LocationDetail.stateid)
      .subscribe(cty => {
        let resultcty: any = cty;
        let cddlist: CustomDropDown[] = [];
        resultcty.forEach(itm => {
          let cdd: CustomDropDown = new CustomDropDown();
          cdd.datatext = itm.name;
          cdd.datavalue = itm.id;
          cddlist.push(cdd);
        });
        this.LocationDetail.cities = cddlist;
        this.LocationDetail.cityid = 0;
      },
        cty => {
          this.LocationDetail.cities = [];
          this.LocationDetail.cityid = 0;
        }
      );
  }

  loadAllLocation() {
    this.TotalCount = 0;
    this.TotalPages = 0;
    this.Locations = null;
    this.pfrom = 0;
    this.pto = 0;
    this._api.GetAllLocation(this.luser.LoggedInUserName, this.psize, this.poffset, this.csortby, this.csortorder, this.cfilter)
      .subscribe(fetched_location => {
        let result: any = fetched_location;
        if (result.length > 0) {
          this.TotalCount = result[0].totalcount;
          this.Locations = result;

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
      });
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
    this.loadAllLocation()
  }

  RefreshGrid() {
    for (let i = 0; i < this.CustomHeader.length; i++) {
      this.CustomHeader[i].ColumnSortClass = 'fa fa-sort';
    }
  }
  
  loadAllLoactionByPageSize() {
    this.CurrentPage = 1;
    this.poffset = 0;
    this.loadAllLocation();
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
      this.loadAllLocation();
    }
    else if (prmvalue == 2) {
      if (this.CurrentPage > 1) {
        this.CurrentPage = this.CurrentPage - 1;
        this.poffset = (this.CurrentPage - 1) * this.psize;
        this.loadAllLocation();
      }
    }
    else if (prmvalue == 3) {
      this.poffset = this.CurrentPage * this.psize;
      this.CurrentPage = this.CurrentPage + 1;
      this.loadAllLocation();
    }
    else if (prmvalue == 4) {
      this.CurrentPage = this.TotalPages;
      this.poffset = (this.TotalPages - 1) * this.psize;
      this.loadAllLocation();
    }
    else {

    }
  }
  ngOnInit() {
    this.mode = 0;
    var cgh = new CustomGridHeader();
    cgh.ColumnId = 1;
    cgh.ColumnNameLabel = "Client Name";
    cgh.ColumnName = "clientname";
    cgh.ColumnSortClass = "fa fa-sort";
    cgh.IsSortable = true;
    this.CustomHeader.push(cgh);

    cgh = new CustomGridHeader();
    cgh.ColumnId = 2;
    cgh.ColumnNameLabel = "Country";
    cgh.ColumnName = "countryname";
    cgh.ColumnSortClass = "fa fa-sort";
    cgh.IsSortable = true;
    this.CustomHeader.push(cgh);

    cgh = new CustomGridHeader();
    cgh.ColumnId = 3;
    cgh.ColumnNameLabel = "State ";
    cgh.ColumnName = "statename";
    cgh.ColumnSortClass = "fa fa-sort";
    cgh.IsSortable = true;
    this.CustomHeader.push(cgh);

    cgh = new CustomGridHeader();
    cgh.ColumnId = 4;
    cgh.ColumnNameLabel = "City";
    cgh.ColumnName = "cityname";
    cgh.ColumnSortClass = "";
    cgh.IsSortable = false;
    this.CustomHeader.push(cgh);

    cgh = new CustomGridHeader();
    cgh.ColumnId = 5;
    cgh.ColumnNameLabel = "Latitude";
    cgh.ColumnName = "latitude";
    cgh.ColumnSortClass = "";
    cgh.IsSortable = false;
    this.CustomHeader.push(cgh);

    cgh = new CustomGridHeader();
    cgh.ColumnId = 6;
    cgh.ColumnNameLabel = "Longitude";
    cgh.ColumnName = "longitude";
    cgh.ColumnSortClass = "";
    cgh.IsSortable = false;
    this.CustomHeader.push(cgh);

    cgh = new CustomGridHeader();
    cgh.ColumnId = 7;
    cgh.ColumnNameLabel = "ZIP";
    cgh.ColumnName = "zip";
    cgh.ColumnSortClass = "";
    cgh.IsSortable = false;
    this.CustomHeader.push(cgh);

    cgh = new CustomGridHeader();
    cgh.ColumnId = 8;
    cgh.ColumnNameLabel = "Description";
    cgh.ColumnName = "description";
    cgh.ColumnSortClass = "";
    cgh.IsSortable = false;
    this.CustomHeader.push(cgh);

    cgh = new CustomGridHeader();
    cgh.ColumnId = 6;
    cgh.ColumnNameLabel = "Parking Type";
    cgh.ColumnName = "parkingtype";
    cgh.ColumnSortClass = "";
    cgh.IsSortable = false;
    this.CustomHeader.push(cgh);

    cgh = new CustomGridHeader();
    cgh.ColumnId = 9;
    cgh.ColumnNameLabel = "";
    cgh.ColumnSortClass = "";
    cgh.IsSortable = false;
    this.CustomHeader.push(cgh);

    this.loadAllLocation();
    // var retrievedObject = localStorage.getItem('luser');
    // this.obj = JSON.parse(retrievedObject)
    // if (this.obj == null) {
    //   this.router.navigate(['login']);
    // }
  }

}
