function unpack(rows, key) {
  return rows.map(function(row) { 
    return row[key]; 
  });
}

var perform = function(coordNames, points, minMax) {
  let trace = {
    type: 'parcoords',
    line: {
      color: unpack(points, 'group'),
      colorscale: [[1.0, 'red'], [2.0, 'blue'], [3.0, 'yellow'], [4.0, 'green']]
    },
    dimensions: []
  };
  coordNames.forEach(function (name, i, coordNames){
    trace.dimensions.push({
      range: minMax[name],
      label: name,
      values: unpack(points, name)
    });
  });

  let myData = [trace];

  layout = {
    height: 900
  }

  Plotly.plot('graphDiv', myData, layout);
}

d3.json('data.json', function (data) {
  var coordNames = data.var;
  var points = data.points;
  var minMax = data.minMax;
  perform(coordNames, points, minMax);
})

