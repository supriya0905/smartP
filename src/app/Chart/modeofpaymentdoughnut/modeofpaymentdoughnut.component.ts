import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Chart } from 'node_modules/chart.js/dist/Chart.js'

@Component({
  selector: 'app-modeofpaymentdoughnut',
  templateUrl: './modeofpaymentdoughnut.component.html',
  styleUrls: ['./modeofpaymentdoughnut.component.css']
})
export class ModeofpaymentdoughnutComponent implements OnInit {

  @Input() sdata = [];
  @ViewChild('myChart') MyChart: ElementRef;

  constructor() { }

  ngOnInit() {
    let myChart = new Chart(this.MyChart.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ["Cash", "Wallet","Creditcard"],
        datasets: [{
          label: 'Mode Of Payment',
          data: [40,70,14],
          backgroundColor: [
            'rgb(0, 125, 209)',
            'rgb(214, 171, 0)',
            'rgb(209, 73, 0)'
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: false,
        legend:{
          onClick: (e) => e.stopPropagation(),
          labels: {
            fontColor: "white",
            fontSize: 12
        },
          display:true,
          position: 'bottom',
        },
        segmentShowStroke: false
      }
    });
}
}
