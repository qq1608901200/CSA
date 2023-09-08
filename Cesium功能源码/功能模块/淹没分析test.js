// *----------------------------缓冲区分析----------------------
// let radius = 6, bufferEntity = [];
    // init
    function initPage() {
      
      window.polygon_test = function () {
        // 绘制面 右键结束
        Cesium.drawPolygonGraphics({ viewer: viewer }).then((polygons) => {
          // 创建缓冲区范围
          let _polygons = []
          
          polygons.forEach((polygon) => { let point = [polygon.lng, polygon.lat]; _polygons.push(point) })
          console.log(_polygons)
        //   let turfPositions = turf.polygon([_polygons])
        //   bufferEntity.push(Cesium.createGraphicsBuffer({
        //     viewer: viewer,
        //     animation:true,
        //     turfPositions: turfPositions,
        //     radius: Number(radius)
        //   }))
        })
      }
      var positions = [];
 positions.forEach((point)=>{
    console.log(point)
 })
    //   window.animation = function () {
    //     bufferEntity && bufferEntity.forEach(entity => entity.animation = !entity.animation)
    //   }
    }

    // load
    window.onload = function () {
      initPage()
    }