// Create an ee.Geometry.
var polygon =  ee.Geometry.Polygon(
        [[[70, 15],
          [140, 15],
          [140, 55],
          [70, 55]]]);
print(polygon);
Map.centerObject(polygon)
Map.addLayer(polygon)
// Create a Feature from the Geometry.
var polyFeature = ee.Feature(polygon, {name: "region_of_china", areas: polygon.area()});
print(polyFeature, 'featrue no attr');

// set some new properties
var polyFeature = polyFeature.set("centroid", polygon.centroid())
                 .set("bounds", polygon.bounds());

print(polyFeature, 'feature have attr');
Map.addLayer(polyFeature, {color: 'red'}, 'polyFeature');


          
          
          