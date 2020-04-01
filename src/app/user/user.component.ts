import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { UserService } from '../service/user.service';
import { User } from '../model/User';
import { Utility } from '../helpers/utility';
import { CustomGridHeader } from '../model/CustomGridHeader';
import { ToastrService } from 'ngx-toastr';
import { debug } from 'util';
import { environment } from 'src/environments/environment.prod';
import { OverlayService } from '.././service/overlay.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  luser: any = JSON.parse(localStorage.getItem('PEMSUser'));
  Users: any;
  modalRef: BsModalRef;
  pfrom: number;
  pto: number;
  psize: number = 10;
  poffset: number = 0;
  csortby: string = 'userid';
  csortorder: string = 'desc';
  cfilter: string = null;
  TotalCount: number = 0;
  mode: number;
  TotalPages: number = 0;
  CurrentPage: number = 1;
  CustomHeader: CustomGridHeader[] = [];
  UserModalLabel: string;
  UName: string;
  UserDetail: User = null;
  obj:any;

  constructor(private api: UserService,private router: Router, private modalService: BsModalService, private toastr: ToastrService, private _overlay: OverlayService) { }

  private InitializeHeader() {
    var cgh = new CustomGridHeader();
    cgh.ColumnId = 1;
    cgh.ColumnNameLabel = "Name";
    cgh.ColumnName = "fullname";
    cgh.ColumnSortClass = "fa fa-sort";
    cgh.IsSortable = true;
    this.CustomHeader.push(cgh);

    cgh = new CustomGridHeader();
    cgh.ColumnId = 2;
    cgh.ColumnNameLabel = "Role";
    cgh.ColumnName = "userroles";
    cgh.ColumnSortClass = "fa fa-sort";
    cgh.IsSortable = true;
    this.CustomHeader.push(cgh);

    cgh = new CustomGridHeader();
    cgh.ColumnId = 3;
    cgh.ColumnNameLabel = "Email/UserName";
    cgh.ColumnName = "email";
    cgh.ColumnSortClass = "fa fa-sort";
    cgh.IsSortable = true;
    this.CustomHeader.push(cgh);

    cgh = new CustomGridHeader();
    cgh.ColumnId = 4;
    cgh.ColumnNameLabel = "Phone";
    cgh.ColumnName = "phone";
    cgh.ColumnSortClass = "";
    cgh.IsSortable = false;
    this.CustomHeader.push(cgh);

    cgh = new CustomGridHeader();
    cgh.ColumnId = 5;
    cgh.ColumnNameLabel = "Gender";
    cgh.ColumnName = "gender";
    cgh.ColumnSortClass = "";
    cgh.IsSortable = false;
    this.CustomHeader.push(cgh);

    cgh = new CustomGridHeader();
    cgh.ColumnId = 6;
    cgh.ColumnNameLabel = "Location";
    cgh.ColumnName = "location";
    cgh.ColumnSortClass = "";
    cgh.IsSortable = false;
    this.CustomHeader.push(cgh);

    cgh = new CustomGridHeader();
    cgh.ColumnId = 7;
    cgh.ColumnNameLabel = "CreatedBy";
    cgh.ColumnName = "createdby";
    cgh.ColumnSortClass = "";
    cgh.IsSortable = false;
    this.CustomHeader.push(cgh);

    cgh = new CustomGridHeader();
    cgh.ColumnId = 8;
    cgh.ColumnNameLabel = "CreatedOn";
    cgh.ColumnName = "datestring";
    cgh.ColumnSortClass = "";
    cgh.IsSortable = false;
    this.CustomHeader.push(cgh);

    cgh = new CustomGridHeader();
    cgh.ColumnId = 9;
    cgh.ColumnNameLabel = "";
    cgh.ColumnSortClass = "";
    cgh.IsSortable = false;
    this.CustomHeader.push(cgh);
  }

  private loadAllUsers() {
    this.TotalCount = 0;
    this.Users = null;
    this.TotalPages = 0;
    this.pfrom = 0;
    this.pto = 0;
    this.api.getAllUsers(this.luser.LoggedInUserName, this.csortby, this.csortorder, this.psize, this.poffset, this.cfilter)
      .subscribe(u => {
        var result: any = u;
        this.Users = result;
        if (result.length > 0) {
          this.TotalCount = u[0].totalcount;
          this.Users = u;
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

  private ValidateMandatoryField() {
    var msg = "";
    var chk = true;
    if (this.UserDetail.username == null || this.UserDetail.username == '' || this.UserDetail.username == undefined) {
      msg = msg + "Username,";
      chk = false;
    }

    if (this.UserDetail.firstname == null || this.UserDetail.firstname == '' || this.UserDetail.firstname == undefined) {
      msg = msg + "FirstName,";
      chk = false;
    }

    if (this.UserDetail.gender == null || this.UserDetail.gender == '' || this.UserDetail.gender == undefined) {
      msg = msg + "Gender,";
      chk = false;
    }

    var chkrole = false;
    this.UserDetail.roles.forEach(element => {
      if (element.isassign == true) {
        chkrole = true;
      }
    });

    if (chkrole == false) {
      msg = msg + "Roles,";
      chk = false;
    }

    msg = msg.substring(0, msg.length - 1);

    if (chk == false) {
      this.toastr.warning(msg + ' are mandatory fields.', 'MindTeckSmartParking');
    }

    return chk;
  }

  private ValidateFieldValue() {
    var chk = true;
    var msg = "";

    var regexpemail = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if (!regexpemail.test(this.UserDetail.username)) {
      chk = false;
      msg = msg + "UserName,";
    }

    var regcontact = new RegExp(/^[0-9]{10,15}$/);
    if (!regcontact.test(this.UserDetail.phone)) {
      chk = false;
      msg = msg + "Contact Number,";
    }

    msg = msg.substring(0, msg.length - 1);

    if (chk == false) {
      this.toastr.warning(msg + ' are invalid fields.', 'MindTeckSmartParking');
    }

    return chk;
  }

  openModalWithClass(template: TemplateRef<any>) {
    this.mode = 1;
    this.UserModalLabel = "Create User";
    this.modalRef = this.modalService.show(
      template,
      Object.assign({
      }, { class: 'gray modal-lg' })
    );
    this.api.getUserRoles(this.luser.LoggedInUserName)
      .subscribe(ur => {
        debugger;
        var result: any = ur;
        this.UserDetail = new User();
        this.UserDetail.userid = 0;
        this.UserDetail.username = '';
        this.UserDetail.phone = '';
        this.UserDetail.email = '';
        this.UserDetail.gender = '';
        this.UserDetail.firstname = '';
        this.UserDetail.lastname = '';
        this.UserDetail.location = '';
        this.UserDetail.clientlocationid=0;
        this.UserDetail.locations = result.locations;
        this.UserDetail.clientid = this.luser.clientid;
        this.UserDetail.roles = result;
        this.UserDetail.createdby = this.luser.LoggedInUserName;
      });
  }

  openModalWithClassEdit(template: TemplateRef<any>, id, fn) {
    this.mode = 2;
    this.UserModalLabel = "Edit User";
    this.modalRef = this.modalService.show(
      template,
      Object.assign({
      }, { class: 'gray modal-lg' })
    );
    this.api.getUserById(id)
      .subscribe(u => {
        var result: any = u;
        this.UserDetail = new User();
        this.UserDetail.userid = result.userid;
        this.UserDetail.username = result.username;
        this.UserDetail.phone = result.phone;
        this.UserDetail.email = result.email;
        this.UserDetail.gender = result.gender;
        this.UserDetail.firstname = result.firstname;
        this.UserDetail.lastname = result.lastname;
        this.UserDetail.clientid = result.clientid;
        this.UserDetail.location = result.location;
        this.UserDetail.locations = result.locations;
        this.UserDetail.roles = result.roles;
      });
  }

  openModalWIthClassDelete(template: TemplateRef<any>, id, fn) {
    this.UName = fn;
    this.modalRef = this.modalService.show(
      template,
      Object.assign({
      }, { class: 'gray modal-sm' })
    );

    this.api.getUserById(id)
      .subscribe(u => {
        var result: any = u;
        this.UserDetail = new User();
        this.UserDetail.userid = result.userid;
        this.UserDetail.username = result.username;
        this.UserDetail.phone = result.phone;
        this.UserDetail.email = result.email;
        this.UserDetail.gender = result.gender;
        this.UserDetail.firstname = result.firstname;
        this.UserDetail.lastname = result.lastname;
        this.UserDetail.clientid = result.clientid;
        this.UserDetail.location = result.location;
        this.UserDetail.locations = result.locations;
        this.UserDetail.roles = result.roles;
      });
  }

  SaveUser() {
    this._overlay.activateOverlay(true, 'sk-circle');
    if (this.ValidateMandatoryField()) {
      if (this.ValidateFieldValue()) {
        this.api.IsUserExists(this.luser.LoggedInUserName, this.UserDetail.username)
          .subscribe(r => {
            if (r) {
              this.toastr.warning('UserName already exists', 'MindTeckSmartParking');
              setTimeout(() => {
                this._overlay.activateOverlay(false, '');
              }, 500);
            }
            else {
              this.UserDetail.isactive = true;
              this.UserDetail.email = this.UserDetail.username;
              this.api.AddUser(this.UserDetail)
                .subscribe(
                  r => {
                    if (r) {
                      this.CancelModal();
                      this.toastr.success('Record saved successfully!', 'MindTeckSmartParking');
                      this.loadAllUsers();
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
                  });            }
          });
      }
      else {
        setTimeout(() => {
          this._overlay.activateOverlay(false, '');
        }, 500);
      }
    }
    else {
      setTimeout(() => {
        this._overlay.activateOverlay(false, '');
      }, 500);
    }
  }

  UpdateUser() {
    if (this.ValidateMandatoryField()) {
      if (this.ValidateFieldValue()) {
        this.UserDetail.isactive = true;
        this.api.UpdateUser(this.UserDetail)
          .subscribe(
            r => {
              this.CancelModal();
              this.toastr.success('Record updated successfully!', 'MindTeckSmartParking');
              this.loadAllUsers();
            },
            r => {
              this.toastr.error('Server Error', 'MindTeckSmartParking');
            });
      }
    }
  }

  DeleteUser() {
    this.UserDetail.isactive = false;
    this.api.UpdateUser(this.UserDetail)
      .subscribe(
        r => {
          this.CancelModal();
          this.toastr.success('Record removed successfully!', 'MindTeckSmartParking');
          this.loadAllUsers();
        },
        r => {
          this.toastr.error('Server Error', 'MindTeckSmartParking');
        });
  }

  CancelModal() {
    this.modalRef.hide();
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

    this.loadAllUsers();
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
      this.loadAllUsers();
    }
    else if (prmvalue == 2) {
      if (this.CurrentPage > 1) {
        this.CurrentPage = this.CurrentPage - 1;
        this.poffset = (this.CurrentPage - 1) * this.psize;
        this.loadAllUsers();
      }
    }
    else if (prmvalue == 3) {
      this.poffset = this.CurrentPage * this.psize;
      this.CurrentPage = this.CurrentPage + 1;
      this.loadAllUsers();
    }
    else if (prmvalue == 4) {
      this.CurrentPage = this.TotalPages;
      this.poffset = (this.TotalPages - 1) * this.psize;
      this.loadAllUsers();
    }
    else {

    }
  }

  loadAllUserByPageSize() {
    this.CurrentPage = 1;
    this.poffset = 0;
    this.loadAllUsers();
  }

  RefreshGrid() {
    for (let i = 0; i < this.CustomHeader.length; i++) {
      this.CustomHeader[i].ColumnSortClass = 'fa fa-sort';
    }
    this.loadAllUsers();
  }

  GetUserByFilterOption() {
    if (this.cfilter != null && this.cfilter != "" && this.cfilter != undefined) {
      this.cfilter = this.cfilter.trim();
    }
    else {
      this.cfilter = null;
    }

    this.loadAllUsers();
  }
  
  ngOnInit() {
    this.InitializeHeader();
    this.loadAllUsers();
    // var retrievedObject = localStorage.getItem('luser');
    // this.obj = JSON.parse(retrievedObject)
    // if (this.obj == null) {
    //   this.router.navigate(['login']);
    // }s
  }

  AddNewUser() {

  }

}
