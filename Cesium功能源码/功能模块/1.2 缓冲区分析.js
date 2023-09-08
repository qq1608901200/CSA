// *----------------------------缓冲区分析----------------------
let radius = 2, bufferEntity = [];
    // init
    
      const point_buffer = function () {
        // 绘制点 右键结束
        Cesium.drawPointGraphics({ viewer: viewer }).then((point) => {
          // 创建缓冲区范围
          point = point[0]
          let turfPositions = turf.point([point.lng, point.lat])
          bufferEntity.push(Cesium.createGraphicsBuffer({
            viewer: viewer,
            animation:true,
            turfPositions: turfPositions,
            radius: Number(radius)
          }))
        })
      }

      const polyline_buffer = function () {
        // 绘制线 右键结束
        Cesium.drawLineGraphics({ viewer: viewer }).then((lines) => {
          // 创建缓冲区范围
          let _lines = []
          lines.forEach((line) => { let point = [line.lng, line.lat]; _lines.push(point) })
          let turfPositions = turf.lineString(_lines)
          bufferEntity.push(Cesium.createGraphicsBuffer({
            viewer: viewer,
            animation:true,
            turfPositions: turfPositions,
            radius: Number(radius)
          }))
        })
      }

      const polygon_buffer = function () {
        // 绘制面 右键结束
        Cesium.drawPolygonGraphics({ viewer: viewer }).then((polygons) => {
          // 创建缓冲区范围
          let _polygons = []
          polygons.forEach((polygon) => { let point = [polygon.lng, polygon.lat]; _polygons.push(point) })
          let turfPositions = turf.polygon([_polygons])
          bufferEntity.push(Cesium.createGraphicsBuffer({
            viewer: viewer,
            animation:true,
            turfPositions: turfPositions,
            radius: Number(radius)
          }))
        })
      }

      const animation = function () {
        bufferEntity && bufferEntity.forEach(entity => entity.animation = !entity.animation)
      }
    

    // // load
    // window.onload = function () {
    //   initPage()
    // }