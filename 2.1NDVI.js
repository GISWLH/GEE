// Load an image.
var geometry = 
    /* color: #d63000 */
    /* shown: false */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-122.97490136533187, 37.93397292384871],
          [-122.97490136533187, 36.943920818115146],
          [-121.48076074033187, 36.943920818115146],
          [-121.48076074033187, 37.93397292384871]]], null, false);
var image = ee.Image('LANDSAT/LC08/C01/T1_TOA/LC08_044034_20140318');
print("image", image);

// Define the visualization parameters.
var vizParams = {
  bands: ['B5', 'B4', 'B3'],
  min: 0,
  max: 0.5,
  gamma: [0.95, 1.1, 1]
};

// Center the map and display the image.
Map.setCenter(-122.1899, 37.5010, 8); // San Francisco Bay
Map.addLayer(image, vizParams, 'false color composite');

/*var geometry = ee.Geometry.Rectangle([-122.099, 37.247, -122.634, 37.599]);*/
var image = image.clip(geometry)
// compute ndvi
// defien the visualizaiton parameters
var visParam_NDVI = {
 min: -0.2,
 max: 1,
 palette: 'FFFFFF, CE7E45, DF923D, F1B555, FCD163, 99B718, 74A901, 66A000, 529400,' +
   '3E8601, 207401, 056201, 004C00, 023B01, 012E01, 011D01, 011301'
};

var imgNDVI = image.normalizedDifference(["B5", "B4"]).rename("imgNDVI")
                  .set("system:time_start", image.get("system:time_start"))
//                  .set("cloud_cover", image.get("CLOUD_COVER"))


Map.addLayer(imgNDVI, visParam_NDVI,'image NDVI');
print("imgNDVI", imgNDVI);

var imgMNDWI = image.normalizedDifference(["B3", "B6"]);
Map.addLayer(imgMNDWI, {min:0, max:1, palette:['#000000', '0000FF']},'image MNDWI');
Map.addLayer(imgMNDWI.selfMask(), {palette:['0000FF']},'image MNDWI2');

var waterMask = imgMNDWI.gte(0);
Map.addLayer(waterMask.selfMask(), {'palette':'red'}, 'waterMask');

// Compute the EVI using an expression.
var evi = image.expression(
    '2.5 * ((NIR - RED) / (NIR + 6 * RED - 7.5 * BLUE + 1))', {
      'NIR': image.select('B5'),
      'RED': image.select('B4'),
      'BLUE': image.select('B2')
});

Map.addLayer(evi, {min:-1, max:1, palette:['FF0000', '00FF00']}, 'EVI');

function EVI_Calculate(img) {
  // .multiply(0.0001) 
 var blue = img.select("B2").multiply(0.0001);
 var red = img.select("B4").multiply(0.0001);
 var nir = img.select("B5").multiply(0.0001);
 var evi = img.expression(
   '2.5 * ((B8 - B3) / (B8 + 6 * B3 - 7.5 * B2 + 1))',
   {
     "B2": blue,
     "B3": red,
     "B8": nir
   }
 ).rename('EVI');
 return evi;
}


