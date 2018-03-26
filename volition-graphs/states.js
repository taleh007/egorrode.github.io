function unpack(rows, key) {
  return rows.map(function(row) { return row[key]; });
}

var perform_by_states = function (filename, z_column, zmax, title, divId) {
  Plotly.d3.csv(filename, function(err, rows){

    var data = [{
      type: 'choropleth',
      locationmode: 'USA-states',
      locations: unpack(rows, 'abbr'),
      z: unpack(rows, z_column),
      zmin: (z_column == 'average_order_amount' ?  55 : 0),
      zmax: zmax,
      text: unpack(rows, 'text'),
      colorscale: [
        [0, '#fff'], [0.1, '#feeb65'], [0.5, '#e4521b'], [0.9, '#4d342f'], [1, '#000']
      ],
      colorbar: {
        title: '',
        thickness: 0.2
      },
      marker: {
        line:{
          color: 'rgb(217,217,217)',
          width: 2
        }
      }
    }];


    var layout = {
      title: title,
      width: 1000,
      geo:{
        scope: 'usa',
        showlakes: false
      }
    };
    
    Plotly.plot(divId, data, layout, {showLink: false});
  })
};

perform_by_states('orders.csv', 'amount', 130000, 'Order total, US $', 'heat-map-total')
perform_by_states('unpopular-orders.csv', 'amount', 35000, 'Order total in unpopular states, US $', 'heat-map-total-unpopular')
perform_by_states('orders.csv', 'count', 1600, 'Order count', 'heat-map-count')
perform_by_states('unpopular-orders.csv', 'count', 500, 'Order count in unpopular states', 'heat-map-count-unpopular')
perform_by_states('orders.csv', 'average_order_amount', 105, 'Order average, US $ / order', 'heat-map-average')
