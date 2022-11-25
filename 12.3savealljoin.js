// Load a primary collection: Landsat imagery.
var primary = ee.ImageCollection('LANDSAT/LC08/C02/T1_TOA')
    .filterDate('2014-04-01', '2014-06-01')
    .filterBounds(ee.Geometry.Point(-122.092, 37.42));

// Load a secondary collection: MODIS imagery.
var modSecondary = ee.ImageCollection('MODIS/006/MOD09GA')
    .filterDate('2014-03-01', '2014-07-01');

// Define an allowable time difference: two days in milliseconds.
var twoDaysMillis = 2 * 24 * 60 * 60 * 1000;

// Create a time filter to define a match as overlapping timestamps.
var timeFilter = ee.Filter.or(
  ee.Filter.maxDifference({
    difference: twoDaysMillis,
    leftField: 'system:time_start',
    rightField: 'system:time_end'
  }),
  ee.Filter.maxDifference({
    difference: twoDaysMillis,
    leftField: 'system:time_end',
    rightField: 'system:time_start'
  })
);

// Define the join.
var saveAllJoin = ee.Join.saveAll({
  matchesKey: 'terra',
  ordering: 'system:time_start',
  ascending: true
});

// Apply the join.
var landsatModis = saveAllJoin.apply(primary, modSecondary, timeFilter);

// Display the result.
print('Join.saveAll:', landsatModis);