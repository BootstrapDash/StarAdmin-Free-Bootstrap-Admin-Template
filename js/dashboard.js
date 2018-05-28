(function ($) {
  'use strict';
  $(function () {
    if ($('#dashboard-area-chart').length) {
      var lineChartCanvas = $("#dashboard-area-chart").get(0).getContext("2d");
      var data = {
        labels: ["2013", "2014", "2014", "2015", "2016", "2017"],
        datasets: [{
            label: 'Product',
            data: [0, 11, 6, 10, 8, 0],
            backgroundColor: 'rgba(0, 128, 207, 0.4)',
            borderWidth: 1,
            fill: true
          },
          {
            label: 'Product',
            data: [0, 7, 11, 8, 11, 0],
            backgroundColor: 'rgba(2, 178, 248, 0.4)',
            borderWidth: 1,
            fill: true
          },
          {
            label: 'Support',
            data: [0, 14, 10, 14, 6, 0],
            backgroundColor: 'rgba(73, 221, 255, 0.4)',
            borderWidth: 1,
            fill: true
          }
        ]
      };
      var options = {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          yAxes: [{
            display: false
          }],
          xAxes: [{
            display: false,
            ticks: {
              beginAtZero: true
            }
          }]
        },
        legend: {
          display: false
        },
        elements: {
          point: {
            radius: 3
          }
        },
        layout: {
          padding: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
          }
        },
        stepsize: 1
      };
      var lineChart = new Chart(lineChartCanvas, {
        type: 'line',
        data: data,
        options: options
      });
    }
  });
})(jQuery);