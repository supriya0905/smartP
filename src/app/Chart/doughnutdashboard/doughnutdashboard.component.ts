import { Component, OnInit,ViewChild ,ElementRef} from '@angular/core';
import { Chart } from 'node_modules/chart.js/dist/Chart.js'
@Component({
  selector: 'app-doughnutdashboard',
  templateUrl: './doughnutdashboard.component.html',
  styleUrls: ['./doughnutdashboard.component.css']
})
export class DoughnutdashboardComponent implements OnInit {
  @ViewChild('myChart') MyChart: ElementRef;
  constructor() { }

  ngOnInit() {
    let myChart = new Chart(this.MyChart.nativeElement, {
      type: 'doughnut',
      data: {  
        labels: ["Occupied", "Vacant"],
        datasets: [{
          label: 'slots of newarray',
          data: [21, 39],
          backgroundColor: [
            'rgba(237, 184, 62)',
            'rgb(159, 165, 160)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        // elements: {
        //   center: {
        //     text: '90%',
        //     color: '#333333', 
        //     fontStyle: 'Arial', 
        //     sidePadding: 20
        //   }
        // },
        responsive: false,
        cutoutPercentage:70,
        legend:{
          display:true,
          position: 'bottom',
        },
        // title:{
        //   display:true,
        //   text:'AvailabilityByLocation',
        //   fontSize:15
        // }
      }
    });
    Chart.pluginService.register({
      beforeDraw: function (chart) {
        if (chart.config.options.elements.center) {
          //Get ctx from string
          var ctx = chart.ctx;
          
          //Get options from the center object in options
          var centerConfig = chart.config.options.elements.center;
          var fontStyle = centerConfig.fontStyle || 'Arial';
          var txt = centerConfig.text;
          var color = centerConfig.color || '#000';
          var sidePadding = centerConfig.sidePadding || 20;
          var sidePaddingCalculated = (sidePadding/100) * (chart.innerRadius * 2)
          //Start with a base font of 30px
          ctx.font = "80px " + fontStyle;
          
          //Get the width of the string and also the width of the element minus 10 to give it 5px side padding
          var stringWidth = ctx.measureText(txt).width;
          var elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;
  
          // Find out how much the font can grow in width.
          var widthRatio = elementWidth / stringWidth;
          var newFontSize = Math.floor(30 * widthRatio);
          var elementHeight = (chart.innerRadius * 2);
  
          // Pick a new font size so it will not be larger than the height of label.
          var fontSizeToUse = Math.min(newFontSize, elementHeight);
  
          //Set font settings to draw it correctly.
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          var centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
          var centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
          ctx.font = fontSizeToUse+"px " + fontStyle;
          ctx.fillStyle = color;
          
          //Draw text in center
          ctx.fillText(txt, centerX, centerY);
        }
      }
    });
  }

}
