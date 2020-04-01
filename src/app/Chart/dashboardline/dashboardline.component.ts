import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-dashboardline',
  templateUrl: './dashboardline.component.html',
  styleUrls: ['./dashboardline.component.css']
})
export class DashboardlineComponent implements OnInit {
  @Input() sdata=[];
  // @Input() l2data = [];
  // @Input() wdata = [];
  @ViewChild('myChart') MyChart: ElementRef;
  constructor() { }

  ngOnInit() {
  //   console.log(this.l1data)
  //  console.log(this.l2data)
  var array;
  setTimeout(() => {
    array = this.sdata;
    console.log("array");
    console.log(array);
  }, 1000);
    let myChart = new Chart(this.MyChart.nativeElement, {      
      type: 'line',     
      data: {
        labels: ["Week 6", "Week 7","Week 8","Week 9","Week 10","Week 11"],
        datasets: [{
          label: 'Bike',
          backgroundColor:'#007dd1',
          borderColor:'#007dd1',
          data: array,
          fill:false,
        },
        {
          label:'Car',
          backgroundColor:'#D6AB00',
          borderColor:'#D6AB00',
          fill:false,
          data: [12,20,30]
        },
      
    ]
      },      
        options: {
          responsive: false,
          legend:{
            labels: {
              fontColor: "white",
              fontSize: 12
          },
            display:true,
            position: 'bottom',
          },
          scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true,
                    fontColor:'white'
                }
            }],
            xAxes: [{
              ticks: {
                  beginAtZero:true,
                  fontColor:'white'
              }
          }]
        }
        },        
    });

}
}
