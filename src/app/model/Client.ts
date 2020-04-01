import{ClientDependent} from '../model/ClientDependent';
import{CustomDropDown} from '../model/CustomDropDown';
export class Client{
    clientid:number;
    name:string;
    emailid:string;
    description:string;
    createdby:string;
    createddate:Date;
    modifiedby:string;
    modifieddate:Date;
    datestring:string;
    parkingtypes:string;
    modules:string;
    totalcount:number;
    contactno:string;
    ownername:string;
    ownergender:string;
    isactive:boolean;
    clientmodules:ClientDependent[]=[];
    clientparkingtypes:ClientDependent[]=[];
    assignedmodules:CustomDropDown[]=[];
    assignedparkingtypes:CustomDropDown[]=[];
}