import { Component, OnInit ,ViewChild,ElementRef} from '@angular/core';
import { Chart } from 'node_modules/chart.js/dist/Chart.js'

@Component({
  selector: 'app-dashboardstacked',
  templateUrl: './dashboardstacked.component.html',
  styleUrls: ['./dashboardstacked.component.css']
})
export class DashboardstackedComponent implements OnInit {
  @ViewChild('myChart') MyChart: ElementRef;
  constructor() { }

  ngOnInit() {
    let myChart = new Chart(this.MyChart.nativeElement, {
      type: 'bar',
      data: {  
        labels: ["Jan-19", "Feb-19","Mar-19","Apr-19","May-19","Jun-19"],
        datasets: [{
          label: 'Ticketting App',
          data: [3550,2000,3260,4002,3856,3562],
          backgroundColor: [
            'rgb(0, 125, 209)',
            'rgb(0, 125, 209)',
            'rgb(0, 125, 209)',
            'rgb(0, 125, 209)',
            'rgb(0, 125, 209)',
            'rgb(0, 125, 209)'
          ],
          borderColor: [
            'rgb(0, 125, 209)',
            'rgb(0, 125, 209)',
            'rgb(0, 125, 209)',
            'rgb(0, 125, 209)',
            'rgb(0, 125, 209)',
            'rgb(0, 125, 209)',
          ],
          borderWidth: 0
        },
        {
           label: 'Citizen App',
          data: [1000,1000,700,900,1200,1320],
          backgroundColor: [
            'rgb(209, 73, 0)',
            'rgb(209, 73, 0)',
            'rgb(209, 73, 0)',
            'rgb(209, 73, 0)',
            'rgb(209, 73, 0)',
            'rgb(209, 73, 0)'
          ],
          borderColor: [
            'rgb(209, 73, 0)',
            'rgb(209, 73, 0)',
            'rgb(209, 73, 0)',
            'rgb(209, 73, 0)',
            'rgb(209, 73, 0)',
            'rgb(209, 73, 0)'
          ],
          borderWidth: 0
        }
      ]
      },
      options: {
        "hover":{
          "animationDuration":0
        },
        responsive: false,
        legend:{
          labels: {
            fontColor: "white",
            fontSize: 12
        },
          display:true,
          position:'bottom'
        },
        scales: {
          xAxes: [{
             stacked: true ,
             ticks: {
              beginAtZero:true,
              fontColor:'white'
          }
            }],
          yAxes: [{ 
            stacked: true,
            ticks: {
              beginAtZero:true,
              fontColor:'white'
          }
          }]
        }

        // title:{
        //   display:true,
        //   position:'top',
        //   text:'Top 10 FOC',
        //   fontSize:15
        // }
      }
    });
  }
}