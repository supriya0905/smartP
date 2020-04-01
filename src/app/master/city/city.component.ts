import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Utility } from '../../helpers/utility'
import { CustomGridHeader } from '../../model/CustomGridHeader';
import { ToastrService } from 'ngx-toastr';
import { OverlayService } from '../../service/overlay.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountryStateCity } from '../../model/Region'
import { ControlmasterService } from '../../service/controlmaster.service'
import { filter } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css']
})
export class CityComponent implements OnInit {
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
  CityLabel: string;
  cityModules: any;
  Cities: any;
  CityDetail: CountryStateCity = null;
  Countries: any;
  States: any;
  isPushed: boolean = false;
  obj:any;

  constructor(private api: ControlmasterService,private router: Router, private modalService: BsModalService, private toastr: ToastrService, private _overlay: OverlayService, private formBuilder: FormBuilder) { }

  private ValidateMandatoryField() {
    let msg = "";
    let chk = true;

    if (this.CityDetail.name == null || this.CityDetail.name == '' || this.CityDetail.name == undefined) {
      msg = msg + "City Name,";
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
    if (!regonlyalphabet.test(this.CityDetail.name)) {
      chk = false;
      msg = msg + "City Name,";
    }
    msg = msg.substring(0, msg.length - 1);
    if (chk == false) {
      this.toastr.warning(msg + ' are invalid fields.', 'MindTeckSmartParking');
    }
    return chk;
  }


  private loadAllCity() {
    this.TotalCount = 0;
    this.TotalPages = 0;
    this.Cities = null;
    this.pfrom = 0;
    this.pto = 0;
    this.api.GetAllCity(this.luser.LoggedInUserName, this.psize, this.poffset, this.csortby, this.csortorder, this.cfilter)
      .subscribe(fetched_state => {
        let result: any = fetched_state;
        if (result.length > 0) {
          this.TotalCount = result[0].totalcount;
          this.Cities = result;

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
    this.api.GetAllCountry(this.luser.LoggedInUserName, 1000, 0, "name", "asc", null)
      .subscribe(cnt => {
        let resultcnt: any = cnt;
        this.Countries = resultcnt;
        this.CityLabel = "Create City";
        this.mode = 1;
        this.CityDetail = new CountryStateCity();
        this.CityDetail.countryid = 0;
        this.CityDetail.stateid = 0;
        this.CityDetail.name = "";
        this.CityDetail.modifiedby = this.luser.LoggedInUserName;
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

  openModalWithClassEdit(template: TemplateRef<any>, id: number) {
    this.api.GetCityById(id)
      .subscribe(cty => {
        let result: any = cty;
        this.CityDetail = new CountryStateCity();
        this.CityDetail.id = result.id;
        this.CityDetail.name = result.name;
        this.CityDetail.countryid = result.countryid;
        this.CityDetail.stateid = result.stateid;
        this.CityDetail.modifiedby = this.luser.LoggedInUserName;
        this.CityDetail.isactive = true;
        this.api.GetAllCountry(this.luser.LoggedInUserName, 1000, 0, "name", "asc", null)
          .subscribe(cnt => {
            let resultcnt: any = cnt;
            this.Countries = resultcnt;
            this.api.GetStatesByCountry(this.CityDetail.countryid)
              .subscribe(st => {
                let resultst: any = st;
                this.States = resultst;
                this.mode = 2;
                this.CityLabel = "Edit City";
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
    this.api.GetCityById(id)
      .subscribe(cty => {
        let result: any = cty;
        this.CityDetail = new CountryStateCity();
        this.CityDetail.id = result.id;
        this.CityDetail.name = result.name;
        this.CityDetail.countryid = result.countryid;
        this.CityDetail.stateid = result.stateid;
        this.CityDetail.modifiedby = this.luser.LoggedInUserName;
        this.CityDetail.isactive = false;;
        this.modalRef = this.modalService.show(
          template,
          Object.assign({
          }, { class: 'gray modal-sm' })
        );
      });
  }

  SaveCity() {
    if (this.ValidateMandatoryField()) {
      if (this.ValidateFieldValue()) {
        this.isPushed = true;
        this._overlay.activateOverlay(true, 'sk-circle');
        this.api.IsCityExists(this.CityDetail.name, this.CityDetail.stateid)
          .subscribe(r => {
            if (r) {
              this.toastr.warning('State already exists', 'MindTeckSmartParking');
              setTimeout(() => {
                this._overlay.activateOverlay(false, '');
              }, 200);
            }
            else {
              this.api.AddCity(this.CityDetail)
                .subscribe(r => {
                  if (r) {
                    this.CancelModal();
                    this.toastr.success('Record saved successfully!', 'MindTeckSmartParking');
                    this.loadAllCity();
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

  UpdateCity() {
    if (this.ValidateMandatoryField()) {
      if (this.ValidateFieldValue()) {
        this.isPushed = true;
        this._overlay.activateOverlay(true, 'sk-circle');
        this.api.UpdateCity(this.CityDetail)
          .subscribe(
            r => {
              if (r) {
                this.CancelModal();
                this.toastr.success('Record saved successfully!', 'MindTeckSmartParking');
                this.loadAllCity();
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
    }
  }

  DeleteCity() {
    this.api.UpdateCity(this.CityDetail)
      .subscribe(
        r => {
          this.CancelModal();
          this.toastr.success('Record removed successfully!', 'MindTeckSmartParking');
          this.loadAllCity();
        },
        r => {
          this.toastr.error('Server Error', 'MindTeckSmartParking');
        });
  }

  GetCityByFilterOption() {
    if (this.cfilter != null && this.cfilter != "" && this.cfilter != undefined) {
      this.cfilter = this.cfilter.trim();
    }
    else {
      this.cfilter = null;
    }

    this.loadAllCity();
  }

  loadAllCityByPageSize() {
    this.CurrentPage = 1;
    this.poffset = 0;
    this.loadAllCity();
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
      this.loadAllCity();
    }
    else if (prmvalue == 2) {
      if (this.CurrentPage > 1) {
        this.CurrentPage = this.CurrentPage - 1;
        this.poffset = (this.CurrentPage - 1) * this.psize;
        this.loadAllCity();
      }
    }
    else if (prmvalue == 3) {
      this.poffset = this.CurrentPage * this.psize;
      this.CurrentPage = this.CurrentPage + 1;
      this.loadAllCity();
    }
    else if (prmvalue == 4) {
      this.CurrentPage = this.TotalPages;
      this.poffset = (this.TotalPages - 1) * this.psize;
      this.loadAllCity();
    }
    else {

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
    cgh.ColumnNameLabel = "State Name";
    cgh.ColumnName = "statename";
    cgh.ColumnSortClass = "fa fa-sort";
    cgh.IsSortable = true;
    this.CustomHeader.push(cgh);

    cgh = new CustomGridHeader();
    cgh.ColumnId = 3;
    cgh.ColumnNameLabel = "Country Name";
    cgh.ColumnName = "countryname";
    cgh.ColumnSortClass = "fa fa-sort";
    cgh.IsSortable = true;
    this.CustomHeader.push(cgh);

    cgh = new CustomGridHeader();
    cgh.ColumnId = 4;
    cgh.ColumnNameLabel = "ModifiedBy";
    cgh.ColumnName = "modifiedby";
    cgh.ColumnSortClass = "";
    cgh.IsSortable = false;
    this.CustomHeader.push(cgh);

    cgh = new CustomGridHeader();
    cgh.ColumnId = 5;
    cgh.ColumnNameLabel = "Modified Timestamp";
    cgh.ColumnName = "modifiedtimestamp";
    cgh.ColumnSortClass = "";
    cgh.IsSortable = false;
    this.CustomHeader.push(cgh);

    cgh = new CustomGridHeader();
    cgh.ColumnId = 6;
    cgh.ColumnNameLabel = "";
    cgh.ColumnSortClass = "";
    cgh.IsSortable = false;
    this.CustomHeader.push(cgh);

    this.loadAllCity();
    // var retrievedObject = localStorage.getItem('luser');
    // this.obj = JSON.parse(retrievedObject)
    // if (this.obj == null) {
    //   this.router.navigate(['login']);
    // }
  }

  CountryChange() {
    this.api.GetStatesByCountry(this.CityDetail.countryid)
      .subscribe(st => {
        let resultst: any = st;
        this.States = resultst;
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
    this.loadAllCity()
  }

  RefreshGrid() {
    for (let i = 0; i < this.CustomHeader.length; i++) {
      this.CustomHeader[i].ColumnSortClass = 'fa fa-sort';
    }



    // this.loadAllRole();
  }
}
