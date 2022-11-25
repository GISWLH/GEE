var china = ee.FeatureCollection("projects/ee-wang/assets/china");
var roi = china.filter(ee.Filter.eq('name','beijing'))
// define the unitScale function
function imgUnitScale(img, region){
  // var imgBandName = img.bandNames();
  var minMax = img.reduceRegion({
    reducer: ee.Reducer.minMax(),
    geometry: ee.FeatureCollection(region).geometry(),
    scale: 500,
    tileScale:16
  });
  var dicKeys = minMax.keys();
  var dicValues = ee.List(minMax.values(dicKeys));
  var imgMin = ee.Number(dicValues.get(1));
  var imgMax = ee.Number(dicValues.get(0));

  return img.unitScale(imgMin, imgMax);
}

var visParam1 = {
min: 0,
max: 1000,
palette: 'FFFFFF, CE7E45, DF923D, F1B555, FCD163, 99B718, 74A901, 66A000, 529400,' +
  '3E8601, 207401, 056201, 004C00, 023B01, 012E01, 011D01, 011301'
};

var visParam2 = {
min: 0,
max: 1,
palette: 'FFFFFF, CE7E45, DF923D, F1B555, FCD163, 99B718, 74A901, 66A000, 529400,' +
  '3E8601, 207401, 056201, 004C00, 023B01, 012E01, 011D01, 011301'
};

// input srtm
var srtm = ee.Image("USGS/SRTMGL1_003"); 
// dem
var dem = ee.Image(srtm).clip(roi);
srtm = null;
var demScale = imgUnitScale(dem, roi).rename("dem");
// dem =null;
Map.centerObject(roi,8)
Map.addLayer(dem, visParam1, 'dem');
Map.addLayer(demScale, visParam2,"demScale", false);