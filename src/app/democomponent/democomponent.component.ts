import { Component, OnInit,Input,ViewChild ,ElementRef} from '@angular/core';

@Component({
  selector: 'app-democomponent',
  templateUrl: './democomponent.component.html',
  styleUrls: ['./democomponent.component.css']
})
export class DemocomponentComponent implements OnInit {
  // @Input('sdata') sdata :any[];
  
  @Input() sdata=[];
  constructor() { }

  ngOnInit() {
    var array;
    setTimeout(() => {
      array = this.sdata;
      console.log("array");
     console.log(array);
    }, 1000);
  }
}
