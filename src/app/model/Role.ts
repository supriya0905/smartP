import{RoleModule} from '../model/RoleModule';
export class Role{
    roleid:number;
    rolename:string;
    module:string;
    createdby:string;
    createddate:Date;
    totalcount:number;
    isactive:boolean;
    mappings:RoleModule[];
}

   