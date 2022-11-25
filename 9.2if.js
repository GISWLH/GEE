var china = ee.FeatureCollection("projects/ee-wang/assets/china");
var roi = china.filter(ee.Filter.eq('name', 'beijing'));
// https://zhuanlan.zhihu.com/p/114647380
// sentinel cloud
var maskS2Cloud = function (image) {
    var qa = image.select('QA60');
    var mask = qa.bitwiseAnd(1 << 10)
        .or(qa.bitwiseAnd(1 << 11))
    return image.updateMask(mask.not())
};
// Landsat cloud
var maskLandsatCloud = function (image) {
    var qa = image.select('BQA');
    var mask = qa.bitwiseAnd(1 << 4)
        .or(qa.bitwiseAnd(1 << 8));
    return image.updateMask(mask.not());
};
// Landsat8 bandname
var landsatRe8Band = function (img) {
    return img.select('B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B10')
        .rename('B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7');
}
// Landsat7 bandname
var landsatRe7Band = function (img) {
    return img.select('B1', 'B2', 'B3', 'B4', 'B5', 'B7', 'B6_VCID_1')
        .rename('B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7');
};
// Landsat4,Landsat5 bandname
var landsatRe45Band = function (img) {
    return img.select('B1', 'B2', 'B3', 'B4', 'B5', 'B7', 'B6')
        .rename('B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7');
};
// sentinel2 bandname
var s2ReBand = function (img) {
    return img.select('B2', 'B3', 'B4', 'B8', 'B11', 'B12', 'B9')
        .rename('B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7');
};

var getImg = function (landstr) {
    ImgC = ee.ImageCollection(landstr)
        .filterBounds(roi)
        .filterDate("1986-01-01", "2020-12-30");
    var img_indx = (landstr).slice(11, 12);
    var ImgC = ee.Algorithms.If({
        condition: img_indx == 8,
        trueCase: ImgC.map(maskLandsatCloud).map(landsatRe8Band),
        falseCase: ee.Algorithms.If({
            condition: img_indx == 7,
            trueCase: ImgC.map(maskLandsatCloud).map(landsatRe7Band),
            falseCase: ee.Algorithms.If({
                condition: img_indx == 5 || img_indx == 4,
                trueCase: ImgC.map(maskLandsatCloud).map(landsatRe45Band),
                falseCase: ImgC.map(maskS2Cloud).map(s2ReBand).map(function (img) {
                    return img.divide(10000).set('system:time_start', ee.Date(img.date()).millis());
                })
            })
        })
    });
    return ImgC;
};


var landstr = ['LANDSAT/LC08/C01/T1_RT_TOA',
    'LANDSAT/LE07/C01/T1_RT_TOA',
    'LANDSAT/LT05/C01/T1_TOA',
    'LANDSAT/LT04/C01/T1_TOA',
    'COPERNICUS/S2'];
    
var listImgC_ee = landstr.map(getImg);
print(listImgC_ee, "listImgC_ee")