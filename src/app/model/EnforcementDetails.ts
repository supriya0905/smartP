import{CustomDropDown}from '../model/CustomDropDown';
export class Enforcement{
    id:number;
    clientid:number;
    clientname:string;
    cameraid:string;
    zoneid:string;
    title:string; 
    description:string;
    isfixed:boolean;
    isactive:boolean;
    createdby:string;   
    modifiedby:string;
    datestring:string;
    totalcount:number;
    checkintime:string;
    uniquecode:string;
    enforcementtypeid:number;
    name:string;
    clientlocationid:number;
    clientlocationdescription:string;
    clientlocation:CustomDropDown[]=[];
}
