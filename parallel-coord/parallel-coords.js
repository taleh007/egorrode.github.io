function unpack(rows, key) {
  return rows.map(function(row) {
    return row[key];
  });
}

function unpack_groups(points) {
  return points.map(function(point) {
    return (point.group);
  });
}

function perform(coordNames, points, minMax, isGrouped, containerId, title) {
  let trace = {
    type: 'parcoords',
    line: {
      color: (isGrouped ? unpack(points, 'group') : 1),
      autocolorscale: true, // colorscale: [[1.0, 'rgba(200,0,0,0.5)'], [2.0, 'rgba(0,200,0,0.5)'], [3.0, 'rgba(0,0,200,0.5)'], [4.0, 'rgba(0,200,200,0.5)']],
      cmin: 1.0,
      cmax: 4.0
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
    height: 900,
    title: title
  }

  Plotly.plot(containerId, myData, layout);
}

function perform_with(filename, containerId, isGrouped) {
  d3.json(filename, function (data) {
    var coordNames = data.var;
    var points = data.points;
    var minMax = data.minMax;
    var title = data.title;
    perform(coordNames, points, minMax, isGrouped, containerId, title);
  });
}

perform_with('not_normalized.json', 'not-normalized-graph', false);
perform_with('normalized.json', 'normalized-graph', true);

