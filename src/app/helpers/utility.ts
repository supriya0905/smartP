export class Utility{
    public static FloatToInt(n:number)
    {
      var INo:number;
      var fltNo = n.toString().split('.');
      if(fltNo!=null)
      {
        if(fltNo.length>1)
        {
          INo= parseInt(fltNo[0]);
        }
        else
        {
          INo = parseInt(n.toString());
        }
      }
    
      return INo;
    } 
}