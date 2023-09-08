// 假设你已经加载了地形数据并创建了Cesium.Viewer对象

// 创建一个矩形
// var rectangle = Cesium.Rectangle.fromDegrees(lonWest, latSouth, lonEast, latNorth);


// const slopeAnalysis=()=>{
//   // var rectangle = Cesium.Rectangle.fromDegrees(120.06,35.96, 120.12,35.98);
//   120.080093,35.933183, 120.080093,35.933183
//   var positions = [Cesium.Cartographic.fromDegrees(120.06,35.96),
//     Cesium.Cartographic.fromDegrees(120.12,35.98,),
//     Cesium.Cartographic.fromDegrees(120.08,35.93),
//     Cesium.Cartographic.fromDegrees(120.13,36.00),
//   ];
//   // var positions = [Cesium.Cartographic.fromDegrees(120.06,35.96)];
//   let terrainProvider=Cesium.createWorldTerrain();
              
//   // 使用Cesium.sampleTerrainMostDetailed方法获取矩形区域内的高程数据
// Cesium.sampleTerrainMostDetailed(terrainProvider, positions)
// .then(function(terrainData) {
//   console.log('地形数据',terrainData)
//   // 获取高程数据
//   var terrain = terrainData;
//   console.log('高程数据',terrain)
//   // 定义坡度值的颜色映射表
// var colorMap = [{
//   slope: 0, // 最小的坡度值
//   color: Cesium.Color.fromCssColorString('#00FF00') // 浅绿色
// }, {
//   slope: 30, // 中间坡度值
//   color: Cesium.Color.fromCssColorString('#FFFF00') // 黄色
// }, {
//   slope: 60, // 最大的坡度值
//   color: Cesium.Color.fromCssColorString('#FF0000') // 红色
// }];
//   // 遍历矩形区域内的每个高程点并计算坡度
//   for (var i = 0; i < terrain.length; i++) {
//     var position = terrain[i].position;
//     var normal = getNormal(terrain[i])

//     // 计算坡度
//     var slope = Math.acos(Cesium.Cartesian3.dot(normal, Cesium.Cartesian3.UNIT_Z));
//     var slopeDegree = Cesium.Math.toDegrees(slope);
//     console.log('高程点的position:',terrain.positions)
//     // 打印坡度值
//     console.log('坡度:', slopeDegree);



//     // 根据坡度值查找对应的颜色
//   var color = getColorForSlope(slopeDegree, colorMap);

//   // 创建一个矩形实例
//   var rectangleInstance = new Cesium.GeometryInstance({
//     geometry: new Cesium.RectangleGeometry({
//       rectangle: Cesium.Rectangle.fromDegrees(position.longitude, position.latitude, position.longitude, position.latitude),
//       vertexFormat: Cesium.VertexFormat.POSITION_AND_COLOR
//     }),
//     attributes: {
//       color: Cesium.ColorGeometryInstanceAttribute.fromColor(color)
//     }
//   });

//   // 创建显示矩形的Primitive
//   var primitive = new Cesium.Primitive({
//     geometryInstances: rectangleInstance,
//     appearance: new Cesium.PerInstanceColorAppearance()
//   });

//   viewer.scene.primitives.add(primitive);
//   }
// })
// .catch(function(error) {
//   console.log('获取高程数据错误:', error);
// });

// }
// // 根据坡度值查找对应的颜色
// function getColorForSlope(slope, colorMap) {
//   for (var i = 1; i < colorMap.length; i++) {
//     if (slope < colorMap[i].slope) {
//       var prevColor = colorMap[i - 1].color;
//       var nextColor = colorMap[i].color;
//       var t = (slope - colorMap[i - 1].slope) / (colorMap[i].slope - colorMap[i - 1].slope);

//       return Cesium.Color.lerp(prevColor, nextColor, t);
//     }
//   }

//   return colorMap[colorMap.length - 1].color;
// }

// function getNormal(terrainData){
//     // 生成地形网格
//         var mesh = Cesium.TerrainMesh.fromTerrainData(terrainData);
//           // 计算法线
//         var normals = mesh.computeNormals();
// return normals;
// }

const slopeAnalysis=()=>{
//  var positions = [Cesium.Cartographic.fromDegrees(longitude, latitude)];
// var rectangle = Cesium.Rectangle.fromDegrees(120.06,35.96, 120.12,35.98);
// 定义矩形区域
// var rectangle = Cesium.Rectangle.fromDegrees(-120, 30, -110, 40);

var terrainProvider = Cesium.createWorldTerrain();
// 定义矩形区域
// var rectangle = Cesium.Rectangle.fromDegrees(120.06,35.96, 120.12,35.98);

var rectangle = Cesium.Rectangle.fromDegrees(-120, 30, -110, 40); // 定义地形区域的矩形范围
var gridSize = 100; // 网格大小

computeSlopeAspect(rectangle, terrainProvider, gridSize).then(function (slopeData) {
  // 处理坡向数据
  console.log(slopeData);
}).catch(function (error) {
  // 处理错误
  console.log(error);
});


// 计算地形坡向函数
function computeSlopeAspect(rectangle, terrainProvider, gridSize) {
  var positions = Cesium.Rectangle.subsample(rectangle, gridSize); // 将地形区域划分为一系列位置点
  var promise = Cesium.sampleTerrainMostDetailed(terrainProvider, positions); // 获取地形高程信息

  return Cesium.when(promise, function (updatedPositions) {
    var slopeData = [];

    // 遍历每个位置点，计算坡向
    for (var i = 0; i < updatedPositions.length - gridSize; i++) {
      var p1 = updatedPositions[i];
      var p2 = updatedPositions[i + gridSize];
      var deltaX = Cesium.Cartographic.subtract(p2, p1).longitude;
      var deltaZ = p2.height - p1.height;
      var slope = Math.atan(deltaZ / (deltaX * Cesium.Ellipsoid.WGS84.maximumRadius));
      var aspect = Math.atan2(deltaX, -deltaZ);

      slopeData.push({ slope: slope, aspect: aspect });
    }

    return slopeData;
  });
}
}

