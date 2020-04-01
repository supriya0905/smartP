import { Component, OnInit,TemplateRef  } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import{SubModuleService} from '../../service/submodule.service';
import{SubModule} from '../../model/SubModule';
import{CustomGridHeader} from '../../model/CustomGridHeader';
import { ToastrService } from 'ngx-toastr';
import{Utility} from '../../helpers/utility';
import { OverlayService } from '../../service/overlay.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-submodulemaster',
  templateUrl: './submodulemaster.component.html',
  styleUrls: ['./submodulemaster.component.css']
})
export class SubmodulemasterComponent implements OnInit {
  isPushed: boolean = false;
  luser:any=JSON.parse(localStorage.getItem('PEMSUser'));
  Modules:any;
  SubModules:any;
  modalRef: BsModalRef;
  pfrom:number;
  pto:number;
  psize:number = 10;
  poffset:number = 0;
  csortby:string = 'moduleid';
  csortorder:string = 'desc';
  cfilter:string=null;
  TotalCount:number=0;
  mode:number;
  TotalPages:number=0;
  CurrentPage:number=1;
  CustomHeader:CustomGridHeader[]=[];
  SubModuleLabel:string;
  SubModuleName:string;
  SubModuleDetail:SubModule=null; 
  obj:any;
  constructor(private api: SubModuleService,private router: Router,private modalService: BsModalService,private toastr: ToastrService,private _overlay: OverlayService) { }

  private InitializeHeader(){
    var cgh=new CustomGridHeader();
    cgh.ColumnId=1;
    cgh.ColumnNameLabel="SubModule Name";
    cgh.ColumnName="submodulename";
    cgh.ColumnSortClass="fa fa-sort";
    cgh.IsSortable=true;
    this.CustomHeader.push(cgh);

    cgh=new CustomGridHeader();
    cgh.ColumnId=2;
    cgh.ColumnNameLabel="Module Name";
    cgh.ColumnName="modulename";
    cgh.ColumnSortClass="fa fa-sort";
    cgh.IsSortable=true;
    this.CustomHeader.push(cgh);

    cgh=new CustomGridHeader();
    cgh.ColumnId=3;
    cgh.ColumnNameLabel="PageLink";
    cgh.ColumnName="pagelink";
    cgh.ColumnSortClass="fa fa-sort";
    cgh.IsSortable=true;
    this.CustomHeader.push(cgh);

    cgh=new CustomGridHeader();
    cgh.ColumnId=4;
    cgh.ColumnNameLabel="SortOrder";
    cgh.ColumnName="sortorder";
    cgh.ColumnSortClass="";
    cgh.IsSortable=false;
    this.CustomHeader.push(cgh);

    cgh=new CustomGridHeader();
    cgh.ColumnId=5;
    cgh.ColumnNameLabel="CreatedBy";
    cgh.ColumnName="createdby";
    cgh.ColumnSortClass="";
    cgh.IsSortable=false;
    this.CustomHeader.push(cgh);

    cgh=new CustomGridHeader();
    cgh.ColumnId=6;
    cgh.ColumnNameLabel="CreatedOn";
    cgh.ColumnName="datestring";
    cgh.ColumnSortClass="";
    cgh.IsSortable=false;
    this.CustomHeader.push(cgh);

    cgh=new CustomGridHeader();
    cgh.ColumnId=7;
    cgh.ColumnNameLabel="";
    cgh.ColumnSortClass="";
    cgh.IsSortable=false;
    this.CustomHeader.push(cgh);
  }

