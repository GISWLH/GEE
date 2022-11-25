var geo1 = 
    /* color: #d63000 */
    /* shown: false */
    ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Point([-89.45382958784516, 39.77125924554537]),
            {
              "type": 1,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Point([-89.59356194868501, 39.73404219299725]),
            {
              "type": 1,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Point([-89.3789852274936, 39.74935376962035]),
            {
              "type": 1,
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Point([-88.92785912886079, 39.81874115274924]),
            {
              "type": 1,
              "system:index": "3"
            }),
        ee.Feature(
            ee.Geometry.Point([-89.47265792352596, 39.643868093114435]),
            {
              "type": 1,
              "system:index": "4"
            }),
        ee.Feature(
            ee.Geometry.Point([-89.18289351922908, 39.59944015954271]),
            {
              "type": 1,
              "system:index": "5"
            }),
        ee.Feature(
            ee.Geometry.Point([-89.60724044305721, 39.71151294653236]),
            {
              "type": 1,
              "system:index": "6"
            }),
        ee.Feature(
            ee.Geometry.Point([-89.53033614618221, 39.80969125746683]),
            {
              "type": 1,
              "system:index": "7"
            }),
        ee.Feature(
            ee.Geometry.Point([-89.00573897821346, 39.82340395555388]),
            {
              "type": 1,
              "system:index": "8"
            }),
        ee.Feature(
            ee.Geometry.Point([-89.32846236688533, 39.51049874907477]),
            {
              "type": 1,
              "system:index": "9"
            }),
        ee.Feature(
            ee.Geometry.Point([-89.37515426141658, 39.712569371651945]),
            {
              "type": 1,
              "system:index": "10"
            })]),
    geo2 = 
    /* color: #98ff00 */
    /* shown: false */
    ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Point([-89.46716475946346, 39.71573854994028]),
            {
              "type": 2,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Point([-89.39712691766658, 39.69355124432685]),
            {
              "type": 2,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Point([-89.16778731805721, 39.72841380698596]),
            {
              "type": 2,
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Point([-89.21722579461971, 39.71468217335602]),
            {
              "type": 2,
              "system:index": "3"
            }),
        ee.Feature(
            ee.Geometry.Point([-88.92883468133846, 39.611078803595504]),
            {
              "type": 2,
              "system:index": "4"
            }),
        ee.Feature(
            ee.Geometry.Point([-89.02496505243221, 39.5316856181619]),
            {
              "type": 2,
              "system:index": "5"
            }),
        ee.Feature(
            ee.Geometry.Point([-89.51111007196346, 39.52427094916471]),
            {
              "type": 2,
              "system:index": "6"
            }),
        ee.Feature(
            ee.Geometry.Point([-88.89999557001033, 39.71996389448994]),
            {
              "type": 2,
              "system:index": "7"
            }),
        ee.Feature(
            ee.Geometry.Point([-88.76266646844783, 39.81180108140537]),
            {
              "type": 2,
              "system:index": "8"
            }),
        ee.Feature(
            ee.Geometry.Point([-88.95080733758846, 39.80863632121482]),
            {
              "type": 2,
              "system:index": "9"
            }),
        ee.Feature(
            ee.Geometry.Point([-89.63882613641658, 39.7685367490747]),
            {
              "type": 2,
              "system:index": "10"
            })]),
    AOI = 
    /* color: #0b4a8b */
    /* shown: false */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-89.74044967157283, 39.954064448081375],
          [-89.74044967157283, 39.4850659755668],
          [-88.69400191766658, 39.4850659755668],
          [-88.69400191766658, 39.954064448081375]]], null, false);
var roi = AOI;
Map.centerObject(roi,7);
Map.addLayer(roi, {color: "gray"}, "roi"); 


// Function to mask clouds using the Sentinel-2 QA band.
function maskS2clouds(image) {
  var qa = image.select('QA60'); 

  // Bits 10 and 11 are clouds and cirrus, respectively.
  var cloudBitMask = ee.Number(2).pow(10).int();
  var cirrusBitMask = ee.Number(2).pow(11).int();

  // Both flags should be set to zero, indicating clear conditions.
  var mask = qa.bitwiseAnd(cloudBitMask).eq(0).and(
             qa.bitwiseAnd(cirrusBitMask).eq(0));

  // Return the masked and scaled data.
  return image.updateMask(mask).divide(10000)
      .copyProperties(image, ['system:time_start']);
}

