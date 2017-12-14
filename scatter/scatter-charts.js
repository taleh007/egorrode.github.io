function unpack(rows, key) {
  return rows.map(function(row) {
    return row[key];
  });
}

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
    for (var i = 0; i < devided.length; i++) {
      result[i].push(devided[i]);
    }
  });
  return result;
}

function performHorizon(traceNames, labels, points, title) {
  let layout = {
    height: 800,
    showlegend: false,
    title: title + '(horizon graph)',
    xaxis: {domain: [0, 1]},
    yaxis1: {
      domain: [0, 0.2],
      title: labels[0],
    },
    yaxis2: {
      domain: [0.25, 0.45],
      title: labels[1],
    },
    yaxis3: {
      domain: [0.5, 0.7],
      title: labels[2],
    },
    yaxis4: {
      domain: [0.75, 0.95],
      title: labels[3],
    },
  };
  let defaultTrace = {
    type: 'scatter',
    mode: 'none',
    fill: 'tozeroy',
    fillcolor: 'rgba(0,0,255,0.33)',
    name: ''
  }
  let divId = 'horizonGraph';
  let colors = [
    'rgba(0,0,255,0.33)',
    'rgba(0,0,255,0.33)',
    'rgba(0,0,255,0.33)',
    'rgba(255,0,0,0.33)',
    'rgba(255,0,0,0.33)',
    'rgba(255,0,0,0.33)',
  ];
  var max = 0;

  traceNames.forEach(function(name, i, traceNames){
    if (name == 'esi_san' || name == 'gdpn')
      return;
    current_max = Math.abs(+_.max(points, function(p){return Math.abs(+p[name])})[name]);
    max = (current_max > max ? current_max : max);
  });

  data = [];
  traceNames.forEach(function(name, j, traceNames){
    if (name == 'esi_san' || name == 'gdpn')
      return;
    traces = new Array(6);
    yByLayers = devideByLayers(unpack(points, name), max / 3);
    x = unpack(points, "date");

    for (var i = 0; i < yByLayers.length; i++) {
      traces[i] = _.clone(defaultTrace);
      traces[i].fillcolor = colors[i];
      traces[i].y = yByLayers[i];
      traces[i].x = x;
      traces[i].yaxis = 'y' + (j + 1);
      traces[i].xaxis = 'x';
      data.push(traces[i]);
    }
  });
  Plotly.newPlot("horizonGraphs", data, layout);
}

function performBar(traceNames, labels, points, title) {
  let layout = {
    barmode: 'relative',
    title: title + '(stacked bar graph)'
  };
  let defaultTrace = {
    type: 'bar'
  }
  let divId = 'barGraphDiv';

  perform(traceNames, labels, points, defaultTrace, layout, divId);
}

function performOverlaid(traceNames, labels, points, title) {
  let layout = {
    title: title + '(overlaid graph)'
  };
  let defaultTrace = {
    type: 'scatter',
    fill: 'tozeroy'
  }
  let divId = 'overlaidGraphDiv';

  perform(traceNames, labels, points, defaultTrace, layout, divId);
}

function perform(traceNames, labels, points, defaultTrace, layout, divId) {
  data = [];
  traceNames.forEach(function(name, i, traceNames){
    trace = _.clone(defaultTrace);
    trace.x = unpack(points, 'date');
    trace.y = unpack(points, name);
    trace.name = labels[i];
    if (name == 'gdpn') {
      trace.type = 'scatter';
      trace.fill = 'none';
      trace.yaxis = 'y2';
      trace.line = {color: 'black'};
    }
    if (name == 'esi_san') {
      trace.type = 'scatter';
      trace.fill = 'none';
      trace.mode = 'lines+markers';
      trace.yaxis = 'y3';
      trace.marker = {color: 'black'};
      trace.line = {color: 'black'};
    }

    data.push(trace);
  });

  layout.yaxis = {title: 'index'};
  layout.yaxis2 = {
    title: 'gdp/esa',
    overlaying: 'y',
    side: 'right',
    showgrid: false,
    range: [95.5, 102.2]
  }
  layout.yaxis3 = {
    overlaying: 'y',
    side: 'right',
    showgrid: false,
    ticks: '',
    // attributes: {x: 1.1, y: 1}
    range: [95.5, 102.2]
  }
  layout.legend = {font: {size: 18}};
  layout.font = {size: 22};

  Plotly.newPlot(divId, data, layout);
};


d3.json('data.json', function (data) {
  traceNames = data.names;
  points = data.points;
  labels = data.labels;
  title = data.title;
  colors = data.colors;
  performBar(traceNames, labels, points, title);
  performOverlaid(traceNames, labels, points, title);
  performHorizon(traceNames, labels, points, title);
})
