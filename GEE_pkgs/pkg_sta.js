var pkgs = {};

pkgs.Mean = function(image, geometry, scale){
  var image_sta = image.reduceRegion({
    reducer: ee.Reducer.mean(),
    geometry: geometry,
    scale: scale , 
    crs: 'EPSG:4326', 
});
return image_sta  
}

pkgs.Median = function(image, geometry, scale){
  var image_sta = image.reduceRegion({
    reducer: ee.Reducer.median(),
    geometry: geometry,
    scale: scale , 
    crs: 'EPSG:4326', 
});
return image_sta  
}
exports = pkgs;
