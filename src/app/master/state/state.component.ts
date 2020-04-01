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
import { Router } from '@angular/router';
@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.css']
})
export class StateComponent implements OnInit {
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
  StateLabel: string;
  Stateid: number;
  StateModules: any;
  States: any;
  StateDetail: CountryStateCity = null
  isPushed: boolean = false;
  Countries: any;
  obj:any;
  constructor(private api: ControlmasterService,private router: Router, private modalService: BsModalService, private toastr: ToastrService, private _overlay: OverlayService, private formBuilder: FormBuilder) { }

  private ValidateMandatoryField() {
    let msg = "";
    let chk = true;

    if (this.StateDetail.name == null || this.StateDetail.name == '' || this.StateDetail.name == undefined) {
      msg = msg + "State Name,";
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
    if (!regonlyalphabet.test(this.StateDetail.name)) {
      chk = false;
      msg = msg + "State Name,";
    }
    msg = msg.substring(0, msg.length - 1);
    if (chk == false) {
      this.toastr.warning(msg + ' are invalid fields.', 'MindTeckSmartParking');
    }
    return chk;
  }

  openModalWithClass(template: TemplateRef<any>) {
    this.api.GetAllCountry(this.luser.LoggedInUserName, 1000, 0, "name", "asc", null)
      .subscribe(cnt => {
        this.Countries = cnt;
        this.mode = 1;
        this.StateLabel = "Create State";
        this.StateDetail = new CountryStateCity();
        this.StateDetail.countryid = 0;
        this.StateDetail.name = "";
        this.StateDetail.modifiedby = this.luser.LoggedInUserName;
        this.modalRef = this.modalService.show(
          template,
          Object.assign({
          }, { class: 'gray modal-lg' })
        );
      });
  }

  openModalWithClassEdit(template: TemplateRef<any>, id: number) {
    this.api.GetAllCountry(this.luser.LoggedInUserName, 1000, 0, "name", "asc", null)
      .subscribe(cnt => {
        this.Countries = cnt;
        this.api.GetStateById(id)
          .subscribe(st => {
            var result: any = st;
            this.StateDetail = new CountryStateCity();
            this.StateDetail.countryid = result.countryid;
            this.StateDetail.id = result.id;
            this.StateDetail.name = result.name;
            this.StateDetail.isactive = true;
            this.StateDetail.modifiedby = this.luser.LoggedInUserName;
            this.mode = 2;
            this.StateLabel = "Edit State";
            this.modalRef = this.modalService.show(
              template,
              Object.assign({
              }, { class: 'gray modal-lg' })
            );
          });
      });
  }

  openModalWIthClassDelete(template: TemplateRef<any>, id) {
    this.api.GetStateById(id)
      .subscribe(st => {
        var result: any = st;
        this.StateDetail = new CountryStateCity();
        this.StateDetail.countryid = result.countryid;
        this.StateDetail.id = result.id;
        this.StateDetail.name = result.name;
        this.StateDetail.isactive = false;
        this.StateDetail.modifiedby = this.luser.LoggedInUserName;
        this.modalRef = this.modalService.show(
          template,
          Object.assign({
          }, { class: 'gray modal-sm' })
        );
      });
  }


  CancelModal() {
    this.modalRef.hide();
  }

  SaveState() {
    if (this.ValidateMandatoryField()) {
      if (this.ValidateFieldValue()) {
        this.isPushed = true;
        this._overlay.activateOverlay(true, 'sk-circle');
        this.api.IsStateExists(this.StateDetail.name, this.StateDetail.countryid)
          .subscribe(r => {
            if (r) {
              this.toastr.warning('State already exists', 'MindTeckSmartParking');
              setTimeout(() => {
                this._overlay.activateOverlay(false, '');
              }, 200);
            }
            else {
              this.api.AddState(this.StateDetail)
                .subscribe(r => {
                  if (r) {
                    this.CancelModal();
                    this.toastr.success('Record saved successfully!', 'MindTeckSmartParking');
                    this.loadAllStates();
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
  UpdateState() {
    if (this.ValidateMandatoryField()) {
      if (this.ValidateFieldValue()) {
        this.isPushed = true;
        this._overlay.activateOverlay(true, 'sk-circle');
        this.api.UpdateState(this.StateDetail)
          .subscribe(
            r => {
              if (r) {
                this.CancelModal();
                this.toastr.success('Record saved successfully!', 'MindTeckSmartParking');
                this.loadAllStates();
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

  DeleteState() {
    this.api.UpdateState(this.StateDetail)
      .subscribe(
        r => {
          this.CancelModal();
          this.toastr.success('Record removed successfully!', 'MindTeckSmartParking');
          this.loadAllStates();
        },
        r => {
          this.toastr.error('Server Error', 'MindTeckSmartParking');
        });
  }

  private loadAllStates() {
    this.TotalCount = 0;
    this.TotalPages = 0;
    this.States = null;
    this.pfrom = 0;
    this.pto = 0;
    this.api.GetAllState(this.luser.LoggedInUserName, this.psize, this.poffset, this.csortby, this.csortorder, this.cfilter)
      .subscribe(fetched_state => {
        let result: any = fetched_state;
        if (result.length > 0) {
          this.TotalCount = result[0].totalcount;
          this.States = result;

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

  GetStateByFilterOption() {
    if (this.cfilter != null && this.cfilter != "" && this.cfilter != undefined) {
      this.cfilter = this.cfilter.trim();
    }
    else {
      this.cfilter = null;
    }

    this.loadAllStates();
  }


  loadAllstateByPageSize() {
    this.CurrentPage = 1;
    this.poffset = 0;
    this.loadAllStates();
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
      // this.loadAllRole();
    }
    else if (prmvalue == 2) {
      if (this.CurrentPage > 1) {
        this.CurrentPage = this.CurrentPage - 1;
        this.poffset = (this.CurrentPage - 1) * this.psize;
        // this.loadAllRole();
      }
    }
    else if (prmvalue == 3) {
      this.poffset = this.CurrentPage * this.psize;
      this.CurrentPage = this.CurrentPage + 1;
      // this.loadAllRole();
    }
    else if (prmvalue == 4) {
      this.CurrentPage = this.TotalPages;
      this.poffset = (this.TotalPages - 1) * this.psize;
      // this.loadAllRole();
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
    cgh.ColumnNameLabel = "Country Name";
    cgh.ColumnName = "countryname";
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

    this.loadAllStates();
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
    this.loadAllStates();
  }

  RefreshGrid() {
    for (let i = 0; i < this.CustomHeader.length; i++) {
      this.CustomHeader[i].ColumnSortClass = 'fa fa-sort';
    }



    // this.loadAllRole();
  }
}