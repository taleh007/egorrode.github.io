function unpack(rows, key) {
  return rows.map(function(row) { return row[key]; });
};

function select_unpack(rows, select_key, select_value, unpack_key) {
  return rows.filter(row => row[select_key] == select_value).map(row => row[unpack_key]);
};
  
function devideByLayers(array, layerSize) {
  result = [[],[],[],[],[],[]];
  _.clone(array).forEach(function(e){
    devided = [0,0,0,0,0,0];
    if (e < 0) {
      e = -e;
      devided[0] = e - layerSize * 2;
      
      if (devided[0] > 0) {
        devided[1] = layerSize;
        devided[2] = layerSize;
      } else {
        devided[0] = 0;
        devided[1] = e - layerSize;
      };

      if (devided[1] > 0) {
        devided[2] = layerSize;
      } else {
        devided[1] = 0;
        devided[2] = e;
      };
    } else if (e > 0) {
      devided[3] = e - layerSize * 2;
      
      if (devided[3] > 0) {
        devided[4] = layerSize;
        devided[5] = layerSize;
      } else {
        devided[3] = 0;
        devided[4] = e - layerSize;
      };

      if (devided[4] > 0) {
        devided[5] = layerSize;
      } else {
        devided[4] = 0;
        devided[5] = e;
      };
    };
    for (let i = 0; i < devided.length; i++) {
      result[i].push(devided[i]);
    }
  });
  return result;
}

Plotly.d3.csv('weekdays-orders-hours.csv', function(err, rows){
  let weekdays = _.uniq(unpack(rows, 'weekday_name'));
  function perform_horizon(column, divId) {
    let layout = {
      height: 800,
      width: 1000,
      showlegend: false,
      title: 'Orders amount difference with average amount for each hour',
      xaxis: {domain: [0, 1]}
    };
    
    let max = _.max(unpack(rows, column).map(e => {return Math.abs(e)}));

    weekdays.forEach((day, i) => {
      layout['yaxis' + (i+1)] = {
        domain: [0.13*i + (i == 0 ? 0 : 0.01), 0.13*(i+1)],
        title: day,
        range: [0, max/3]
      }
    });
    
    let defaultTrace = {
      type: 'scatter',
      mode: 'none',
      fill: 'tozeroy',
      fillcolor: 'rgba(0,0,255,0.33)',
      name: ''
    }
    
    let colors = [
      'rgba(0,0,255,0.33)',
      'rgba(0,0,255,0.33)',
      'rgba(0,0,255,0.33)',
      'rgba(255,0,0,0.33)',
      'rgba(255,0,0,0.33)',
      'rgba(255,0,0,0.33)',
    ];


    let x = select_unpack(rows, 'weekday_name', 'Monday', 'hour')

    data = [];
    weekdays.forEach((day, j) => {
      traces = new Array(6);
      yByLayers = devideByLayers(select_unpack(rows, 'weekday_name', day, column), max / 3);

      for (let i = 0; i < yByLayers.length; i++) {
        traces[i] = _.clone(defaultTrace);
        traces[i].fillcolor = colors[i];
        traces[i].y = yByLayers[i];
        traces[i].x = x;
        traces[i].yaxis = 'y' + (j + 1);
        traces[i].xaxis = 'x';
        data.push(traces[i]);
      }
    });
    Plotly.newPlot(divId, data, layout);
  }
  let divId = 'weekdays-orders-hours-horizon-amount';
  perform_horizon('amount_diff', 'weekdays-orders-hours-horizon-amount');
  perform_horizon('count_diff', 'weekdays-orders-hours-horizon-count');
});
