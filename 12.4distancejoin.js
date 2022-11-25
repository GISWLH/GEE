// Load a primary collection: protected areas (Yosemite National Park).
var primary = ee.FeatureCollection("WCMC/WDPA/current/polygons")
  .filter(ee.Filter.eq('NAME', 'Yosemite National Park'));

// Load a secondary collection: power plants.
var powerPlants = ee.FeatureCollection('WRI/GPPD/power_plants');

// Define a spatial filter, with distance 100 km.
var distFilter = ee.Filter.withinDistance({
  distance: 100000,
  leftField: '.geo',
  rightField: '.geo',
  maxError: 10
});

// Define a saveAll join.
var distSaveAll = ee.Join.saveAll({
  matchesKey: 'points',
  measureKey: 'distance'
});

// Apply the join.
var spatialJoined = distSaveAll.apply(primary, powerPlants, distFilter);
var result = ee.FeatureCollection(ee.List(spatialJoined.first().get('points')));
// Print the result.
print(spatialJoined);
Map.addLayer(primary, {}, 'primary')
Map.addLayer(powerPlants, {}, 'powerPlants')
print(result)
Map.addLayer(result, {}, 'Joined')