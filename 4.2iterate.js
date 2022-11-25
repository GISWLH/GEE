// It is so interesting to apply the iterate function
// var tmp1 = ee.List.sequence(1,10);
var tmp1 = ee.List([1,5,10,20,25,30]);
print("original tmp1:",tmp1);

var accumulativeAdd = function(item, list){
  var previous = ee.Number(ee.List(list).get(-1));
  var added  = ee.Number(item).add(previous);
  return ee.List([list]).add(added);
  
};
var tmp3 = ee.List(tmp1.iterate(accumulativeAdd, ee.List([0]))).flatten().remove(0);
print("Accumalative sum:", tmp3);

// itetate like map
function NDVICompute(image){
  var ndvi = image.normalizedDifference(['B5','B4']).rename('NDVI');
  return image.addBands(ndvi);
}


var time1 = Date.now();
var time = ee.List.sequence(2013,2020)
var filterImg = function(year,first){
  var y = ee.Number(year).format("%04d").cat("-01-01")
  var image = ee.ImageCollection("LANDSAT/LC08/C01/T1_RT_TOA")
    .filterBounds(roi)
    .filterDate(y,ee.Date(y).advance(1,"year"))
    .map(NDVICompute)
    .median()
    .select(["B2","B3","B4","NDVI"],['blue','green','red','NDVI'])
    .clip(roi).setMulti({"system:index":y,'system:time_start':ee.Date(y)})
  return ee.List(first).add(image);
}
var imgMonth = time.iterate(filterImg,ee.List([]))
var imgMonth= ee.ImageCollection.fromImages(imgMonth)

print(imgMonth,"imgMonth_iterate");

var visParam_NDVI = {
 min: -0.2,
 max: 1,
 palette: 'FFFFFF, CE7E45, DF923D, F1B555, FCD163, 99B718, 74A901, 66A000, 529400,' +
   '3E8601, 207401, 056201, 004C00, 023B01, 012E01, 011D01, 011301'
};
Map.addLayer(imgMonth.first().select(["NDVI"]), visParam_NDVI, 'NDVI')
