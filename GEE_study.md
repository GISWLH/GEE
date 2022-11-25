# Lession Introduction to GEE

![qrcode_for_gh_34ce282d1728_258](https://imagecollection.oss-cn-beijing.aliyuncs.com/img/qrcode_for_gh_34ce282d1728_258.jpg)

## lesson 1 image and introduction

* Register
* GEE platform: code editor/ references/ Datasets
* Code editor

![](https://imagecollection.oss-cn-beijing.aliyuncs.com/img/20220925165931.png)

![](https://imagecollection.oss-cn-beijing.aliyuncs.com/img/20220925170032.png)

https://code.earthengine.google.com/2f7f84d09ef45d4f067563eb7591af7f

API: https://developers.google.cn/earth-engine/apidocs

image: https://developers.google.com/earth-engine/datasets/

* GEE thinking:
  * cloud and local
  * JavaScript/python GEE
  * minimum unit: image

## Lesson 2: image calculation (NDVI, EVI, etc.)

band expression (two ways)

https://code.earthengine.google.com/0ac956c6d42cf7316f896f9e09349d33

![](https://imagecollection.oss-cn-beijing.aliyuncs.com/img/20220928172659.png)



## Lesson 3: imagecollection function

https://code.earthengine.google.com/c33bb91a8a847c9b57fa167b16b41717

* first: Returns the first entry from a given collection.
* mean: Reduces an image collection by calculating the mean of all values at each pixel across the stack of all matching bands. Bands are matched by name.
* median:......

![](https://imagecollection.oss-cn-beijing.aliyuncs.com/img/20220415171141.png)

## Lesson 4: map and list

https://code.earthengine.google.com/709920735c92679abd41719b923d7fad

* List: return value can be different from the initial
  * actually, it can save all kinds of data
* Map: no order or sequence of each item

linearFit: https://code.earthengine.google.com/3ac5b6947b15c3188c40e25c40acd952

![](https://imagecollection.oss-cn-beijing.aliyuncs.com/img/20220928182812.png)


* iterate

**iterate(algorithm, \*first\*)**

Applies a user-supplied function to each element of a collection. The user-supplied function is given two arguments: the current element, and the value returned by the previous call to iterate() or the first argument

<img src="https://imagecollection.oss-cn-beijing.aliyuncs.com/img/%E6%96%B0%E5%BB%BA%20CorelDRAW%202019%20Graphic.png" style="zoom:50%;" />

https://code.earthengine.google.com/89fda1125027c8aee8ce783152a7b08e

## Lesson 5: filter cloud and download image
![](https://imagecollection.oss-cn-beijing.aliyuncs.com/img/20220908111355.png)
|符号	|描述	|运算规则|
|---|---|---|
|<<	|左移|	各二进位全部左移若干位，高位丢弃，低位补0|
|>>	|右移	|各二进位全部右移若干位，对无符号数，高位补0，有符号数，各编译器处理方法不一样，有的补符号位（算术右移），有的补0（逻辑右移）|

bitwiseAnd按位与运算符 (&) 在两个操作数对应的二进位都为 1 时，该位的结果值才为 1，否则为 0。

https://code.earthengine.google.com/87fa46948e5204ff96b54b8f2506b21e

* Download image
  * To google drive
  * Task was done in cloud——Can close computer
  * Drive was not enough for basic documents

https://code.earthengine.google.com/b6ce5b4d7c9b2282cb0823bd010f8378

![](https://imagecollection.oss-cn-beijing.aliyuncs.com/img/20221006190804.png)

https://www.google.cn/intl/zh_cn/drive/

## Lesson 6 **superclassify**

<img src="https://imagecollection.oss-cn-beijing.aliyuncs.com/img/1-s2.0-S0034425721003047-gr2_lrg.jpg" style="zoom: 50%;" />

How to automate timely large-scale mangrove mapping with remote sensing (2021) Lu Y. and Wang L., *Remote Sensing of Environment*

* Image: Multi-character(bands)\No cloud\Long series...
* Feature: Must be FeatureCollection
* Classify: GEE inner method
* Validation:  Accuracy assessment

https://code.earthengine.google.com/fb11fea33ffd87b3035119bfc50bed4f

## Lesson 7 Array

### array 

0 axis , 0-1 axis and 0-2 axis

https://code.earthengine.google.com/5333dfcf9d3d06347aa37687261b42ed

![](https://imagecollection.oss-cn-beijing.aliyuncs.com/img/20221013193916.png)

* Arrays are a flexible data structure, but in exchange for the power they offer, they do not scale as well as other data structures in Earth Engine If the problem can be solved without using arrays, the result will be computed faster and more efficiently
* But if the problem requires a higher dimension model flexible linear algebra, or anything
  else arrays are uniquely suited to, you can use the Array class

![image-20221013194716117](https://imagecollection.oss-cn-beijing.aliyuncs.com/img/image-20221013194716117.png)

### Image Array

Each pixel in Array Image is one independent Array

https://code.earthengine.google.com/4a7e18efff31905a537de8a1b87ef545

![image-20221013180055562](https://imagecollection.oss-cn-beijing.aliyuncs.com/img/image-20221013180055562.png)

### K-T transform

![](https://imagecollection.oss-cn-beijing.aliyuncs.com/img/20221013200026.png)

Six of seven Landsat TM bands are used for the algorithm, generating three levels of information:

- Tasseled Cap Band 1 (brightness, a measurement value for the ground)
- Tasseled Cap Band 2 (greenness, a measured value for the vegetation)
- Tasseled Cap Band 3 (wetness, a measured value for interactions of soil and canopy moisture)

https://code.earthengine.google.com/f077de5c4a70cc1e4e526266a6907d81

## Lesson 8 Spectral Angle Mapper

https://code.earthengine.google.com/a2b13c3123911ba6d261a042ab5572b1

![](https://imagecollection.oss-cn-beijing.aliyuncs.com/img/20221013200521.png)
$$
\theta(x_i,x)=cos^{-1}(\frac{x^Tx_i}{\sqrt{x^Tx_i}\sqrt{x^Tx}})
$$
![](https://imagecollection.oss-cn-beijing.aliyuncs.com/img/20221013200715.png)

PCA

https://code.earthengine.google.com/63757c3038daca51aa333032d412423c

![](https://imagecollection.oss-cn-beijing.aliyuncs.com/img/20221020222906.png)

## Lesson 9 Filter

What is filter?

![image-20221028211126007](https://imagecollection.oss-cn-beijing.aliyuncs.com/img/image-20221028211126007.png)

https://code.earthengine.google.com/9e24279427e3ae263f26a554de68c6cd

Returns a image that have same month but different year?

![image-20221028211318469](https://imagecollection.oss-cn-beijing.aliyuncs.com/img/image-20221028211318469.png)

Now we can do "For", how we do "If"

![image-20221028211607696](https://imagecollection.oss-cn-beijing.aliyuncs.com/img/image-20221028211607696.png)

https://code.earthengine.google.com/90af36f300547f649a0fc11dc2195d49

## Lesson 10 Reduce

https://code.earthengine.google.com/6c99d053bc1801b39db5cf39006b2c39

![image-20221028211849672](https://imagecollection.oss-cn-beijing.aliyuncs.com/img/image-20221028211849672.png)

ReduceRegion

To get statistics of pixel values in a region of an `ee.Image`, use [`image.reduceRegion()`](https://developers.google.com/earth-engine/apidocs/ee-image-reduceregion). This reduces all the pixels in the region(s) to a statistic or other compact representation of the pixel data in the region (e.g. histogram). The region is represented as a `Geometry`, which might be a polygon, containing many pixels, or it might be a single point, in which case there will only be one pixel in the region. 

![image-20221028212341502](https://imagecollection.oss-cn-beijing.aliyuncs.com/img/image-20221028212341502.png)

https://code.earthengine.google.com/8135325f54d094f9834e7e31411b06fc

**normalization**

https://code.earthengine.google.com/1c1f2e526ea699e890508f5e5fb1ed36

![image-20221028212712505](https://imagecollection.oss-cn-beijing.aliyuncs.com/img/image-20221028212712505.png)

## Lesson 11 Savitzky-Golay filter

https://code.earthengine.google.com/ef5592b85199f3facd22cb49579b0520

![img](https://imagecollection.oss-cn-beijing.aliyuncs.com/img/20181224220622820.png)

![img](https://imagecollection.oss-cn-beijing.aliyuncs.com/img/20181224221727301.png)

## Lesson 12 Join

* Joins are used to combine elements from different collections (e.g. `ImageCollection` or `FeatureCollection`) based on a condition specified by an `ee.Filter`
* The type of filter (e.g. `equals`, `greaterThanOrEquals`, `lessThan`, etc.) indicates the relationship between the fields.
* The type of join indicates one-to-many or one-to-one relationships between the elements in the collections and how many matches to retain. The output of a join is produced by `join.apply()` and will vary according to the type of join.

连接是将两个数据集结合到一起的操作，这种操作可以分为两个部分。给一个Filter当作连接条件，再给两个数据集当作连接数据。

### Simple Join

A simple join returns elements from the `primary` collection that match any element in the `secondary` collection according to the match condition in the filter. 

与Sentinel拍摄时间相差一天以内的Landsat 8图像

https://code.earthengine.google.com/4064f33733e5a47b484574789965913c

### Inner Join

To enumerate all matches between the elements of two collections, use an `ee.Join.inner()`. The output of an inner join is a `FeatureCollection` (even if joining one `ImageCollection` to another `ImageCollection`). Each feature in the output represents a match, where the matching elements are stored in two properties of the feature. 

将MODIS的EVI和Quality数据集连接并整合成为一个数据集

https://code.earthengine.google.com/29d5c6d4eb67dae2c783da6aae856846

### Save-All

Saving joins are one way of representing one-to-many relationships in Earth Engine. Unlike an [inner join](https://developers.google.com/earth-engine/guides/joins_inner), a saving join stores matches from the `secondary` collection as a named property of the features in the `primary` collection.

把与Landsat 8图像拍摄相差时间一天以内的Sentinel图像放到符合条件的Landsat 8图像的属性里

https://code.earthengine.google.com/1fb14a0069f681ade7d7d84105af6861

### Distance Join



https://code.earthengine.google.com/78aa48d1aab6807287d255679e62c286
