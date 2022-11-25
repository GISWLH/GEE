var arr1 = ee.Array([[1,2,3,4],[10,11,12,13]]);
print("arr1", arr1);

// length
var arrlength = arr1.length();
print("arrlength",arrlength);

// cat
var a = ee.Array([0, 1, 2]);
var b = ee.Array([3, 4, 5]);
print(ee.Array.cat([a, b]));  // [0,1,2,3,4,5]
print(ee.Array.cat([a, b], 0));  // [0,1,2,3,4,5]
print(ee.Array.cat([a, b], 1));  // [[0,3],[1,4],[2,5]]

// get
print(arr1.get([0, 0]));  // 1
print(arr1.get([1, 3]));  // 13

// slice
var array1x6 = ee.Array([1, 2, 3, 4, 5, 6]);
print(array1x6.slice(0, 0, 6, 2));  // [1,3,5]
print(array1x6.slice(0, 0, 6, 3));  // [1,4]

// trans
var arr2 = arr1.transpose();
print("arr1_T",arr2);

// matrix multiply
var ArrayMatrixMultiply = arr1.matrixMultiply(arr2);
print("ArrayMatrixMultiply: ", ArrayMatrixMultiply);

// multiply
var ArrayMultiply = arr1.multiply(2); // [[2],[2],[2]]
print("ArrayMultiply", ArrayMultiply);

// project
var arr3 = ee.Array([[1], [2], [3]])
var arr3_pro = arr3.project([0]);
print("arr3_pro", arr3_pro)

// reduce
var arrayReduce = arr1.reduce(ee.Reducer.max(),[1]);
print("arrayReduce",arrayReduce);

