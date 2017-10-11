
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


(function (global, factory) {
    factory(global.cityMap = global.cityMap || {});
}(this,
function (exports) {
    var mapType = {
        //此地图类型展示普通街道视图
        BMAP_NORMAL_MAP: 1,
        //此地图类型展示透视图像视图
        BMAP_PERSPECTIVE_MAP: 2,
        //此地图类型展示卫星视图
        BMAP_SATELLITE_MAP: 3,
        //BMAP_HYBRID_MAP
        BMAP_HYBRID_MAP: 4
    }

    var mapLoadingConfig = {
        labelText: '<div style="text-align:center;"><div class="common-loading"><div class="load-container"><span class="pillar" style="animation-delay:.1s;"></span><span class="pillar" style="animation-delay:.2s;"></span><span class="pillar" style="animation-delay:.3s;"></span><span class="pillar" style="animation-delay:.4s;"></span><span class="pillar" style="animation-delay:.5s;"></span><span class="pillar" style="animation-delay:.6s;"></span><p>loading</p></div></div></div>',
        width: 100,
        height: 50,
        isHasInfoWindow: false
    }

    var mapStyle = {
        'default': { styleJson: [{ "featureType": "land", "elementType": "geometry", "stylers": { "color": "#0e1720" } }, { "featureType": "water", "elementType": "all", "stylers": { "color": "#1b2a38" } }, { "featureType": "green", "elementType": "all", "stylers": { "color": "#b0d3dd", "visibility": "off" } }, { "featureType": "highway", "elementType": "geometry.fill", "stylers": { "color": "#1b334b" } }, { "featureType": "highway", "elementType": "geometry.stroke", "stylers": { "color": "#1b334b", "weight": "0.8" } }, { "featureType": "arterial", "elementType": "geometry.fill", "stylers": { "color": "#1b334b" } }, { "featureType": "arterial", "elementType": "geometry.stroke", "stylers": { "color": "#1b334b", "weight": "0.6" } }, { "featureType": "local", "elementType": "labels.text.fill", "stylers": { "color": "#7a959a" } }, { "featureType": "local", "elementType": "labels.text.stroke", "stylers": { "color": "#d6e4e5" } }, { "featureType": "arterial", "elementType": "labels.text.fill", "stylers": { "color": "#374a46" } }, { "featureType": "highway", "elementType": "labels.text.fill", "stylers": { "color": "#374a46" } }, { "featureType": "highway", "elementType": "labels.text.stroke", "stylers": { "color": "#e9eeed" } }, { "featureType": "poi", "elementType": "all", "stylers": { "visibility": "off" } }, { "featureType": "all", "elementType": "labels.text.fill", "stylers": { "color": "#999999" } }, { "featureType": "all", "elementType": "labels.text.stroke", "stylers": { "color": "#000000" } }, { "featureType": "railway", "elementType": "all", "stylers": { "visibility": "off" } }, { "featureType": "boundary", "elementType": "geometry.fill", "stylers": { "color": "#2a445e" } }, { "featureType": "boundary", "elementType": "geometry.stroke", "stylers": { "color": "#2a445e" } }, { "featureType": "subway", "elementType": "geometry.fill", "stylers": { "color": "#0a293e" } }, { "featureType": "subway", "elementType": "geometry.stroke", "stylers": { "color": "#0a293e" } }, { "featureType": "local", "elementType": "all", "stylers": { "visibility": "off" } }, { "featureType": "manmade", "elementType": "geometry.fill", "stylers": { "color": "#182a36" } }, { "featureType": "building", "elementType": "geometry.fill", "stylers": { "color": "#0f1d27" } }, { "featureType": "highway", "elementType": "labels.icon", "stylers": { "visibility": "off" } }, { "featureType": "subway", "elementType": "labels.icon", "stylers": { "visibility": "off" } }] },
        'googlelite': { styleJson: [{ "featureType": "road", "elementType": "all", "stylers": { "lightness": 20 } }, { "featureType": "highway", "elementType": "geometry", "stylers": { "color": "#f49935" } }, { "featureType": "railway", "elementType": "all", "stylers": { "visibility": "off" } }, { "featureType": "local", "elementType": "labels", "stylers": { "visibility": "off" } }, { "featureType": "water", "elementType": "all", "stylers": { "color": "#d1e5ff" } }, { "featureType": "poi", "elementType": "labels", "stylers": { "visibility": "off" } }] },
        'custom_white': { styleJson: [{ "featureType": "highway", "elementType": "geometry", "stylers": { "lightness": 15, "saturation": -20 } }, { "featureType": "highway", "elementType": "labels", "stylers": { "visibility": "off" } }, { "featureType": "green", "elementType": "geometry", "stylers": { "lightness": 15, "saturation": -30 } }, { "featureType": "water", "elementType": "geometry", "stylers": { "lightness": 10, "saturation": -30 } }, { "featureType": "manmade", "elementType": "geometry", "stylers": { "lightness": 10, "saturation": -35 } }, { "featureType": "subway", "elementType": "geometry", "stylers": { "saturation": -30 } }, { "featureType": "poi", "elementType": "all", "stylers": { "visibility": "off" } }, { "featureType": "railway", "elementType": "all", "stylers": { "visibility": "off" } }, { "featureType": "subway", "elementType": "all", "stylers": { "visibility": "off" } }, { "featureType": "highway", "elementType": "geometry", "stylers": { "weight": "0.1" } }, { "featureType": "label", "elementType": "labels", "stylers": { "saturation": -64 } }] },
        'standard_grey': { styleJson: [{ "featureType": "water", "elementType": "all", "stylers": { "color": "#171f29" } }, { "featureType": "highway", "elementType": "geometry.fill", "stylers": { "color": "#232c39" } }, { "featureType": "highway", "elementType": "geometry.stroke", "stylers": { "color": "#232c39", "weight": "0.9" } }, { "featureType": "arterial", "elementType": "geometry.fill", "stylers": { "color": "#0f151e" } }, { "featureType": "arterial", "elementType": "geometry.stroke", "stylers": { "color": "#0f151e", "weight": "0.7" } }, { "featureType": "local", "elementType": "all", "stylers": { "color": "#000000", "visibility": "off" } }, { "featureType": "land", "elementType": "geometry", "stylers": { "color": "#080d13" } }, { "featureType": "railway", "elementType": "geometry.fill", "stylers": { "color": "#000000", "visibility": "off" } }, { "featureType": "railway", "elementType": "geometry.stroke", "stylers": { "color": "#08304b", "visibility": "off" } }, { "featureType": "subway", "elementType": "all", "stylers": { "lightness": -70, "visibility": "off" } }, { "featureType": "building", "elementType": "geometry.fill", "stylers": { "color": "#000000", "visibility": "off" } }, { "featureType": "all", "elementType": "labels.text.fill", "stylers": { "color": "#888888" } }, { "featureType": "all", "elementType": "labels.text.stroke", "stylers": { "color": "#000000" } }, { "featureType": "building", "elementType": "geometry", "stylers": { "color": "#022338", "visibility": "off" } }, { "featureType": "green", "elementType": "geometry", "stylers": { "color": "#062032", "visibility": "off" } }, { "featureType": "boundary", "elementType": "all", "stylers": { "color": "#171f29" } }, { "featureType": "manmade", "elementType": "all", "stylers": { "color": "#171f29", "visibility": "off" } }, { "featureType": "poi", "elementType": "all", "stylers": { "visibility": "off" } }, { "featureType": "highway", "elementType": "labels.icon", "stylers": { "visibility": "off" } }, { "featureType": "administrative", "elementType": "labels", "stylers": { "visibility": "off" } }] },
        'poly_custom_white': { styleJson: [{ "featureType": "background", "elementType": "all", "stylers": { "saturation": -100 } }, { "featureType": "highway", "elementType": "geometry.fill", "stylers": { "color": "#ffffff" } }, { "featureType": "highway", "elementType": "geometry.stroke", "stylers": { "color": "#cccccc", "weight": "0.9" } }, { "featureType": "poi", "elementType": "all", "stylers": { "visibility": "off" } }, { "featureType": "highway", "elementType": "labels.icon", "stylers": { "visibility": "off" } }, { "featureType": "railway", "elementType": "all", "stylers": { "visibility": "off" } }, { "featureType": "subway", "elementType": "all", "stylers": { "hue": "#f2fbff", "lightness": 35, "saturation": -60 } }, { "featureType": "road", "elementType": "labels", "stylers": { "saturation": -100 } }, { "featureType": "arterial", "elementType": "geometry.fill", "stylers": { "color": "#ffffff" } }, { "featureType": "arterial", "elementType": "geometry.stroke", "stylers": { "color": "#cccccc" } }, { "featureType": "local", "elementType": "geometry.stroke", "stylers": { "color": "#cccccc" } }, { "featureType": "local", "elementType": "geometry.fill", "stylers": { "color": "#ffffff" } }, { "featureType": "boundary", "elementType": "all", "stylers": { "saturation": -100 } }, { "featureType": "administrative", "elementType": "labels", "stylers": { "lightness": 42, "saturation": -100 } }] },
        'jinke_blue': {
            styleJson: [
              {
                  "featureType": "all",
                  "elementType": "geometry",
                  "stylers": {
                      "hue": "#007fff",
                      "saturation": -65
                  }
              },
              {
                  "featureType": "highway",
                  "elementType": "geometry",
                  "stylers": {
                      "lightness": 10,
                      "saturation": -80
                  }
              },
              {
                  "featureType": "poi",
                  "elementType": "labels",
                  "stylers": {
                      "visibility": "off"
                  }
              },
              {
                  "featureType": "subway",
                  "elementType": "geometry.fill",
                  "stylers": {
                      "color": "#9db7c1"
                  }
              },
              {
                  "featureType": "subway",
                  "elementType": "geometry.stroke",
                  "stylers": {
                      "weight": "1"
                  }
              },
              {
                  "featureType": "manmade",
                  "elementType": "all",
                  "stylers": {
                      "visibility": "off"
                  }
              },
              {
                  "featureType": "building",
                  "elementType": "all",
                  "stylers": {
                      "visibility": "off"
                  }
              },
              {
                  "featureType": "highway",
                  "elementType": "labels.icon",
                  "stylers": {
                      "visibility": "off"
                  }
              },
              {
                  "featureType": "subway",
                  "elementType": "labels.text.fill",
                  "stylers": {
                      "color": "#415861"
                  }
              },
              {
                  "featureType": "railway",
                  "elementType": "all",
                  "stylers": {
                      "visibility": "off"
                  }
              },
              {
                  "featureType": "road",
                  "elementType": "labels",
                  "stylers": {
                      "lightness": 10,
                      "saturation": -80
                  }
              },
              {
                  "featureType": "water",
                  "elementType": "all",
                  "stylers": {
                      "lightness": 20,
                      "saturation": -80
                  }
              },
              {
                  "featureType": "highway",
                  "elementType": "labels.text.stroke",
                  "stylers": {
                      "weight": "0.9"
                  }
              }
            ]
        },
        //白色+突出主干道
        'custom_white_mainroad': { styleJson: [{ "featureType": "highway", "elementType": "geometry", "stylers": { "lightness": 15, "saturation": -20 } }, { "featureType": "highway", "elementType": "labels", "stylers": { "visibility": "off" } }, { "featureType": "green", "elementType": "geometry", "stylers": { "lightness": 15, "saturation": -30 } }, { "featureType": "water", "elementType": "geometry", "stylers": { "lightness": 10, "saturation": -30 } }, { "featureType": "manmade", "elementType": "geometry", "stylers": { "lightness": 10, "saturation": -35 } }, { "featureType": "subway", "elementType": "geometry", "stylers": { "saturation": -30 } }, { "featureType": "poi", "elementType": "all", "stylers": { "visibility": "off" } }, { "featureType": "railway", "elementType": "all", "stylers": { "visibility": "off" } }, { "featureType": "subway", "elementType": "all", "stylers": { "visibility": "off" } }, { "featureType": "highway", "elementType": "geometry", "stylers": { "color": "#f46422", "weight": "1.2", "saturation": 56 } }, { "featureType": "label", "elementType": "labels", "stylers": { "saturation": -64 } }] },
        'baodai_custom_white_mainroad': { styleJson: [{ "featureType": "highway", "elementType": "geometry", "stylers": { "lightness": 15, "saturation": -20 } }, { "featureType": "highway", "elementType": "labels", "stylers": { "visibility": "off" } }, { "featureType": "green", "elementType": "geometry", "stylers": { "lightness": 15, "saturation": -30 } }, { "featureType": "water", "elementType": "geometry", "stylers": { "lightness": 10, "saturation": -30 } }, { "featureType": "manmade", "elementType": "geometry", "stylers": { "lightness": 10, "saturation": -35 } }, { "featureType": "subway", "elementType": "geometry", "stylers": { "saturation": -30 } }, { "featureType": "poi", "elementType": "all", "stylers": { "visibility": "off" } }, { "featureType": "railway", "elementType": "all", "stylers": { "visibility": "off" } }, { "featureType": "subway", "elementType": "all", "stylers": { "visibility": "off" } }, { "featureType": "highway", "elementType": "geometry", "stylers": { "color": "#2c82e8", "weight": "1" } }, { "featureType": "label", "elementType": "labels", "stylers": { "weight": "1.7", "saturation": -64 } }] },
        'baodai_custom_black_mainroad': { styleJson: [{ "featureType": "land", "elementType": "geometry", "stylers": { "color": "#0e1720" } }, { "featureType": "water", "elementType": "all", "stylers": { "color": "#1b2a38" } }, { "featureType": "green", "elementType": "all", "stylers": { "color": "#b0d3dd", "visibility": "off" } }, { "featureType": "highway", "elementType": "geometry.fill", "stylers": { "color": "#1b334b" } }, { "featureType": "highway", "elementType": "geometry", "stylers": { "color": "#4d93e5", "weight": "1", "saturation": -34 } }, { "featureType": "arterial", "elementType": "geometry.fill", "stylers": { "color": "#1b334b" } }, { "featureType": "arterial", "elementType": "geometry.stroke", "stylers": { "color": "#1b334b", "weight": "0.6" } }, { "featureType": "local", "elementType": "labels.text.fill", "stylers": { "color": "#7a959a" } }, { "featureType": "local", "elementType": "labels.text.stroke", "stylers": { "color": "#d6e4e5" } }, { "featureType": "arterial", "elementType": "labels.text.fill", "stylers": { "color": "#374a46" } }, { "featureType": "highway", "elementType": "labels.text.stroke", "stylers": { "color": "#e9eeed" } }, { "featureType": "poi", "elementType": "all", "stylers": { "visibility": "off" } }, { "featureType": "all", "elementType": "labels.text.fill", "stylers": { "color": "#999999" } }, { "featureType": "all", "elementType": "labels.text.stroke", "stylers": { "color": "#000000" } }, { "featureType": "railway", "elementType": "all", "stylers": { "visibility": "off" } }, { "featureType": "boundary", "elementType": "geometry.fill", "stylers": { "color": "#2a445e" } }, { "featureType": "boundary", "elementType": "geometry.stroke", "stylers": { "color": "#2a445e" } }, { "featureType": "subway", "elementType": "geometry.fill", "stylers": { "color": "#0a293e" } }, { "featureType": "subway", "elementType": "geometry.stroke", "stylers": { "color": "#0a293e" } }, { "featureType": "local", "elementType": "all", "stylers": { "visibility": "off" } }, { "featureType": "manmade", "elementType": "geometry.fill", "stylers": { "color": "#182a36" } }, { "featureType": "building", "elementType": "geometry.fill", "stylers": { "color": "#0f1d27" } }, { "featureType": "highway", "elementType": "labels.icon", "stylers": { "visibility": "off" } }, { "featureType": "subway", "elementType": "labels.icon", "stylers": { "visibility": "off" } }] }
    }

    var _fixType = function (type) {
        type = type.toLowerCase().replace(/jpg/i, 'jpeg');
        var r = type.match(/png|jpeg|bmp|gif/)[0];
        return 'image/' + r;
    };


    function DownloadImage(opts) {

        var overlaybox = $('.pages-container');
        if (overlaybox.length == 0) overlaybox = opts.container;

        overlaybox.overlay();
        opts = $.extend({},
            {
                container: null,
                callback: null,
                chart: null,
                imageType: 'png',
                filename: 'export'
            }, opts);

        //替换地图images
        $.each(opts.container.find('img'), function (i, j) {
            var src = $(j).attr('src');
            if (src &&
                src.toLowerCase().indexOf('/dictionaries/loadimage/') < 0 &&
                src.toLowerCase().indexOf('data:image') < 0) {
                $(j).attr('src', '/dictionaries/loadimage/?imgUrl=' + encodeURIComponent(src));
            }
        });

        var tempImage;
        if (opts.chart) {
            //替换3D图
            var id = opts.chart.getDom().id;
            var imgHtml = '<img src="' + opts.chart.getDataURL() + '"  style="width:100%;height:100%;position: absolute;top: 0;left: 0;z-index: 9;" class="help-tempimage"/>';
            $('#' + id).append(imgHtml);
            tempImage = $('#' + id + ' .help-tempimage');
        }

        html2canvas(opts.container, {
            onrendered: function (canvas) {
                var type = 'png';
                var imgData64 = canvas.toDataURL(opts.imageType);
                imgData64 = imgData64.replace(_fixType(opts.imageType), 'image/octet-stream');

                var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
                save_link.href = imgData64;
                save_link.download = opts.filename + '.' + opts.imageType;

                var event = document.createEvent('MouseEvents');
                event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                save_link.dispatchEvent(event);


                if (tempImage) tempImage.remove();
                if (typeof opts.callback == 'function') opts.callback();

                overlaybox.unOverlay();
            }
        });
    }


    function BaseMap(param) {
        this.param = $.extend({}, {
            //地图容器
            map: 'map',
            //限制最小比例尺
            minZoom: 4,
            //当前比例尺
            zoom: 12,
            //是否启用滚轮事件
            enableScrollWheelZoom: true,
            //坐标点
            point: {
                x: null,
                y: null
            },
            //城市名称
            city: null,
            //地图样式
            mapStyle: null,
            loadingOpts: null
        }, param);
        //覆盖物
        this.overlays = {};
        this.tips = {};
        this.initialize();
    }
    /*初始化*/
    BaseMap.prototype.initialize = function () {
        var me = this;

        var bmap = new BMap.Map(me.param.map, {
            enableMapClick: false,
            minZoom: me.param.minZoom
        });




        if (me.param.point.x && me.param.point.y) {
            var point = new BMap.Point(me.param.point.x, me.param.point.y);
            bmap.centerAndZoom(point, me.param.zoom); // 初始化地图，设置中心点坐标和地图级别
        }
        else if (me.param.city) {
            bmap.centerAndZoom(me.param.city, me.param.zoom); // 初始化地图，设置中心点坐标和地图级别
        }
        if (me.param.enableScrollWheelZoom)
            bmap.enableScrollWheelZoom(); // 启用滚轮放大缩小


        this.bmap = bmap;

        me.setStyle(me.param.mapStyle || mapStyle.default);
        $.each(['dragend', 'resize', 'zoomend'], function (i, j) {
            me.addEventListener(j);
        });
        //var bottom_left_control = new BMap.ScaleControl({ anchor: BMAP_ANCHOR_BOTTOM_RIGHT });// 左上角，添加比例尺
        //var bottom_left_navigation = new BMap.NavigationControl({ anchor: BMAP_ANCHOR_BOTTOM_RIGHT });  //左上角，添加默认缩放平移控件
        //bmap.addControl(bottom_left_control);
        //bmap.addControl(bottom_left_navigation);

        //bmap.addControl(new BMap.ScaleControl({ anchor: BMAP_ANCHOR_BOTTOM_RIGHT }));
        //bmap.addControl(new BMap.NavigationControl({ anchor: BMAP_ANCHOR_BOTTOM_RIGHT }));
        //bmap.addControl(new BMap.NavigationControl({ anchor: BMAP_ANCHOR_BOTTOM_RIGHT, type: BMAP_NAVIGATION_CONTROL_ZOOM }));


    }
    /*刷新mapTip 的位置*/
    BaseMap.prototype.tipPositionRefresh = function () {
        var me = this;
        var tips = me.tips || {};
        for (var k in tips) {
            var tip = tips[k];
            if (tip.mapLine) tip.drawMapLine();
            else tip.setPosition();
        }
    }
    /*
    添加地图监听事件
    (请使用百度原事件) 需废弃
    */
    BaseMap.prototype.addEventListener = function (type, target) {
        var me = this;
        //添加事件
        var func = (type == 'dragend' || type == 'resize' || type == 'zoomend') ?
           function (p) {
               me.tipPositionRefresh();
               if (typeof target == 'function') target(p, me);
           } : function (p) { target(p, me); };

        this.events = this.events || {};
        this.events[type] = func;
        this.bmap.addEventListener(type, func);
    }
    /*
    清除地图监听事件
    (请使用百度原事件) 需废弃
    */
    BaseMap.prototype.removeEventListener = function (type) {
        this.events = this.events || {};
        this.bmap.removeEventListener(type, this.events[type]);
    }
    /*添加覆盖物
    type:类别(快速查找)
    key
    overlay
    */
    BaseMap.prototype.addOverlay = function (type, key, overlay) {
        this.overlays = this.overlays || {};
        this.overlays[type] = this.overlays[type] || {};
        this.overlays[type][key] = overlay;
        this.bmap.addOverlay(overlay);
    }
    //清除单个覆盖物
    BaseMap.prototype.removeOverlay = function (type, key) {
        var overlays = this.overlays || {};
        var overlay = (overlays[type] || {})[key];
        if (overlay) {
            this.bmap.removeOverlay(overlay);
            delete this.overlays[type][key];
        }
    }
    //清除所有
    BaseMap.prototype.clearOverlays = function () {
        this.overlays = {};

        var tips = this.tips || {};
        for (var k in tips) {
            this.removeMapTip(tips[k])
        }
        this.tips = {};
        this.bmap.clearOverlays();
    }
    /*
    切换地图类型
    type:mapType,
    city:城市名称(当地图类型为mapType.BMAP_PERSPECTIVE_MAP 需要城市)
    */
    BaseMap.prototype.setMapType = function (type, city) {
        switch (type) {
            case mapType.BMAP_NORMAL_MAP:
                this.bmap.setMapType(BMAP_NORMAL_MAP);
                break;
            case mapType.BMAP_PERSPECTIVE_MAP:
                city = city || this.param.city;
                this.bmap.setMapType(BMAP_PERSPECTIVE_MAP);
                this.bmap.setCurrentCity(city);
                break;
            case mapType.BMAP_SATELLITE_MAP:
                this.bmap.setMapType(BMAP_SATELLITE_MAP);
                break;
            case mapType.BMAP_HYBRID_MAP:
                this.bmap.setMapType(BMAP_HYBRID_MAP);
                break;
        }
    }
    /*清除地图上所有覆盖物*/
    BaseMap.prototype.clear = function () {
        this.overlays = {};
        this.tips = {};
        this.bmap.clearOverlays();
    }

    /*设置百度地图样式*/
    BaseMap.prototype.setStyle = function (style) {
        this.bmap.setMapStyle(style)
    }

    /*添加mapTip
    页面弹框
    */
    BaseMap.prototype.addMapTip = function (mapTip) {
        var id = mapTip.opts.id,
            tips = this.tips || {};

        var mapNode = this.bmap.getContainer();

        if (!tips[id]) {
            $(mapNode).after(mapTip.$node);
            tips[id] = mapTip;
            mapTip.draggable(this.bmap);
        }
        mapTip.setPosition();
        mapTip.scroll();
    }
    //删除mapTip
    BaseMap.prototype.removeMapTip = function (mapTip) {
        if (mapTip) {
            var id = mapTip.opts.id;
            var tips = this.tips || {};
            if (tips[id]) delete tips[id];

            mapTip.destroy();
        }
    }
    /*
    开启全屏、退出全屏
    需要css支持
    open close
    （废弃）
    */
    BaseMap.prototype.fullScreen = function (type) {
        var mapObj = this.bmap.getContainer(),
            center = this.bmap.getCenter(),
            zoom = this.bmap.getZoom();
        if (type == 'close') {
            //关闭全屏
            $(mapObj.parentNode).removeClass('fullScreen')
        }
        else {
            //开启全屏
            $(mapObj.parentNode).addClass('fullScreen');
        }
        //设置中心点
        this.bmap.centerAndZoom(center, zoom);
    }

    //loading效果
    BaseMap.prototype.loading = function () {
        this.unLoading();
        var opts = this.param.loadingOpts || mapLoadingConfig;
        //var opts = { labelText: '<div style="text-align:center;"><div class="common-loading"><img src="/images/loading.gif" /></div></div></div>', width: 36, height: 36, isHasInfoWindow: false };
        this.overlay = new CustomOverlay(this.bmap.getCenter(), this.bmap, opts);
        this.bmap.addOverlay(this.overlay);
    }
    //取消loading效果
    BaseMap.prototype.unLoading = function () {
        if (this.overlay) this.bmap.removeOverlay(this.overlay);
    }
    //根据页面事件获取百度地图point
    BaseMap.prototype.getPointByEvent = function (e) {
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
            return self.bmap.pixelToPoint(new BMap.Pixel(x, y));
        }
    }
    /*保存图片*/
    /*
    {
        callback: null,
        chart: null,
        imageType: 'png',
        filename: 'export',
        containment:'' //parent
    }
    */
    BaseMap.prototype.downloadImg = function (opts) {
        opts = $.extend({},
            {
                callback: null,
                chart: null,
                imageType: 'png',
                filename: 'export',
                containment: ''
            }, opts);

        opts.container = $(this.bmap.getContainer());
        if (opts.containment == 'parent') {
            opts.container = opts.container.parent();
        }
        DownloadImage(opts);
    }




    //获取箭头部分的坐标点
    function getArrowPoints(bmap, polyline, length, angleValue) {
        var linePoint = polyline.getPath();//线的坐标串
        var arrowCount = linePoint.length;

        if (arrowCount != 2) return;

        var pixelStart = bmap.pointToPixel(linePoint[0]);
        var pixelEnd = bmap.pointToPixel(linePoint[1]);
        var angle = angleValue;//箭头和主线的夹角
        var r = length; // r/Math.sin(angle)代表箭头长度
        var delta = 0; //主线斜率，垂直时无斜率
        var param = 0; //代码简洁考虑
        var pixelTemX, pixelTemY;//临时点坐标
        var pixelX, pixelY, pixelX1, pixelY1;//箭头两个点
        if (pixelEnd.x - pixelStart.x == 0) { //斜率不存在是时
            pixelTemX = pixelEnd.x;
            if (pixelEnd.y > pixelStart.y) {
                pixelTemY = pixelEnd.y - r;
            }
            else {
                pixelTemY = pixelEnd.y + r;
            }
            //已知直角三角形两个点坐标及其中一个角，求另外一个点坐标算法
            pixelX = pixelTemX - r * Math.tan(angle);
            pixelX1 = pixelTemX + r * Math.tan(angle);
            pixelY = pixelY1 = pixelTemY;
        }
        else  //斜率存在时
        {
            delta = (pixelEnd.y - pixelStart.y) / (pixelEnd.x - pixelStart.x);
            param = Math.sqrt(delta * delta + 1);

            if ((pixelEnd.x - pixelStart.x) < 0) //第二、三象限
            {
                pixelTemX = pixelEnd.x + r / param;
                pixelTemY = pixelEnd.y + delta * r / param;
            }
            else//第一、四象限
            {
                pixelTemX = pixelEnd.x - r / param;
                pixelTemY = pixelEnd.y - delta * r / param;
            }
            //已知直角三角形两个点坐标及其中一个角，求另外一个点坐标算法
            pixelX = pixelTemX + Math.tan(angle) * r * delta / param;
            pixelY = pixelTemY - Math.tan(angle) * r / param;

            pixelX1 = pixelTemX - Math.tan(angle) * r * delta / param;
            pixelY1 = pixelTemY + Math.tan(angle) * r / param;
        }

        var pointArrow = bmap.pixelToPoint(new BMap.Pixel(pixelX, pixelY));
        var pointArrow1 = bmap.pixelToPoint(new BMap.Pixel(pixelX1, pixelY1));

        return [pointArrow, linePoint[1], pointArrow1];
    }

    //地图画箭头
    function DrawArrow(opts) {
        var self = this;
        self.opts = $.extend(true,
            {
                bmap: null,
                open: true,
                points: [],
                arrowLength:12,
                polylineOptions: {
                    strokeColor: '#1976d2',
                    strokeWeight: 3,
                    enableMassClear: false
                },
                eventListener: {
                    //绘制箭头开始
                    begin: null,
                    //绘制箭头完毕
                    end: null
                }
            }, opts);

        var points = [],
            bmap = self.bmap = self.opts.bmap,
            polyline,
            arrowLine;


        self.eventListener = {
            click: function (e) {
                var point = self.getPointByEvent(e);
                points.push(point);
                if (self.polyline) {
                    self.polyline.setPath(points);
                }

                if (points.length == 1) {
                    //开启move监听事件
                    self.bmap.addEventListener('mousemove', self.eventListener['mousemove']);
                    //创建line
                    self.polyline = polyline = new BMap.Polyline(points, self.opts.polylineOptions);
                    bmap.addOverlay(polyline);

                    if (typeof self.opts.eventListener.begin == 'function')
                        self.opts.eventListener.begin(self);
                }
                else if (points.length == 2) {

                    self.addArrowLine(self.opts.arrowLength, Math.PI / 7);

                    self.close();

                    if (typeof self.opts.eventListener.end == 'function')
                        self.opts.eventListener.end(self);
                }
            },
            mousemove: function (e) {
                if (polyline) {
                    //设置线的点
                    var point = self.getPointByEvent(e);
                    polyline.setPath(points.concat([point]));
                    self.addArrowLine(self.opts.arrowLength, Math.PI / 7);
                }
            }
        }

        this.initialize();
    }
    DrawArrow.prototype.initialize = function () {
        var self = this;

        if (self.opts.points.length >= 2) {
            self.polyline = new BMap.Polyline(self.opts.points.slice(self.opts.points.length - 2, 2), self.opts.polylineOptions);
            self.bmap.addOverlay(self.polyline);

            self.addArrowLine(self.opts.arrowLength, Math.PI / 7);
        }
        else {
            if (self.opts.open)
                self.open();
        }
    }
    /**
     * 在百度地图上给绘制的直线添加箭头
     * @param length 箭头线的长度 一般是12
     * @param angleValue 箭头与直线之间的角度 一般是Math.PI/7
     */
    DrawArrow.prototype.addArrowLine = function (length, angleValue) {
        var self = this,
            polyline = self.polyline,
            bmap = self.bmap;

        var arrowPoints = getArrowPoints(bmap, polyline, length, angleValue);
        if (self.arrowLine) {
            self.arrowLine.setPath(arrowPoints);
        }
        else {
            var arrowLine = self.arrowLine = new BMap.Polyline(arrowPoints, self.opts.polylineOptions);
            self.bmap.addOverlay(arrowLine);
        }
    }

    DrawArrow.prototype.getPointByEvent = function (e) {
        var self = this;
        var x = e.pageX || e.clientX || 0;
        var y = e.pageY || e.clientY || 0;
        var mapObjOffset = $(self.bmap.getContainer()).offset();
        x = x - mapObjOffset.left;
        y = y - mapObjOffset.top;
        x = x > 0 ? x : 0;
        y = y > 0 ? y : 0;
        return self.bmap.pixelToPoint(new BMap.Pixel(x, y));
    }
    //关闭当前绘制
    DrawArrow.prototype.close = function () {
        var self = this;
        //删除监听事件
        self.bmap.removeEventListener('click', self.eventListener['click']);
        self.bmap.removeEventListener('mousemove', self.eventListener['mousemove']);
        //改变鼠标样式
        self.bmap.setDefaultCursor('url("https://api.map.baidu.com/images/openhand.cur"),default');
    }
    //开启绘制
    DrawArrow.prototype.open = function () {
        var self = this;
        self.bmap.addEventListener('click', self.eventListener['click']);
        self.bmap.setDefaultCursor('crosshair');
    }

    DrawArrow.prototype.hide = function () {
        var self = this;

        var polyline = self.polyline,
            arrowLine = self.arrowLine;

        if (polyline) polyline.hide();
        if (arrowLine) arrowLine.hide();
    }
    //显示
    DrawArrow.prototype.show = function () {
        var self = this;

        var polyline = self.polyline,
            arrowLine = self.arrowLine;

        if (polyline) polyline.show();
        if (arrowLine) arrowLine.show();
    }
    //销毁
    DrawArrow.prototype.destory = function () {
        var self = this;

        if (self.polyline) {
            self.bmap.removeOverlay(self.polyline);
            delete self.polyline;
        }
        if (self.arrowLine) {
            self.bmap.removeOverlay(self.arrowLine);
            delete self.arrowLine;
        }
    }
    //刷新箭头大小
    DrawArrow.prototype.refresh = function () {
        var self = this;

        var polyline = self.polyline,
            arrowLine = self.arrowLine;

        if (polyline && arrowLine) {
            var arrowPoints = getArrowPoints(self.bmap, polyline, self.opts.arrowLength, Math.PI / 7);
            arrowLine.setPath(arrowPoints);
        }
    }

    //画区县板块街道名称
    function DrawPolygonLabel(opts) {
        this.opts = $.extend(
            true,
            {
                //百度地图对象
                bmap: null,
                //数据
                data: [],
                //样式 css样式
                labelStyle: { backgroundColor: 'rgba(255,255,255,0)', color: '#FFF', borderColor: 'rgba(255,255,255,0)' },
                //见覆盖物属性 百度地图(Label:LabelOptions)
                labelOptions: {},
                //隐藏显示标签 Zoom
                displayZoom: 10
            },
            opts);
        this.initialize();
    }
    DrawPolygonLabel.prototype.initialize = function () {
        var self = this,
            zoom = this.zoom = self.opts.bmap.getZoom();

        self.labels = [];

        $.each(self.opts.data, function (i, j) {
            var points = [];
            $.each(j.sPoints.split('#'), function (k, pointStr) {
                points = points.concat($.map(pointStr.split('|'), function (p) { var arr = p.split(','); return new BMap.Point(arr[0], arr[1]) }));
            });
            var viewport = self.opts.bmap.getViewport(points);
            //创建label
            var label = new BMap.Label(j.sName, $.extend({}, self.opts.labelOptions, { position: viewport.center }));
            label.setStyle(self.opts.labelStyle);
            label.data = j;
            label.sID = j.sID;

            self.opts.bmap.addOverlay(label);
            zoom < self.opts.displayZoom ? self.hide(label) : self.show(label);

            self.labels.push(label);
        });

        function zoomend() {
            if (self.disabled) return;

            var zoom = self.opts.bmap.getZoom();
            if (zoom < self.opts.displayZoom && (self.zoom && self.zoom < self.opts.displayZoom)) return;
            if (zoom >= self.opts.displayZoom && (self.zoom && self.zoom >= self.opts.displayZoom)) return;

            self.zoom = zoom;
            zoom < self.opts.displayZoom ? self.hide() : self.show();
        }


        self.opts.bmap.addEventListener('zoomend', zoomend);
    }
    //显示
    DrawPolygonLabel.prototype.show = function (label) {
        var self = this,
            labels = label ? [label] : self.labels;
        $.each(labels, function (i, j) { j.setStyle({ display: '' }); });
    }
    //隐藏
    DrawPolygonLabel.prototype.hide = function (label) {
        var self = this,
            labels = label ? [label] : self.labels;
        $.each(labels, function (i, j) { j.setStyle({ display: 'none' }); });
    }

    //禁用
    DrawPolygonLabel.prototype.disable = function () {
        this.disabled = true;
    }
    //启用
    DrawPolygonLabel.prototype.enable = function () {
        delete this.zoom;
        this.disabled = false;
    }

    //销毁（删除覆盖物）
    DrawPolygonLabel.prototype.destroy = function () {
        var self = this;
        $.each(self.labels || [], function (i, j) {
            self.opts.bmap.removeOverlay(j);
        });
    }



    /*
    point 坐标
    bmap 百度地图对象
    opts 配置
    methods:{
        openTip:function(){}
    } 方法
    */
    function CustomOverlay(point, bmap, opts, methods) {
        this._point = point;
        this._opts = opts;
        this._bmap = bmap;
        this._methods = methods;
    }
    CustomOverlay.prototype = new BMap.Overlay();
    CustomOverlay.prototype.initialize = function () {
        var div = document.createElement("div");
        div.style.position = "absolute";
        div.style.cursor = "pointer";
        div.style.zIndex = this._opts.zIndex || 0;

        if (this._opts.id) {
            div.id = this._opts.id;
        }
        div.className = this._opts.labelClass || '';
        div.innerHTML = this._opts.labelText || '';
        if (this._opts.style)
            div.style = this._opts.style || '';
        this._div = div;
        this._bmap.getPanes().labelPane.appendChild(this._div);
        return this._div;
    };
    CustomOverlay.prototype.draw = function () {
        var pixel = this._bmap.pointToOverlayPixel(this._point);
        var left = pixel.x;
        var top = pixel.y;

        left = pixel.x - this._opts.width;
        top = pixel.y - this._opts.height;

        this._div.style.left = left + "px";
        this._div.style.top = top + "px";
        this._div.style.zIndex = this._opts.zIndex || 0;

        if (this.isOpen) {
            var method = (this._methods || {}).openTip;
            if (method) method();
        }
    };
    CustomOverlay.prototype.AddEvent = function (type, func) {
        if (!this._div) {
            return;
        }
        type = type.replace(/^on/i, '').toLowerCase();
        if (this._div.addEventListener) {
            this._div.addEventListener(type, func, false);
        } else if (this._div.attachEvent) {
            this._div.attachEvent("on" + type, func);
        }
    }
    CustomOverlay.prototype.hide = function () {
        this.isOpen = false;
        this._div.style.display = 'none';
    }
    CustomOverlay.prototype.show = function () {
        this._div.style.display = '';
    }

    function BaseOverlay() { }
    BaseOverlay.prototype.addEventListener = function (type, target) {
        var me = this;
        var func = function (e) {
            target(e);
            stopBubble(e);
        }
        me.events[type] = func;
        me.overlay.addEventListener(type, func);
    }
    BaseOverlay.prototype.removeEventListener = function (type) {
        this.events = this.events || {};
        this.overlay.removeEventListener(type, this.events[type]);
    }

    /*
    覆盖物（面）
    pointStr 坐标点字符串
    opts 样式  百度地图覆盖物（Polygon:PolygonOptions）
    targets 事件
    targets:{
        click
        mouseout
    }
    */
    function Polygon(pointStr, opts, events) {
        opts = $.extend({},
           {
               strokeColor: 'rgba(157,246,255,1)',
               fillColor: '#6DC5FF',
               strokeWeight: 1,
               strokeOpacity: 1,
               fillOpacity: 1,
               strokeStyle: 'solid'
           }, opts);
        var me = this;
        if (pointStr) {
            var points = [];
            $.each(pointStr.split('|'), function (i, j) {
                var arr = j.split(',');
                points.push(new BMap.Point(arr[0], arr[1]));
            });

            var polygon = this.overlay = new BMap.Polygon(points, opts);

            me.points = polygon.points = points;
            me.opts = opts;
            //polygon.center = me.bmap.getViewport(points).center;
            me.events = events = events || {};
            for (var type in events) {
                if (!events[type]) continue;
                polygon.addEventListener(type, events[type])
            }
        }
    }
    Polygon.prototype = new BaseOverlay();

    /*
    id ：mapTip-id
    point :定位的位置
    innerHtml:tip的html
    style:tip样式
    bmap :百度地图
    screwed:固定（鼠标离开不会隐藏）
    callback :{
        //关闭
        close:function(){},
        screwed:function(){}
    }
    */
    function MapTip(bdMap, parameters) {
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
                close: function () { },
                //固定（显示、隐藏 回调）
                screwed: function () { },
                //help-index-count 显示隐藏 监听事件
                display: null
            },
            methods: {
                mouseover: null,
                mouseout: null
            },
            //滚动条参数
            niceScroll: { styler: "fb", cursorcolor: "#27cce4", cursorwidth: '5', cursorborderradius: '10px', background: '#091d3d', spacebarenabled: false, cursorborder: '0', zindex: '1000' },
            //拉线样式  见百度地图覆盖物（Polyline:PolylineOptions）
            polylineStyle: { strokeColor: '#0696eb', strokeWeight: 2, strokeStyle: 'dashed' }
        }, parameters);
        this.bdMap = bdMap;
        this.initialize();
    }
    MapTip.prototype.initialize = function () {
        var me = this;

        var $div = $('<div id="' + me.opts.id + '" style="position:absolute;' + (me.opts.style || 'left:0;top:0;') + '" class="' + (me.opts.className || 'suspendbox') + '">' + me.opts.innerHtml + '</div>');
        if (me.opts.draggable == 'enable')
            $div.find('.tb_tit').addClass('cursor_move');

        $div.find('.help-contentHtml').html('<div style="text-align:center;"><div class="common-loading"><div class="load-container"><span class="pillar" style="animation-delay:.1s;"></span><span class="pillar" style="animation-delay:.2s;"></span><span class="pillar" style="animation-delay:.3s;"></span><span class="pillar" style="animation-delay:.4s;"></span><span class="pillar" style="animation-delay:.5s;"></span><span class="pillar" style="animation-delay:.6s;"></span><p>loading</p></div></div></div>');
        //关闭
        $div.find('.btn-close').click(function () {
            me.bdMap.removeMapTip(me);
            if (typeof me.opts.callback.close == 'function')
                me.opts.callback.close();
        });
        //固定窗口
        $div.find('.help-screwed').click(function () {
            var temp = $(this);
            if (me.opts.screwed) {
                me.opts.screwed = false;
                temp.removeClass('open').addClass('closed');
                //删除mapLine
                if (me.mapLine) {
                    me.bdMap.bmap.removeOverlay(me.mapLine);
                    delete me.mapLine;
                }
            }
            else {
                me.opts.screwed = true;
                temp.removeClass('closed').addClass('open');
                me.drawMapLine();
            }
            if (typeof me.opts.callback.screwed == 'function')
                me.opts.callback.screwed(me.opts.screwed);
        });
        //展开/隐藏
        $div.on('click', '.help-index-count',
            function () {
                var temp = $(this),
                next = temp.next();
                next.is(':visible') ? next.hide() : next.show();

                if (typeof me.opts.callback.display == 'function')
                    me.opts.callback.display(temp, next);
                me.scroll();
            });

        //添加
        this.$node = $div;


        if (me.opts.methods.mouseover) {
            $div.mouseover(function (e) {
                me.opts.methods.mouseover(e, me);
            });
        }
        if (me.opts.methods.mouseout) {
            $div.mouseout(function (e) {
                me.opts.methods.mouseout(e, me);
            });
        }
    }
    //设置定位
    MapTip.prototype.setPosition = function (point) {
        if (this.hidden) return;
        var me = this,
            bmap = me.bdMap.bmap;

        me.opts.point = point || me.opts.point;
        var mapNode = bmap.getContainer();


        var pixel = bmap.pointToPixel(this.opts.point);

        var postion = { left: 0, top: 0 };

        var nodeHeight = me.$node.outerHeight(true),
            nodeWidth = me.$node.outerWidth(true),
            mapSize = bmap.getSize();

        if (me.opts.position) {
            switch (me.opts.position) {
                case 'top':
                    postion = { top: pixel.y - nodeHeight, left: pixel.x - nodeWidth / 2 }
                    break;
                case 'bottom':
                    postion = { top: pixel.y, left: pixel.x - nodeWidth / 2 }
                    break;
                case 'left':
                    postion = { top: pixel.y > nodeHeight / 2 ? pixel.y - nodeHeight / 2 : 0, left: pixel.x - nodeWidth }
                    break;
                case 'right':
                    postion = { top: pixel.y > nodeHeight / 2 ? pixel.y - nodeHeight / 2 : 0, left: pixel.x }
                    break;
            }
        }
        else {
            if (pixel.x > nodeWidth && pixel.x < mapSize.width - nodeWidth / 2) {
                postion.top = pixel.y > nodeHeight ? pixel.y - nodeHeight : pixel.y;
                postion.left = pixel.x - nodeWidth / 2;
            }
            else if (pixel.x < nodeHeight) {
                //显示在右侧
                postion.left = pixel.x;
                postion.top = pixel.y > nodeHeight / 2 ? pixel.y - nodeHeight / 2 : 0;
            }
            else if (pixel.x > mapSize.width - nodeWidth / 2) {
                postion.left = pixel.x - nodeWidth;
                postion.top = pixel.y > nodeHeight / 2 ? pixel.y - nodeHeight / 2 : 0;
            }
            else {
                postion.left = pixel.x - me.$node.width() / 2;
                postion.top = pixel.y > nodeHeight ? pixel.y - me.$node.height() : pixel.y;
            }
        }
        postion.top = postion.top < pixel.y ? postion.top - me.opts.offset.top : postion.top + me.opts.offset.bottom;
        if (postion.left <= pixel.x - nodeWidth) postion.left = postion.left - me.opts.offset.left;
        else if (postion.left >= pixel.x) postion.left = postion.left + me.opts.offset.right;
        //this.node.style.left = (pixel.x - mapNodePos.x) + 'px';
        //this.node.style.top = (pixel.y - mapNodePos.y) + 'px';
        me.$node.css({ left: postion.left + 'px', top: postion.top + 'px' })
    }
    /*
    status|mapNode
    */
    MapTip.prototype.draggable = function () {
        var me = this;
        if (typeof arguments[0] == 'string') {
            arguments[0] == 'enable' ? me.$node.draggable('enable') : me.$node.draggable('disabled');
        }
        else if (me.opts.draggable == 'enable') {

            //var mapNode = me.bmap.getContainer(),
            //mapNodePos = GetAbsPoint(mapNode);

            //开启拖拽
            me.$node.draggable({
                containment: 'parent', scroll: false, handle: ".cursor_move",
                drag: function (e) {
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
    MapTip.prototype.drawMapLine = function () {
        var me = this,
            bmap = me.bdMap.bmap;

        var mapNode = bmap.getContainer(),
            mapNodePos = GetAbsPoint(mapNode);

        //绘制point与tip连续
        var nodePos = GetAbsPoint(me.$node[0]);
        var left = nodePos.x - mapNodePos.x,
            top = nodePos.y - mapNodePos.y,
            width = me.$node.width(),
            height = me.$node.height();

        //每次链接到最顶端
        //top += height / 2;
        top += 30;
        left += width / 2;

        var draggablePoint = bmap.pixelToPoint(new BMap.Pixel(left, top)),
                p2 = new BMap.Point(draggablePoint.lng, me.opts.point.lat); //生成转折点point

        var points = [draggablePoint, p2, me.opts.point];
        if (me.mapLine) {
            me.mapLine.setPath(points);

        }
        else {
            var line = me.mapLine = new BMap.Polyline(points, me.opts.polylineStyle);
            bmap.addOverlay(line);

            setTimeout(function () {
                //设置svg的zIndex
                var overlaySvg = $('#' + mapNode.id + ' svg'),
                    zIndex = overlaySvg.css('z-index');
                if (parseInt(zIndex) != zIndex) overlaySvg.css('z-index', 99);
            }, 20);
        }
    }
    /*显示*/
    MapTip.prototype.show = function () {
        this.hidden = false;
        this.$node.show();
    }
    /*隐藏*/
    MapTip.prototype.hide = function () {
        if (this.mapLine) {
            this.bdMap.bmap.removeOverlay(this.mapLine);
            delete this.mapLine;
        }
        this.hidden = true;
        this.$node.hide();
    }
    MapTip.prototype.destroy = function () {
        if (this.mapLine) {
            this.bdMap.bmap.removeOverlay(this.mapLine);
            delete this.mapLine;
        }
        this.$node.remove();
    }
    MapTip.prototype.setContentHtml = function (indexHtml) {
        this.$node.find('.help-contentHtml').html(indexHtml);
        this.scroll();
    }
    //设置滚动条
    MapTip.prototype.scroll = function () {
        var self = this;
        if (self.$node.find('.nicescroll-rails').length > 0) {
            self.$node.find('.nice-scroll').getNiceScroll().resize();
        }
        else {
            self.$node.find('.nice-scroll').niceScroll(self.opts.niceScroll);
        }
    }


    exports.map = BaseMap;
    exports.polygon = Polygon;
    exports.drawArrow = DrawArrow;
    exports.customOverlay = CustomOverlay;
    exports.tip = MapTip;
    exports.drawPolygonLabel = DrawPolygonLabel;

    //百度地图样式
    exports.mapStyle = mapStyle;
    //百度地图类型
    exports.mapType = mapType;
    //百度地图loading效果
    exports.setMapLoading = function (opts) { mapLoadingConfig = opts; }
    /*
    {
        container: null,
        callback: null,
        chart: null,
        imageType: 'png',
        filename: 'export'
    }
    */
    exports.downloadImg = DownloadImage;
}));