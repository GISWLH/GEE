// This lesson talked about list/map/for
var maskcloud = function(image) {
  var qa = image.select('BQA');
  var mask = qa.bitwiseAnd(1 << 4)
            .or(qa.bitwiseAnd(1 << 8));
  return image.updateMask(mask.not());
};

var ndvi = function(image){
      var ndvi = image.normalizedDifference(['B5','B4']).rename('NDVI');
      return ndvi
    };

var pro = function(image){
  var newimg = image.reproject({
    crs: 'EPSG:4326',
    scale: 5500
  })
  return newimg
};

var roi = ee.Geometry.Polygon(
        [[[70, 15],
          [70, 55],
          [140, 55],
          [140, 15]]]);

var time = ee.List.sequence(2013,2020)
var imgMonth = time.map(function(num){
  var year = ee.Number(num).format("%04d").cat("-01-01")
  var image = ee.ImageCollection("LANDSAT/LC08/C01/T1_RT_TOA")
    .filterBounds(roi)
    .filterDate(year,ee.Date(year).advance(1,"year"))
    .map(maskcloud)
    .map(ndvi)
    .mean()
    .clip(roi)
    return image
  })

var img = ee.ImageCollection(imgMonth).map(pro)

var visParam_NDVI = {
 min: -0.2,
 max: 1,
 palette: 'FFFFFF, CE7E45, DF923D, F1B555, FCD163, 99B718, 74A901, 66A000, 529400,' +
   '3E8601, 207401, 056201, 004C00, 023B01, 012E01, 011D01, 011301'
};

print(img.first(), 'ndvi_year_mean')
Map.addLayer(img.mean(), visParam_NDVI, 'NDVImean')