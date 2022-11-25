// Make a date filter to get images in this date range.
var dateFilter = ee.Filter.date('2014-01-01', '2014-02-01');

// Load a MODIS collection with EVI data.
var mcd43a4 = ee.ImageCollection('MODIS/MCD43A4_006_EVI')
    .filter(dateFilter);

// Load a MODIS collection with quality data.
var mcd43a2 = ee.ImageCollection('MODIS/006/MCD43A2')
    .filter(dateFilter);

// Define an inner join.
var innerJoin = ee.Join.inner();

// Specify an equals filter for image timestamps.
var filterTimeEq = ee.Filter.equals({
  leftField: 'system:time_start',
  rightField: 'system:time_start'
});

// Apply the join.
var innerJoinedMODIS = innerJoin.apply(mcd43a4, mcd43a2, filterTimeEq);

// Display the join result: a FeatureCollection.
print('Inner join output:', innerJoinedMODIS);

// To a single image
var joinedMODIS = innerJoinedMODIS.map(function(feature) {
  return ee.Image.cat(feature.get('primary'), feature.get('secondary'));
});

// Display the join result: a Imagecollection.
print('Inner join, merged bands:', joinedMODIS);