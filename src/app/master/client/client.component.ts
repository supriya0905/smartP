import { Component, OnInit,TemplateRef  } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import{ClientService} from '../../service/client.service';
import{Client} from '../../model/Client';
import{CustomGridHeader} from '../../model/CustomGridHeader';
import { ToastrService } from 'ngx-toastr';
import{Utility} from '../../helpers/utility';
import { OverlayService } from '../../service/overlay.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {
  isPushed: boolean = false;
  luser:any=JSON.parse(localStorage.getItem('PEMSUser'));
  Clients:any;
  SubModules:any;
  modalRef: BsModalRef;
  pfrom:number;
  pto:number;
  psize:number = 10;
  poffset:number = 0;
  csortby:string = 'clientid';
  csortorder:string = 'desc';
  cfilter:string=null;
  TotalCount:number=0;
  mode:number;
  TotalPages:number=0;
  CurrentPage:number=1;
  CustomHeader:CustomGridHeader[]=[];
  ClientLabel:string;
  EmailId:string;
  ClientDetail:Client=null; 
  obj:any;
  constructor(private api: ClientService,private router: Router,private modalService: BsModalService,private toastr: ToastrService,private _overlay: OverlayService) { }

  private ValidateMandatoryField()
  {
    let msg="";
    let chk=true;
  
    if(this.ClientDetail.name==null|| this.ClientDetail.name==''|| this.ClientDetail.name==undefined){
      msg=msg+"Client Name,";
      chk=false;
    }

    if(this.ClientDetail.emailid==null|| this.ClientDetail.emailid==''|| this.ClientDetail.emailid==undefined){
      msg=msg+"Client Email,";
      chk=false;
    }

    if(this.ClientDetail.contactno==null|| this.ClientDetail.contactno==''|| this.ClientDetail.contactno==undefined){
      msg=msg+"Client Email,";
      chk=false;
    }

    let chkpt=false;
    this.ClientDetail.assignedparkingtypes.forEach(itm => {    
        if(itm.ischecked==true){
          chkpt=true;         
        }
    });

    if(chkpt==false)
    {
      msg=msg+"Assign Client Parking Option,";
      chk=false;
    }

    let chkcm=false;
    this.ClientDetail.assignedmodules.forEach(itm => {     
        if(itm.ischecked==true){
          chkcm=true;         
        }
    });

    if(chkcm==false)
    {
      msg=msg+"Assign Client Modules,";
      chk=false;
    }

    msg=msg.substring(0,msg.length-1);
  
    if(chk==false){
      this.toastr.warning(msg+' are mandatory fields.', 'MindTeckSmartParking');
    }  
  
    return chk;
  }

  private ValidateFieldValue(){
  let chk=true;
  let msg="";

  let regonlyalphabet = new RegExp(/^[A-Za-z ]+$/);
  if(!regonlyalphabet.test(this.ClientDetail.name))
  {
    chk=false;
    msg=msg+"Client Name,";
  }

  let regexpemail = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  if(!regexpemail.test(this.ClientDetail.emailid))
  {
    chk=false;
    msg=msg+"Client Email,";
  }

  let regcontact = new RegExp(/^[0-9]{10,15}$/);
  if(!regcontact.test(this.ClientDetail.contactno))
  {
    chk=false;
    msg=msg+"Contact Number,";
  }
  

  msg=msg.substring(0,msg.length-1);

  if(chk==false){
    this.toastr.warning(msg+' are invalid fields.', 'MindTeckSmartParking');
  } 

  return chk;

  } 

  private loadAllClient()
  {
    this.TotalCount=0;
    this.Clients=null;
    this.TotalPages=0;
    this.pfrom=0;
    this.pto=0;
    this.api.GetAllClients(this.luser.LoggedInUserName,this.csortby,this.csortorder,this.psize,this.poffset,this.cfilter)    
      .subscribe(cl=>{  
        let result:any=cl;
        if(result.length>0)
        {        
          this.TotalCount=result[0].totalcount;
          this.Clients=result;

          if(this.TotalCount>0)
          {
              if(this.TotalCount>=this.psize)
              {
                let modres = this.TotalCount%this.psize;

                if(modres>0)
                {
                  this.TotalPages=Utility.FloatToInt(this.TotalCount/this.psize)+1;
                }
                else{
                  this.TotalPages=Utility.FloatToInt(this.TotalCount/this.psize);
                }
              }
              else{
                this.TotalPages=1;
              }

              if(this.CurrentPage==1)
              {
                this.pfrom=1;
                this.pto=this.psize;
              }
              else{
                this.pfrom=((this.CurrentPage-1)*this.psize)+1;
                this.pto=this.pfrom+(this.psize-1);
              }
          } 
        }
      });
  }

  private InitializeHeader(){   
    let cgh=new CustomGridHeader();
    cgh.ColumnId=1;
    cgh.ColumnNameLabel="Name";
    cgh.ColumnName="name";
    cgh.ColumnSortClass="fa fa-sort";
    cgh.IsSortable=true;
    this.CustomHeader.push(cgh);

    cgh=new CustomGridHeader();
    cgh.ColumnId=2;
    cgh.ColumnNameLabel="Email";
    cgh.ColumnName="emailid";
    cgh.ColumnSortClass="fa fa-sort";
    cgh.IsSortable=true;
    this.CustomHeader.push(cgh);

    cgh=new CustomGridHeader();
    cgh.ColumnId=3;
    cgh.ColumnNameLabel="ContactNo";
    cgh.ColumnName="contactno";
    cgh.ColumnSortClass="fa fa-sort";
    cgh.IsSortable=true;
    this.CustomHeader.push(cgh);

    cgh=new CustomGridHeader();
    cgh.ColumnId=4;
    cgh.ColumnNameLabel="Parking Options";
    cgh.ColumnName="parkingtypes";
    cgh.ColumnSortClass="";
    cgh.IsSortable=false;
    this.CustomHeader.push(cgh);

    cgh=new CustomGridHeader();
    cgh.ColumnId=5;
    cgh.ColumnNameLabel="Modules";
    cgh.ColumnName="modules";
    cgh.ColumnSortClass="";
    cgh.IsSortable=false;
    this.CustomHeader.push(cgh);    

    cgh=new CustomGridHeader();
    cgh.ColumnId=6;
    cgh.ColumnNameLabel="CreatedBy";
    cgh.ColumnName="createdby";
    cgh.ColumnSortClass="";
    cgh.IsSortable=false;
    this.CustomHeader.push(cgh);

    cgh=new CustomGridHeader();
    cgh.ColumnId=7;
    cgh.ColumnNameLabel="CreatedOn";
    cgh.ColumnName="datestring";
    cgh.ColumnSortClass="";
    cgh.IsSortable=false;
    this.CustomHeader.push(cgh);

    cgh=new CustomGridHeader();
    cgh.ColumnId=8;
    cgh.ColumnNameLabel="";
    cgh.ColumnSortClass="";
    cgh.IsSortable=false;
    this.CustomHeader.push(cgh);
  }

  ngOnInit() {
    this.InitializeHeader();
    // this.loadAllClient();
    // var retrievedObject = localStorage.getItem('luser');
    // this.obj = JSON.parse(retrievedObject)
    // if (this.obj == null) {
    //   this.router.navigate(['login']);
    // }
  }

  openModalWithClass(template: TemplateRef<any>) { 
    this.api.GetClientById(-1)    
    .subscribe(cd=>{  
      let result:any=cd;
      this.ClientDetail=new Client();
      this.ClientDetail.name='';
      this.ClientDetail.emailid='';
      this.ClientDetail.description='';
      this.ClientDetail.createdby=this.luser.LoggedInUserName;
      this.ClientDetail.contactno='';
      this.ClientDetail.ownername='';
      this.ClientDetail.ownergender='';      
      this.ClientDetail.isactive=true;
      this.ClientDetail.assignedparkingtypes=result.assignedparkingtypes;
      this.ClientDetail.assignedmodules=result.assignedmodules;

      this.mode=1; 
      this.ClientLabel = "Create Client";
  
      this.modalRef = this.modalService.show(
        template,
        Object.assign({       
        }, { class: 'gray modal-lg' })
      );
    });

  }

  openModalWithClassEdit(template: TemplateRef<any>,cid,cn) {
    this.api.GetClientById(cid)    
    .subscribe(cd=>{ 
      let result:any=cd;
      this.ClientDetail=new Client();
      this.ClientDetail.clientid=cid;
      this.ClientDetail.name=result.name;
      this.ClientDetail.emailid=result.emailid;
      this.ClientDetail.description=result.description;
      this.ClientDetail.modifiedby=this.luser.LoggedInUserName;
      this.ClientDetail.contactno=result.contactno;
      this.ClientDetail.ownername=result.ownername;
      this.ClientDetail.ownergender=result.ownergender;      
      this.ClientDetail.isactive=result.isactive;
      this.ClientDetail.assignedparkingtypes=result.assignedparkingtypes;
      this.ClientDetail.assignedmodules=result.assignedmodules;
      this.mode=2; 
      this.ClientLabel = "Edit Client";
      this.EmailId=cn;
  
      this.modalRef = this.modalService.show(
        template,
        Object.assign({       
        }, { class: 'gray modal-lg' })
      );
    });
  }

  CancelModal(){
    this.modalRef.hide();
  }

  SaveClient(){ 
    if(this.ValidateMandatoryField()){
      if(this.ValidateFieldValue()){   
          this.isPushed = true;
          this._overlay.activateOverlay(true,'sk-circle');                  
          this.api.IsClientEmailExists(this.ClientDetail.emailid)
          .subscribe(r=>{  
            if(r){
              this.toastr.warning('Client email already exists', 'MindTeckSmartParking');
              setTimeout(() => {
                this._overlay.activateOverlay(false,'');
                },200);
            }
            else{
              this.api.AddClient(this.ClientDetail)
              .subscribe(
                r => {  
                  if(r){
                    this.CancelModal();
                    this.toastr.success('Record saved successfully!', 'MindTeckSmartParking');
                    this.loadAllClient();
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
          });
      }
    }  
  }

  UpdateClient(){
    if(this.ValidateMandatoryField()){
      if(this.ValidateFieldValue()){   
          this.isPushed = true;
          this._overlay.activateOverlay(true,'sk-circle');                  
          this.api.UpdateClient(this.ClientDetail)
          .subscribe(
            r => {  
              if(r){
                this.CancelModal();
                this.toastr.success('Record saved successfully!', 'MindTeckSmartParking');
                this.loadAllClient();
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

  SortColumn(cn:string,ccls:string,idx:number)
  {
    this.csortby=cn;
    if(ccls=='fa fa-sort' || ccls=='fa fa-sort-asc')
    {
      this.CustomHeader[idx].ColumnSortClass='fa fa-sort-desc';
      this.csortorder='desc';
    }
    else{
      this.CustomHeader[idx].ColumnSortClass='fa fa-sort-asc';
      this.csortorder='asc';
    }

    this.loadAllClient();
  }

  CheckPaginationFirst(){
    var chk=true;
    if(this.TotalPages>0&&this.CurrentPage>1){
      chk=false;
    }
    return chk;
  }

  CheckPaginationPrev(){    
    var chk=true;
    if(this.TotalPages>0&&this.CurrentPage>1){
      chk=false;
    }
    return chk;
  }

  CheckPaginationNext(){
    var chk=true;
    if(this.TotalPages>0&&this.CurrentPage<this.TotalPages){
      chk=false;
    }
    return chk;
  }

  CheckPaginationLast(){  
    var chk=true;
    if(this.TotalPages>0&&this.CurrentPage<this.TotalPages){
      chk=false;
    }
    return chk;
  }

  GoToPage(prmvalue:number){

if(prmvalue==1)
{
  this.CurrentPage=1;
  this.poffset = 0;
  this.loadAllClient();
}
else if(prmvalue==2)
{
 if(this.CurrentPage>1)
 {
  this.CurrentPage=this.CurrentPage-1;
  this.poffset=(this.CurrentPage-1)*this.psize;
  this.loadAllClient();
 }
}
else if(prmvalue==3)
{
  this.poffset=this.CurrentPage*this.psize;
  this.CurrentPage=this.CurrentPage+1;
  this.loadAllClient();
}
else if(prmvalue==4)
{ 
  this.CurrentPage=this.TotalPages;
  this.poffset=(this.TotalPages - 1)*this.psize;
  this.loadAllClient();
}
else
{

}
  }

  loadAllSubModulesByPageSize()
  {
    this.CurrentPage=1;
    this.poffset=0;
    this.loadAllClient();
  }

  RefreshGrid(){
    for(let i=0;i<this.CustomHeader.length;i++){
      this.CustomHeader[i].ColumnSortClass='fa fa-sort';
    }


    this.loadAllClient();
  }

  GetClientByFilterOption(){ 
    if(this.cfilter!=null&&this.cfilter!=""&&this.cfilter!=undefined){
      this.cfilter=this.cfilter.trim();    
    }
    else
    {
      this.cfilter=null;
    }    

    this.loadAllClient();
  } 

  unPushMe() {
    this.isPushed = false;
  }

}
