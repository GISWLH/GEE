// load image through image ID
var loadedImage = ee.Image('JAXA/ALOS/AW3D30/V2_2');
print(loadedImage, 'image1');

// load image through ImageCollection 
var era5_2mt = ee.ImageCollection('ECMWF/ERA5/DAILY')
                   .select('mean_2m_air_temperature')
                   .filter(ee.Filter.date('2019-07-01', '2019-07-31'));
                   
                   
var vis2mt = {
  min: 250,
  max: 320,
  palette: [
    '#000080', '#0000D9', '#4000FF', '#8000FF', '#0080FF', '#00FFFF', '#00FF80',
    '#80FF00', '#DAFF00', '#FFFF00', '#FFF500', '#FFDA00', '#FFB000', '#FFA400',
    '#FF4F00', '#FF2500', '#FF0A00', '#FF00FF'
  ]
};
Map.setCenter(83.277, 17.7009, 12);

Map.addLayer(era5_2mt.filter(ee.Filter.date('2019-07-15')), vis2mt,  'Daily mean 2m air temperature');
// Create a constant image.
var image1 = ee.Image(1);
print(image1);

// Concatenate two images into one multi-band image.
var image2 = ee.Image(2);
var image3 = ee.Image.cat([image1, image2]);
print(image3)