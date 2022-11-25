var geometry = 
    /* color: #d63000 */
    /* shown: false */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[116.05832971191406, 40.07597832623985],
          [116.05832971191406, 39.727265797371494],
          [116.73398889160156, 39.727265797371494],
          [116.73398889160156, 40.07597832623985]]], null, false);
// Load a landcover image
var dataset = ee.ImageCollection("ESA/WorldCover/v100").first();

var visualization = {
  bands: ['Map'],
};

Map.centerObject(dataset);

Map.addLayer(dataset, visualization, "Landcover");

// Create a geometry representing an export region.
var geometry = ee.Geometry.Rectangle([116.2621, 39.8412, 116.4849, 40.01236]);
Map.centerObject(geometry);
Map.addLayer(geometry, {'color':"red"}, 'geometry');


// Export the image, specifying scale and region.
// single band
Export.image.toDrive({
  image: dataset,
  description: 'imageToDriveExample',
  scale: 10,
  region: geometry
});


// Export the image to an Earth Engine asset.
// multiband

var landsat = ee.Image('LANDSAT/LC08/C01/T1_TOA/LC08_123032_20140515')
  .select(['B4', 'B3', 'B2']);
// Get band 4 from the Landsat image, copy it.
var band4 = landsat.select('B4').rename('b4_mean')
  .addBands(landsat.select('B4').rename('b4_sample'))
  .addBands(landsat.select('B4').rename('b4_max'));



Export.image.toAsset({
  image: band4,
  description: 'imageToAssetExample',
  assetId: 'exampleExport',
  scale: 30,
  region: geometry,
  pyramidingPolicy: {
    'b4_mean': 'mean',
    'b4_sample': 'sample',
    'b4_max': 'max'
  }
});