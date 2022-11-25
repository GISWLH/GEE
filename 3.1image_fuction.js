// This lesson talked about image fuction: first/list/size
// clip image and load vector
// load shp by yourself
// draw the region yourself

var dataset = ee.ImageCollection('NASA/GLDAS/V021/NOAH/G025/T3H')
                  .filter(ee.Filter.date('2010-06-01', '2011-06-02'));
var k = dataset.select('AvgSurfT_inst');
var vis = {
  min: 250.0,
  max: 300.0,
  palette: ['1303ff', '42fff6', 'f3ff40', 'ff5d0f'],
};
    
var roi = ee.Geometry.Polygon(
        [[[112.74, 40.73],
          [121.53, 40.73],
          [121.53, 35.44],
          [112.74, 35.44]]]);
Map.addLayer(roi, {'color':'grey'}, 'StudyArea');
// first image         
var k_first = k.first();
// Map.addLayer(k_first, vis, 'k_first');
print("S2Col_first",k_first);

var k_mean = k.mean().clip(roi);
Map.addLayer(k_mean, vis, 'k_mean');
print("S2Col_mean",k_mean);


var k_size = k.size();
print("ksize",k_size);
