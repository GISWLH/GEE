/***********************************************
Obtain the standard spectral curves of class of interest
In this study, it is the water point
***********************************************/
var water_SampleValue = ee.Array([
  [0.08391415327787399, 
   0.049653347581624985,
   0.027281755581498146,
   0.009903084486722946,
   0.0020137191750109196, 
   0.0012413336662575603],
]);

// compute the STD_SampleValue length
var water_SampleValue = ee.Image(water_SampleValue);
var water_SampleValue_T = water_SampleValue.arrayTranspose(0,1);
var water_SampleValue_length = water_SampleValue.matrixMultiply(water_SampleValue_T);
var water_SampleValue_length = water_SampleValue_length.arrayProject([0])
                                           .arrayFlatten([['Standard']])
                                           .sqrt();
// select the image
var image = ee.Image('LANDSAT/LC08/C02/T1_TOA/LC08_044034_20140318')
              .select(['B2', 'B3', 'B4', 'B5', 'B6', 'B7']);
Map.addLayer(image, {bands: ['B5', 'B4', 'B3'], min: 0, max: 0.5}, 'original image');  

// compute the image length
var arrayImage1D = image.toArray();
var arrayImage2D = arrayImage1D.toArray(1);
var arrayImage2D_2 = arrayImage2D.arrayTranspose(0,1);
var arrayImage2D_3 = arrayImage2D_2.matrixMultiply(arrayImage2D);
var arrayImage2D_3 = arrayImage2D_3.arrayProject([0])
                                   .arrayFlatten([['Img']])
                                   .sqrt();
// compute the SAM
var SAM_Image_1 = ee.Image(water_SampleValue)
                    .matrixMultiply(arrayImage2D)
                    .arrayProject([0])
                    .arrayFlatten(
                      [['SAM']]);
                      
var SAM = SAM_Image_1.divide(arrayImage2D_3).divide(water_SampleValue_length).acos();
// Map.addLayer(SAM);
var th = 0.50;
Map.addLayer(SAM.lte(th).selfMask(), {'palette':['blue']}, 'water');