  private loadAllSubModules() { 
    this.TotalCount=0;
    this.SubModules=null;
    this.TotalPages=0;
    this.pfrom=0;
    this.pto=0;
    this.api.GetAllSubModules(this.luser.LoggedInUserName,this.csortby,this.csortorder,this.psize,this.poffset,this.cfilter)    
      .subscribe(m=>{       
        var result:any=m;
        if(result.length>0)
        {        
          this.TotalCount=m[0].totalcount;
          this.SubModules=m;

          if(this.TotalCount>0)
          {
if(this.TotalCount>=this.psize)
{
  var modres = this.TotalCount%this.psize;

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

  private ValidateMandatoryField(){  
    var msg="";
    var chk=true;
  
    if(this.SubModuleDetail.submodulename==null|| this.SubModuleDetail.submodulename==''|| this.SubModuleDetail.submodulename==undefined){
      msg=msg+"SubModule,";
      chk=false;
    }
  
    if(this.SubModuleDetail.moduleid==null|| this.SubModuleDetail.moduleid==0|| this.SubModuleDetail.moduleid==undefined){
      msg=msg+"Module,";
      chk=false;
    }

    if(this.SubModuleDetail.pagelink==null|| this.SubModuleDetail.pagelink==''|| this.SubModuleDetail.pagelink==undefined){
      msg=msg+"PageLink,";
      chk=false;
    }
  
    if(this.SubModuleDetail.sortorder==null|| this.SubModuleDetail.sortorder==0|| this.SubModuleDetail.sortorder==undefined){
      msg=msg+"Sort Order,";
      chk=false;
    }
  
    msg=msg.substring(0,msg.length-1);
  
    if(chk==false){
      this.toastr.warning(msg+' are mandatory fields.', 'MindTeckSmartParking');
    }  
  
    return chk;
  }
  
  private ValidateFieldValue(){
    var chk=true;
    var msg="";
  
    var regonlyalphabet = new RegExp(/^[A-Za-z ]+$/);
    if(!regonlyalphabet.test(this.SubModuleDetail.submodulename))
    {
      chk=false;
      msg=msg+"SubModule Name,";
    }
  
    if(!regonlyalphabet.test(this.SubModuleDetail.pagelink))
    {
      chk=false;
      msg=msg+"Page Link,";
    }
  
    msg=msg.substring(0,msg.length-1);
  
    if(chk==false){
      this.toastr.warning(msg+' are invalid fields.', 'MindTeckSmartParking');
    }
    
    return chk;
  }

  openModalWithClass(template: TemplateRef<any>) { 
    this.mode=1; 
    this.SubModuleLabel = "Create SubModule";
    this.modalRef = this.modalService.show(
      template,
      Object.assign({       
      }, { class: 'gray modal-lg' })
    );

    this.SubModuleDetail=new SubModule();
    this.SubModuleDetail.moduleid=0;
    this.SubModuleDetail.submodulename='';
    this.SubModuleDetail.submoduleid=0;
    this.SubModuleDetail.pagelink='';
    this.SubModuleDetail.sortorder=0;
    this.SubModuleDetail.createdby=this.luser.LoggedInUserName;
    this.SubModuleDetail.isactive=true;
    this.api.GetAllActiveModules()    
    .subscribe(m=>{ 
      this.Modules=m;
    });
  }

  openModalWithClassEdit(template: TemplateRef<any>,id,fn) {
    this.mode=2; 
    this.SubModuleLabel = "Edit SubModule";
    this.modalRef = this.modalService.show(
      template,
      Object.assign({       
      }, { class: 'gray modal-lg' })
    );

    this.api.GetAllActiveModules()    
    .subscribe(m=>{ 
      this.Modules=m;

      this.api.GetSubModuleById(id)    
      .subscribe(sm=>{ 
        var result:any=sm;
        this.SubModuleDetail=new SubModule();
        this.SubModuleDetail.moduleid=result.moduleid;
        this.SubModuleDetail.submoduleid=result.submoduleid;
        this.SubModuleDetail.submodulename=result.submodulename;
        this.SubModuleDetail.pagelink=result.pagelink;
        this.SubModuleDetail.sortorder=result.sortorder;      
        this.SubModuleDetail.modifiedby=this.luser.LoggedInUserName;
      });
    });
  }

  openModalWIthClassDelete(template: TemplateRef<any>,id,mlabel) {
    this.SubModuleName=mlabel; 
    this.modalRef = this.modalService.show(
      template,
      Object.assign({       
      }, { class: 'gray modal-sm' })
    );
  
    this.api.GetSubModuleById(id)    
      .subscribe(sm=>{ 
        var result:any=sm;
        this.SubModuleDetail=new SubModule();
        this.SubModuleDetail.moduleid=result.moduleid;
        this.SubModuleDetail.submoduleid=result.submoduleid;
        this.SubModuleDetail.submodulename=result.submodulename;
        this.SubModuleDetail.pagelink=result.pagelink;
        this.SubModuleDetail.sortorder=result.sortorder;      
        this.SubModuleDetail.modifiedby=this.luser.LoggedInUserName;
      });
  }

  SaveSubModule(){
    this.isPushed = true;
    this._overlay.activateOverlay(true,'sk-circle');
    if(this.ValidateMandatoryField()){
     if(this.ValidateFieldValue()){   
       this.api.IsSubModuleValid(this.SubModuleDetail.moduleid,this.SubModuleDetail.submodulename)
       .subscribe(r=>{  
         if(r){
           this.toastr.warning('SubModule already exists', 'MindTeckSmartParking');
           setTimeout(() => {
            this._overlay.activateOverlay(false,'');
            },500);
         }
         else{
           this.api.AddSubModule(this.SubModuleDetail)
           .subscribe(
             r => {  
               if(r){
                 this.CancelModal();
                 this.toastr.success('Record saved successfully!', 'MindTeckSmartParking');
                 this.loadAllSubModules();
                 setTimeout(() => {
                  this._overlay.activateOverlay(false,'');
                  },500);
               }
             },
             r => {
               if(r){
               this.toastr.error('Server Error', 'MindTeckSmartParking');
               setTimeout(() => {
                this._overlay.activateOverlay(false,'');
                },500);
              }
             });
         }      
       });
     }
     else{
      setTimeout(() => {
        this._overlay.activateOverlay(false,'');
        },500);
     }
    }
    else{
      setTimeout(() => {
        this._overlay.activateOverlay(false,'');
        },500);
    }
   }

   unPushMe() {
    this.isPushed = false;
}

   UpdateSubModule(){
    if(this.ValidateMandatoryField()){
        if(this.ValidateFieldValue()){  
          this.SubModuleDetail.isactive=true;         
          this.api.UpdateSubModule(this.SubModuleDetail)
          .subscribe(
            r => {
              this.CancelModal();
              this.toastr.success('Record updated successfully!', 'MindTeckSmartParking');
              this.loadAllSubModules();
            },
            r => {
              this.toastr.error('Server Error', 'MindTeckSmartParking');
            });
        }
     }
  }
  
  DeleteSubModule(){
    this.SubModuleDetail.isactive=false;
    this.api.UpdateSubModule(this.SubModuleDetail)
    .subscribe(
      r => {
        this.CancelModal();
        this.toastr.success('Record removed successfully!', 'MindTeckSmartParking');
        this.loadAllSubModules();
      },
      r => {
        this.toastr.error('Server Error', 'MindTeckSmartParking');
      });
  }
  
  CancelModal(){
    this.modalRef.hide();
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
  
      this.loadAllSubModules();
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
    this.loadAllSubModules();
  }
  else if(prmvalue==2)
  {
   if(this.CurrentPage>1)
   {
    this.CurrentPage=this.CurrentPage-1;
    this.poffset=(this.CurrentPage-1)*this.psize;
    this.loadAllSubModules();
   }
  }
  else if(prmvalue==3)
  {
    this.poffset=this.CurrentPage*this.psize;
    this.CurrentPage=this.CurrentPage+1;
    this.loadAllSubModules();
  }
  else if(prmvalue==4)
  { 
    this.CurrentPage=this.TotalPages;
    this.poffset=(this.TotalPages - 1)*this.psize;
    this.loadAllSubModules();
  }
  else
  {
  
  }
    }
  
    loadAllSubModulesByPageSize()
    {
      this.CurrentPage=1;
      this.poffset=0;
      this.loadAllSubModules();
    }
  
    RefreshGrid(){
      for(let i=0;i<this.CustomHeader.length;i++){
        this.CustomHeader[i].ColumnSortClass='fa fa-sort';
      }
  
  
      this.loadAllSubModules();
    }
  
    GetSubModuleByFilterOption(){ 
      if(this.cfilter!=null&&this.cfilter!=""&&this.cfilter!=undefined){
        this.cfilter=this.cfilter.trim();    
      }
      else
      {
        this.cfilter=null;
      }    
  
      this.loadAllSubModules();
    } 
  
    ngOnInit() {
      this.InitializeHeader();
      this.loadAllSubModules();
      // var retrievedObject = localStorage.getItem('luser');
      // this.obj = JSON.parse(retrievedObject)
      // if (this.obj == null) {
      //   this.router.navigate(['login']);
      // }
    }

}
