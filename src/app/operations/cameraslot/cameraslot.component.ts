import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { Utility } from '../../helpers/utility';
import { CustomGridHeader } from '../../model/CustomGridHeader';
import { ToastrService } from 'ngx-toastr';
import { debug } from 'util';
import { environment } from 'src/environments/environment.prod';
import { OverlayService } from '../../service/overlay.service'
import { Router } from '@angular/router';


@Component({
  selector: 'app-cameraslot',
  templateUrl: './cameraslot.component.html',
  styleUrls: ['./cameraslot.component.css']
})
export class CameraslotComponent implements OnInit {
  luser: any = JSON.parse(localStorage.getItem('PEMSUser'));
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
  constructor(private router: Router, private modalService: BsModalService, private toastr: ToastrService, private _overlay: OverlayService) { }

  openModalWithClass(template: TemplateRef<any>) {
    this.mode = 1;
    this.UserModalLabel = "Create User";
    this.modalRef = this.modalService.show(
      template,
      Object.assign({
      }, { class: 'gray modal-lg' })
    );
  }

  RefreshGrid() {
    for (let i = 0; i < this.CustomHeader.length; i++) {
      this.CustomHeader[i].ColumnSortClass = 'fa fa-sort';
    }
    // this.loadAllUsers();
  }
  GetUserByFilterOption() {
    if (this.cfilter != null && this.cfilter != "" && this.cfilter != undefined) {
      this.cfilter = this.cfilter.trim();
    }
    else {
      this.cfilter = null;
    }
    //this.loadAllUsers();
  }

  openModalWithClassEdit(template: TemplateRef<any>) {
    this.mode = 2;
    this.UserModalLabel = "Edit User";
    this.modalRef = this.modalService.show(
      template,
      Object.assign({
      }, { class: 'gray modal-lg' })
    );
  }

  openModalWIthClassDelete(template: TemplateRef<any>) {
   // this.UName = fn;
    this.modalRef = this.modalService.show(
      template,
      Object.assign({
      }, { class: 'gray modal-sm' })
    );
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
      //this.loadAllUsers();
    }
    else if (prmvalue == 2) {
      if (this.CurrentPage > 1) {
        this.CurrentPage = this.CurrentPage - 1;
        this.poffset = (this.CurrentPage - 1) * this.psize;
        //  this.loadAllUsers();
      }
    }
    else if (prmvalue == 3) {
      this.poffset = this.CurrentPage * this.psize;
      this.CurrentPage = this.CurrentPage + 1;
      // this.loadAllUsers();
    }
    else if (prmvalue == 4) {
      this.CurrentPage = this.TotalPages;
      this.poffset = (this.TotalPages - 1) * this.psize;
      // this.loadAllUsers();
    }
    else {

    }
  }

  loadAllUserByPageSize() {
    this.CurrentPage = 1;
    this.poffset = 0;
    //this.loadAllUsers();
  }


  CancelModal() {
    this.modalRef.hide();
  }
  SaveUser() {

  }
  UpdateUser() {

  }
  DeleteUser() {

  }

  ngOnInit() {
  }

}

