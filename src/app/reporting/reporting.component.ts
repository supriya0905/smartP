import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ReportService } from '../service/report.service';
import { CustomDropDown } from '../model/CustomDropDown';
import { CustomGridHeader } from '../model/CustomGridHeader';
import { ToastrService } from 'ngx-toastr';
import { Utility } from '../helpers/utility';
import { OverlayService } from '../service/overlay.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { OverallReport } from '../model/Report';
import { DashboardService } from '../service/dashboard.service';
import { DatePipe } from '@angular/common';
import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
@Component({
  selector: 'app-reporting',
  templateUrl: './reporting.component.html',
  styleUrls: ['./reporting.component.css']
})
export class ReportingComponent implements OnInit {
  modalRef: BsModalRef;
  luser: any = JSON.parse(localStorage.getItem('PEMSUser'));
  pfrom: number;
  pto: number;
  psize: number = 100;
  poffset: number = 0;
  csortby: string = 'id';
  csortorder: string = 'desc';
  cfilter: string = '0';
  TotalCount: number = 0;
  TotalPages: number = 0;
  CurrentPage: number = 1;
  clid: number = 0;
  clocid: number = 0
  btype: string = '0';
  sdate: string;
  start_date: any;
  final_start_date: any;
  edate: string;
  model: any = {};
  end_date: any;
  final_end_date: any;
  vtype: number = 0;
  foc: number = 2;
  CustomHeader: CustomGridHeader[] = [];
  showHide: boolean;
  OverallReportDetail: OverallReport = null;
  option: any;
  Clients: CustomDropDown[] = [];
  BookingTypes: CustomDropDown[] = [];
  VehicleTypes: CustomDropDown[] = [];
  Focs: CustomDropDown[] = [];
  Locations: CustomDropDown[] = [];
  reportForm = new FormGroup({
    sdate: new FormControl(new Date()),
    edate: new FormControl(new Date())
  });
  submitted = false;
  showTable: boolean;
  report_csv_array = [];
  reports: any = "Reports";
  fetched_data: any;
  myDateValue: Date;
  minDate: Date;
  maxDate: Date;
  minDate1: Date;
  //downloading csv
  public options = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    headers: ["Client Name", "Location", "Vehicle Type", "Vehicle No.", "Contact No.", "	Checked In Time", "	Checked Out Time","Amount"],
    nullToEmptyString: true,
  };

  constructor(private api: ReportService, private _api: DashboardService, private router: Router, private modalService: BsModalService, private toastr: ToastrService, private _overlay: OverlayService, private formBuilder: FormBuilder, public datepipe: DatePipe) {
    this.minDate = new Date();
    this.maxDate = new Date();
    this.minDate1 = new Date();
    this.minDate.setDate(this.minDate.getDate() - 183);
    this.minDate1.setDate(this.minDate1.getDate() - 1);
    this.maxDate.setDate(this.maxDate.getDate() + 0);
  }

  public downloadPDF() {
    const doc = new jsPDF('landscape');
    doc.setFontSize(14);
    doc.text(15, 10, 'Mindteck Smart Parking Report');
    doc.autoTable({
      html: '#my-table',
      // headers:[['Client Name','Location','Vehicle Type','Vehicle No.','Contact No.','Checked In Time','Checked Out Time','Amount']],
      styles: { cellWidth: 'auto', rowPageBreak: 'auto', fontSize: 9.5 },
      columnStyles: { text: { cellWidth: 'auto' } },
      tableWidth: 'auto',
    });
    doc.save('Reports.pdf');
  }


  download_csv() {
    new Angular5Csv(this.report_csv_array, this.reports, this.options);
  }

  resetForm() {
    this.reportForm.reset();
    this.showTable = false;
  }

  split_date() {
    this.start_date = this.datepipe.transform(this.reportForm.get('sdate').value, 'yyyy-MM-dd');
    this.end_date = this.datepipe.transform(this.reportForm.get('edate').value, 'yyyy-MM-dd');
  }

  loadAllReports() {
    this.api.getAllReportdDropdown().subscribe(data => {
      var result: any = data;
      this.Clients = result.clients;
      this.BookingTypes = result.bookingTypes;
      this.VehicleTypes = result.vehicleTypes;
      this.Focs = result.focs;
    })
  }
  ClientChange() {
    this.api.getAllReportClientLocationByClientId(this.clid).subscribe(m => {
      var result: any = m;
      this.Locations = result
    })
  }
  onSubmit() {
    this.submitted = true;
    if (this.reportForm.invalid) {
            return;
    }
    this._overlay.activateOverlay(true, 'sk-circle');
    this.split_date();
    this.TotalCount = 0;
    this.TotalPages = 0;
    this.pfrom = 0;
    this.pto = 0;
    this.api.getAllReports(this.clid, this.clocid, this.btype, this.start_date, this.end_date, this.vtype, this.foc, this.luser.LoggedInUserName, this.csortby, this.csortorder, this.psize, this.poffset, this.cfilter)
      .subscribe(r => {
        var result: any = r;
        this.OverallReportDetail = result;
        console.log(this.OverallReportDetail)
        this.fetched_data = this.OverallReportDetail
        this.report_csv_array = [];
        if (this.fetched_data) {
          this.showTable = true;
          this.fetched_data.forEach((element) => {
            const filtered_indexedData = {
              "clientname": element.clientname,
              "location": element.description,
              "vehicletype": element.vehicletype,
              "vehicleno": element.vehiclenumber,
              "contactno": element.contactnumber,
              "checkintime": element.checkintime,
              "checkouttime": element.checkouttime,
              "totalamount":element.totalamount
            }
            this.report_csv_array.push(filtered_indexedData)
          });
          setTimeout(() => {
            this._overlay.activateOverlay(false, '');
          }, 500);
        }      
          if (this.fetched_data == null || this.fetched_data == '' || this.fetched_data == undefined) {
          this.showTable = false;
          this.toastr.info("no data for particular search")
          setTimeout(() => {
            this._overlay.activateOverlay(false, '');
          }, 500);
        }
        this.submitted = false;
      });
}
  

  GetUserByFilterOption() {
    if (this.cfilter != null && this.cfilter != "" && this.cfilter != undefined) {
      this.cfilter = this.cfilter.trim();
    }
    else {
      this.cfilter = null;
    }
    this.loadAllReports();
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

  ngOnInit() {
    this.showTable = false;
    this.ClientChange()
    this.reportForm = this.formBuilder.group({
      clid: [0, Validators.required],
      clocid: [0],
      btype: ['0'],
      sdate: ['', Validators.required],
      edate: ['', Validators.required],
      vtype: [0],
      foc: [2]
    },{validator: this.dateLessThan('sdate', 'edate')});
    this.loadAllReports();
  }

  dateLessThan(from: string, to: string) {
    return (group: FormGroup): {[key: string]: any} => {
      let f = group.controls[from];
      let t = group.controls[to];
      if (f.value > t.value) {
        return {
          dates: 'Check out date should be greater or equal'
        };
      }
      return {};
    }
}
  // convenience getter for easy access to form fields
  get f() { return this.reportForm.controls; }

  loadAllRoleByPageSize() {
    this.CurrentPage = 1;
    this.poffset = 0;
    // this.loadAllDashboardCameraLocal();
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
      this.loadAllReports();
    }
    else if (prmvalue == 2) {
      if (this.CurrentPage > 1) {
        this.CurrentPage = this.CurrentPage - 1;
        this.poffset = (this.CurrentPage - 1) * this.psize;
        this.loadAllReports();
      }
    }
    else if (prmvalue == 3) {
      this.poffset = this.CurrentPage * this.psize;
      this.CurrentPage = this.CurrentPage + 1;
      this.loadAllReports();
    }
    else if (prmvalue == 4) {
      this.CurrentPage = this.TotalPages;
      this.poffset = (this.TotalPages - 1) * this.psize;
      this.loadAllReports();
    }
    else {

    }
  }
}
