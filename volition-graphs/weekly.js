function unpack(rows, key) {
  return rows.map(function(row) { return row[key]; });
};

Plotly.d3.csv('weekly_data.csv', function(err, rows){
  var data = [
    {
      y: unpack(rows, 'week_orders_count'),
      x: unpack(rows, 'date'),
      type: "scatter",
      name: "count",
    }, {
      y: unpack(rows, 'week_promotions_count'),
      x: unpack(rows, 'date'),
      type: "scatter",
      name: "promotion usage",
      yaxis: "y2",
    }
  ];

  var layout = {
    title: 'Weekly orders data',
    width: 900,
    height: 600,
    yaxis: {
      title: 'count'
    },
    yaxis2: {
      title: 'promotion usage',
      overlaying: 'y',
      side: 'right',
      showgrid: false,
      range: [-20, 80]
    },
  };

  Plotly.newPlot('weekly-data', data, layout);
});
