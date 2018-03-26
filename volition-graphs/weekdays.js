function unpack(rows, key) {
  return rows.map(function(row) { return row[key]; });
};

function select_unpack(rows, select_key, select_value, unpack_key) {
  return rows.filter(row => row[select_key] == select_value).map(row => row[unpack_key]);
};

Plotly.d3.csv('weekdays-orders.csv', function(err, rows){
  var data = [
    {
      y: unpack(rows, 'count'),
      x: unpack(rows, 'weekday_name'),
      type: "scatter",
      name: "count",
    },
    {
      y: unpack(rows, 'amount'),
      x: unpack(rows, 'weekday_name'),
      yaxis: 'y2',
      type: "scatter",
      name: "amount",
    }
  ];
  
  var layout = {
    title: 'Orders by weekdays',
    width: 1000,
    yaxis: {
      title: 'count',
      domain: [1000, 1400]
    },
    yaxis2: {
      title: 'amount',
      side: 'right',
      overlaying: 'y',
      domain: ''
    },
  };
  
  Plotly.newPlot('weekdays-orders', data, layout);
  
  Plotly.d3.csv('weekdays-orders-hours.csv', function(err, hours_rows){
    
    var weekdays = unpack(rows, 'weekday_name');
    
    function perform_for_weekdays(div_id, column) {
      traces = [];
      weekdays.forEach(weekday => {
        traces.push({
          y: select_unpack(hours_rows, 'weekday_name', weekday, column),
          x: select_unpack(hours_rows, 'weekday_name', weekday, 'hour'),
          type: "scatter",
          name: weekday
        });
      });

      layout = {
        title: 'Orders ' + column + ' per hour for each weekday',
        width: 1000,
      }

      Plotly.newPlot(div_id, traces, layout);
    };

    perform_for_weekdays('weekdays-orders-hours-count', 'count');
    perform_for_weekdays('weekdays-orders-hours-amount', 'amount');
  
  
  });
});
