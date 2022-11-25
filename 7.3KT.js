// Define an Array of Tasseled Cap coefficients.
 
var coefficients = ee.Array([  
  [0.3037, 0.2793, 0.4743, 0.5585, 0.5082, 0.1863],  
  [-0.2848, -0.2435, -0.5436, 0.7243, 0.0840, -0.1800],  
  [0.1509, 0.1973, 0.3279, 0.3406, -0.7112, -0.4572]
]);  
//image to array
var image = ee.Image("LANDSAT/LT05/C01/T1_TOA/LT05_044034_20081011")   
              .select(['B1', 'B2', 'B3', 'B4', 'B5', 'B7']);  
 
              
var arrayImage1D = image.toArray();  
//print("arrayImage1D",arrayImage1D)
Map.addLayer(arrayImage1D,{},"arrayImage1D")
 
 
var arrayImage2D = arrayImage1D.toArray(1);  
//print("arrayImage2D",arrayImage2D)
Map.addLayer(arrayImage2D,{},"arrayImage2D")
 
 
//Transform
var componentsImage = ee.Image(coefficients)   
                        .matrixMultiply(arrayImage2D)   
                        .arrayProject([0])   
                        .arrayFlatten([[  
                          'brightness', 'greenness', 'wetness' 
                        ]]);  
var vizParams = {  
  "bands": ['brightness', 'greenness', 'wetness'],  
  "min": -0.1,   
  "max": [0.5, 0.1, 0.1]  
};  
Map.centerObject(image, 7);  
Map.addLayer(componentsImage, vizParams, "componentsImage"); 
print("componentsImage",componentsImage)
 