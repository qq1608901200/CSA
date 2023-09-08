# CSA
## 空间分析实验
Spatial analysis algorithm combined with cesium visualization
## Usege
- import
```
<!-- 引用cesium的js文件和css文件 -->
    <script src="./libs/Cesium/Cesium.js"></script>
    <link rel="stylesheet" href="./libs/Cesium/Widgets/widgets.css">
```
- Cesium initialization
```js
// Your access token can be found at: https://cesium.com/ion/tokens.
    //这是账户上的授权tokens
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhZWU4ZGZmZS0wOTZlLTQ4YzQtOGM3OS02MzRiNzc0OTdlOWUiLCJpZCI6MTE0NjIzLCJpYXQiOjE2NjgyMzI3Nzh9.HVk7OIA04OU94OeezRqSah9dpF9aQngQ-OH6jTK6yxU';

    var viewer = new Cesium.Viewer('cesiumContainer', {
    // scene3DOnly: true,
    imageryProvider: Cesium.ArcGisMapServerImageryProvider({
                url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"
            }),
      terrainProvider:new Cesium.createWorldTerrain(),
      
    selectionIndicator: false,
    timeline:false,
    animation:false,
});
```
## Outline
![概要](img/概要.jpeg)
## Visual Spacial Analysis
![可视域分析](img/可视域分析.png)
## Drown Spacial Analysis
- Set the heights of drown
![淹没分析](img/淹没分析.png)
## Buffer Spacial Analysis
![缓冲区分析](img/缓冲区分析.png)
## Dijkstra algorithm
- Set source and target in map that get the points of paths
![最短路径分析](img/最短路径.png)
# Etc......