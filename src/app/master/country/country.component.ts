import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Utility } from '../../helpers/utility'
import { CustomGridHeader } from '../../model/CustomGridHeader';
import { ToastrService } from 'ngx-toastr';
import { OverlayService } from '../../service/overlay.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ControlmasterService } from '../../service/controlmaster.service';
import { CountryStateCity } from '../../model/Region'
import { Router } from '@angular/router';
// import { LoggedInUser } from '../../model/LoggedInUser';

@Component({

  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent implements OnInit {
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
  submitted = false;
  CountryLabel: string;
  countryid: number;
  CountryModules: any;
  Countries: CountryStateCity[] = [];
  CountryDetail: CountryStateCity = null
  isPushed: boolean = false;
  obj:any;

  constructor(private api: ControlmasterService,private router: Router, private modalService: BsModalService, private toastr: ToastrService, private _overlay: OverlayService, private formBuilder: FormBuilder) { }

  private ValidateMandatoryField() {
    let msg = "";
    let chk = true;

    if (this.CountryDetail.name == null || this.CountryDetail.name == '' || this.CountryDetail.name == undefined) {
      msg = msg + "Country Name,";
      chk = false;
    }

    if (this.CountryDetail.isocode == null || this.CountryDetail.isocode == '' || this.CountryDetail.isocode == undefined) {
      msg = msg + "Country ISO code,";
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

    let regonlyalphabet = new RegExp(/^[A-Za-z ]+$/);
    if (!regonlyalphabet.test(this.CountryDetail.name)) {
      chk = false;
      msg = msg + "Country Name,";
    }

    let regexpemail = new RegExp(/^[A-Za-z ]+$/);
    if (!regexpemail.test(this.CountryDetail.isocode)) {
      chk = false;
      msg = msg + "Country ISO code,";
    }

    msg = msg.substring(0, msg.length - 1);

    if (chk == false) {
      this.toastr.warning(msg + ' are invalid fields.', 'MindTeckSmartParking');
    }

    return chk;

  }

  SaveCountry() {
    if (this.ValidateMandatoryField()) {
      if (this.ValidateFieldValue()) {
        this.isPushed = true;
        this._overlay.activateOverlay(true, 'sk-circle');
        this.api.IsCountryExists(this.CountryDetail.name)
          .subscribe(r => {
            if (r) {
              this.toastr.warning('Country already exists', 'MindTeckSmartParking');
              setTimeout(() => {
                this._overlay.activateOverlay(false, '');
              }, 200);
            }
            else {
              this.api.AddCountry(this.CountryDetail)
                .subscribe(r => {
                  if (r) {
                    this.CancelModal();
                    this.toastr.success('Record saved successfully!', 'MindTeckSmartParking');
                    this.loadAllCountry();
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
          });
      }
    }
  }

  UpdateCountry() {
    if (this.ValidateMandatoryField()) {
      if (this.ValidateFieldValue()) {
        this.isPushed = true;
        this._overlay.activateOverlay(true, 'sk-circle');
        this.api.UpdateCountry(this.CountryDetail)
        .subscribe(
          r => {  
            if(r){
              this.CancelModal();
              this.toastr.success('Record saved successfully!', 'MindTeckSmartParking');
              this.loadAllCountry();
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
  }

  private loadAllCountry() {
    this.TotalCount = 0;
    this.TotalPages = 0;
    this.Countries = null;
    this.pfrom = 0;
    this.pto = 0;
    this.api.GetAllCountry(this.luser.LoggedInUserName, this.psize, this.poffset, this.csortby, this.csortorder, this.cfilter)
      .subscribe(fetched_country => {
        let result: any = fetched_country;
        if (result.length > 0) {
          this.TotalCount = result[0].totalcount;
          this.Countries = result;

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
        setTimeout(() => {
          this._overlay.activateOverlay(false, '');
        }, 200);
      });
  }

  openModalWithClass(template: TemplateRef<any>) {
    this.api.GetCountryById(-1)
      .subscribe(cd => {
        let result: any = cd;
        this.CountryDetail = new CountryStateCity();
        this.CountryDetail.name = '';
        this.CountryDetail.isocode = '';
        this.CountryDetail.modifiedby = this.luser.LoggedInUserName;
        this.mode = 1;
        this.CountryLabel = "Create Country";
        this.modalRef = this.modalService.show(
          template,
          Object.assign({
          }, { class: 'gray modal-lg' })
        );
      });
  }

  CancelModal() {
    this.modalRef.hide();
  }

  openModalWithClassEdit(template: TemplateRef<any>,id) {
    this.api.GetCountryById(id)
      .subscribe(cd => {
        let result: any = cd;
        this.CountryDetail = new CountryStateCity();
        this.CountryDetail.id=id;
        this.CountryDetail.name = result.name;
        this.CountryDetail.isocode = result.isocode;
        this.CountryDetail.modifiedby = this.luser.LoggedInUserName;
        this.CountryDetail.isactive = true;
        this.mode = 2;
        this.CountryLabel = "Edit Country";
        this.modalRef = this.modalService.show(
          template,
          Object.assign({
          }, { class: 'gray modal-lg' })
        );
      });
  }

  unPushMe() {
    this.isPushed = false;
  }
  openModalWithClassDelete(template: TemplateRef<any>,id) {
    this.CountryLabel = "Delete Country";
    this.modalRef = this.modalService.show(
      template,
      Object.assign({
      }, { class: 'gray modal-sm' })
    );
    this.api.GetCountryById(id)
      .subscribe(cd => {
        let result: any = cd;
        this.CountryDetail = new CountryStateCity();
        this.CountryDetail.id=id;
        this.CountryDetail.name = result.name;
        this.CountryDetail.isocode = result.isocode;
        this.CountryDetail.modifiedby = this.luser.LoggedInUserName;
        this.CountryDetail.isactive = false;
      });
  }
  

  DeleteCountry(){
    this.api.UpdateCountry(this.CountryDetail)
    .subscribe(
      r => {
        this.CancelModal();
        this.toastr.success('Record removed successfully!', 'MindTeckSmartParking');
        this.loadAllCountry();
      },
      r => {
        this.toastr.error('Server Error', 'MindTeckSmartParking');
      });
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
     this.loadAllCountry();
    }
    else if (prmvalue == 2) {
      if (this.CurrentPage > 1) {
        this.CurrentPage = this.CurrentPage - 1;
        this.poffset = (this.CurrentPage - 1) * this.psize;
        this.loadAllCountry();
      }
    }
    else if (prmvalue == 3) {
      this.poffset = this.CurrentPage * this.psize;
      this.CurrentPage = this.CurrentPage + 1;
       this.loadAllCountry();
    }
    else if (prmvalue == 4) {
      this.CurrentPage = this.TotalPages;
      this.poffset = (this.TotalPages - 1) * this.psize;
      this.loadAllCountry();
    }
    else {

    }
  }

  GetCountryByFilterOption(){ 
    if(this.cfilter!=null&&this.cfilter!=""&&this.cfilter!=undefined){
      this.cfilter=this.cfilter.trim();    
    }
    else
    {
      this.cfilter=null;
    }    

    this.loadAllCountry();
  } 


  loadAllCountryByPageSize(){
    this.CurrentPage=1;
    this.poffset=0;
    this.loadAllCountry();
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

  ngOnInit() {
    this.mode = 0;
    var cgh = new CustomGridHeader();
    cgh.ColumnId = 1;
    cgh.ColumnNameLabel = "Name";
    cgh.ColumnName = "name";
    cgh.ColumnSortClass = "fa fa-sort";
    cgh.IsSortable = true;
    this.CustomHeader.push(cgh);

    cgh = new CustomGridHeader();
    cgh.ColumnId = 2;
    cgh.ColumnNameLabel = "ISO code";
    cgh.ColumnName = "isocode";
    cgh.ColumnSortClass = "fa fa-sort";
    cgh.IsSortable = true;
    this.CustomHeader.push(cgh);

    cgh = new CustomGridHeader();
    cgh.ColumnId = 3;
    cgh.ColumnNameLabel = "ModifiedBy";
    cgh.ColumnName = "modifiedby";
    cgh.ColumnSortClass = "";
    cgh.IsSortable = false;
    this.CustomHeader.push(cgh);

    cgh = new CustomGridHeader();
    cgh.ColumnId = 4;
    cgh.ColumnNameLabel = "Modified Timestamp";
    cgh.ColumnName = "modifiedtimestamp";
    cgh.ColumnSortClass = "";
    cgh.IsSortable = false;
    this.CustomHeader.push(cgh);

    cgh = new CustomGridHeader();
    cgh.ColumnId = 5;
    cgh.ColumnNameLabel = "";
    cgh.ColumnSortClass = "";
    cgh.IsSortable = false;
    this.CustomHeader.push(cgh);

    this.loadAllCountry();
    // var retrievedObject = localStorage.getItem('luser');
    // this.obj = JSON.parse(retrievedObject)
    // if (this.obj == null) {
    //   this.router.navigate(['login']);
    // }
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
this.loadAllCountry();
  }

  RefreshGrid() {
    for (let i = 0; i < this.CustomHeader.length; i++) {
      this.CustomHeader[i].ColumnSortClass = 'fa fa-sort';
    }
this.loadAllCountry();
  }
}
