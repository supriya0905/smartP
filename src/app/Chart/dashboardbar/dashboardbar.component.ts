import { Component, OnInit ,ViewChild,ElementRef} from '@angular/core';
import { Chart } from 'node_modules/chart.js/dist/Chart.js'

@Component({
  selector: 'app-dashboardbar',
  templateUrl: './dashboardbar.component.html',
  styleUrls: ['./dashboardbar.component.css']
})
export class DashboardbarComponent implements OnInit {
  @ViewChild('myChart') MyChart: ElementRef;
  constructor() { }
  ngOnInit() {
    let myChart = new Chart(this.MyChart.nativeElement, {
      type: 'bar',
      data: {  
        labels: ["LOC A", "LOC B","LOC C","LOC D","LOC E","LOC F","LOC G","LOC H","LOC I","LOC J"],
        datasets: [{
          label: 'Current FOC',
          data: [55,63,23,11,34,77,44,102,84,19],
          backgroundColor: [
            'rgba(0, 84, 158)',
            'rgba(0, 84, 158)',
            'rgba(0, 84, 158)',
            'rgba(0, 84, 158)',
            'rgba(0, 84, 158)',
            'rgba(0, 84, 158)',
            'rgba(0, 84, 158)',
            'rgba(0, 84, 158)',
            'rgba(0, 84, 158)',
            'rgba(0, 84, 158)'
          ],
          borderColor: [
            'rgba(0, 84, 158)',
            'rgba(0, 84, 158)',
            'rgba(0, 84, 158)',
            'rgba(0, 84, 158)',
            'rgba(0, 84, 158)',
            'rgba(0, 84, 158)',
            'rgba(0, 84, 158)',
            'rgba(0, 84, 158)',
            'rgba(0, 84, 158)',
            'rgba(0, 84, 158)'
          ],
          borderWidth: 1
        },
        {
           label: 'Previous FOC',
          data: [15,33,43,61,24,25,46,92,34,79],
          backgroundColor: [
            'rgba(35, 133, 121)',
            'rgba(35, 133, 121)',
            'rgba(35, 133, 121)',
            'rgba(35, 133, 121)',
            'rgba(35, 133, 121)',
            'rgba(35, 133, 121)',
            'rgba(35, 133, 121)',
            'rgba(35, 133, 121)',
            'rgba(35, 133, 121)',
            'rgba(35, 133, 121)'
          ],
          borderColor: [
            'rgba(35, 133, 121)',
            'rgba(35, 133, 121)',
            'rgba(35, 133, 121)',
            'rgba(35, 133, 121)',
            'rgba(35, 133, 121)',
            'rgba(35, 133, 121)',
            'rgba(35, 133, 121)',
            'rgba(35, 133, 121)',
            'rgba(35, 133, 121)',
            'rgba(35, 133, 121)'
          ],
          borderWidth: 1
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
              fontSize: 10
          },
          display:true,
          position:'bottom'
        },
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
