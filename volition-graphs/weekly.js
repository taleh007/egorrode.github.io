function unpack(rows, key) {
  return rows.map(function(row) { return row[key]; });
};

Plotly.d3.csv('weekly_data.csv', function(err, rows){
  var data = [
    {
      y: unpack(rows, 'week_orders_count'),
      x: unpack(rows, 'date'),
      type: "scatter",
      name: "количество",
    }, {
      y: unpack(rows, 'week_promotions_count'),
      x: unpack(rows, 'date'),
      type: "scatter",
      name: "с промокодами",
      yaxis: "y2",
    }
  ];

  var layout = {
    title: 'Заказы по неделям',
    width: 900,
    height: 600,
    yaxis: {
      title: 'количество'
    },
    yaxis2: {
      title: 'с промокодами',
      overlaying: 'y',
      side: 'right',
      showgrid: false,
      range: [-20, 80]
    },
  };

  Plotly.newPlot('weekly-data', data, layout);
});
