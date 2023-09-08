  /**---------------------可视域分析-------------- */
    // 存储可视域位置
var arrViewField = [];
    var viewModel = { verticalAngle: 90, horizontalAngle: 120, distance: 10 };
    // 开关
    function setvisible(value) {
      switch (value) {
        case 'add':
          addViewField();
          break;
        case 'remove':
          clearAllViewField();
          break;
      }
    }
    
    // 添加3dtiles模型
    function add3Dtiles(){
     const tileset = viewer.scene.primitives.add(
  new Cesium.Cesium3DTileset({
    url: Cesium.IonResource.fromAssetId(75343),
  })
);

      viewer.flyTo(tileset)
    }
    // 添加可视域
    function addViewField() {
      var e = new Cesium.ViewShed3D(viewer, {
        horizontalAngle: Number(viewModel.horizontalAngle),
        verticalAngle: Number(viewModel.verticalAngle),
        distance: Number(viewModel.distance),
        calback: function () {
          viewModel.distance = e.distance
        }
      });
      arrViewField.push(e)
    }
    // 清除可视域
    function clearAllViewField() {
      for (var e = 0, i = arrViewField.length; e < i; e++) {
        arrViewField[e].destroy()
      }
      arrViewField = []
      // 关闭3Dtiles模型
      viewer.scene.primitives.removeAll()
    }



//     ldCollection.add(new Cesium.ClassificationPrimitive({
//     geometryInstances: new Cesium.GeometryInstance({
//         geometry: new Cesium.PolygonGeometry({
//             polygonHierarchy: new Cesium.PolygonHierarchy(
//                 Cesium.Cartesian3.fromDegreesArray('坐标')
//             ),
//             extrudedHeight: '高度'
//         }),
//         attributes: {
//             color: Cesium.ColorGeometryInstanceAttribute.fromColor(new Cesium.Color(1, 1, 1, 1e-4)),
//             show: new Cesium.ShowGeometryInstanceAttribute(true)
//         },
//         id: '自定义id'
//     }),
//     classificationType: Cesium.ClassificationType.CESIUM_3D_TILE
// }))