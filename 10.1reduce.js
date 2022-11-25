// list
var list1 = ee.List.sequence(1,10);
var listmean = list1.reduce(ee.Reducer.mean());
print("listmean", listmean);

var listminmax = list1.reduce(ee.Reducer.minMax());
print("listminmax", listminmax);

var listsum = list1.reduce(ee.Reducer.sum());
print("listsum", listsum);

// ImageCollection
var roi = /* color: #98ff00 */ee.Geometry.Polygon(  
        [[[114.62959747314449, 33.357067677774594],  
          [114.63097076416011, 33.32896028884253],  
          [114.68315582275386, 33.33125510961763],  
          [114.68178253173824, 33.359361757948754]]]);  
Map.centerObject(roi, 10);  
Map.setOptions("SATELLITE");  //set SATELLITE basemap
var l8Col = ee.ImageCollection("LANDSAT/LC08/C01/T1_TOA")  //Note:TOA!!!
              .filterBounds(roi)  
              .filterDate("2018-1-1", "2019-1-1")  
              .map(ee.Algorithms.Landsat.simpleCloudScore)//add cloud property
              .map(function(image) {  //select cloud <= 20
                return image.updateMask(image.select("cloud").lte(20));  
              })  
              .map(function(image) {  // add NDVI band
                var ndvi = image.normalizedDifference(["B5", "B4"]).rename("NDVI");  
                return image.addBands(ndvi);  
              })  
              .select("NDVI");  
print(l8Col);
var img = l8Col.reduce(ee.Reducer.mean());   // or var img = l8Col.mean();  
var img90 = l8Col.reduce(ee.Reducer.percentile([90]));
var visParam_NDVI = {
 min: -0.2,
 max: 1,
 palette: 'FFFFFF, CE7E45, DF923D, F1B555, FCD163, 99B718, 74A901, 66A000, 529400,' +
   '3E8601, 207401, 056201, 004C00, 023B01, 012E01, 011D01, 011301'
};
Map.addLayer(img90.clip(roi), visParam_NDVI, "NDVI90"); 
Map.addLayer(img.clip(roi), visParam_NDVI, "NDVI"); 
Map.addLayer(roi, {color: "red"}, "roi"); 

// vector
var reduce_combine = countries.reduceColumns({
  reducer:ee.Reducer.min().combine(ee.Reducer.max()),
  selectors: ['POP_RANK', 'POP_RANK']
});
print(reduce_combine, 'combine')

var reduce_repeat = countries.reduceColumns({
  reducer: ee.Reducer.max().repeat(2),
  selectors: ['POP_EST ','POP_RANK'],
});
print(reduce_repeat, 'repeat')