// Map the cloud masking function over one year of data
var s2filtered = ee.ImageCollection('COPERNICUS/S2')
                   .filterDate('2016-01-01', '2016-12-31')
                   .filterBounds(roi)
                  // Pre-filter to get less cloudy granules.
                  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
                  .map(maskS2clouds)
                  .select('B.*');

var composite = s2filtered.median().clip(roi);
// Display the results.
Map.addLayer(composite, {bands: ['B3', 'B2', 'B1'], min: 0, max: 0.3}, 'composite', false);

var months = ee.List.sequence(1, 12, 6);
var compositesS2 = months.map(function(m) {
  return s2filtered.filter(ee.Filter.calendarRange({
    start: m, 
    end: ee.Number(m).add(2), 
    field: 'month'
  })).median().clip(roi);
});
// var check = ee.Image(compositesS2.get(0));
// Map.addLayer(check, {}, 'check');

var mergeBands = function(previous, image) {
  return ee.Image(previous).addBands(image);
};

composite = ee.Image(compositesS2.iterate(mergeBands, ee.Image([])));
print(composite, 'composite')

// Load the CDL image for 2016.  This is the training data.
var cdl = ee.ImageCollection("USDA/NASS/CDL")
var cdl2016 = ee.Image(cdl.filterDate('2016-01-01', '2016-12-13').first()).clip(roi);

// We only want the first few crop types.
cdl2016 = cdl2016.select('cropland');
cdl2016 = cdl2016.updateMask(cdl2016.lte(5));
Map.addLayer(cdl2016, {}, 'cdl2016');

// Take a stratified sample.
var sample = cdl2016.addBands(composite).stratifiedSample({
  numPoints: 300, 
  classBand: 'cropland', 
  region: roi, 
  scale: 30, 
  seed: 1,
  tileScale: 16
});
print("sample",sample.first());

// Partition the training.
sample = sample.randomColumn({ seed: 1 });

var training = sample.filter(ee.Filter.lt('random', 0.7));
var validation = sample.filter(ee.Filter.gte('random', 0.7));

var classifier = ee.Classifier.smileRandomForest(40)
    .train({
      features: training, 
      classProperty: 'cropland', 
      inputProperties: composite.bandNames()
    });

var classified = composite.classify(classifier).clip(roi);
Map.addLayer(classified.randomVisualizer(), null, 'classified');

var trainAccuracy = classifier.confusionMatrix().accuracy();
// print('trainAccuracy', trainAccuracy); // 0.9701408450704225
// After parameter tuning.
// print('trainAccuracy', trainAccuracy); // 0.9923534409515717
// After adding multitemporal data:
print('trainAccuracy', trainAccuracy); // 0.9968418030433535

var testAccuracy = validation
    .classify(classifier)
    .errorMatrix('cropland', 'classification')
    .accuracy();
// print('testAccuracy', testAccuracy); // 0.8068965517241379
// After parameter tuning:
// print('testAccuracy', testAccuracy); // 0.8373042886317222
// After adding multitemporal data:
print('testAccuracy', testAccuracy); // 0.918918918918919

// // Parameter tuning.
// var numTrees = ee.List.sequence(5, 50, 5);

// var accuracies = numTrees.map(function(t) {
//   var classifier = ee.Classifier.smileRandomForest(t)
//     .train({
//       features: training, 
//       classProperty: 'cropland', 
//       inputProperties: composite.bandNames()
//     });
//   return validation
//     .classify(classifier)
//     .errorMatrix('cropland', 'classification')
//     .accuracy();
// });

// print(ui.Chart.array.values({
//   array: ee.Array(accuracies), 
//   axis: 0, 
//   xLabels: numTrees
// })); // OK


var sample1 = geo1.merge(geo2) 
var bands = ee.List(composite.bandNames())
 
var training = composite.select(bands).sampleRegions({
  collection: sample1,
  properties: ['type'],
  scale: 30
});


var sample1 = sample1.randomColumn({ seed: 1 });

var training1 = sample1.filter(ee.Filter.lt('random', 0.7));
var validation1 = sample1.filter(ee.Filter.gte('random', 0.7));

var classifier1 = ee.Classifier.smileRandomForest(40)
    .train({
      features: training, 
      classProperty: 'type', 
      inputProperties: composite.bandNames()
    });
print("sample1",sample1.first());
var classified1 = composite.classify(classifier1).clip(roi);
Map.addLayer(classified1.randomVisualizer(), null, 'classified_own');
