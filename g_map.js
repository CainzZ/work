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

        var gmapOptions = {
            host: 'http://10.16.0.160',
            uri: 'http://10.16.0.160/s/dataviz/v2/config',
            ak: 'ZGE5NDg2OTkzMThhNDE3Mzg0N2I4YjdmNDI2YTAwYTY',
            tileHost: 'http://10.16.0.160'
        };

        // 地图类型
        var mapType = {
            //欧朋街道地图
            OpenStreetMap: 1,
            // 百度街道地图
            BaiduMap: 2,
            // 百度卫星地图
            BaiduMap_satel: 3,
            // 高德街道地图
            AMap: 4,
            // 高德卫星地图
            AMap_satel: 5,
            // 谷歌街道地图
            GoogleCnMap: 6,
            // 谷歌卫星地图
            GoogleCnMap_satel: 7
        };
        //设置默认样式
        function BaseMap(param) {
            this.param = $.extend({}, {
                //地图容器
                map: 'map',
                //是否显示环绕地图，该属性不支持IE7/8浏览器
                wrap: false,
                //限制最小比例尺
                maxRes: 9783.9396205,
                //是否启用滚轮事件
                scrollZoom: true,
                //分辨率 [地图级别]
                res: 9783.939621,
                // 城市名称
                city: null,
                //坐标点
                point: {
                    x: null,
                    y: null
                },
                rotate: 0, //地图旋转角度  开启WEBGL模式参数
                pitch: 0, //地图倾斜角度  开启WEBGL模式参数
            }, param);

            this.overlays = {};
            this.tips = {};
            this.initialize();
            // console.log(this.removeMapTip())
        };

        // 初始化地图
        BaseMap.prototype.initialize = function() {
            var me = this;
            var gmap = me.map = new G.Map(me.param.map, {
                // clickable: false,//应该是没有底图点击事件
                maxRes: me.param.maxRes,
                // 设置初始状态
                initStatus: {
                    // center: me.param.point, //地图中心
                    res: me.param.res,
                    rotate: me.param.rotate,
                    pitch: me.param.pitch
                }
            });

            if (me.param.point.x && me.param.point.y) {
                var point = G.Proj.WebMercator.project(me.param.point.x, me.param.point.y);
                //设置地图中心
                gmap.centerAt(point);
            }

            this.gmap = gmap;
            // console.log(gmap)

            this.mapContainer = document.getElementById(this.param.map);
        }


        /*
            
            更换地图类型  黑色底图目前不能这么添加
            需要直接瓦片图链接加入
            先清除所有图层 BaseMap.prototype.clearLayers（）
            然后调用  BaseMap.prototype.adjustByLayer（）
        
        */

        BaseMap.prototype.setMapType = function(type) {
            var mapTypeLayer;
            var me = this;
            switch (type) {
                case mapType.OpenStreetMap:
                    // 欧朋街道地图
                    me.clearLayers()
                    mapTypeLayer = new G.Layer.OpenStreetMap();
                    me.gmap.addLayer(mapTypeLayer);
                    me.adjustByLayer(mapTypeLayer);
                    break;
                case mapType.BaiduMap:
                    //百度街道地图
                    me.clearLayers()
                    mapTypeLayer = new G.Layer.BaiduMap('street');
                    me.gmap.addLayer(mapTypeLayer);
                    me.adjustByLayer(mapTypeLayer);
                    break;
                case mapType.BaiduMap_satel:
                    // 百度卫星图
                    me.clearLayers()
                    mapTypeLayer = new G.Layer.BaiduMap('sate');
                    me.gmap.addLayer(mapTypeLayer);
                    mapTypeLayer = new G.Layer.BaiduMap('satel');
                    me.gmap.addLayer(mapTypeLayer);
                    me.adjustByLayer(mapTypeLayer);
                    break;
                case mapType.AMap:
                    // 高德街道地图
                    me.clearLayers()
                    mapTypeLayer = new G.Layer.AMap('street');
                    me.gmap.addLayer(mapTypeLayer);
                    me.adjustByLayer(mapTypeLayer);
                    break;
                case mapType.AMap_satel:
                    // 高德卫星图
                    me.clearLayers()
                    mapTypeLayer = new G.Layer.AMap('sate');
                    me.gmap.addLayer(mapTypeLayer);
                    mapTypeLayer = new G.Layer.AMap('satel');
                    me.gmap.addLayer(mapTypeLayer);
                    me.adjustByLayer(mapTypeLayer);
                    break;
                case mapType.GoogleCnMap:
                    // google街道地图
                    me.clearLayers()
                    mapTypeLayer = new G.Layer.GoogleCnMap('street');
                    me.gmap.addLayer(mapTypeLayer);
                    me.adjustByLayer(mapTypeLayer);
                    break;
                case mapType.GoogleCnMap_satel:
                    // google卫星图
                    me.clearLayers()
                    mapTypeLayer = new G.Layer.GoogleCnMap('satel');
                    me.gmap.addLayer(mapTypeLayer);
                    me.adjustByLayer(mapTypeLayer);
                    break;

            }
        }

        // 清除所有图层
        BaseMap.prototype.clearLayers = function() {
            var me = this;
            var layers = me.gmap.getLayers();
            for (var i in layers) {
                layers[i].remove();
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
            var self = this;
            self.layers = {};

            // 图形标注图层
            var imgLayer = self.layers.imgLayer = new G.Layer.Graphic();
            imgLayer.addTo(self.gmap);
            // 文本标注图层
            var txtLayer = self.layers.txtLayer = new G.Layer.Graphic();
            txtLayer.addTo(self.gmap);
            // 原点标注图层
            var circleLayer = self.layers.circleLayer = new G.Layer.Graphic();
            circleLayer.addTo(self.gmap);
            // 覆盖物图层
            var polygonLayer = self.layers.polygonLayer = new G.Layer.Graphic();
            polygonLayer.addTo(self.gmap);
        }

        // 图层反转
        BaseMap.prototype.reverseLayers = function() {
            var me = this;
            console.log(me.layers)
            $.each(Object.keys(me.layers), function(i, j) {
                me.layers[j].bringToTop()
            })
        }

        // 设置dataviz层
        BaseMap.prototype.getDataViz = function(dataViz) {
            var me = this;
            me.dataVizEventListener = {
                eventListener: {
                    click: function() {},
                    mousemove: function() {}
                }
            };

            // 生成一个 id 为 label 的 div，追加到 html 中
            var label = document.createElement('div')
            label.id = 'label'
            document.body.appendChild(label)
            label.style.position = 'absolute';
            label.style.height = '20px';
            label.style.background = '#000';
            label.style.color = '#fff';
            label.style.lineHeight = '20px';
            label.style.padding = '0 5px';
            label.style.borderRadius = '5px';

            var layerList = G.DataViz.get(dataViz, gmapOptions);
            //翻转


            var layerArray = [];

            for (var i = 0; i < layerList.length; i++) {
                var item = layerList[i];
                var layer = item.layer;
                me.gmap.addLayer(layer);

                layerArray.push({
                    uid: item.dataUid,
                    type: item.dataType
                });

                if (item.animated) {
                    var timelineControl = new G.Control.Timeline();
                    me.gmap.addControl(timelineControl);
                    timelineControl.setLayer(layer);
                }
                if (item.utfGridLayer) {
                    item.utfGridLayer.options.showAttr = false;
                    me.gmap.addLayer(item.utfGridLayer);
                    item.utfGridLayer.addListener('gridMouseMove', function(e) {});
                }
            };
            layerArray.reverse();
            me.reverseLayers();
            // layerArray.bringToBottom()

            this.click()

            return layerArray;
        }

        // 地图添加点击事件
        BaseMap.prototype.click = function() {
            var me = this;
            //创建高亮图层
            var highLightLayer = new G.Layer.Graphic();
            me.gmap.addLayer(highLightLayer);

            me.gmap.bind('click', function() {
                var tolerance = 0;

                if (window.mobile) {
                    tolerance = tolerance < 8 ? 8 : tolerance;
                } else {
                    tolerance = tolerance < 5 ? 5 : tolerance;
                };

                var mapPoint = me.gmap.toMap([e.screenX, e.screenY]);

                var ld = me.gmap.toMap([e.screenX - tolerance, e.screenY + tolerance]);
                var ru = me.gmap.toMap([e.screenX + tolerance, e.screenY - tolerance]);
                var rect = [ld[0], ld[1], ru[0], ru[1]];

                highLightLayer.clear();
                me.gmap.hidePopup();

                G.Util.ajax('http://10.16.0.160/s/tmp_data/7d6f58d7902d4178816ed0488ef402b9/query?ak=' + gmapOptions.ak, {
                    type: 'post',
                    dataType: 'json',
                    data: {
                        geometry: rect
                    }
                });

                
            })
        }


        /*
            添加覆盖物
            type:类别(快速查找)
            key
            overlay
        */
        BaseMap.prototype.addOverlay = function(type, key, overlay) {
            this.overlays = this.overlays || {};
            this.overlays[type] = this.overlays[type] || {};
            this.overlays[type][key] = overlay;
            this.gmap.addLayer(overlay);

            // overlay.addTo(this.gmap);
        }

        //清除单个覆盖物
        BaseMap.prototype.removeOverlay = function(type, key) {
            var overlays = this.overlays || {};
            var overlay = (overlays[type] || {})[key];
            if (overlay) {
                // this.bmap.removeOverlay(overlay);
                // console.log(overlay)
                overlay.remove()
                delete this.overlays[type][key];
            }
        }

        /*刷新mapTip 的位置*/
        BaseMap.prototype.tipPositionRefresh = function() {
            var me = this;
            var tips = me.tips || {};
            for (var k in tips) {
                var tip = tips[k];
                if (tip.mapLine) tip.drawMapLine();
                else tip.setPosition();
            }
        }
        //添加弹窗
        BaseMap.prototype.addMapTip = function(mapTip) {
            var id = mapTip.opts.id,
                me = this,
                tips = this.tips || {};

            // var mapNode = this.gmap.getContainer();
            // var mapNode = this.param.map;
            var mapNode = me.mapContainer;
            // console.log(mapNode)
            if (!tips[id]) {
                $(mapNode).after(mapTip.$node);
                tips[id] = mapTip;
                mapTip.draggable(this.gmap);
            }
            mapTip.setPosition();
            // mapTip.scroll();
            // console.log(mapTip.scroll)
        }

        //移除弹窗
        BaseMap.prototype.removeMapTip = function(mapTip) {

            if (mapTip) {
                var id = mapTip.opts.id;
                var tips = this.tips || {};
                if (tips[id]) delete tips[id];

                mapTip.destroy();
            }
        }
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

        /*
            添加自定义 文字标注或者图形标注
            shape: ['text']文字 | ['image']图片
        */

        // function CreateMarker (opts){

        //     var layer = new G.Graphic.Point(centerPort, null, {
        //         shape: me.param.shape,
        //         size: me.param.size,
        //         offset: me.param.offset,
        //         image: me.param.image,
        //         clickable: true
        //     });

        //     this.xx=x;
        // if (me.param.shape == 'circle') {
        //         layer.addTo(circleLayer);
        //     } else if (me.param.shape == 'image') {
        //         layer.addTo(imgLayer);
        //     } else if (me.param.shape == 'text') {
        //         layer.addTo(txtLayer);
        //     }
        //     this.layer;
        // }
        function CreateMarks(info, param) {
            this.param = $.extend({}, {
                type: null,
                shape: '', // 默认为 circle， 可选 text  image
                size: [30, 35], // 图形的尺寸，circle图形只会使用数组中第一个值作为直径，text图形只会使用数组中第一个值作为文字的尺寸
                offset: [-10, -35], // 偏移量
                image: '', // 引用图片的地址
                clickable: true //可点击的标识, 默认是true
            }, param);
            this.initialize(info);
        };

        CreateMarks.prototype.initialize = function(info) {
            var me = this;
            me.type = me.param.shape;
            var centerPort = G.Proj.WebMercator.project(info.x, info.y);
            var layer = new G.Graphic.Point(centerPort, null, {
                shape: me.param.shape,
                size: me.param.size,
                offset: me.param.offset,
                image: me.param.image,
                clickable: true
            });

        };

        // 添加多面覆盖物
        function Polygon(pointStr, opts, events) {
            opts = $.extend({}, {
                fillColor: 'rgba(105,241,214,0.5)', //填充色
                fillOpacity: 0.5, //填充透明度
                outlineWidth: 2,
                outlineColor: 'rgb(9,95,78)', // 边框线颜色
                clickable: true
            }, opts);

            var me = this;
            if (pointStr) {
                var points = [];
                $.each(pointStr.split('|'), function(i, j) {
                    var arr = j.split(',');
                    points.push(G.Proj.WebMercator.project(parseFloat(arr[0]),
                        parseFloat(arr[1])));
                });

                var layer = new G.Graphic.Polygon(points, null, opts);
                layer.addTO(polygonLayer);
                me.events = events = events || {};
                for (var type in events) {
                    if (!events[type]) continue;
                    polygon.addEventListener(type, events[type])
                }
            }
        }

        function MapTip(gMap, parameters) {
            this.opts = $.extend(true, {
                //id
                id: '',
                //坐标点
                point: null,
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
                // niceScroll: { styler: "fb", cursorcolor: "#27cce4", cursorwidth: '5', cursorborderradius: '10px', background: '#091d3d', spacebarenabled: false, cursorborder: '0', zindex: '1000' },
                //拉线样式  见百度地图覆盖物（Polyline:PolylineOptions）
                polylineStyle: { lineColor: '#0696eb', lineWidth: 2, lineDashArray: [4] }
            }, parameters);
            this.gMap = gMap;
            //添加标签图层
            mapTipLayer = new G.Layer.Graphic();
            mapTipLayer.addTo(this.gMap.map);
            this.initialize();
        }

        //初始化弹窗
        MapTip.prototype.initialize = function() {
            var me = this;
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
            this.$node = $div;

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
        }

        //设置定位
        MapTip.prototype.setPosition = function(point) {
            if (this.hidden) return;
            var me = this,
                gmap = me.gMap.map;
            me.opts.point = point || me.opts.point;
            var mapNode = me.gMap.mapContainer;
            var pixel = gmap.toScreen(this.opts.point);

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
        }

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
                    // scroll: false,
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
        }

        //画线
        MapTip.prototype.drawMapLine = function() {
            var me = this,
                gmap = me.gMap.map;


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
                line.addTo(mapTipLayer);

                setTimeout(function() {
                    //设置svg的zIndex
                    var overlaySvg = $('#' + mapNode.id + ' svg'),
                        zIndex = overlaySvg.css('z-index');
                    if (parseInt(zIndex) != zIndex) overlaySvg.css('z-index', 99);
                }, 20);
            }

        }

        //销毁maptip
        MapTip.prototype.destroy = function() {
            if (this.mapLine) {
                // console.log(222);
                this.mapLine.remove();
                delete this.mapLine;
            }
            this.$node.remove();
        }

        /*显示*/
        MapTip.prototype.show = function() {
            this.hidden = false;
            this.$node.show();
        }

        /*隐藏*/
        MapTip.prototype.hide = function() {
            if (this.mapLine) {
                this.mapLine.remove()
                delete this.mapLine;
            }
            this.hidden = true;
            this.$node.hide();
        }

        MapTip.prototype.setContentHtml = function(indexHtml) {
            this.$node.find('.help-contentHtml').html(indexHtml);
            this.scroll();
        }
        //设置滚动条
        // MapTip.prototype.scroll = function() {
        //     var self = this;
        //     if (self.$node.find('.nicescroll-rails').length > 0) {
        //         self.$node.find('.nice-scroll').getNiceScroll().resize();
        //     } else {
        //         self.$node.find('.nice-scroll').niceScroll(self.opts.niceScroll);
        //     }
        // }

        exports.map = BaseMap;
        exports.gtip = MapTip;
        exports.createMarks = CreateMarks;
        exports.polygon = Polygon;
        // 地图类型
        exports.mapType = mapType;
        exports.gmapOptions = gmapOptions;
    }));
/*

    Flipped
      on
      you
*/