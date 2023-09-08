
// import * as Cesium from 'cesium';
// import './libs/Cesium/Widgets/widgets.css'
 // Your access token can be found at: https://cesium.com/ion/tokens.
    //这是账户上的授权tokens
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhZWU4ZGZmZS0wOTZlLTQ4YzQtOGM3OS02MzRiNzc0OTdlOWUiLCJpZCI6MTE0NjIzLCJpYXQiOjE2NjgyMzI3Nzh9.HVk7OIA04OU94OeezRqSah9dpF9aQngQ-OH6jTK6yxU';

    var viewer = new Cesium.Viewer('cesiumContainer', {
    // scene3DOnly: true,
    imageryProvider: Cesium.ArcGisMapServerImageryProvider({
                url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"
            }),
      //       terrainProvider: new Cesium.CesiumTerrainProvider({ //加载火星在线地形
      //           url: "http://data.marsgis.cn/terrain",
      //           requestWaterMask: true,
      // requestVertexNormals: true
      //       }),
      terrainProvider:new Cesium.createWorldTerrain(),
      
    selectionIndicator: false,
    timeline:false,
    animation:false,
    // terrainProvider: Cesium.createWorldTerrain({
    //     requestVertexNormals: true,
    //     requestWaterMask: true
    // })
    
});
// var terrainProvider=new Cesium.createWorldTerrain({
//     url: "http://data.marsgis.cn/terrain",
//         requestVertexNormals: true,
//         requestWaterMask: true
//     })
// viewer.terrainProvider=terrainProvider
 // 隐藏logo
viewer._cesiumWidget._creditContainer.style.display = "none";


var lineStatus = false;

// 主页键返回初始位置
 // 修改homeButton的默认返回位置
viewer.homeButton.viewModel.command.beforeExecute.addEventListener(function(e) {
    e.cancel = true;
    viewer.camera.flyTo({
              destination: Cesium.Cartesian3.fromDegrees(120.123473,36.003513, 3000),
    })
})

// 相机默认定位到青岛
 // Cesium 相机系统 --setView
const position_camera = Cesium.Cartesian3.fromDegrees(120.123473,36.003513, 3000)
this.viewer.camera.setView({
    destination: position_camera, // 相机位置
    orientation: {
        heading: Cesium.Math.toRadians(0), // 水平旋转  -正北方向
        pitch: Cesium.Math.toRadians(-90), // 上下旋转  --俯视朝向
        roll: 0 // 视口翻滚角度
    }
})
// /**
//  * 坡向分析
//  */
// const slopeAnalysis=()=>{
//   // let terrainProvider=new Cesium.createWorldTerrain({
//   //   url: "http://data.marsgis.cn/terrain",
//   //       requestVertexNormals: true,
//   //       requestWaterMask: true
//   //   })
//     viewer.terrainProvider = Cesium.createWorldTerrain();
//   // viewer.terrainProvider=terrainProvider;
//   var slopeProvider = new Cesium.SlopeProvider({
//   terrainProvider: viewer.terrainProvider
// });
// slopeProvider.gradient = [
//   { height: 0, color: Cesium.Color.fromCssColorString('#00FF00') }, // 浅绿色表示较缓的坡度
//   { height: 10, color: Cesium.Color.fromCssColorString('#FFFF00') }, // 黄色表示中等坡度
//   { height: 30, color: Cesium.Color.fromCssColorString('#FF0000') } // 红色表示较陡的坡度
// ];
// slopeProvider.alpha = 0.5; // 设置透明度为0.5，使坡度分析结果半透明
// viewer.scene.globe.slopeProviders.add(slopeProvider);
// viewer.scene.globe.slopeProvider = slopeProvider;
// viewer.scene.globe.enableLighting = true; // 启用光照效果
// viewer.scene.globe.depthTestAgainstTerrain = true; // 调整地形与其他图元的深度测试关系
// // 光照角度：调整光源的角度可以改变坡度的视觉效果。尝试改变光源的位置来突出不同方向的坡度。
// viewer.scene.globe.lightingOptions.lightSourceDirection = new Cesium.Cartesian3.fromDegrees(45, 30, 1000);
// viewer.scene.sun.glowFactor = 10; // 增加阴影的强度

// // 添加额外的设置和样式以获得更具体的坡度可视化效果

// }

