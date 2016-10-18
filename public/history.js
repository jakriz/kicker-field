$(function() {
  var ctx = $('#historyChart');
  
  $.get('/players/history', function(players) {
    console.log(players);
    
    var colorPalette = [
      "#781c81",
      "#4a2384",
      "#3f499d",
      "#4273bb",
      "#4c94bf",
      "#5ea9a2",
      "#76b67d",
      "#92bd60",
      "#b1be4e",
      "#ccb742",
      "#dfa539",
      "#e78432",
      "#e4542a",
      "#d92120"
    ];
    
    var datasets = _.map(players, function(points, player) {
      var colorIndex = Math.floor(Math.random()*colorPalette.length);
      var color = colorPalette[colorIndex];
      colorPalette.splice(colorIndex, 1);
      
      return {
        label: player,
        data: points,
        fill: false,
        backgroundColor: color,
        borderColor: color,
      };
    });
    
    var labels = _.range(1, _.values(players)[0].length+1);
    
    var historyChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: datasets
      },
      options: {
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Match No'
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Rating'
            }
          }]
        }
      }
    });
  });
});
