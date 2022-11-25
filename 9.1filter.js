// vector
Map.addLayer(china, {}, 'china')
Map.centerObject(china, 4)
var beijing = china.filter(ee.Filter.eq('name','beijing'));
Map.addLayer(beijing, {'color':'red'}, 'beijing')
var big5 = counrties.filter(ee.Filter.gt('GDP_MD_EST', 1929000)); // 删除
Map.addLayer(big5, {'color':'green'}, 'countries5')
// list
var list1 = ee.List.sequence(1,10);
var list2 = list1.filter(ee.Filter.gt('item',5)).filter(ee.Filter.lte('item',7));
print("list2",list2);

var list3 = list1.map(function(item){
  var this_item = ee.Number(item);
  return ee.Algorithms.If(this_item.gt(5).and(this_item.lte(7)),item,0);
}).removeAll([0]);
print('list3', list3);

// image
var S2SRCol = ee.ImageCollection('COPERNICUS/S2_SR')
                .filterBounds(beijing)
                .filter(ee.Filter.calendarRange(2018,2020,'year'))
                .filter(ee.Filter.calendarRange(1,1,'month'));
print("S2SRCol",S2SRCol);