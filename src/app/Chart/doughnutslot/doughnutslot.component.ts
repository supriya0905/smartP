import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-doughnutslot',
  templateUrl: './doughnutslot.component.html',
  styleUrls: ['./doughnutslot.component.css']
})
export class DoughnutslotComponent implements OnInit {

  @Input() sdata = [];
  @ViewChild('myChart') MyChart: ElementRef;

  constructor() { }

  ngOnInit() {
    let myChart = new Chart(this.MyChart.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ["occupiedcount", "vacantcount"],
        datasets: [{
          label: 'slots of newarray',
          data: this.sdata,
          backgroundColor: [
            // 'rgba(255, 99, 132, 1)',
            // 'rgba(233,106,31)',
            'rgba(26,90,147)',
            'rgba(237, 184, 62)',
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: false,
        legend:{
          display:true,
          position: 'bottom',
          labels: {
            fontColor: "white",
            fontSize: 12
        },
        }
      }
    });
}
}