// 挖方
const AltitudeTrend=()=>{
  var points = [
    new Cesium.Cartesian3(120.123473,36.003513, 3566663.752912529),
    new Cesium.Cartesian3(120.223473,36.003513,3566647.6921528564),
    new Cesium.Cartesian3(120.223883,36.003513, 3566627.519787549),
    new Cesium.Cartesian3(120.33473,36.003513, 3566607.861264360),
    new Cesium.Cartesian3(121.123473,36.003513, 3566603.878289345),
    new Cesium.Cartesian3(121.14473,36.003513, 3566614.671147202),
    new Cesium.Cartesian3(122.123473,36.003513, 3566643.580587877),
    new Cesium.Cartesian3(122.223473,36.003513, 3566662.468046927),
    new Cesium.Cartesian3(122.323473,36.003513, 3566671.205164391)
];
var pointsLength = points.length;
var clippingPlanes = []; // 存储ClippingPlane集合
for (var i = 0; i < pointsLength; ++i) {
  var nextIndex = (i + 1) % pointsLength;
  var midpoint = Cesium.Cartesian3.add(points[i], points[nextIndex], new Cesium.Cartesian3());
  midpoint = Cesium.Cartesian3.multiplyByScalar(midpoint, 0.5, midpoint);

  var up = Cesium.Cartesian3.normalize(midpoint, new Cesium.Cartesian3());
  var right = Cesium.Cartesian3.subtract(points[nextIndex], midpoint, new Cesium.Cartesian3());
  right = Cesium.Cartesian3.normalize(right, right);

  var normal = Cesium.Cartesian3.cross(right, up, new Cesium.Cartesian3());
  normal = Cesium.Cartesian3.normalize(normal, normal);

  var originCenteredPlane = new Cesium.Plane(normal, 0.0);
  var distance = Cesium.Plane.getPointDistance(originCenteredPlane, midpoint);

  clippingPlanes.push(new Cesium.ClippingPlane(normal, distance));
}

viewer.scene.globe.clippingPlanes = new Cesium.ClippingPlaneCollection({
  planes: clippingPlanes,
  edgeWidth: 1.0,
  edgeColor: Cesium.Color.WHITE
});


}

/**
 * 添加地形特征
 */
function add_terrain(){
  let terrainProvider=new Cesium.CesiumTerrainProvider({ //加载火星在线地形
                url: "http://data.marsgis.cn/terrain"
            })
    viewer.terrainProvider=terrainProvider;
}
// 关闭地形
function close_terrain(){
        viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider({}) //先实例化地形对象，然后置空
        viewer.scene.globe.depthTestAgainstTerrain = false //关闭深度
}

// 启动测量功能
function start_line(){
Draw('line')

}
function start_polygon(){
    Draw('polygon')
}

// 清除功能

function close_all(){
viewer.entities.removeAll();
// 关闭地形功能
    viewer.terrainProvider=false
    //关闭深度测试
    viewer.scene.globe.enableLighting = false; 

}


function Draw(Draw_Type){
    var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    switch(Draw_Type){
case 'line':
    measureLineSpace(viewer, handler);
    break;
case 'polygon':
      measureAreaSpace(viewer, handler)
break;

}
}


