function GetAbsPoint(e) {
    var x = e.offsetLeft;
    var y = e.offsetTop;
    while (e = e.offsetParent) {
        x += e.offsetLeft;
        y += e.offsetTop;
    }
    return { 'x': x, 'y': y };
}

/**
 * 停止事件冒泡传播，
 * @type {Event} e e对象
 */
function stopBubble(e) {
    var e = window.event || e;
    e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
};

/**
 * 阻止默认事件处理，
 * @type {Event} e e对象
 */
function preventDefault(e) {
    var e = window.event || e;
    e.preventDefault ? e.preventDefault() : e.returnValue = false;
    return false;
};

(function(global, factory) {
    factory(global.cityGMap = global.cityGMap || {});
}(this,
    function(exports) {

        // 城市中心
        var CITYCENTER = { "北京": "39.9081726,116.3979471", "上海": "31.2243531,121.4759159", "天津": "39.1038561,117.2523808", "南京": "32.0583652,118.7964675", "重庆": "29.5549144,106.5484250", "深圳": "22.5434465,114.0578183", "广州": "23.1290750,113.2644227", "武汉": "30.5931680,114.3053611", "杭州": "30.2734969,120.1552488", "济南": "36.6652821,116.9949153", "成都": "30.6586016,104.0648565", "青岛": "36.0665687,120.3826699", "西安": "34.2648804,108.9442647", "长沙": "28.2285282,112.9388267", "桂林": "25.2735667,110.2901950", "郑州": "34.7472846,113.6248626", "无锡": "31.5661476,120.3030271", "乌鲁木齐": "43.8256663,87.6172983", "苏州": "31.2977791,120.5855864", "昆山": "31.39,120.95", "东莞": "23.0205360,113.7517657", "大连": "38.9137860,121.6147700", "昆明": "25.0372828,102.7221250", "石家庄": "38.0423196,114.5148635", "福州": "26.0742857,119.2965792", "常州": "31.7815764,119.9563766", "惠州": "23.1110303,114.4170526", "南宁": "22.8170688,108.3654615", "南昌": "28.6836542,115.8583358", "沈阳": "41.8073212,123.4304496", "悉尼": "31.5773853,105.9732341", "厦门": "24.4796151,118.0893905", "宁波": "29.8683360,121.5439900", "长春": "43.8170838,125.3235296", "贵阳": "26.6459309,106.6333750", "太原": "37.8705544,112.5507374", "温州": "27.9942430,120.6993555", "合肥": "31.823434,117.236884", "哈尔滨": "45.8032604,126.5352454", "海南": "36.2810308,100.6135479", "嘉兴": "30.7539240,120.7585430", "台州": "28.8285005,121.1758343", "舟山": "29.9854444,122.2065964", "金华": "29.0786960,119.6474768", "衢州": "28.9358827,118.8740180", "丽水": "28.4516952,119.9168746", "中山": "22.5159724,113.3927433", "佛山": "23.0217208,113.1213158", "珠海": "22.2709398,113.5772608", "兰州": "36.0612548,103.8343765", "常熟": "31.6539543,120.7524797", "吴江": "31.1577263,120.6440332", "南通": "31.9799973,120.8943244", "南充": "30.843297,106.117231", "徐州": "34.2598267,117.1910799", "连云港": "34.5965504,119.2212870", "湛江": "21.2707642,110.3592549", "扬州": "32.3942369,119.4128538", "绍兴": "29.9957620,120.5861090", "烟台": "37.4638194,121.4479258", "潍坊": "36.7068242,119.1619288", "唐山": "39.6304759,118.1804074", "呼和浩特": "40.8423100,111.7488469", "吉林": "43.8378835,126.5495724", "保定": "38.8739720,115.4646301", "包头": "40.6574474,109.8403852", "威海": "37.5130682,122.1204195", "日照": "35.4163773,119.5268883", "邯郸": "36.6122666,114.4929676", "西宁": "36.6162889,101.7787565", "洛阳": "34.6228843,112.4565629", "湘潭": "27.8563254,112.9073395", "株洲": "27.8278915,113.1338907", "宜昌": "30.6919668,111.2864709", "绵阳": "31.4633766,104.7412737", "镇江": "32.1997885,119.4569276", "泰州": "32.4565838,119.9230460", "江门": "22.5787696,113.0818700", "北海": "21.4811977,109.1199507", "柳州": "24.3253965,109.4158662", "汕头": "23.3533618,116.6819429", "顺德": "22.8042561,113.2943974", "廊坊": "39.5210167,116.7066508", "赣州": "25.8292089,114.9335527", "三亚": "18.2526851,109.5120298", "淄博": "36.8134972,118.0550074", "芜湖": "31.3387902,118.3851556", "鞍山": "41.1085465,122.9946397", "菏泽": "35.2337502,115.4806561", "聊城": "36.4566965,115.9853711", "秦皇岛": "39.9357047,119.6018328", "东营": "37.4353822,118.6754870", "鄂尔多斯": "39.6081820,109.7812020", "淮安": "33.6110838,119.0157552", "宝鸡": "34.3725290,107.1337853", "张家港": "31.8754037,120.5556304", "马鞍山": "31.6967876,118.5046571", "泉州": "24.9073983,118.5871139", "银川": "38.4871938,106.2309089", "太仓": "31.4498120,121.1089054", "湖州": "30.8943600,120.0868180", "德州": "37.4509195,116.3025872", "晋城": "35.4908696,112.8517682", "玉林": "22.6366327,110.1557504", "江阴": "31.9206736,120.2849462", "宿迁": "33.9620831,118.2752895", "海口": "20.0301288,110.3384399", "保亭": "18.647643,109.702187", "阿巴嘎旗": "114.97, 44.03", "阿巴嘎": "114.97, 44.03", "阿克苏": "41.15,80.29", "阿勒泰": "47.86, 88.14", "安康": "32.7,109.02", "安庆": "30.52,117.03", "安顺": "26.25,105.92", "安阳": "36.1,114.35", "巴中": "31.86,106.73", "白城": "45.63,122.82", "百色": "23.91,106.62", "蚌埠": "32.93,117.34", "本溪": "41.3,123.73", "滨州": "37.3,118.03", "沧州": "38.33,116.83", "长治": "36.18,113.0", "常德": "29.05,111.69", "巢湖": "31.62,117.87", "朝阳": "41.58,120.42", "潮州": "23.68,116.63", "郴州": "25.79,113", "承德": "40.97,117.93", "澄迈": "19.75,110", "赤峰": "42.28,118.87", "崇左": "22.42,107.37", "滁州": "32.33,118.31", "淳安": " 29.61,119.05", "慈溪": "30.18,121.23", "从化": "23.57,113.55", "大庆": "46.58,125.03", "大同": "40.12,113.3 ", "丹东": "40.13,124.37", "德阳": "31.13,104.37", "定安": "19.68,110.31", "定西": "35.57,104.57", "东方": "19.09,108.64", "奉化": "29.66,121.41", "抚顺": "41.97,123.97", "抚州": "28,116.34", "阜新": "42,121.65", "阜阳": "32.89, 115.81", "富阳": "30.07,119.9", "高淳": "31.32,118.87", "固原": "36.01,106.28", "广安": "30.48,106.61", "汉中": "33.07,108.04", "和田": "37.12,79.94", "河池": "24.7,108.06", "河源": "23.73, 114.68", "鹤壁": "35.9,114.17", "鹤岗": "47.33,130.3", "黑河": "50.22,127.53", "衡水": "37.72,115.72", "衡阳": "26.89,112.61", "怀化": "27.52,109.95", "淮北": "33.97,116.7", "淮南": "32.62,116.98", "黄冈": "30.44,114.87", "黄石": "30.2,115.09", "吉安": "27.12,114.97", "济宁": "35.38,116.5", "济源": "35.08,112.57", "佳木斯": "46.83,130.35", "建德": "29.49,119.27", "焦作": "35.24,113.21", "揭阳": "23.55,116.35", "锦州": "41.13,121.15", "荆门": "31.02,112.19", "景德镇": "29.3,117.22", "九江": "29.71,115.97", "酒泉": "39.71,98.5", "开封": "34.79,114.35", "克拉玛依": "45.59,84.77", "来宾": "23.76,109.2", "莱芜": "36.19,117.67", "丽江": "26.86,100.25", "溧水": "31.65,119.02", "辽阳": "41.28,123.17", "辽源": "42.97,125.15", "临安": "30.23,119.72", "临汾": "36.08,111.5", "临高": "19.91,109.69", "临沂": "35.11,118.36", "六安": "31.73,116.49", "六盘水": "26.58,104.82", "龙岩": "25.12,117.01", "娄底": "27.71,111.96", "泸州": "28.91,105.39", "漯河": "33.56,114.0", "茂名": "21.68,110.88", "梅州": "24.55,116.1", "牡丹江": "44.6,129.58", "内江": "29.59,105.04", "南平": "26.65,118.16", "南阳": "33.01,112.53", "宁德": "26.65,119.52", "宁海": "29.3,121.42", "平顶山": "33.75,113.29", "平凉": "35.51,106.68", "萍乡": "27.6,113.85", "莆田": "25.44,119", "濮阳": "35.71,114.98", "普洱": "23.07,101.03", "七台河": "45.82,130.8", "钦州": "21.96,108.61", "清远": "23.7,113.01", "庆阳": "36.03,107.8", "琼海": "19.25,110.4", "曲靖": "25.51,103.79", "三门峡": "34.76,111.19", "三明": "26.23,117.61", "商丘": "34.44,115.65", "上饶": "28.47,117.97", "韶关": "24.84,113.62", "邵阳": "27.22,111.5", "十堰": "32.65,110.79", "石河子": "44.27,85.9", "石嘴山": "39.04,106.39", "双鸭山": "46.65,131.17", "四平": "43.17,124.37", "宿州": "33.63,116.97", "绥化": "46.63,127", "遂宁": "30.52,105.5", "泰安": "36.18,117.13", "天水": "34.6,105.69", "铁岭": "42.32,123.85", "通化": "41.49,125.92", "通辽": "43.63,122.2", "桐庐": "29.8,119.64", "铜川": "35.09,109.11", "铜陵": "30.93,117.82", "铜仁": "27.73,109.2", "吐鲁番": "42.91,89.19", "屯昌": "19.36,110.1", "万宁": "18.8,110.39", "渭南": "34.52,109.5", "文昌": "19.61,110.72", "乌海": "39.67,106.82", "吴忠": "37.99,106.21", "梧州": "23.51,111.3", "武威": "37.94,102.61", "咸宁": "29.87,114.28", "咸阳": "34.36,108.72", "襄樊": "30.02,112.14", "襄阳": "32.02027,112.11281", "象山": "29.48,121.8", "孝感": "30.930712,113.922962", "新乡": "35.31,113.85", "新余": "27.81,114.92", "信阳": "32.13,114.0", "邢台": "37.05, 114.48", "许昌": "34.02,113.81", "宣城": "31.95,118.73", "雅安": "29.97,102.97", "延安": "36.6,109.47", "盐城": "33.38,120.13", "阳江": "21.85,111.9", "阳泉": "37.85,113.5", "伊春": "47.73,128.92", "宜宾": "29.77,104.56", "宜春": "27.81,114.3", "益阳": "28.6,112.33", "鹰潭": "28.23,117.02", "营口": "40.65,122.18", "永州": "26.22,111.63", "余姚": "30.04,121.16", "榆林": "38.3,109.77", "玉溪": "24.35,102.52", "岳阳": "29.37,113.09", "云浮": "22.93,112.02", "运城": "35.03,110.9", "枣庄": "34.86,117.57", "增城": "23.13,113.81", "张掖": "38.93,100.46", "漳州": "24.52,117.35", "昭通": "29.32,103.7", "肇庆": "23.05,112.4", "中卫": "37.51,105.18", "周口": "33.63,114.63", "驻马店": "32.98,114.02", "资阳": "30.19,104.6", "遵义": "27.7,106.9", "固安": "39.4333,116.3038", "香河": "39.7629,117.005", "陵水": "18.51,110.04", "大厂": "39.892954,116.99592", "宜兴": "31.346071,119.830069", "大理": "25.597589,100.236278", "瑞安": "27.78403,120.661762", "眉山": "30.081369,103.85507", "海门": "31.885216,121.16494", "海宁": "30.515221,120.687581", "义乌": "29.311326,120.081262", "温岭": "28.377456,121.392579", "临海": "28.864049,121.151535" };

        // 分辨率和缩放级别关系
        var ZOOMRES = {
            '4': 9700,
            '5': 7192,
            '6': 4096,
            '7': 2048,
            '8': 1024,
            '9': 512,
            '10': 256,
            '11': 128,
            '12': 64,
            '13': 32,
            '14': 16,
            '15': 8,
            '16': 4,
            '17': 2,
            '18': 1,
            '19': 0.5
        };

        var gmapOptions = {
            host: 'http://10.16.0.160',
            uri: 'http://10.16.0.160/s/dataviz/v2/config',
            ak: 'ZGE5NDg2OTkzMThhNDE3Mzg0N2I4YjdmNDI2YTAwYTY',
            tileHost: 'http://10.16.0.160'
        };

        // 瓦片图类型
        var mapStyle = {
            // 温暖
            warm: 'warm',
            // 清爽
            cool: 'cool',
            // 午夜
            midnight: 'midnight',
            // 铅笔画
            pencil: 'pencil',
            // 暗色
            dark: 'dark',
            // 高对比
            contrast: 'contrast',
            // 浪漫粉
            pink: 'pink',
            // 夜视
            vision: 'vision',
            // 探险
            adventure: 'adventure',
            // 魅蓝
            blue: 'blue',
            // 浅色
            light: 'light',
            // 清新
            fresh: 'fresh',
            // 自然
            natural: 'natural',
            // 政区
            admin: 'admin',
            // 旅游
            tourism: 'tourism',
            // 水系
            river: 'river',
            // 中文
            chinese: 'chinese'
        }

        // 地图类型
        var mapType = {
            //欧朋街道地图
            OpenStreetMap: 1,
            // 百度街道地图
            // BaiduMap: 2,
            // 百度卫星地图
            // BaiduMap_satel: 3,
            // 高德街道地图
            AMap: 4,
            // 高德卫星地图
            AMap_satel: 5,
            // 谷歌街道地图
            GoogleCnMap: 6,
            // 谷歌卫星地图
            GoogleCnMap_satel: 7,
            // 谷歌地形图
            GoogleTerrian: 8,
        };

        // 坐标转换
        var PointService = {
            Baidu: {
                wgs84: function(point) {
                    return G.Proj.Baidu.unproject(point[0], point[1]);
                },
                gcj02: function(point) {
                    return PointService.Wgs84.gcj02(PointService.Baidu.wgs84(point));
                },
                mercator: function(point) {
                    return PointService.Gcj02.mercator(PointService.Baidu.gcj02(point));
                }
            },
            Wgs84: {
                mercator: function(point) {
                    return PointService.Gcj02.mercator(PointService.Wgs84.gcj02(point));
                },
                baidu: function(point) {
                    return G.Proj.Baidu.project(point[0], point[1]);
                },
                gcj02: function(point) {
                    return G.Proj.Gcj.project(point[0], point[1]);
                }
            },
            Mercator: {
                Wgs84: function(point) {
                    return PointService.Gcj02.Wgs84(PointService.Mercator.gcj02(point));
                },
                baidu: function(point) {
                    return PointService.Wgs84.baidu(PointService.Mercator.Wgs84(point))
                },
                gcj02: function(point) {
                    return G.Proj.WebMercator.unproject(point[0], point[1]);
                }
            },
            Gcj02: {
                mercator: function(point) {
                    return G.Proj.WebMercator.project(point[0], point[1]);
                },
                Wgs84: function(point) {
                    return G.Proj.Gcj.unproject(point[0], point[1]);
                },
                baidu: function(point) {
                    return PointService.Wgs84.baidu(PointService.Gcj02.Wgs84(point))
                }
            }
        };

        var mapTypeLayers = {}
        //百度卫星图
        mapTypeLayers[mapType.BaiduMap_satel] = [
            ['BaiduMap', 'satel'],
            ['BaiduMap', 'sate']
        ];
        // 欧朋街道地图
        mapTypeLayers[mapType.OpenStreetMap] = [
            ['OpenStreetMap', ''],
        ];
        // 百度街道地图
        mapTypeLayers[mapType.BaiduMap] = [
            ['BaiduMap', 'street'],
        ];
        // 高德街道地图
        mapTypeLayers[mapType.AMap] = [
            ['AMap', 'street'],
        ];
        // 高德卫星地图
        mapTypeLayers[mapType.AMap_satel] = [
            ['AMap', 'satel'],
            ['AMap', 'sate']
        ];
        // 谷歌街道地图
        mapTypeLayers[mapType.GoogleCnMap] = [
            ['GoogleCnMap', 'street'],
        ];
        // 谷歌卫星地图
        mapTypeLayers[mapType.GoogleCnMap_satel] = [
            ['GoogleCnMap', 'satel'],
            ['GoogleCnMap', 'sate']
        ];
        // 谷歌地形图
        mapTypeLayers[mapType.Googvarerrian] = [
            ['GoogleCnMap', 'terrian'],
        ];

        //设置默认样式
        function BaseMap(param) {
            var me = this;
            me.param = $.extend({}, {
                //地图容器
                map: 'map',
                //是否显示环绕地图，该属性不支持IE7/8浏览器
                wrap: false,
                //限制最小比例尺
                maxRes: 9700,
                //是否启用滚轮事件
                scrollZoom: true,
                // 缩放级别
                zoom: null,
                // 城市名称
                city: null,
                //坐标点
                point: null,
                rotate: 0, //地图旋转角度  开启WEBGL模式参数
                pitch: 0, //地图倾斜角度  开启WEBGL模式参数
                mapType: mapType.AMap
            }, param);
            me.methods = {};
            me.overlays = {};
            me.tips = {};
            me.initialize();
        };

        // 初始化地图
        BaseMap.prototype.initialize = function() {
            var me = this;
            var mapParamter = {
                maxRes: me.param.maxRes,
                continuouslyZoom: false,
                zoomAnim: true,
                // 设置初始状态
                initStatus: {
                    res: ZOOMRES[me.param.zoom] || 7192,
                    rotate: me.param.rotate,
                    pitch: me.param.pitch
                }
            };

            if (me.param.point && me.param.point[0] && me.param.point[1]) {
                mapParamter.initStatus.center = me.param.point;
            } else {
                mapParamter.initStatus.center = me.getCityCenter(me.param.city);
            }

            var gmap = me.gmap = new G.Map(me.param.map, mapParamter);
            me.gmap = gmap;
            me.mapContainer = document.getElementById(me.param.map);
            //设置地图类型
            me.setMapType(me.param.mapType);
            me.setCenterAndZoom(me.param.city, me.param.zoom);
            me._createLayer();
            $.each(['moveEnd', 'resize', 'zoomEnd'], function(i, j) {
                me.addEventListener(j);
            });
        }

        /*
            设置瓦片图样式
            geoheyAk = N2YyZDcyNzcyODdhNGEwYmI2YzRjNjg5ZWZjYzNlODI
            'http://10.16.0.160/s/mapping/warm/all?z={z}&x={x}&y={y}&retina={i}&ak='
        */

        BaseMap.prototype.setCityBaseMap = function(param) {
            var geoheyAk = 'N2YyZDcyNzcyODdhNGEwYmI2YzRjNjg5ZWZjYzNlODI'
            var me = this;
            var geoheyUrl = 'http://geohey.com/s/mapping/' + param + '/all?z={z}&x={x}&y={y}&retina={i}&ak=' + geoheyAk;
            var layer = new G.Layer.Tile(geoheyUrl, {
                tileEnlarge: false
            });
            return layer;
        };

        /*
            更换地图类型 
        */
        BaseMap.prototype.setMapType = function(type) {
            var me = this;
            //清除底图(先获取底图)
            for (var i = 0; i < (me.mapTypeLayers || []).length; i++) {
                me.mapTypeLayers[i].remove();
            }
            me.mapTypeLayers = [];
            $.each(mapTypeLayers[type], function(i, j) {
                var method = G.Layer[j[0]];
                if (method) {
                    var layer = new method(j[1] || '');
                    me.gmap.addLayer(layer);
                    me.mapTypeLayers.push(layer)
                    layer.bringToBottom();
                }
            });
            me.adjustByLayer(me.mapTypeLayers[me.mapTypeLayers.length - 1]);
        };

        // 清除所有图层
        BaseMap.prototype.clearLayers = function() {
            var me = this;
            var layers = me.gmap.getLayers();
            for (var i in layers) {
                layers[i].remove();
            }
        };
        //获取城市中心点
        BaseMap.prototype.getCityCenter = function(point) {
            var me = this;
            if (typeof point == 'string') {
                var cityName = point;
                point = null;
                cityName = cityName.replace("市", "");
                var arr = (CITYCENTER[cityName] || '').split(',');
                if (arr.length == 2) {
                    point = [arr[1], arr[0]];
                    return PointService.Baidu.mercator(point);
                }
            }
        };

        // 设置中心点
        BaseMap.prototype.setCenterAndZoom = function(point, zoom) {
            var me = this;
            var points = me.getCityCenter(point);

            if (points) {
                me.gmap.zoomRes(points, ZOOMRES[zoom]);
            }
        };

        // 设置地图中心
        BaseMap.prototype.setCenter = function(point) {
            var me = this;
            var points = me.getCityCenter(point);
            if (points) {
                me.gmap.view(points);
            }
        };

        // 设置缩放分辨率
        BaseMap.prototype.setZoom = function(zoom) {
            var me = this;
            var point = me.gmap.getCenter();
            if (point) {
                me.gmap.zoomRes(point, ZOOMRES[zoom])
            }
        };

        // 适配地图类型
        BaseMap.prototype.adjustByLayer = function(layer) {
            var me = this;
            me.gmap.options.minRes = layer.options.minRes;
            me.gmap.options.maxRes = layer.options.maxRes;
            var res = me.gmap.getResolution();
            var size = me.gmap.getSize();
            var center = me.gmap.getCenter();
            me.gmap.view(center, size[0] * res, size[1] * res, me.gmap.getRotate());
        };

        // 创建图层集合
        BaseMap.prototype._createLayer = function() {
            var me = this;
            me.layers = {};
            var args = ['polygon', 'circle', 'text', 'image', 'mapTip'];
            $.each(args, function(i, j) {
                me.layers[j] = new G.Layer.Graphic();
                me.layers[j].addTo(me.gmap);
                if (j != 'mapTip') {
                    me.layers[j].addListener("graphicClicked", function(ev) {
                        me._layerClick = true;
                        var graphic = ev.graphic;
                        if (graphic) {
                            var type = graphic._overlayType,
                                key = graphic._overlayKey;
                            var overlay = me.overlays[type][key];
                            if (typeof overlay.eventListener.click == 'function') {
                                overlay.eventListener.click(overlay);
                            }
                        }
                    });
                    me.layers[j].addListener("graphicOver", function(ev) {
                        me._layerClick = true;
                        var graphic = ev.graphic;
                        if (graphic) {
                            var type = graphic._overlayType,
                                key = graphic._overlayKey;
                            var overlay = me.overlays[type][key];
                            if (typeof overlay.eventListener.mouseover == 'function') {
                                overlay.eventListener.mouseover(overlay);
                            }
                        }
                    });
                    me.layers[j].addListener("graphicOut", function(ev) {
                        me._layerClick = true;
                        var graphic = ev.graphic;
                        if (graphic) {
                            var type = graphic._overlayType,
                                key = graphic._overlayKey;
                            var overlay = me.overlays[type][key];
                            if (typeof overlay.eventListener.mouseout == 'function') {
                                overlay.eventListener.mouseout(overlay);
                            }
                        }
                    });

                }

            });
        };

        // 图层反转
        BaseMap.prototype.reverseLayers = function() {
            var me = this;
            $.each(Object.keys(me.layers), function(i, j) {
                me.layers[j].bringToTop()
            })
        };

        // 设置dataviz层
        BaseMap.prototype.getDataViz = function(dataViz, eventListener) {
            var me = this;
            me.dataViz = dataViz;
            me.dataVizEventListener = $.extend(true, {
                click: null,
                mousemove: null
            }, eventListener);
            var layerList = G.DataViz.get(me.dataViz, gmapOptions);
            me.dataVizList = layerList;
            for (var i = 0; i < layerList.length; i++) {
                var item = layerList[i];
                var layer = item.layer;
                me.gmap.addLayer(layer);
                if (item.animated) {
                    var timelineControl = new G.Control.Timeline();
                    me.gmap.addControl(timelineControl);
                    timelineControl.setLayer(layer);
                }
                if (item.utfGridLayer) {
                    if (typeof me.dataVizEventListener.mousemove == 'function') {
                        item.utfGridLayer.options.showAttr = false;
                        me.gmap.addLayer(item.utfGridLayer);
                        item.utfGridLayer.addListener('gridMouseMove', me.dataVizEventListener.mousemove);
                    }
                }
            };
            var highLightLayer = new G.Layer.Graphic();
            me.gmap.addLayer(highLightLayer);

            me.methods.dataVizClick = function(e) {
                setTimeout(function() {
                    if (me._layerClick) {
                        delete me._layerClick;
                        return;
                    }
                    var tolerance = 0;
                    if (window.mobile) {
                        tolerance = tolerance < 8 ? 8 : tolerance;
                    } else {
                        tolerance = tolerance < 5 ? 5 : tolerance;
                    }
                    // 将屏幕坐标转换为地图坐标
                    var mapPoint = me.gmap.toMap([e.screenX, e.screenY]);

                    var ld = me.gmap.toMap([e.screenX - tolerance, e.screenY + tolerance]);
                    var ru = me.gmap.toMap([e.screenX + tolerance, e.screenY - tolerance]);
                    var rect = [ld[0], ld[1], ru[0], ru[1]];
                    highLightLayer.clear();
                    me.gmap.hidePopup();
                    $.ajax({
                        url: 'http://10.16.0.160/s/tmp_data/' + me.dataViz[0].dataUid + '/query?ak=' + gmapOptions.ak,
                        type: 'post',
                        dataType: 'json',
                        data: {
                            'geometry': JSON.stringify(rect),
                            'returnGeometry': true
                        },
                        success: function(data) {
                            // console.log(data);
                            if (data) {
                                var content = '';
                                var attrs = data.data.features[0].attrs;
                                var labelPoint = G.GeomUtil.labelPoint(data.data.features[0].geom)
                                if (typeof me.dataVizEventListener.click == 'function')
                                    me.dataVizEventListener.click(e, attrs);
                            }
                        }
                    });
                }, 200)
            };
            me.gmap.bind('click', me.methods.dataVizClick)
            me.reverseLayers();
        };

        BaseMap.prototype.removeDataViz = function() {
            var me = this;
            if (me.dataVizList && me.dataVizList.length > 0) {
                $.each(me.dataVizList, function(i, j) {
                    j.layer.remove();
                })
                delete me.dataVizList;
                me.gmap.unbind('click', me.methods.dataVizClick)
                delete me.methods.dataVizClick;
            }
        };

        /*
            将覆盖物添加到图层中
            type:类别(快速查找)
            key
            overlay
        */
        BaseMap.prototype.addOverlay = function(type, key, overlay) {
            var me = this;
            me.overlays = me.overlays || {};
            me.overlays[type] = me.overlays[type] || {};
            me.overlays[type][key] = overlay;
            overlay.layer._overlayType = type;
            overlay.layer._overlayKey = key;
            overlay.layer.addTo(me.layers[overlay.type]);
        };

        //清除单个覆盖物
        BaseMap.prototype.removeOverlay = function(type, key) {
            var overlays = this.overlays || {};
            var overlay = (overlays[type] || {})[key];
            if (overlay) {
                overlay.layer.remove()
                delete this.overlays[type][key];
            }
        };

        // 清除所有覆盖物
        BaseMap.prototype.clearOverlays = function() {
            var me = this;
            var overlays = me.overlays || {};
            var tips = me.tips || {};
            for (var k in tips) {
                me.removeMapTip(tips[k])
            }
            me.tips = {};
            for (var i in overlays) {
                overlays[i].layer.clear();
                delete me.overlays;
            }
        };

        /*刷新mapTip 的位置*/
        BaseMap.prototype.tipPositionRefresh = function() {
            var me = this;
            var tips = me.tips || {};
            for (var k in tips) {
                var tip = tips[k];
                if (tip.mapLine) tip.drawMapLine();
                else tip.setPosition();
            }
        };

        /* 添加地图监听事件 */
        BaseMap.prototype.addEventListener = function(type, target) {
            var me = this;
            //添加事件
            var func = (type == 'moveEnd' || type == 'resize' || type == 'zoomEnd') ?
                function(p) {
                    me.tipPositionRefresh();
                    if (typeof target == 'function') target(p, me);
                } : function(p) { target(p, me); };
            me.events = me.events || {};
            me.events[type] = func;
            me.gmap.bind(type, func);
        };

        /*
            清除地图监听事件
        */
        BaseMap.prototype.removeEventListener = function(type) {
            this.events = this.events || {};
            this.gmap.unbind(type, this.events[type]);
        };

        //添加弹窗
        BaseMap.prototype.addMapTip = function(mapTip) {
            var id = mapTip.opts.id,
                me = this,
                tips = this.tips || {};
            var mapNode = me.mapContainer;
            if (!tips[id]) {
                $(mapNode).after(mapTip.$node);
                tips[id] = mapTip;
                mapTip.draggable(this.gmap);
            }
            mapTip.setPosition();
        };

        //移除弹窗
        BaseMap.prototype.removeMapTip = function(mapTip) {
            if (mapTip) {
                var id = mapTip.opts.id;
                var tips = this.tips || {};
                if (tips[id]) delete tips[id];
                mapTip.destroy();
            }
        };

        /*
           添加自定义 文字标注或者图形标注
           shape: ['text']文字 | ['image']图片
        */
        function CreateMarks(param) {
            this.param = $.extend({}, {
                point: null,
                type: null,
                shape: '', // 默认为 circle， 可选 text  image
                size: [30, 35], // 图形的尺寸，circle图形只会使用数组中第一个值作为直径，text图形只会使用数组中第一个值作为文字的尺寸
                offset: [0, -35], // 偏移量
                image: '', // 引用图片的地址
                clickable: false //可点击的标识, 默认是true
            }, param);
            this.initialize();

        };

        CreateMarks.prototype.initialize = function() {
            var me = this;
            me.type = me.param.shape;
            var centerPort = me.param.point;

            var layer = new G.Graphic.Point(centerPort, null, {
                shape: me.param.shape,
                size: me.param.size,
                offset: me.param.offset,
                image: me.param.image,
                clickable: me.param.clickable
            });
            me.layer = layer;
        };

        CreateMarks.prototype.addEvent = function(eventListener) {
            this.eventListener = $.extend(true, {
                    click: null,
                    mouseover: null,
                    mouseout: null
                }, eventListener);
        }
        // 添加多面覆盖物
        function Polygon(pointStr, opts, eventListener) {
            var me = this;
            me.opts = $.extend({}, {
                point: null,
                type: 'polygon',
                fillColor: 'rgba(105,241,214,0.5)', //填充色
                fillOpacity: 0.5, //填充透明度
                outlineWidth: 2,
                outlineColor: 'rgb(9,95,78)', // 边框线颜色
                clickable: true
            }, opts);

            me.initialize();
            me.eventListener = $.extend(true, { click: null }, eventListener)

        };

        // 
        Polygon.prototype.initialize = function() {
            var me = this;
            me.type = me.opts.type;
            me.point = me.opts.point;

            var layer = new G.Graphic.Polygon(me.point, null, {
                fillColor: me.opts.fillColor, //填充色
                fillOpacity: me.opts.fillOpacity, //填充透明度
                outlineWidth: me.opts.outerWidth,
                outlineColor: me.opts.outlineColor, // 边框线颜色
                clickable: me.opts.clickable
            });
            me.layer = layer;
        };

        /*
            id: mapTip-id
            point: 定位的位置
            innerHtml: tip的html
            style: tip样式
            gmap: 极海地图
            screwed: 固定（鼠标离开不会隐藏）
            callback: {
                //关闭
                close: function(){},
                screwed: function(){}
            }
        */
        function MapTip(gMap, parameters) {
            var me = this;
            me.opts = $.extend(true, {
                //id
                id: '',
                //坐标点
                point: null,
                type: 'mapTip',
                //样式
                style: null,
                //样式名
                className: null,
                //拖动 （默认禁用） enable:启用  disabled-禁用
                draggable: 'disabled',
                //是否固定
                screwed: false,
                //弹框内容(要生成最外层DIV)
                innerHtml: '',
                //tip位置：top bottom left right
                position: '',
                //偏移值
                offset: { top: 0, bottom: 0, left: 0, right: 0 },
                callback: {
                    //关闭事件
                    close: function() {},
                    //固定（显示、隐藏 回调）
                    screwed: function() {},
                    //help-index-count 显示隐藏 监听事件
                    display: null
                },
                methods: {
                    mouseover: null,
                    mouseout: null
                },
                //滚动条参数
                niceScroll: { styler: "fb", cursorcolor: "#27cce4", cursorwidth: '5', cursorborderradius: '10px', background: '#091d3d', spacebarenabled: false, cursorborder: '0', zindex: '1000' },
                //拉线样式  
                polylineStyle: { lineColor: '#0696eb', lineWidth: 2, lineDashArray: [4] }
            }, parameters);
            me.gMap = gMap;
            //添加标签图层
            me.initialize();
        };

        //初始化弹窗
        MapTip.prototype.initialize = function() {
            var me = this;
            me.type = me.opts.type;
            var $div = $('<div id="' + me.opts.id + '" style="position:absolute;' + (me.opts.style || 'left:0;top:0;') + '" class="' + (me.opts.className || 'suspendbox') + '">' + me.opts.innerHtml + '</div>');
            if (me.opts.draggable == 'enable')
                $div.find('.tb_tit').addClass('cursor_move');
            $div.find('.help-contentHtml').html('<div style="text-align:center;"><div class="common-loading"><div class="load-container"><span class="pillar" style="animation-delay:.1s;"></span><span class="pillar" style="animation-delay:.2s;"></span><span class="pillar" style="animation-delay:.3s;"></span><span class="pillar" style="animation-delay:.4s;"></span><span class="pillar" style="animation-delay:.5s;"></span><span class="pillar" style="animation-delay:.6s;"></span><p>loading</p></div></div></div>');

            //关闭
            $div.find('.btn-close').click(function() {
                // console.log(me.gMap)
                me.gMap.removeMapTip(me);
                if (typeof me.opts.callback.close == 'function')
                    me.opts.callback.close($(this));
            });
            //固定窗口
            $div.find('.help-screwed').click(function() {
                var temp = $(this);
                if (me.opts.screwed) {
                    me.opts.screwed = false;
                    temp.removeClass('open').addClass('closed');
                    //删除mapLine
                    if (me.mapLine) {
                        me.mapLine.remove()
                        delete me.mapLine;
                    }
                } else {
                    me.opts.screwed = true;
                    temp.removeClass('closed').addClass('open');
                    me.drawMapLine();
                }
                if (typeof me.opts.callback.screwed == 'function')
                    me.opts.callback.screwed(me.opts.screwed);
            });

            //添加
            me.$node = $div;
            if (me.opts.methods.mouseover) {
                $div.mouseover(function(e) {
                    me.opts.methods.mouseover(e, me);
                });
            }
            if (me.opts.methods.mouseout) {
                $div.mouseout(function(e) {
                    me.opts.methods.mouseout(e, me);
                });
            }
        };

        //设置定位
        MapTip.prototype.setPosition = function(point) {
            if (this.hidden) return;
            var me = this,
                gmap = me.gMap.gmap;

            if (point) me.opts.point = point;

            var mapNode = me.gMap.mapContainer;
            var pixel = gmap.toScreen(me.opts.point);

            var position = { left: 0, top: 0 };
            var nodeHeight = me.$node.outerHeight(true),
                nodeWidth = me.$node.outerWidth(true),
                mapSize = gmap.getSize();

            if (me.opts.position) {
                switch (me.opts.position) {
                    case "top":
                        position = { top: pixel[1] - nodeHeight, left: pixel[0] - nodeWidth / 2 }
                        break;
                    case 'bottom':
                        position = { top: pixel[1], left: pixel[0] - nodeWidth / 2 }
                        break;
                    case 'left':
                        position = { top: pixel[1] > nodeHeight / 2 ? pixel[1] - nodeHeight / 2 : 0, left: pixel[0] - nodeWidth }
                        break;
                    case 'right':
                        position = { top: pixel[1] > nodeHeight / 2 ? pixel[1] - nodeHeight / 2 : 0, left: pixel[0] }
                        break;
                }

            } else {
                if (pixel[0] > nodeWidth && pixel[0] < mapSize[0] - nodeWidth / 2) {
                    position.top = pixel[1] > nodeHeight ? pixel[1] - nodeHeight : pixel[1];
                    position.left = pixel[0] - nodeWidth / 2;
                } else if (pixel[0] < nodeHeight) {
                    //显示在右侧
                    position.left = pixel[0];
                    position.top = pixel[1] > nodeHeight / 2 ? pixel[1] - nodeHeight / 2 : 0;
                } else if (pixel[0] > mapSize[0] - nodeWidth / 2) {
                    position.left = pixel[0] - nodeWidth;
                    position.top = pixel[1] > nodeHeight / 2 ? pixel[1] - nodeHeight / 2 : 0;
                } else {
                    position.left = pixel[0] - me.$node.width() / 2;
                    position.top = pixel[1] > nodeHeight ? pixel[1] - me.$node.height() : pixel[1];
                }

            }
            position.top = position.top < pixel[1] ? position.top - me.opts.offset.top : position.top + me.opts.offset.bottom;
            if (position.left <= pixel[0] - nodeWidth) position.left = position.left - me.opts.offset.left;
            else if (position.left >= pixel[0]) position.left = position.left + me.opts.offset.right;
            //this.node.style.left = (pixel.x - mapNodePos.x) + 'px';
            //this.node.style.top = (pixel[1] - mapNodePos.y) + 'px';
            // console.log(position)
            me.$node.css({ left: position.left + 'px', top: position.top + 'px' })
        };

        /*
            拖拽
            status|mapNode
        */
        MapTip.prototype.draggable = function() {
            var me = this;
            if (typeof arguments[0] == 'string') {
                arguments[0] == 'enable' ? me.$node.draggable('enable') : me.$node.draggable('disabled');
            } else if (me.opts.draggable == 'enable') {
                //开启拖拽
                me.$node.draggable({
                    containment: 'parent',
                    scroll: false,
                    handle: ".cursor_move",
                    drag: function(e) {
                        if (!me.opts.screwed) {
                            me.opts.screwed = true;
                            me.$node.find('.help-screwed').
                            removeClass('closed').
                            addClass('open');
                        }
                        me.drawMapLine();
                    }
                });
            }
        };

        //画线
        MapTip.prototype.drawMapLine = function() {
            var me = this,
                gmap = me.gMap.gmap;
            var mapNode = me.gMap.mapContainer,
                mapNodePos = GetAbsPoint(mapNode);
            //绘制 point 与 tip 联系
            var nodePos = GetAbsPoint(me.$node[0]);
            var left = nodePos.x - mapNodePos.x,
                top = nodePos.y - mapNodePos.y,
                width = me.$node.width(),
                height = me.$node.height();
            //每次链接到最顶端
            top += 20;
            left += width / 2;
            var draggablePoint = gmap.toMap([left, top]);
            var p2 = [draggablePoint[0], me.opts.point[1]];
            var points = [draggablePoint, p2, me.opts.point];

            if (me.mapLine) {
                me.mapLine.updateGeom(points);
            } else {
                var line = me.mapLine = new G.Graphic.Polyline(points, null, me.opts.polylineStyle);
                //添加到图层中 
                me.layer = line;
                // line.addTo(mapTipLayer);
                setTimeout(function() {
                    //设置svg的zIndex
                    var overlaySvg = $('#' + mapNode.id + ' svg'),
                        zIndex = overlaySvg.css('z-index');
                    if (parseInt(zIndex) != zIndex) overlaySvg.css('z-index', 99);
                }, 20);
            }
        };

        //销毁maptip
        MapTip.prototype.destroy = function() {
            if (this.mapLine) {
                this.mapLine.remove();
                delete this.mapLine;
            }
            this.$node.remove();
        };

        /*显示*/
        MapTip.prototype.show = function() {
            this.hidden = false;
            this.$node.show();
        };

        /*隐藏*/
        MapTip.prototype.hide = function() {
            if (this.mapLine) {
                this.mapLine.remove()
                delete this.mapLine;
            }
            this.hidden = true;
            this.$node.hide();
        };

        MapTip.prototype.setContentHtml = function(indexHtml) {
            this.$node.find('.help-contentHtml').html(indexHtml);
            this.scroll();
        };

        //设置滚动条
        MapTip.prototype.scroll = function() {
            var me = this;
            if (me.$node.find('.nicescroll-rails').length > 0) {
                me.$node.find('.nice-scroll').getNiceScroll().resize();
            } else {
                me.$node.find('.nice-scroll').niceScroll(me.opts.niceScroll);
            }
        };

        exports.gmap = BaseMap;
        exports.gtip = MapTip;
        exports.createMarks = CreateMarks;
        exports.PointService = PointService;
        exports.polygon = Polygon;
        exports.mapStyle = mapStyle; //瓦片图样式
        exports.mapType = mapType; // 地图类型
        exports.gmapOptions = gmapOptions;
    }));