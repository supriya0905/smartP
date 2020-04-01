import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Utility } from '../../helpers/utility'
import { CustomGridHeader } from '../../model/CustomGridHeader';
import { ToastrService } from 'ngx-toastr';
import { OverlayService } from '../../service/overlay.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  luser: any = JSON.parse(localStorage.getItem('PEMSUser'));
  modalRef: BsModalRef;
  CustomHeader: CustomGridHeader[] = [];
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
  constructor(private router: Router, private modalService: BsModalService, private toastr: ToastrService, private _overlay: OverlayService, private formBuilder: FormBuilder) { }

  openModalWithClass(template: TemplateRef<any>) {
    this.mode = 1;
    this.modalRef = this.modalService.show(
      template,
      Object.assign({
      }, { class: 'gray modal-lg' })
    );
  }

  openModalWithClassEdit(template: TemplateRef<any>) {
    this.mode = 2;
    this.modalRef = this.modalService.show(
      template,
      Object.assign({
      }, { class: 'gray modal-lg' })
    );
  }

  openModalWIthClassDelete(template: TemplateRef<any>) {

    this.modalRef = this.modalService.show(
      template,
      Object.assign({
      }, { class: 'gray modal-sm' })
    );
  }

  SaveMessage() {

  }

  RefreshGrid() {
    for (let i = 0; i < this.CustomHeader.length; i++) {
      this.CustomHeader[i].ColumnSortClass = 'fa fa-sort';
    }

  }

  UpdateMessage() {

  }
  CancelModal() {
    this.modalRef.hide();
  }

  ngOnInit() {
  }

}
