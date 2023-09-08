/**
 * 最短路径分析
 */
function get_shortage_path(){
function getCatesian3FromPX(px, viewer, entity) {
            var pick = viewer.scene.pick(px);
            var cartesian;
            var drillPick = viewer.scene.drillPick(px);
            var truePick = null;
            if (entity) {
                for (var i = 0; i < drillPick.length; i++) {
                    if (drillPick[i].id._id != entity.id) {
                        truePick = drillPick[i].id;
                        break;
                    }
                }
            } else {
                truePick = pick;
            }
            if (viewer.scene.pickPositionSupported && Cesium.defined(truePick)) {
                cartesian = viewer.scene.pickPosition(px);
            } else {
                var ray = viewer.camera.getPickRay(px);
                if (!ray) return;
                cartesian = viewer.scene.globe.pick(ray, viewer.scene);
            }
            return cartesian;
        }

        // 笛卡尔坐标系转经纬度
        function cartesianToLnglat(cartesian, isToWgs84) {
            if (!cartesian) return;
            var ellipsoid = viewer.scene.globe.ellipsoid;
            var lnglat = ellipsoid.cartesianToCartographic(cartesian);
            //var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            if (isToWgs84) {
                var lat = Cesium.Math.toDegrees(lnglat.latitude);
                var lng = Cesium.Math.toDegrees(lnglat.longitude);
                var hei = lnglat.height;
                return [lng, lat, hei];
            } else {
                return [lnglat.longitude, lnglat.latitude, lnglat.height];
            }

        }
        // 经纬度转笛卡尔坐标
        function lnglatToCartesian(lnglat) { //经纬度转世界坐标 [101,40]
            if (!lnglat) return null;
            return Cesium.Cartesian3.fromDegrees(lnglat[0], lnglat[1], lnglat[2] || 0);
        }
          // 经纬度数组转笛卡尔坐标数组
        function lnglatArrToCartesianArr(lnglatArr) {
            if (!lnglatArr) return [];
            var arr = [];
            for (var i = 0; i < lnglatArr.length; i++) {
                arr.push(lnglatToCartesian(lnglatArr[i]));
            }
            return arr;
        }


         class searchRoute {
            constructor(start, end) {
                this.startP = start;
                this.endP = end;
            }
            start(opt) {
                var startP = wgs2gcj(this.startP);
                var endP = wgs2gcj(this.endP);
                // var startP=[116.481028,39.989643]
                // var endP=[116.434446,39.90816]
                console.log(startP)
                console.log(endP)
                $.ajax({
                    url: "http://restapi.amap.com/v3/direction/driving",
                    type: "GET",
                    dataType: "json",
                    timeout: "5000",
                    contentType: "application/json;utf-8",
                    data: {
                        "output": "json",
                        "extensions": "all",
                        "key": "45c09133bcab0131be210ca8c84d7c32",
                        "origin": startP[0] + "," + startP[1],
                        "destination": endP[0] + "," + endP[1],
                        "strategy": opt.strategy || 10
                    },
                    success: function(json) {
                        // 由于线涉及坐标较多 此处返回的坐标 未转为wgs84
                        var data = "";
                        if (!json || !json.route || !json.route.paths) {
                            data = "";
                        } else {
                            data = json.route.paths;
                        }
                       
                            console.log(data)
                        opt.callback(data);

                        
                        // console.log(data[0].steps)
                        // opt.callback(data[0].steps);
                    },
                    error: function(data) {}
                });
            }
        }
        var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        var isClickAgain = false;
        var start = null;
        var end = null;
        handler.setInputAction(function(evt) { //单击开始绘制
            var pick = viewer.scene.pick(evt.position);
            var cartesian = getCatesian3FromPX(evt.position, viewer);
            if (!isClickAgain) {
                isClickAgain = true;
                start = viewer.entities.add({
                    name: "图标点",
                    position: cartesian,
                    billboard:{
            image: "img/location4.png",
              show: true, // default
              eyeOffset: new Cesium.Cartesian3(0.0, 0.0, 0.0), // default
              horizontalOrigin: Cesium.HorizontalOrigin.CENTER, // default
              verticalOrigin: Cesium.VerticalOrigin.BOTTOM, // default: CENTER
              scale: 1.0, // default: 1.0
              // color: Cesium.Color.LIME, // default: WHITE
              rotation: Cesium.Math.PI_OVER_FOUR, // default: 0.0
              alignedAxis: Cesium.Cartesian3.ZERO, // default
              width: 10, // default: undefined
              height: 10, // default: undefined
              pixelOffset: new Cesium.Cartesian2(0, -72),
            }
                });
                return;
            }
            if (isClickAgain) {
                end = viewer.entities.add({
                    name: "图标点",
                    position: cartesian,
                    billboard:{
              image: "img/location4.png",
              show: true, // default
              eyeOffset: new Cesium.Cartesian3(0.0, 0.0, 0.0), // default
              horizontalOrigin: Cesium.HorizontalOrigin.CENTER, // default
              verticalOrigin: Cesium.VerticalOrigin.BOTTOM, // default: CENTER
              scale: 1.0, // default: 1.0
              // color: Cesium.Color.LIME, // default: WHITE
              rotation: Cesium.Math.PI_OVER_FOUR, // default: 0.0
              alignedAxis: Cesium.Cartesian3.ZERO, // default
              width: 10, // default: undefined
              height: 10, // default: undefined
            pixelOffset: new Cesium.Cartesian2(0, -72),
            }
                });
                console.log(start.position.getValue(),end.position.getValue())
                showRes(start.position.getValue(), end.position.getValue());
                handler.destroy();
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        function showRes(start, end) {
            if (!start || !end) return;
            var startP = cartesianToLnglat(start, true);
            var endP = cartesianToLnglat(end, true);
            console.log(startP)
            console.log(endP)
            // value[0]为x value[1]为y
            var search = new searchRoute([startP[0], startP[1]], [endP[0], endP[1]]);
            search.start({
                strategy: 11,
                callback: function(data) {
                    for(let i=0;i<data.length;i++){
                        console.log(data[i].steps)
                        addRouteLine(data[i].steps);
                    }
                }
            })
        }

        function addRouteLine(data) {
            var arr = [];
            var steps = data;
            for (var i = 0; i < steps.length; i++) {
                var item = steps[i];
                var positionStr = item.polyline;
                var strArr = positionStr.split(";");
                for (var z = 0; z < strArr.length; z++) {
                    var item2 = strArr[z];
                    var strArr2 = item2.split(",");
                    var p = gcj2wgs(strArr2);
                    arr.push(p);
                }
            }
            var cartesians = lnglatArrToCartesianArr(arr);
            var line = viewer.entities.add({
                polyline: {
                    positions: cartesians,
                    clampToGround: true,
                    // material: Cesium.Color.YELLOW.withAlpha(1),
                    material:Cesium.Color.fromRandom({alpha: 1}),
                    width: 8
                }
            });
            viewer.zoomTo(line)
            // moveOnRoute(line);
        }

//坐标转换==================================
        var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
        var PI = 3.1415926535897932384626;
        var a = 6378245.0;
        var ee = 0.00669342162296594323;
        function transformWD(lng, lat) {
            var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
            ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
            ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
            ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
            return ret;
        }
        function transformJD(lng, lat) {
            var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
            ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
            ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
            ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
            return ret;
        }
        function wgs2gcj(arrdata) {
            console.log(arrdata)
            var lng = Number(arrdata[0]);
            var lat = Number(arrdata[1]);
            var dlat = transformWD(lng - 105.0, lat - 35.0);
            var dlng = transformJD(lng - 105.0, lat - 35.0);
            var radlat = lat / 180.0 * PI;
            var magic = Math.sin(radlat);
            magic = 1 - ee * magic * magic;
            var sqrtmagic = Math.sqrt(magic);
            dlat = dlat * 180.0 / (a * (1 - ee) / (magic * sqrtmagic) * PI);
            dlng = dlng * 180.0 / (a / sqrtmagic * Math.cos(radlat) * PI);
            var mglat = lat + dlat;
            var mglng = lng + dlng;

            mglng = Number(mglng.toFixed(6));
            mglat = Number(mglat.toFixed(6));
            return [mglng, mglat];

        };

        function gcj2wgs(arrdata) {
            var lng = Number(arrdata[0]);
            var lat = Number(arrdata[1]);
            var dlat = transformWD(lng - 105.0, lat - 35.0);
            var dlng = transformJD(lng - 105.0, lat - 35.0);
            var radlat = lat / 180.0 * PI;
            var magic = Math.sin(radlat);
            magic = 1 - ee * magic * magic;
            var sqrtmagic = Math.sqrt(magic);
            dlat = dlat * 180.0 / (a * (1 - ee) / (magic * sqrtmagic) * PI);
            dlng = dlng * 180.0 / (a / sqrtmagic * Math.cos(radlat) * PI);

            var mglat = lat + dlat;
            var mglng = lng + dlng;

            var jd = lng * 2 - mglng;
            var wd = lat * 2 - mglat;

            jd = Number(jd.toFixed(6));
            wd = Number(wd.toFixed(6));
            return [jd, wd];

        }
}
