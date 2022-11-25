var modis = ee.ImageCollection("MODIS/006/MOD13Q1"),
    testPoint = 
    /* color: #d63000 */
    /* shown: false */
    /* displayProperties: [
      {
        "type": "rectangle"
      },
      {
        "type": "marker"
      }
    ] */
    ee.Geometry({
      "type": "GeometryCollection",
      "geometries": [
        {
          "type": "Polygon",
          "coordinates": [
            [
              [
                5.685058655444055,
                52.76037428383795
              ],
              [
                5.685058655444055,
                52.6746923178835
              ],
              [
                5.821701111498743,
                52.6746923178835
              ],
              [
                5.821701111498743,
                52.76037428383795
              ]
            ]
          ],
          "geodesic": false,
          "evenOdd": true
        },
        {
          "type": "Point",
          "coordinates": [
            5.7433090268107545,
            52.720866237067774
          ]
        }
      ],
      "coordinates": []
    });
// set studyArea
var roi = testPoint;
Map.centerObject(roi, 9);

// set the time stamp
var start_date = '2010-01-01';
var end_date = '2021-01-01'; 

// Add predictors for SG fitting, using date difference
// We prepare for order 3 fitting, but can be adapted to lower order fitting later on
var modis_res = modis.filterDate(start_date, end_date).filterBounds(roi).map(function(img) {
  var dstamp = ee.Date(img.get('system:time_start'));
  var ddiff = dstamp.difference(ee.Date(start_date), 'hour');
  img = img.select(['NDVI', 'EVI']).divide(1e4).set('date', dstamp)
           .clip(roi).set('footprint',roi); // .divide(32768.0)
  return img.addBands(ee.Image(1).toFloat().rename('constant'))
            .addBands(ee.Image(ddiff).toFloat().rename('t'))
            .addBands(ee.Image(ddiff).pow(ee.Image(2)).toFloat().rename('t2'))
            .addBands(ee.Image(ddiff).pow(ee.Image(3)).toFloat().rename('t3'));
});
print("modis_res", modis_res);


Map.addLayer(modis_res.median().select('EVI').clip(roi), {'min':0,'max':0.3,'palette':['black','green']}, 'modis_res');

// Step 2: Set up Savitzky-Golay smoothing
var window_size = 9;
var half_window = (window_size - 1)/2;

// Define the axes of variation in the collection array.
var imageAxis = 0;
var bandAxis = 1;

// Set polynomial order
var order = 3;
var coeffFlattener = [['constant', 'x', 'x2', 'x3']];
var indepSelectors = ['constant', 't', 't2', 't3'];


// Convert the collection to an array.
var array = modis_res.toArray();

// Solve 
function getLocalFit(i) {
  // Get a slice corresponding to the window_size of the SG smoother
  var subarray = array.arraySlice(imageAxis, ee.Number(i).int(), ee.Number(i).add(window_size).int());
  var predictors = subarray.arraySlice(bandAxis, 2, 2 + order + 1);
  var response = subarray.arraySlice(bandAxis, 0, 1); // NDVI
  var coeff = predictors.matrixSolve(response);

  coeff = coeff.arrayProject([0]).arrayFlatten(coeffFlattener);
  return coeff;  
}

// For the remainder, use modis_res as a list of images
modis_res = modis_res.toList(modis_res.size());
var runLength = ee.List.sequence(0, modis_res.size().subtract(window_size));

// Run the SG solver over the series, and return the smoothed image version
var sg_series = runLength.map(function(i) {
  var ref = ee.Image(modis_res.get(ee.Number(i).add(half_window)));
  return getLocalFit(i).multiply(ref.select(indepSelectors))
                       .reduce(ee.Reducer.sum()).copyProperties(ref);
});

print("sg_series",sg_series);
// Part 3: Generate some output

// 3A. Get an example original image and its SG-ed version
var NDVI = (ee.Image(modis_res.get(41)).select('NDVI'));
var NDVIsg = (ee.Image(sg_series.get(41)));  // half-window difference in index
Map.addLayer(NDVI,{min:0,max:0.6},"NDVI");
Map.addLayer(NDVIsg,{min:0,max:0.6},"NDVIsg");


// 3B. Now get a profile for a buffered point. 
// Make sure to place the point in the centre of a homogenous area (reduces noise) 
var pt = ee.Geometry.Point(5.7451,52.725).buffer(500)

// Build a stack for all images in the collection
function stack(i1, i2)
{
  return ee.Image(i1).addBands(ee.Image(i2))
}

var s1orig = modis_res.slice(1).iterate(stack, modis_res.get(0))

var s1sged = sg_series.slice(1).iterate(stack, sg_series.get(0))

// Get samples from both series
var y = ee.Image(s1orig).select(['NDVI(..)*']).reduceRegion(ee.Reducer.mean(), pt,10).values()
var xlabels = ee.Image(s1orig).select(['t(..)*']).reduceRegion(ee.Reducer.first(), pt,10).values()
var smoothy = ee.Image(s1sged).select(['sum(..)*']).reduceRegion(ee.Reducer.mean(), pt,10).values()

// NB: convert to dB (this actually exaggarates differences between raw points and the smooth series somewhat)
// NB2 the first and last half_window values of the smoothy are simply repeated from the start and end values
//y = y.map(function(f) { return ee.Number(f).log10().multiply(10)})
xlabels = xlabels.map(function(f) { return ee.Number(f).divide(24.0*365.25)}).sort()

//smoothy = smoothy.map(function(f) { return ee.Number(f).log10().multiply(10)})

// Chart
var yValues = ee.Array.cat([y, ee.List.repeat(smoothy.get(0), half_window).cat(smoothy).cat(ee.List.repeat(smoothy.get(-1), half_window))], 1);

var chart = ui.Chart.array.values(yValues, 0, xlabels).setSeriesNames(['Raw', 'Smoothed']).setOptions(
  {
    title: 'Savitsky-Golay smoothing (order = ' + order + ', window_size = ' + window_size + ')', 
    hAxis: {title: 'Time (years after ' + start_date + ')'}, vAxis: {title: 'NDVI'},
    legend: null,
    series: { 
      0: { lineWidth: 0},
      1: { lineWidth: 2, pointSize: 0, color: 'red' }}
  })
print(chart)






