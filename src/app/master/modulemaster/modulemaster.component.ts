import { Component, OnInit,TemplateRef  } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import{ModuleService} from '../../service/module.service';
import{Module} from '../../model/Module';
import{CustomGridHeader} from '../../model/CustomGridHeader';
import { ToastrService } from 'ngx-toastr';
import{Utility} from '../../helpers/utility';
import{LoggedInUser} from '../../model/LoggedInUser';
import { OverlayService } from '../../service/overlay.service'
import { Router } from '@angular/router';


@Component({
  selector: 'app-modulemaster',
  templateUrl: './modulemaster.component.html',
  styleUrls: ['./modulemaster.component.css']
})
export class ModulemasterComponent implements OnInit {
  isPushed: boolean = false;
  luser:any=JSON.parse(localStorage.getItem('PEMSUser'));
  Modules:any;
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
  ModuleModalLabel:string;
  ModuleName:string;
  ModuleDetail:Module=null;  
  obj:any;

  constructor(private api: ModuleService,private router: Router,private modalService: BsModalService,private toastr: ToastrService,private _overlay: OverlayService) { }

  private InitializeHeader(){
    var cgh=new CustomGridHeader();
    cgh.ColumnId=1;
    cgh.ColumnNameLabel="Name";
    cgh.ColumnName="modulename";
    cgh.ColumnSortClass="fa fa-sort";
    cgh.IsSortable=true;
    this.CustomHeader.push(cgh);

    cgh=new CustomGridHeader();
    cgh.ColumnId=2;
    cgh.ColumnNameLabel="PageLink";
    cgh.ColumnName="pagelink";
    cgh.ColumnSortClass="fa fa-sort";
    cgh.IsSortable=true;
    this.CustomHeader.push(cgh);

    cgh=new CustomGridHeader();
    cgh.ColumnId=3;
    cgh.ColumnNameLabel="HavingSubModules";
    cgh.ColumnName="childmenu";
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

  private loadAllModules() { 
    this.TotalCount=0;
    this.Modules=null;
    this.TotalPages=0;
    this.pfrom=0;
    this.pto=0;
    this.api.GetAllModules(this.luser.LoggedInUserName,this.csortby,this.csortorder,this.psize,this.poffset,this.cfilter)    
      .subscribe(m=>{       
        var result:any=m;
        if(result.length>0)
        {        
          this.TotalCount=m[0].totalcount;
          this.Modules=m;

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

  if(this.ModuleDetail.modulename==null|| this.ModuleDetail.modulename==''|| this.ModuleDetail.modulename==undefined){
    msg=msg+"Module Name,";
    chk=false;
  }

  if(this.ModuleDetail.childmenu==false)
  {
    if(this.ModuleDetail.pagelink==null|| this.ModuleDetail.pagelink==''|| this.ModuleDetail.pagelink==undefined){
      msg=msg+"Pagelink,";
      chk=false;
    }
  }

  if(this.ModuleDetail.sortorder==null|| this.ModuleDetail.sortorder==0|| this.ModuleDetail.sortorder==undefined){
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

  var regonlyalphabet = new RegExp(/^[A-Za-z& ]+$/);
  if(!regonlyalphabet.test(this.ModuleDetail.modulename))
  {
    chk=false;
    msg=msg+"Module Name,";
  }

  if(this.ModuleDetail.childmenu==false)
  {
    if(!regonlyalphabet.test(this.ModuleDetail.pagelink))
    {
      chk=false;
      msg=msg+"Page Link,";
    }
  }

  msg=msg.substring(0,msg.length-1);

  if(chk==false){
    this.toastr.warning(msg+' are invalid fields.', 'MindTeckSmartParking');
  } 

  
  return chk;
}

openModalWithClass(template: TemplateRef<any>) { 
  this.mode=1; 
  this.ModuleModalLabel = "Create Module";
  this.modalRef = this.modalService.show(
    template,
    Object.assign({       
    }, { class: 'gray modal-lg' })
  );

  this.ModuleDetail=new Module();
  this.ModuleDetail.moduleid=0;
  this.ModuleDetail.modulename='';
  this.ModuleDetail.childmenu=false;
  this.ModuleDetail.pagelink='';
  this.ModuleDetail.sortorder=0;
  this.ModuleDetail.createdby=this.luser.LoggedInUserName;
}

openModalWithClassEdit(template: TemplateRef<any>,id,fn) {
  this.mode=2; 
  this.ModuleModalLabel = "Edit Module"; 

  this.api.GetModuleById(id)    
  .subscribe(u=>{    
    var result:any=u;
    this.ModuleDetail=new Module();
    this.ModuleDetail.moduleid=result.moduleid;
    this.ModuleDetail.modulename=result.modulename;
    this.ModuleDetail.childmenu=result.childmenu;
    this.ModuleDetail.pagelink=result.pagelink;
    this.ModuleDetail.sortorder=result.sortorder;
    this.ModuleDetail.modifiedby=this.luser.LoggedInUserName;

    this.modalRef = this.modalService.show(
      template,
      Object.assign({       
      }, { class: 'gray modal-lg' })
    );
  });
}

openModalWIthClassDelete(template: TemplateRef<any>,id,mlabel) {
  this.ModuleName=mlabel; 
  this.modalRef = this.modalService.show(
    template,
    Object.assign({       
    }, { class: 'gray modal-sm' })
  );

  this.api.GetModuleById(id)    
  .subscribe(u=>{ 
    var result:any=u;
    this.ModuleDetail=new Module();
    this.ModuleDetail.moduleid=result.moduleid;
    this.ModuleDetail.modulename=result.modulename;
    this.ModuleDetail.childmenu=result.childmenu;
    this.ModuleDetail.pagelink=result.pagelink;
    this.ModuleDetail.sortorder=result.sortorder;
  });
}

SaveModule(){
  this.isPushed = true;
  this._overlay.activateOverlay(true,'sk-circle');
 if(this.ValidateMandatoryField()){
  if(this.ValidateFieldValue()){   
    this.api.IsModuleValid(this.ModuleDetail.modulename)
    .subscribe(r=>{        
      if(r){
        this.toastr.warning('Module already exists', 'MindTeckSmartParking');
        setTimeout(() => {
          this._overlay.activateOverlay(false,'');
          },200);
      }
      else{
        this.ModuleDetail.isactive=true;

        if(this.ModuleDetail.childmenu==true)
        {
          this.ModuleDetail.pagelink="";
        }

        this.api.AddModule(this.ModuleDetail)
        .subscribe(
          r => {  
        if(r){
              this.CancelModal();
              this.toastr.success('Record saved successfully!', 'MindTeckSmartParking');
              this.loadAllModules();
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
  else{
    setTimeout(() => {
      this._overlay.activateOverlay(false,'');
      },200);
    }
  }
  else{
    setTimeout(() => {
      this._overlay.activateOverlay(false,'');
      },200);
    }
  }

unPushMe() {
  this.isPushed = false;
}

UpdateModule(){
  if(this.ValidateMandatoryField()){
      if(this.ValidateFieldValue()){  
        this.ModuleDetail.isactive=true;
        if(this.ModuleDetail.childmenu==true)
        {
          this.ModuleDetail.pagelink="";
        }
        this.api.UpdateModule(this.ModuleDetail)
        .subscribe(
          r => {
            this.CancelModal();
            this.toastr.success('Record updated successfully!', 'MindTeckSmartParking');
            this.loadAllModules();
          },
          r => {
            this.toastr.error('Server Error', 'MindTeckSmartParking');
          });
      }
   }
}

DeleteModule(){
  this.ModuleDetail.isactive=false;
        this.api.UpdateModule(this.ModuleDetail)
        .subscribe(
          r => {
            this.CancelModal();
            this.toastr.success('Record removed successfully!', 'MindTeckSmartParking');
            this.loadAllModules();
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

    this.loadAllModules();
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
  this.loadAllModules();
}
else if(prmvalue==2)
{
 if(this.CurrentPage>1)
 {
  this.CurrentPage=this.CurrentPage-1;
  this.poffset=(this.CurrentPage-1)*this.psize;
  this.loadAllModules();
 }
}
else if(prmvalue==3)
{
  this.poffset=this.CurrentPage*this.psize;
  this.CurrentPage=this.CurrentPage+1;
  this.loadAllModules();
}
else if(prmvalue==4)
{ 
  this.CurrentPage=this.TotalPages;
  this.poffset=(this.TotalPages - 1)*this.psize;
  this.loadAllModules();
}
else
{

}
  }

  loadAllModulesByPageSize()
  {
    this.CurrentPage=1;
    this.poffset=0;
    this.loadAllModules();
  }

  RefreshGrid(){
    for(let i=0;i<this.CustomHeader.length;i++){
      this.CustomHeader[i].ColumnSortClass='fa fa-sort';
    }


    this.loadAllModules();
  }

  GetModuleByFilterOption(){ 
    if(this.cfilter!=null&&this.cfilter!=""&&this.cfilter!=undefined){
      this.cfilter=this.cfilter.trim();    
    }
    else
    {
      this.cfilter=null; 
    }    

    this.loadAllModules();
  } 

  ngOnInit() {
    this.InitializeHeader();
    this. loadAllModules();
    // var retrievedObject = localStorage.getItem('luser');
    // this.obj = JSON.parse(retrievedObject)
    // if (this.obj == null) {
    //   this.router.navigate(['login']);
    // }
  }

}
