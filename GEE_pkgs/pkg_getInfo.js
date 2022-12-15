var pkgs = {};

pkgs.getResolution = function(image){
  return image.projection().nominalScale()
}


exports = pkgs;