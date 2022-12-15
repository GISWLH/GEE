var pkgs = {};

pkgs.Last = function(imagecollection){
  var imglist = imagecollection.toList(imagecollection.size())
  var last = imglist.get(-1)
  return ee.Image(last)
}

pkgs.Last2 = function(imagecollection){
  var imglist = imagecollection.toList(imagecollection.size())
  var last = imglist.get(-2)
  return ee.Image(last)
}

exports = pkgs;