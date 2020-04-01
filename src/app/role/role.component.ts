import { Component, OnInit,TemplateRef  } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import{RoleService} from '../service/role.service';
import{RoleModule} from '../model/RoleModule';
import{Role} from '../model/Role';
import{Utility} from '../helpers/utility'
import{CustomGridHeader} from '../model/CustomGridHeader';
import { ToastrService } from 'ngx-toastr';
import {OverlayService } from '../service/overlay.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {
  
  private rlid:number=0;
  luser:any=JSON.parse(localStorage.getItem('PEMSUser'));
  modalRef: BsModalRef;
  pfrom:number;
  pto:number;
  psize:number = 10;
  poffset:number = 0;
  csortby:string = 'roleid';
  csortorder:string = 'desc';
  cfilter:string=null;
  TotalCount:number=0;
  Roles:any;
  RoleModules:any;
  RoleName:string;
  RoleNameFlag:string;
  mode:number;
  RoleLabel:string;
  TotalPages:number=0;
  CurrentPage:number=1;
  CustomHeader:CustomGridHeader[]=[];
  roleForm: FormGroup;
  submitted = false;
  obj:any;
  // RoleName:string;

  constructor(private api: RoleService,private router: Router,private modalService: BsModalService,private toastr: ToastrService,private _overlay: OverlayService,private formBuilder: FormBuilder) { }

  openModalWithClass(template: TemplateRef<any>) { 
    this.mode=1; 
    this.RoleLabel = "Create Role";
    this.loadAllRoleModules(0);

    this.modalRef = this.modalService.show(
      template,
      Object.assign({       
      }, { class: 'gray modal-lg' })
    );

  }

  CancelModal(){
    this.modalRef.hide();
  }

  openModalWithClassEdit(template: TemplateRef<any>,rid,rn) {
    this.rlid=rid;
    this.mode=2; 
    this.RoleLabel = "Edit Role";
    this.RoleName=rn;
    this.RoleNameFlag=rn;
    this.loadAllRoleModules(rid);   
    this.modalRef = this.modalService.show(
      template,
      Object.assign({       
      }, { class: 'gray modal-lg' })
    );
  }

  openModalWIthClassDelete(template: TemplateRef<any>,rid,rn) {
    this.rlid=rid;
    this.RoleName=rn; 
    this.modalRef = this.modalService.show(
      template,
      Object.assign({       
      }, { class: 'gray modal-sm' })
    );
  }

  GetRoleByFilterOption(){ 
    if(this.cfilter!=null&&this.cfilter!=""&&this.cfilter!=undefined){
      this.cfilter=this.cfilter.trim();    
    }
    else
    {
      this.cfilter=null;
    }    

    this.loadAllRole();
  } 

  SaveRole(){  
    this._overlay.activateOverlay(true,'sk-circle');
    if(this.RoleName != null&&this.RoleName != ''&&this.RoleName !='undefined')
    {
     if(this.checkRoleIsSelected()==true)
     {

      this.api.IsRoleExists(this.luser.LoggedInUserName,this.RoleName)
      .subscribe(r=>{        
        if(!r){

          var rl:Role =new Role();
          rl.rolename=this.RoleName;
          rl.createdby=this.luser.LoggedInUserName;
          rl.mappings = [];

          this.RoleModules.forEach(element => {
            element.values.forEach(itm => {
              if(itm.ischecked==true){              
                var rmod=new RoleModule();
                rmod.moduleid=itm.moduleid;
                rmod.permissionid=itm.id;
                rmod.roleid=0;
                 rl.mappings.push(rmod);
              }
            });
          });

         
          this.api.AddRole(rl)
          .subscribe(
            r => {
              if(r){
              this.RoleName="";
              this.CancelModal();
              this.toastr.success('Record saved successfully!', 'MindTeckSmartParking');
              this.loadAllRole();
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
        else{
          this.toastr.warning('Role name already exists', 'MindTeckSmartParking');
          setTimeout(() => {
            this._overlay.activateOverlay(false,'');
            },500);
        }
      });

     }
     else{
      this.toastr.warning('Select atleast one Role Modules', 'MindTeckSmartParking');
      setTimeout(() => {
        this._overlay.activateOverlay(false,'');
        },500);
     }
    }
    else{
      this.toastr.warning('Enter Role Name', 'MindTeckSmartParking');
      setTimeout(() => {
        this._overlay.activateOverlay(false,'');
        },500);
    }
  }

  UpdateRole(){  
    if(this.RoleName != null&&this.RoleName != ''&&this.RoleName !='undefined')
    {
     if(this.checkRoleIsSelected()==true)
     {
      if(this.RoleName.trim()!=this.RoleNameFlag.trim())
      {
        this.api.IsRoleExists(this.luser.LoggedInUserName,this.RoleName)
        .subscribe(r=>{        
          if(!r){
            var rl:Role =new Role();
            rl.rolename=this.RoleName;
            rl.createdby=this.luser.LoggedInUserName;
            rl.roleid=this.rlid;
            rl.isactive=true;
            rl.mappings = [];
  
            this.RoleModules.forEach(element => {
              element.values.forEach(itm => {
                if(itm.ischecked==true){              
                  var rmod=new RoleModule();                
                  rmod.moduleid=itm.moduleid;
                  rmod.permissionid=itm.id;
                  rmod.roleid=this.rlid;
                   rl.mappings.push(rmod);
                }
              });
            });
  
           
            this.api.UpdateRole(rl)
            .subscribe(
              r => {
                this.RoleName="";
                this.CancelModal();
                this.toastr.success('Record updated successfully!', 'MindTeckSmartParking');
                this.loadAllRole();
              },
              r => {  
                this.toastr.error('Server Error', 'MindTeckSmartParking'); 
              });
  
          
          }
          else{
            this.toastr.warning('Role name already exists', 'MindTeckSmartParking');
          }
        });
      }
      else
      {
        var rl:Role =new Role();
        rl.rolename=this.RoleName;
        rl.createdby=this.luser.LoggedInUserName;
        rl.roleid=this.rlid;
        rl.isactive=true;
        rl.mappings = [];

        this.RoleModules.forEach(element => {
          element.values.forEach(itm => {
            if(itm.ischecked==true){              
              var rmod=new RoleModule();                
              rmod.moduleid=itm.moduleid;
              rmod.permissionid=itm.id;
              rmod.roleid=this.rlid;
               rl.mappings.push(rmod);
            }
          });
        });

       
        this.api.UpdateRole(rl)
        .subscribe(
          r => {
            this.RoleName="";
            this.CancelModal();
            this.toastr.success('Record updated successfully!', 'MindTeckSmartParking');
            this.loadAllRole();
          },
          r => {  
            this.toastr.error('Server Error', 'MindTeckSmartParking'); 
          });
      }
     }
     else{
      this.toastr.warning('Select atleast one Role Modules', 'MindTeckSmartParking');
     }
    }
    else{
      this.toastr.warning('Enter Role Name', 'MindTeckSmartParking');
    }
  }

  DeleteRole()
  {  
    var rl:Role =new Role();
    rl.rolename=this.RoleName;
    rl.createdby=this.luser.LoggedInUserName;
    rl.roleid=this.rlid;
    rl.isactive=false;
    rl.mappings = [];

    this.api.UpdateRole(rl)
    .subscribe(
      r => {
        this.RoleName="";
        this.CancelModal();
        this.toastr.success('Record removed successfully!', 'MindTeckSmartParking');
        this.loadAllRole();
      },
      r => {  
        this.toastr.error('Server Error', 'MindTeckSmartParking'); 
      });
  }

  onCheck(rm,item){     
    for(var i = 0;i<rm.values.length;i++) {
    if(item.ischecked==1)
    {
if(rm.values[i].id!=item.id)
{
  rm.values[i].ischecked=0;
}
    }
   }   
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
  this.loadAllRole();
}
else if(prmvalue==2)
{
 if(this.CurrentPage>1)
 {
  this.CurrentPage=this.CurrentPage-1;
  this.poffset=(this.CurrentPage-1)*this.psize;
  this.loadAllRole();
 }
}
else if(prmvalue==3)
{
  this.poffset=this.CurrentPage*this.psize;
  this.CurrentPage=this.CurrentPage+1;
  this.loadAllRole();
}
else if(prmvalue==4)
{ 
  this.CurrentPage=this.TotalPages;
  this.poffset=(this.TotalPages - 1)*this.psize;
  this.loadAllRole();
}
else
{

}
  }
  

  ngOnInit() {
    this.roleForm = this.formBuilder.group({
      RoleName: ['', Validators.required],
  });
    this.mode=0;
    var cgh=new CustomGridHeader();
    cgh.ColumnId=1;
    cgh.ColumnNameLabel="Name";
    cgh.ColumnName="rolename";
    cgh.ColumnSortClass="fa fa-sort";
    cgh.IsSortable=true;
    this.CustomHeader.push(cgh);

    cgh=new CustomGridHeader();
    cgh.ColumnId=2;
    cgh.ColumnNameLabel="Module";
    cgh.ColumnName="module";
    cgh.ColumnSortClass="fa fa-sort";
    cgh.IsSortable=true;
    this.CustomHeader.push(cgh);

    cgh=new CustomGridHeader();
    cgh.ColumnId=3;
    cgh.ColumnNameLabel="CreatedBy";
    cgh.ColumnName="createdby";
    cgh.ColumnSortClass="";
    cgh.IsSortable=false;
    this.CustomHeader.push(cgh);

    cgh=new CustomGridHeader();
    cgh.ColumnId=4;
    cgh.ColumnNameLabel="CreatedOn";
    cgh.ColumnName="createddate";
    cgh.ColumnSortClass="";
    cgh.IsSortable=false;
    this.CustomHeader.push(cgh);

    cgh=new CustomGridHeader();
    cgh.ColumnId=5;
    cgh.ColumnNameLabel="";
    cgh.ColumnSortClass="";
    cgh.IsSortable=false;
    this.CustomHeader.push(cgh);

    this.loadAllRole();
    // var retrievedObject = localStorage.getItem('luser');
    // this.obj = JSON.parse(retrievedObject)
    // if (this.obj == null) {
    //   this.router.navigate(['login']);
    // }
  }
  get f() { return this.roleForm.controls; }

  onSubmit() {
      this.submitted = true;

      // stop here if form is invalid
      if (this.roleForm.invalid) {
          return;
      }
  }

  loadAllRoleByPageSize(){
    this.CurrentPage=1;
    this.poffset=0;
    this.loadAllRole();
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
    this.loadAllRole();
  }

  RefreshGrid(){
    for(let i=0;i<this.CustomHeader.length;i++){
      this.CustomHeader[i].ColumnSortClass='fa fa-sort';
    }


    this.loadAllRole();
  }

  private checkRoleIsSelected(){
    var chk=false;
    this.RoleModules.forEach(element => {
      element.values.forEach(itm => {
        if(itm.ischecked==true){
          chk=true;
        }
      });
    });

    return chk;
  }

  private loadAllRole() { 
    this.TotalCount=0;
    this.Roles=null;
    this.TotalPages=0;
    this.pfrom=0;
    this.pto=0;
    this.api.getAllRoles(this.luser.LoggedInUserName,this.csortby,this.csortorder,this.psize,this.poffset,this.cfilter)    
      .subscribe(r=>{ 
        var result:any=r;
        if(result.length>0)
        {        
          this.TotalCount=r[0].totalcount;
          this.Roles=r;

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

private loadAllRoleModules(rid:number) {  
  this.api.getAllRoleModules(this.luser.LoggedInUserName,rid)
    .subscribe(r=>{
      var result:any[];
                    var array: any = r;
                    var groups = new Set(array.map(item => item.modulename));
                    result = [];
                    groups.forEach(g => 
                      result.push({
                        name: g, 
                        values: array.filter(i => i.modulename === g)
                      }
                    ));
this.RoleModules=result;
                    
    });

   
}



}
