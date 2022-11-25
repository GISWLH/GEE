// Load a Landsat 8 image, select the bands of interest.
var image = ee.Image('LANDSAT/LC08/C02/T1_TOA/LC08_044034_20140318')
  .select(['B2', 'B3', 'B4', 'B5', 'B6', 'B7']);
print('image', image)

// Make an Array Image, with a 1-D Array per pixel.
var arrayImage1D = image.toArray(); // 1 * 6
print('arrayImage1D', arrayImage1D)

// Make an Array Image with a 2-D Array per pixel, 6x1.
var arrayImage2D = arrayImage1D.toArray(1); // 6 * 1
print('arrayImage2D', arrayImage2D)