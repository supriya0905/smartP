import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Chart } from 'chart.js';
import { DashboardService } from '../../service/dashboard.service';
//import { Chart } from 'node_modules/chart.js/dist/Chart.js'
@Component({
  selector: 'app-demochart',
  templateUrl: './demochart.component.html',
  styleUrls: ['./demochart.component.css']
})
export class DemochartComponent implements OnInit {
  msg: any = [];
  @ViewChild('myChart') MyChart: ElementRef;

  constructor(private dashboardApi: DashboardService) { }
  ngOnInit() {
    this.dashboardApi.currentMessage.subscribe(data => {
      this.msg = data;
      let myChart = new Chart(this.MyChart.nativeElement, {
        type: 'line',
        data: {
          labels: ["Week 6", "Week 7", "Week 8", "Week 9", "Week 10", "Week 11"],
          datasets: [{
            label: 'Bike',
            backgroundColor: '#007dd1',
            borderColor: '#007dd1',
            data: this.msg,
            fill: false
          },
            // {
            //   label:'Car',
            //   backgroundColor:'#D6AB00',
            //   borderColor:'#D6AB00',
            //   fill:false,
            //   data:  this.msg
            // },
          ]
        },
        options: {
          responsive: false,
          legend: {
            labels: {
              fontColor: "white",
              fontSize: 12
            },
            display: true,
            position: 'bottom',
          },
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true,
                fontColor: 'white'
              }
            }],
            xAxes: [{
              ticks: {
                beginAtZero: true,
                fontColor: 'white'
              }
            }]
          }
        },
      });
    });
  }
}