/**
 * 测量空间直线距离
 * @param {*} viewer 
 * @param {*} handler 
 */
    function measureLineSpace(viewer, handler) {
    //   // 取消双击事件-追踪该位置
    handler = new Cesium.ScreenSpaceEventHandler(
        viewer.scene._imageryLayerCollection
      );
      var positions = [];
      var poly = null;
      // var tooltip = document.getElementById("toolTip");
      var distance = 0;
      var cartesian = null;
      var floatingPoint;
      // tooltip.style.display = "block";

      
  //   左键添加点后，移动鼠标形成线
      handler.setInputAction(function (movement) {
        cartesian = viewer.scene.camera.pickEllipsoid(movement.endPosition, viewer.scene.globe.ellipsoid);
        if (positions.length >= 2) {
          if (!Cesium.defined(poly)) {
            poly = new PolyLinePrimitive(positions);
          } else {
            positions.pop();
            // cartesian.y += (1 + Math.random());
            positions.push(cartesian);
          }
          distance = getSpaceDistance(positions);
          // console.log("distance: " + distance);
          // tooltip.innerHTML='<p>'+distance+'米</p>';
        }
        
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  

    //   左键添加点
    
handler.setInputAction(function (movement) {
// tooltip.style.display = "none";
        cartesian = viewer.scene.camera.pickEllipsoid(movement.position, viewer.scene.globe.ellipsoid);
        if (positions.length == 0) {
          positions.push(cartesian.clone());
        }
        positions.push(cartesian);
        //在三维场景中添加Label
        var textDisance = distance + "米";
        floatingPoint = viewer.entities.add({
          name: "空间直线距离",
          position: positions[positions.length - 1],
          point: {
            pixelSize: 5,
            color: Cesium.Color.RED,
            outlineColor: Cesium.Color.WHITE,
            outlineWidth: 2,
          },
          label: {
            text: textDisance,
            font: "18px sans-serif",
            fillColor: Cesium.Color.GOLD,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            outlineWidth: 2,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(20, -20),
          },
        });
        
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      
    //   右键结束画线
      handler.setInputAction(function (movement) {
        lineStatus=false;                 
        handler.destroy(); //关闭事件句柄
        positions.pop(); //最后一个点无效
        // viewer.entities.remove(floatingPoint);
        // tooltip.style.display = "none";
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

    //   画线
      var PolyLinePrimitive = (function () {
        function _(positions) {
          this.options = {
            name: "直线",
            polyline: {
              show: true,
              positions: [],
              material: Cesium.Color.CHARTREUSE,
              width: 10,
              clampToGround: true,
            },
          };
          this.positions = positions;
          this._init();
        }

        _.prototype._init = function () {
          var _self = this;
          var _update = function () {
            return _self.positions;
          };
          //实时更新polyline.positions
          this.options.polyline.positions = new Cesium.CallbackProperty(
            _update,
            false
          );
          viewer.entities.add(this.options);
        };

        return _;
      })();

      //空间两点距离计算函数
      function getSpaceDistance(positions) {
        var distance = 0;
        for (var i = 0; i < positions.length - 1; i++) {
          var point1cartographic = Cesium.Cartographic.fromCartesian(
            positions[i]
          );
          var point2cartographic = Cesium.Cartographic.fromCartesian(
            positions[i + 1]
          );
          /**根据经纬度计算出距离**/
          var geodesic = new Cesium.EllipsoidGeodesic();
          geodesic.setEndPoints(point1cartographic, point2cartographic);
          var s = geodesic.surfaceDistance;
          distance = distance + s;
        }
        return distance.toFixed(2);
      }
    }

    //****************************测量空间面积************************************************//
  function measureAreaSpace(viewer, handler) {
      // 取消双击事件-追踪该位置
      viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
        Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
      );
      // 鼠标事件
      handler = new Cesium.ScreenSpaceEventHandler(
        viewer.scene._imageryLayerCollection
      );
      var positions=[]
      var tempPoints = [];
      var polygon = null;
      // var tooltip = document.getElementById("toolTip");
      var cartesian = null;
      var floatingPoint; //浮动点
      // tooltip.style.display = "block";

      handler.setInputAction(function (movement) {
        let ray = viewer.camera.getPickRay(movement.endPosition);
        cartesian = viewer.scene.globe.pick(ray, viewer.scene);
        //cartesian = viewer.scene.camera.pickEllipsoid(movement.endPosition, viewer.scene.globe.ellipsoid);
        if (positions.length >= 2) {
          if (!Cesium.defined(polygon)) {
            polygon = new PolygonPrimitive(positions);
          } else {
            positions.pop();
            // cartesian.y += (1 + Math.random());
            positions.push(cartesian);
          }
          // tooltip.innerHTML='<p>'+distance+'米</p>';
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

      handler.setInputAction(function (movement) {
        // tooltip.style.display = "none";
        // cartesian = viewer.scene.pickPosition(movement.position);
        let ray = viewer.camera.getPickRay(movement.position);
        cartesian = viewer.scene.globe.pick(ray, viewer.scene);
        // cartesian = viewer.scene.camera.pickEllipsoid(movement.position, viewer.scene.globe.ellipsoid);
        if (positions.length == 0) {
          positions.push(cartesian.clone());
        }
        //positions.pop();
        positions.push(cartesian);
        //在三维场景中添加点
        var cartographic = Cesium.Cartographic.fromCartesian(
          positions[positions.length - 1]
        );
        var longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
        var latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
        var heightString = cartographic.height;
        tempPoints.push({
          lon: longitudeString,
          lat: latitudeString,
          hei: heightString,
        });
        floatingPoint = viewer.entities.add({
          name: "多边形面积",
          position: positions[positions.length - 1],
          point: {
            pixelSize: 5,
            color: Cesium.Color.RED,
            outlineColor: Cesium.Color.WHITE,
            outlineWidth: 2,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          },
        });
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      handler.setInputAction(function (movement) {
        handler.destroy();
        positions.pop();
        var textArea = getArea(tempPoints) + "平方公里";
        viewer.entities.add({
          name: "多边形面积",
          position: positions[positions.length - 1],
          label: {
            text: textArea,
            font: "18px sans-serif",
            fillColor: Cesium.Color.GOLD,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            outlineWidth: 2,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(20, -40),
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          },
        });
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

      var radiansPerDegree = Math.PI / 180.0; //角度转化为弧度(rad)
      var degreesPerRadian = 180.0 / Math.PI; //弧度转化为角度

      //计算多边形面积
      function getArea(points) {
        var res = 0;
        //拆分三角曲面
        for (var i = 0; i < points.length - 2; i++) {
          var j = (i + 1) % points.length;
          var k = (i + 2) % points.length;
          var totalAngle = Angle(points[i], points[j], points[k]);

          var dis_temp1 = distance(positions[i], positions[j]);
          var dis_temp2 = distance(positions[j], positions[k]);
          res += dis_temp1 * dis_temp2 * Math.abs(Math.sin(totalAngle));
          console.log(res);
        }

        return (res / 1000000.0).toFixed(4);
      }

      /*角度*/
      function Angle(p1, p2, p3) {
        var bearing21 = Bearing(p2, p1);
        var bearing23 = Bearing(p2, p3);
        var angle = bearing21 - bearing23;
        if (angle < 0) {
          angle += 360;
        }
        return angle;
      }
      /*方向*/
      function Bearing(from, to) {
        var lat1 = from.lat * radiansPerDegree;
        var lon1 = from.lon * radiansPerDegree;
        var lat2 = to.lat * radiansPerDegree;
        var lon2 = to.lon * radiansPerDegree;
        var angle = -Math.atan2(
          Math.sin(lon1 - lon2) * Math.cos(lat2),
          Math.cos(lat1) * Math.sin(lat2) -
            Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2)
        );
        if (angle < 0) {
          angle += Math.PI * 2.0;
        }
        angle = angle * degreesPerRadian; //角度
        return angle;
      }

      var PolygonPrimitive = (function () {
        function _(positions) {
          this.options = {
            name: "多边形",
            polygon: {
              hierarchy: [],
              // perPositionHeight : true,
              material: Cesium.Color.GREEN.withAlpha(0.5),
              // heightReference:20000
            },
          };

          this.hierarchy = { positions };
          this._init();
        }

        _.prototype._init = function () {
          var _self = this;
          var _update = function () {
            return _self.hierarchy;
          };
          //实时更新polygon.hierarchy
          this.options.polygon.hierarchy = new Cesium.CallbackProperty(
            _update,
            false
          );
          viewer.entities.add(this.options);
        };

        return _;
      })();

      function distance(point1, point2) {
        var point1cartographic = Cesium.Cartographic.fromCartesian(point1);
        var point2cartographic = Cesium.Cartographic.fromCartesian(point2);
        /**根据经纬度计算出距离**/
        var geodesic = new Cesium.EllipsoidGeodesic();
        geodesic.setEndPoints(point1cartographic, point2cartographic);
        var s = geodesic.surfaceDistance;
        //console.log(Math.sqrt(Math.pow(distance, 2) + Math.pow(endheight, 2)));
        //返回两点之间的距离
        s = Math.sqrt(
          Math.pow(s, 2) +
            Math.pow(point2cartographic.height - point1cartographic.height, 2)
        );
        return s;
      }

    }

    // *------添加等高线-------
function add_ElevationLine(){

// 开启地形
viewer.scene.globe.material=null;
  // viewer.scene.globe.enableLighting = true; //开启深度测试
var minHeight = 20.0; // 最小高度-例：最低接近死海高度
var maxHeight = 220.0; // 最大高度-例：最高接近珠峰高度
var contourColor = Cesium.Color.RED.withAlpha(0.4); // 等高线的颜色
var contourSpacing = 10.0; // 等高线的等间距
var contourWidth = 1.0; // 等高线的宽度

var material = Cesium.Material.fromType('ElevationContour');
var contourUniforms = material.uniforms;
contourUniforms.width = contourWidth;
contourUniforms.spacing = contourSpacing;
contourUniforms.color = contourColor;

viewer.scene.globe.material = material;

var material = Cesium.Material.fromType('ElevationRamp');
var shadingUniforms = material.uniforms;
shadingUniforms.minimumHeight = minHeight;
shadingUniforms.maximumHeight = maxHeight;
shadingUniforms.image = getColorRamp(); // 彩色色带
}
//*------移除等高线---------
function remove_ElevationLine(){
    viewer.scene.globe.material=null;
  //  //关闭地形
  //       viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider({}) //先实例化地形对象，然后置空
  //       viewer.scene.globe.depthTestAgainstTerrain = false //关闭深度
    // //关闭深度测试
    //  viewer.scene.globe.enableLighting = false; 

}


//  *-----------漫游功能-----------

// 声明变量，以下代码可能会多次用到
// 声明相机，为了使用键盘的事件moveForward
let camera = viewer.camera;
let ellipsoid = viewer.scene.globe.ellipsoid;
// 声明相机漫游标记,相当于一个键盘事件的模式
let flags = null;

/**
 * 进入键盘漫游模式
 */
function enterKeyBoardMouseRoamingMode() {
  console.log('进入漫游模式');
  alert("进入漫游模式")
  // 1.初始化相机漫游的标记,防止与新的键盘事件冲突
  flags = {
    moveForward: false, // 是否向前移动
    moveBackward: false, // 是否向后移动
    moveLeft: false, // 是否向左移动
    moveRight: false, // 是否向右移动
    moveUp: false, // 是否向上移动
    moveDown: false, // 是否向下移动
  }; // 相机漫游标记

  // 2.添加键盘监听事件
  // 键盘按下事件
  document.addEventListener('keydown', keyDown, false);
  // 键盘弹起事件
  document.addEventListener('keyup', keyUp, false);

  // 3.添加渲染事件
  viewer.clock.onTick.addEventListener(renderEvent);
}

// // DOM添加一个开启键盘鼠标漫游模式的按钮，使用绝对定位放在屏幕左上角，用于测试
// let enterButton = document.createElement('button');
// enterButton.innerText = '开启';
// enterButton.style.position = 'absolute';
// enterButton.style.left = '20px';
// enterButton.style.top = '20px';
// enterButton.onclick = enterKeyBoardMouseRoamingMode;
// document.body.appendChild(enterButton);

/**
 * 退出键盘漫游模式
 */
function exitKeyBoardMouseRoamingMode() {
  console.log('退出漫游');
  alert("退出漫游模式");
  // 1.移除键盘监听事件
  document.removeEventListener('keydown', keyDown, false);
  document.removeEventListener('keyup', keyUp, false);

  // 2.移除渲染事件
  viewer.clock.onTick.removeEventListener(renderEvent);
}

// // DOM添加一个关闭键盘鼠标漫游模式的按钮，使用绝对定位放在屏幕左上角，用于测试
// let exitButton = document.createElement('button');
// exitButton.innerText = '关闭';
// exitButton.style.position = 'absolute';
// exitButton.style.left = '70px';
// exitButton.style.top = '20px';
// exitButton.onclick = exitKeyBoardMouseRoamingMode;
// document.body.appendChild(exitButton);

/**
 * 键盘按下
 */
function keyDown(event) {
  let flagName = getFlagFromKeyCode(event.keyCode);
  if (typeof flagName !== 'undefined') {
    flags[flagName] = true;
  }
}

/**
 * 键盘弹起
 */
function keyUp(event) {
  let flagName = getFlagFromKeyCode(event.keyCode);
  if (typeof flagName !== 'undefined') {
    flags[flagName] = false;
  }
}

/**
 * 渲染函数
 */
function renderEvent() {
  // 根据高度来决定镜头移动的速度
  let cameraHeight = ellipsoid.cartesianToCartographic(camera.position).height;
  let moveRate = cameraHeight / 20.0;
  if (flags.moveForward) {
    camera.moveForward(moveRate);
  }
  if (flags.moveBackward) {
    camera.moveBackward(moveRate);
  }
  if (flags.moveUp) {
    camera.moveUp(moveRate);
  }
  if (flags.moveDown) {
    camera.moveDown(moveRate);
  }
  if (flags.moveLeft) {
    camera.moveLeft(moveRate);
  }
  if (flags.moveRight) {
    camera.moveRight(moveRate);
  }
}

/**
 * 从键盘码获取flag标记
 */
function getFlagFromKeyCode(keyCode) {
  switch (keyCode) {
    case 'W'.charCodeAt(0):
      return 'moveForward';
    case 'S'.charCodeAt(0):
      return 'moveBackward';
    case 'Q'.charCodeAt(0):
      return 'moveUp';
    case 'E'.charCodeAt(0):
      return 'moveDown';
    case 'D'.charCodeAt(0):
      return 'moveRight';
    case 'A'.charCodeAt(0):
      return 'moveLeft';
    default:
      return undefined;
  }
}




