import{UserRole} from '../model/UserRole';
export class User {
    firstname:string;
    lastname:string;
    username:string;
    password:string;
    email:string;
    phone:string;
    createdby:string;
    gender:string;
    fullname:string;
    datestring:string;
    userroles:string;
    userid:number;
    clientid:number;
    isactive:boolean;
    roles:UserRole[]=[];
    totalcount:number;
    locations:string;
    location:string;
    clientlocationid:number;
}

   