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
        //设置默认样式
        function BaseMap(param) {
            this.param = $.extend({}, {
                //地图容器
                map: 'map',
                //是否显示环绕地图，该属性不支持IE7/8浏览器
                // wrap: false,
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
                mapStyle: null
            }, param);
            this.overlays = {};
            this.tips = {};
            this.initialize();
            // console.log(this.removeMapTip())
        };
        //初始化地图
        BaseMap.prototype.initialize = function() {
            var me = this;
            var gmap = me.map = new G.Map(me.param.map, {
                // clickable: false,//应该是没有底图点击事件
                maxRes: me.param.maxRes,
                // 设置初始状态
                initStatus: {
                    // center: me.param.point, //地图中心
                    res: me.param.res,
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
                case 1:
                    // 欧朋街道地图
                    me.clearLayers()
                    mapTypeLayer = new G.Layer.OpenStreetMap();
                    me.gMap.map.addLayer(mapTypeLayer);
                    me.adjustByLayer(mapTypeLayer);
                    break;
                case 2:
                    //百度街道地图
                    me.clearLayers()
                    mapTypeLayer = new G.Layer.BaiduMap('street');
                    me.gMap.map.addLayer(mapTypeLayer);
                    me.adjustByLayer(mapTypeLayer);
                    break;
                case 3:
                    // 百度卫星图
                    me.clearLayers()
                    mapTypeLayer = new G.Layer.BaiduMap('sate');
                    me.gMap.map.addLayer(mapTypeLayer);
                    mapTypeLayer = new G.Layer.BaiduMap('satel');
                    me.gMap.map.addLayer(mapTypeLayer);
                    me.adjustByLayer(mapTypeLayer);
                    break;
                case 4:
                    // 高德街道地图
                    me.clearLayers()
                    mapTypeLayer = new G.Layer.AMap('street');
                    me.gMap.map.addLayer(mapTypeLayer);
                    me.adjustByLayer(mapTypeLayer);
                    break;
                case 5:
                    // 高德卫星图
                    me.clearLayers()
                    mapTypeLayer = new G.Layer.AMap('sate');
                    me.gMap.map.addLayer(mapTypeLayer);
                    mapTypeLayer = new G.Layer.AMap('satel');
                    me.gMap.map.addLayer(mapTypeLayer);
                    me.adjustByLayer(mapTypeLayer);
                    break;
            }

        }

        // 清除所有图层
        BaseMap.prototype.clearLayers = function() {
            var layers = map.getLayers();
            for (var i in layers) {
                map.getLayer(i).remove();
            }
        };
        // 适配地图类型
        BaseMap.prototype.adjustByLayer = function(layer) {
            map.options.minRes = layer.options.minRes;
            map.options.maxRes = layer.options.maxRes;

            var res = map.getResolution();
            var size = map.getSize();
            var center = map.getCenter();
            // console.log(layer.options)
            map.view(center, size[0] * res, size[1] * res, map.getRotate());
        };
        /*
            添加地图监听事件
            (请使用百度原事件) 需废弃
            如果不行 请用 bind 替换 addEventListener
        */
        BaseMap.prototype.addEventListener = function(type, target) {
            var me = this;
            //添加事件
            var func = (type == 'dragend' || type == 'resize' || type == 'zoomend') ? function() {
                me.tipPositionRefresh();
                if (typeof target == 'function') target();
            } : target;
            this.events = this.events || {};
            this.events[type] = func;
            this.gmap.addEventListener(type, func);
        }
        /*
            清除地图监听事件
            (请使用百度原事件) 需废弃
            如果不行 请用 unbind 替换 removeEventListener
        */
        BaseMap.prototype.removeEventListener = function(type) {
            this.events = this.events || {};
            this.gmap.removeEventListener(type, this.events[type]);
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

        BaseMap.prototype.removeMapTip = function(mapTip) {
            if (mapTip) {
                var id = mapTip.opts.id;
                var tips = this.tips || {};
                if (tips[id]) delete tips[id];
                mapTip.destroy();
            }
        }

        //根据页面事件获取百度地图point
        BaseMap.prototype.getPointByEvent = function(e) {
            var self = this;
            e = window.event || e;
            if (e.point) {
                return e.point;
            } else {
                var x = e.pageX || e.clientX || 0;
                var y = e.pageY || e.clientY || 0;
                var mapObjOffset = $("#" + self.param.map).offset();
                x = x - mapObjOffset.left;
                y = y - mapObjOffset.top;
                x = x > 0 ? x : 0;
                y = y > 0 ? y : 0;
                return self.bmap.toMap(G.Proj.WebMercator.project(x, y));
            }
        }
        /*
            开启全屏、退出全屏
            需要css支持
            open close
              (废弃）
        */
        // BaseMap.prototype.fullScreen = function(type) {
        //     var mapObj = this.gMap.mapContainer,
        //         center = this.gMap.gmap.getCenter(),
        //         // zoom = this.gmap.getZoom();
        //         if (type == 'close') {
        //             //关闭全屏
        //             $(mapObj.parentNode).removeClass('fullScreen')
        //         } else {
        //             //开启全屏
        //             $(mapObj.parentNode).addClass('fullScreen');
        //         }
        //     //设置中心点
        //     this.gmap.centerAt(center);
        // }

        /*
            画区县板块街道名称
            因为没有具体数据
            能不能实现还有待确认
            只能添加  
            样式需在源码里改
        */

        function DrawPolygonLabbel(opts) {
            this.opts = $.extend(true, {
                //地图对象
                gmap: null,
                //数据
                data: [],
                //覆盖物属性
                labelOptions: {},

            }, opts);
            this.initialize()
        }

        DrawPolygonLabbel.prototype.initialize = function() {
            var self = this;
            self.labels = [];
            $.each(self.opts.data, function(i, j) {
                var points = [];
                $.each(j.sPoint.split("#"), function(k, pointStr) {
                    points = points.concat($.map(pointStr.split("|"), function(p) {
                        var arr = p.split(",");
                        return G.Proj.WebMercator.project(parseFloat(arr1[0]),
                            parseFloat(arr1[1]));
                    }))
                });

                //中心点
                var centerPoints = G.GeomUtil.centroid(points);
                //创建文字标注
                var label = new G.Graphic.Point(centerPoints, null, {
                    shape: 'text',
                    size: [12],
                    fillColor: '#fff',
                    text: j.sName,
                });

                label.data = j;
                label.sID = j.sID;
                self.labels.push(label);
            });
        }

        /*
            自定义
            point 坐标
            bmap 百度地图对象
            opts 配置
            methods:{
                openTip:function(){}
            } 方法
            需要手动加入到地图中
            还是有问题
        */

        // function new G.Layer.Graphic(point, bmap, opts, methods) {
        //     this._point = point;
        //     this._opts = opts;
        //     this._gmap = gmap;
        //     this._methods = methods;
        // }
        // CustomOverlay.prototype = new G.Layer.Graphic();
        // CustomOverlay.prototype.initialize = function() {
        //     var div = document.createElement("div");
        //     div.style.position = "absolute";
        //     div.style.cursor = "pointer";
        //     div.style.zIndex = this._opts.zIndex || 0;

        //     if (this._opts.id) {
        //         div.id = this._opts.id;
        //     }
        //     div.className = this._opts.labelClass || '';
        //     div.innerHTML = this._opts.labelText || '';
        //     if (this._opts.style)
        //         div.style = this._opts.style || '';
        //     this._div = div;
        //     // 有问题
        //     //graphicLayer.addTo(map);
        //     this._gmap.graphic.labelLayer.appendChild(this._div);
        //     return this._div;
        // };

        // CustomOverlay.prototype.draw = function() {
        //     var pixel = this._bmap.toScreen(this._point);
        //     var left = pixel[0];
        //     var top = pixel[1];

        //     left = pixel[0] - this._opts.width;
        //     top = pixel[1] - this._opts.height;

        //     this._div.style.left = left + "px";
        //     this._div.style.top = top + "px";
        //     this._div.style.zIndex = this._opts.zIndex || 0;

        //     if (this.isOpen) {
        //         var method = (this._methods || {}).openTip;
        //         if (method) method();
        //     }
        // };
        // CustomOverlay.prototype.AddEvent = function(type, func) {
        //     if (!this._div) {
        //         return;
        //     }
        //     type = type.replace(/^on/i, '').toLowerCase();
        //     if (this._div.addEventListener) {
        //         this._div.addEventListener(type, func, false);
        //     } else if (this._div.attachEvent) {
        //         this._div.attachEvent("on" + type, func);
        //     }
        // }
        // CustomOverlay.prototype.hide = function() {
        //     this.isOpen = false;
        //     this._div.style.display = 'none';
        // }
        // CustomOverlay.prototype.show = function() {
        //     this._div.style.display = '';
        // }

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


        // exports.customOverlay = CustomOverlay;
        exports.map = BaseMap;
        exports.gtip = MapTip;
    }));
/*
    Flipped
      on
      you
*/