import { Component, OnInit,ViewChild ,ElementRef} from '@angular/core';
import { Chart } from 'node_modules/chart.js/dist/Chart.js'

@Component({
  selector: 'app-appbooking',
  templateUrl: './appbooking.component.html',
  styleUrls: ['./appbooking.component.css']
})
export class AppbookingComponent implements OnInit {
  @ViewChild('myChart') MyChart: ElementRef;
  constructor() { }

  ngOnInit() {
    let myChart = new Chart(this.MyChart.nativeElement, {
      type: 'doughnut',
      data: {  
        labels: ["Citizen App", "Ticketing App"],
        datasets: [{
          label: 'slots of newarray',
          data: [21, 39],
          backgroundColor: [
           'rgb(209, 73, 0)' ,
            'rgb(0, 113, 189)'
          ],
          borderWidth: 0
        }]
      },
      options: {
        animation: false,
        responsive: false,
        cutoutPercentage:55,
        legend:{
          display:false,
        },
      }
    });
  }

}
