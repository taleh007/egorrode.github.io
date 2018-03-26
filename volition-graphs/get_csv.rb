state_orders = Spree::Order.complete.includes(bill_address: :state).map do |order|
  {
    state_id: order.bill_address.state_id,
    amount: order.total
  }
end.inject({}) do |hash, order|
  unless hash[order[:state_id]]
    state = Spree::State.find(order[:state_id])
    hash[order[:state_id]] = { amount: 0, count: 0, text: state.name, abbr: state.abbr }
  end
  hash[order[:state_id]][:amount] += order[:amount]
  hash[order[:state_id]][:count] += 1
  hash
end.map do |key,val|
  val[:average_order_amount] = val[:amount] / val[:count]
  [key,val]
end.sort_by(&:first);

CSV.open("/tmp/unpopular-orders.csv", "wb") do |csv|
  csv << %w/state_id abbr text amount count average_order_amount/
  parsed_orders.each do |key, value|
    unless ['CA', 'NY', 'TX'].include?(value[:abbr])
      csv << %W/#{key} #{value[:abbr]} #{value[:text]} #{value[:amount]} #{value[:count]} #{value[:average_order_amount]}/
    end
  end
end

def hour_hash
  (0..23).map{ |i| [i, { count: 0, amount: 0 }] }.to_h
end

weekdays_orders = Spree::Order.complete.inject({}) do |hash, order|
  unless order.id == 130
    weekday = order.completed_at.wday
    hash['middle'] ||= { weekday_name: order.completed_at.strftime('%A'), count: 0, amount: 0, count_by_hour: hour_hash } 
    hash[weekday] ||= { weekday_name: order.completed_at.strftime('%A'), count: 0, amount: 0, count_by_hour: hour_hash }
    
    hash[weekday][:count] += 1
    hash['middle'][:count] += 1
    hash[weekday][:count_by_hour][order.completed_at.hour][:count] += 1
    hash['middle'][:count_by_hour][order.completed_at.hour][:count] += 1
    hash[weekday][:amount] += order.total
    hash['middle'][:amount] += order.total
    hash[weekday][:count_by_hour][order.completed_at.hour][:amount] += order.total
    hash['middle'][:count_by_hour][order.completed_at.hour][:amount] += order.total
  end
  
  hash
end;

weekdays_orders['middle'][:count] /= 7;
weekdays_orders['middle'][:amount] /= 7;
weekdays_orders['middle'][:count_by_hour] = weekdays_orders['middle'][:count_by_hour].map{|k,v| [k, {count: v[:count]/7, amount: v[:amount]/7}]}.to_h;

(0..6).each do |i|
  weekdays_orders[i][:count_by_hour] = weekdays_orders[i][:count_by_hour].map do |hour, data|
    middle_hour = weekdays_orders['middle'][:count_by_hour][hour]
    data[:count_diff] = data[:count] - middle_hour[:count]
    data[:amount_diff] = data[:amount] - middle_hour[:amount]
    [hour, data]
  end.to_h
end;

CSV.open("/tmp/weekdays-orders.csv", "wb") do |csv|
  csv << %w/weekday_name hour count amount count_diff amount_diff/
  weekdays_orders.each do |key, value|
    csv << %W/#{value[:weekday_name]} #{value[:amount]} #{value[:count]}/
  end  
end

CSV.open("/tmp/weekdays-orders-hours.csv", "wb") do |csv|
  csv << %w/weekday_id weekday_name hour count amount/
  weekdays_orders.each do |weekday_id, weekday_value|
    weekday_value[:count_by_hour].each do |hour, hour_value|
      csv << %W/#{weekday_id} #{weekday_value[:weekday_name]} #{hour} #{hour_value[:count]} #{hour_value[:amount]} #{hour_value[:count_diff]} #{hour_value[:amount_diff]}/
    end
  end
end
