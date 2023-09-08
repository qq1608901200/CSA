
// *---------------------------淹没分析------------------------
function show_floated(){
    
    // 创建缓冲区范围
        var _polygons = []
        var positions = [];
     // 绘制面 右键结束
        Cesium.drawPolygonGraphics({ viewer: viewer }).then((polygons) => {
        polygons.forEach((polygon) => { 
            let point = [polygon.lng, polygon.lat];
            _polygons.push(point);
            positions.push(point[0],point[1]);
            })
        
        console.log(_polygons)
        console.log(positions)
console.log(positions[1])


// // 设置目标淹没高度
    var targertWaterHeight=document.getElementById("float_value").value
var waterHeight = 0; // 当前淹没高度
console.log(targertWaterHeight);
// console.log(waterHeight);
//   添加实体
    var entity = viewer.entities.add({
        polygon: {
            hierarchy: Cesium.Cartesian3.fromDegreesArray(positions),
            material: new Cesium.Color.fromBytes(64, 157, 253, 150),
            extrudedHeight: new Cesium.CallbackProperty(function () {
                return waterHeight;
            })
        }
    });
viewer.clock.onTick.addEventListener(function () {
    waterHeight += 1;
        if (waterHeight > targertWaterHeight){
            waterHeight = targertWaterHeight;
        }
    })
        })
}

/**
 * 迪杰斯特拉算法
 * @param {pointset} graph 
 * @param {startPoint} startNode 
 * @param {endPoint} endNode 
 * @returns 
 */
function dijkstra(graph, startNode, endNode) {
  const distances = {};
  const visited = {};
  const previous = {};
  const queue = new PriorityQueue();

  // 初始化距离和优先队列
  for (let node in graph) {
    if (node === startNode) {
      distances[node] = 0;
      queue.enqueue(node, 0);
    } else {
      distances[node] = Infinity;
      queue.enqueue(node, Infinity);
    }
    previous[node] = null;
  }

  while (!queue.isEmpty()) {
    let currentNode = queue.dequeue().element;
    if (currentNode === endNode) {
      // 找到最短路径
      const path = [];
      while (previous[currentNode]) {
        path.unshift(currentNode);
        currentNode = previous[currentNode];
      }
      path.unshift(startNode);
      return path;
    }

    if (!visited[currentNode]) {
      visited[currentNode] = true;
      for (let neighbor in graph[currentNode]) {
        let distance = graph[currentNode][neighbor];
        let totalDistance = distances[currentNode] + distance;
        if (totalDistance < distances[neighbor]) {
          distances[neighbor] = totalDistance;
          previous[neighbor] = currentNode;
          queue.changePriority(neighbor, totalDistance);
        }
      }
    }
  }

  return null; // 无最短路径
}