var roi = ee.FeatureCollection("projects/ee-wang/assets/jiangsu");
var year_list = ee.List.sequence(2000, 2019)
var kndvi = function(num){
      var time = ee.Date.fromYMD(ee.Number(num), ee.Number(1), ee.Number(1));
      var year_image = ee.ImageCollection('MODIS/006/MOD13A1').filterDate(time, ee.Date(time).advance(ee.Number(1),'year')).max();
      var year_ndvi = year_image.select('NDVI');
      var year_ndvi = year_ndvi.addBands(ee.Image.constant(ee.Number(num)).toFloat()).clip(roi);
      return year_ndvi;
    };

var year_list = year_list.map(kndvi);
var img_collection = ee.ImageCollection.fromImages(year_list);
var linearFit = img_collection.select(['constant', 'NDVI']).reduce(ee.Reducer.linearFit());
var k = linearFit.select('scale');
var b = linearFit.select('offset')

var trendVis = {
 min: -100,
 max: 100,
 palette: 'FFFFFF, CE7E45, DF923D, F1B555, FCD163, 99B718, 74A901, 66A000, 529400,' +
   '3E8601, 207401, 056201, 004C00, 023B01, 012E01, 011D01, 011301'
};
Map.centerObject(roi.geometry());
Map.addLayer(k, trendVis, 'k');
Map