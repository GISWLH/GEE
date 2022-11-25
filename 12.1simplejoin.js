// Landsat in a day for sentinel 
var L8 = ee.ImageCollection('LANDSAT/LC08/C01/T1_TOA')
        .filterBounds(ee.Geometry.Point(-122.44, 37.78))
        .filterDate('2018-01-01','2018-12-31');
var Sentinel = ee.ImageCollection("COPERNICUS/S2")
        .filterBounds(ee.Geometry.Point(-122.44, 37.78))
        .filterDate('2018-01-01','2018-12-31');
// A day
var A_day = 1*24*60*60*1000
// maxDifference
var L8_join_Sentinel = ee.Filter.maxDifference({
    difference: A_day,
    leftField: 'system:time_start',
    rightField: 'system:time_start'
  })
// simpleJoin
// Join.apply (primary, secondary, condition)
var Join = ee.Join.simple();
var Joined_image = Join.apply(L8, Sentinel, L8_join_Sentinel);

print('Lansat8: ', L8);
print('Sentinel: ', Sentinel);
print('join_image: ', Joined_image);