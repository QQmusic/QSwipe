/**
 * 将插件封装在一个闭包里面，防止外部代码污染  冲突
 */
;(function($){

    /**
     * 定义插件 QSwipe
     */
    var QSwipe,qSelector;  //插件的私有方法，也可以看做是插件的工具方法集

    /**
     * 这里是插件的主体部分
     * 这里是一个自运行的单例模式。
     * 这里之所以用QSwipe 的单例模式 主要是为了封装性，更好的划分代码块
     * 同时 也 方便区分私有方法及公共方法
     * PS：但有时私有方法为了方便还是写在了QSwipe类里，这时建议私有方法前加上"_"
     */

    QSwipe = (function () {
        /**
         * 插件实例化部分，初始化时调用的代码可以放这里
         * @param element 传入jq对象的选择器，如 $("#J_plugin").plugin() ,其中 $("#J_plugin") 即是 element
         * @param options 插件的一些参数神马的
         * @constructor
         */
        function QSwipe(element, options) {
            'use strict';

            //检测节点
            if (typeof element === 'undefined') return;
            //找不到节点就return
            if (!(element.nodeType)) {
                if ($(element).length === 0) return;
            }


            //将插件的默认参数及用户定义的参数合并到一个新的obj里
            this.settings = $.extend({}, $.fn.QSwipe.defaults, options);
            //将dom jquery对象赋值给插件，方便后续调用
            this.elem = $(element);

            //QSwipe ID
            this.id = (new Date()).getTime();
            //是否正在触屏中
            this.isTouched = false;
            //是否正在移动
            this.isMoving ;
            //移动方向
            this.way="";
            this.currentEle;
            this.selector=qSelector;
            console.dir("ssssss3333s");
            //兄弟节点
            this.siblingEle;
            //滑屏模式
            this.isV=this.settings.mode==="vertical";
            this.transition=this.settings.effect;
            this.index=0;

            this.height=$(this.elem).height();

            /*=========================
             Default Flags and vars
             ===========================*/
            this.touches = {
                start: 0,
                startX: 0,
                startY: 0,
                current: 0,
                currentX: 0,
                currentY: 0
            };
            this.positions = {
                start: 0,
                abs: 0,
                diff: 0,
                current: 0
            };




            //初始化调用一下
            this.init();
            //绑定事件
            this.addEvtHandler();
        }

        QSwipe.prototype = {

            init:function(){

            },

            addEvtHandler:function(){

                //传递当前对象
                var _this=this;
                var elem=_this.elem;

                //绑定Touch Event
                elem.on('touchstart', onTouchStart);
                elem.on('touchmove', onTouchMove);
                elem.on('touchend', onTouchEnd);
//                $(document).on('webkitAnimationEnd', function () {
//                    _this.isMoving = false;
//
//                });


                function onTouchStart(event) {
                    console.dir("moving="+_this.isMoving  );
                    if (event.touches.length > 1 || _this.isMoving || _this.isTouched ) {
                        return;
                    }
                    console.dir("moving,noreturn="+_this.isMoving );

                    //阻止手势默认事件
                    //if (event.preventDefault) event.preventDefault();

                    //获取节点坐标
                    var pageX = event.targetTouches[0].pageX;
                    var pageY = event.targetTouches[0].pageY;

                    _this.touches.startX = _this.touches.currentX = pageX;
                    _this.touches.startY = _this.touches.currentY = pageY;

                    _this.touches.start = _this.touches.current = _this.isV ? pageY : pageX;
                    //console.dir("start" + _this.touches.start);
                    _this.currentEle=$(event.target);

                    if (!_this.currentEle.is(_this.selector)) {
                        _this.currentEle = _this.currentEle.parents(_this.selector);

                    }

                    //设置已经触屏
                    _this.isTouched = true;



                }


                function onTouchMove(event){
                    if (event.touches.length > 1 || !_this.isTouched) {
                        return;
                    }
                    if (event.preventDefault) event.preventDefault();

                    //console.dir("move");
                    //设置过渡效果
                    moveTransition(event);

                }

                function moveTransition(event){
                    var effect=_this.transition;
                    var sHeight=_this.height;
                    var dist;

                    switch (effect){
                        case "none":(function(event){
                            if(_this.isV){
                                var pageY = event.targetTouches[0].pageY;
                                _this.touches.current =  pageY;
                                //偏移量
                                dist=_this.positions.current =  pageY-_this.touches.startY;

                                if(dist>0){
                                    _this.way="down";
                                    _this.siblingEle =  _this.currentEle.prev(_this.selector) ;
                                }else if(dist<0){
                                    _this.way="up";
                                    _this.siblingEle =  _this.currentEle.next(_this.selector) ;
                                }else{
                                    _this.way="";
                                }
                                //console.dir("dist="+dist+",way="+_this.way);
                                if (!_this.siblingEle || _this.siblingEle.size() === 0) {
                                    _this.isTouched = false;
                                    return;
                                }

                                console.dir("setting moving ="+_this.isMoving);

                                console.dir(_this);
                                _this.isMoving = true;
                                //console.dir(_this.currentEle);
                                _this.currentEle.css({
                                    '-webkit-transition' : 'none',
                                    '-webkit-transform' : 'translate(0, ' +  _this.positions.current  + 'px)'
                                });

                                //console.dir(_this.positions.current);
                                _this.siblingEle.css({
                                    '-webkit-transition' : 'none',
                                    '-webkit-transform' : 'translate(0, ' + ( _this.positions.current + (_this.way==="up" ? sHeight : -sHeight)) + 'px)'
                                });


                                //console.dir(_this.positions.current);

                            }

                        })(event);
                            break;
                        case "normal":(function(event){


                        })();
                            break;
                        case "scale":(function(event){


                        })();
                            break;
                    }
                }

                function onTouchEnd(event){
                    if ( !_this.isMoving || !_this.isTouched) {
                        return;
                    }

                    moveEndTransition(event);
                    _this.isTouched = false;

                }

                function moveEndTransition(event){
                    var effect=_this.transition;
                    switch (effect){
                        case "none":(function(event){
                            if(_this.isV){
                                if(_this.way===""){
                                    return;
                                }
                                _this.currentEle.css({
                                    '-webkit-transition' : '-webkit-transform 0.4s ease-out',
                                    '-webkit-transform' : 'translate(0, ' + (_this.way==="up" ? '-' : '') + '100%)'

                                }).one('webkitTransitionEnd', function () {

                                    $(this).css({
                                        '-webkit-transform' : 'translate(0, ' + (_this.way==="up" ? '-' : '') + '100%)'
                                    });
                                    //console.dir($(this));
                                    //_this.isMoving = false;
                                    _this.currentEle = null;
                                    _this.siblingEle = null;
                                });

                                _this.siblingEle.css({
                                    '-webkit-transition' : '-webkit-transform 0.4s ease-out',
                                    '-webkit-transform' : 'translate(0, 0)'
                                }).one('webkitTransitionEnd', function () {
                                    $(_this.selector).removeClass(_this.settings.activeClass);
                                    var el = $(this);
                                    el.addClass(_this.settings.activeClass);

                                });

                            }

                        })(event);
                            break;
                        case "normal":(function(event){


                        })();
                            break;
                        case "scale":(function(event){


                        })();
                            break;
                    }
                }

            },

            _callFunc:function (e) {
                // 调用 “_draw”开头的的功能函数
                if (this[func]) { this[func].apply(this, [e]); }

                // 调用回调函数
                if (this.options['draw' + canvasEvent]) { this.options['_draw' + canvasEvent].apply(this, [e]); }


            }



        };



        return QSwipe;

    })();




    /**
     * 插件的私有方法
     */
    privateMethod = function () {

    };

    /**
     * 这里是将QSwipe对象 转为zepto插件的形式进行调用
     * 定义一个插件 QSwipe
     * zepto的data方法与jq的data方法不同
     * 这里的实现方式可参考文章：http://trentrichardson.com/2013/08/20/creating-zepto-plugins-from-jquery-plugins/
     */

    $.fn.QSwipe = function(options,callback){
        qSelector=$(this).selector;

        return this.each(function () {
            var $this = $(this),
                instance = $.fn.QSwipe.lookup[$this.data('QSwipe')];
            if (!instance) {
                //zepto的data方法只能保存字符串，所以用此方法解决一下
                $.fn.QSwipe.lookup[++$.fn.QSwipe.lookup.i] = new QSwipe(this,options,callback);
                $this.data('QSwipe', $.fn.QSwipe.lookup.i);
                instance = $.fn.QSwipe.lookup[$this.data('QSwipe')];
            }

            if (typeof options === 'string') instance[options]();
        });


//        document.addEventListener('touchmove', function (evt) {
//            evt.preventDefault();
//        });
    }

    $.fn.QSwipe.lookup = {i: 0};

    /**
     * 插件的默认值
     */
    $.fn.QSwipe.defaults = {
        mode: 'vertical',
        speed: '300',
        //激活动画样式名
        activeClass:"play",
        //外层父标签样式名
        wrapper:".wrap",
        //默认没有过度动画
        effect:"none"
    };

    /**
     * 优雅处： 通过data-xxx 的方式 实例化插件。
     * 这样的话 在页面上就不需要显示调用了。
     * 可以查看bootstrap 里面的JS插件写法
     */
    $(function () {
        return new QSwipe($('[data-QSwipe]'));
    });

})(window.jQuery || window.Zepto || window.$);