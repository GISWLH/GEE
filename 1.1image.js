// load image through image ID
var loadedImage = ee.Image('JAXA/ALOS/AW3D30/V2_2');
print("loadedImage:",loadedImage);

// load image through ImageCollection 
function maskS2clouds(image) {
  var qa = image.select('QA60');

  // Bits 10 and 11 are clouds and cirrus, respectively.
  var cloudBitMask = 1 << 10;
  var cirrusBitMask = 1 << 11;

  // Both flags should be set to zero, indicating clear conditions.
  var mask = qa.bitwiseAnd(cloudBitMask).eq(0)
      .and(qa.bitwiseAnd(cirrusBitMask).eq(0));

  return image.updateMask(mask).divide(10000);
}

var dataset = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
                  .filterDate('2020-01-01', '2020-01-30')
                  // Pre-filter to get less cloudy granules.
                  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',20))
                  .map(maskS2clouds);

var visualization = {
  min: 0.0,
  max: 0.3,
  bands: ['B4', 'B3', 'B2'],
};

Map.setCenter(83.277, 17.7009, 12);

Map.addLayer(dataset.mean(), visualization, 'RGB')
// Create a constant image.
var image1 = ee.Image(1);
print(image1);

// Concatenate two images into one multi-band image.
var image2 = ee.Image(2);
var image3 = ee.Image.cat([image1, image2]);
print(image3)