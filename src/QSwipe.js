;(function($){
    'use strict';
    $.fn.QSwipe = function(options,callback){

        var _this= $(this),

            //将插件的默认参数及用户定义的参数合并到一个新的obj里
            _settings = $.extend({}, $.fn.QSwipe.defaults, options),
            //QSwipe ID
            _id = (new Date()).getTime(),
            //是否正在触屏中
            _isTouched = false,
            //是否正在移动
            _isMoving=false,
            //index
            _index=0,
            _movePenc,
            //初始化宽高
            _width=0,
            _height=0,
            //移动方向
            _way="",
            _curElement,
            //选择器
            _selector=_this.selector,
            //是否为垂直方向
            _isV,
            //过渡方式
            _transition,
            //兄弟节点
            _siblingElement,
            _touches,
            _positions,
            _bindObj;

            //滑屏模式
            _isV=_settings.mode==="vertical";
            _transition=_settings.effect;
            _movePenc=parseFloat(_settings.movePercent);
            _width=_this.width();
            _height=_this.height();
            _touches = {
                start: 0,
                startX: 0,
                startY: 0,
                current: 0,
                currentX: 0,
                currentY: 0
            };
            _positions = {
                current: 0,
                currentX: 0,
                currentY: 0
            };
             _bindObj={
                width:_width,
                height:_height
             };





        //初始化调用一下
        _init();
        //绑定事件
        _addEvtHandler();


        function _init(){

            //初始化样式
            if(_isV){
                _this.css({
                    "-webkit-transform":"translateY(100%)"
                });
            }else{
                _this.css({
                    "-webkit-transform":"translateX(100%)"
                });
            }
            _this.parent().css({
                "overflow":"hidden"
            });
            _this.css({
                "overflow":"hidden",
                "-webkit-backface-visibility":"hidden"
            });
            _this.eq(0).css({
                "-webkit-transform":"translate(0,0)"
            });
        }

        function _addEvtHandler(){


            //绑定Touch Event
            _this.on('touchstart', onTouchStart);
            _this.on('touchmove', onTouchMove);
            _this.on('touchend', onTouchEnd);
            _this.on('webkitAnimationEnd', function () {
                _this.isMoving = false;

            });


            function onTouchStart(event) {
                if (event.touches.length > 1 || _isMoving || _isTouched ) {
                    return;
                }

                //阻止手势默认事件
                //if (event.preventDefault) event.preventDefault();

                //获取节点坐标
                var pageX = event.targetTouches[0].pageX;
                var pageY = event.targetTouches[0].pageY;

                _touches.startX = _touches.currentX = pageX;
                _touches.startY = _touches.currentY = pageY;


                _touches.start = _touches.current = _isV ? pageY : pageX;
                //console.dir("start" + _touches.start);
                _curElement=$(event.target);

                if (!_curElement.is(_selector)) {
                    _curElement = _curElement.parents(_selector);

                }

                //设置已经触屏
                _isTouched = true;

                if(_settings.onTouchStartFunc){
                    _bindObj={
                        index:_index,
                        movePenc:Math.abs(_positions.current)/totalRang,
                        distX:0,
                        distY:0
                    };
                    _settings.onTouchStartFunc(_bindObj);
                }




            }


            function onTouchMove(event){
                if (event.touches.length > 1 || !_isTouched) {
                    return;
                }
                if (event.preventDefault) event.preventDefault();
                //设置过渡效果
                moveTransition(event);

                if(_settings.onTouchMoveFunc){
                    _bindObj={
                        index:_index,
                        movePenc:Math.abs(_positions.current)/totalRang,
                        distX:_positions.currentX,
                        distY:_positions.currentY
                    };
                    _settings.onTouchMoveFunc(_bindObj);
                }

            }

            function moveTransition(event){
                var effect=_transition;
                var sHeight=_height;

                var currentVal=0;
                _touches.currentX =  event.targetTouches[0].pageX;
                _touches.currentY =  event.targetTouches[0].pageY;

                _positions.currentX=_touches.currentX-_touches.startX;
                _positions.currentY=_touches.currentY-_touches.startY;

                //是否为垂直方向滑屏
                if(_isV){
                    _touches.current =  _touches.currentY;
                    currentVal =  _positions.currentY;
                }else{
                    _touches.current =  _touches.currentX;
                    currentVal =  _positions.currentX;
                }
                _positions.current=currentVal;

                switch (effect){
                    case "none":(function(event){



                    })(event);
                        break;
                    case "normal":(function(event){

                        moveWithNormalEffect(_isV,currentVal,event);

                    })(event);
                        break;
                    case "scale":(function(event){

                        moveWithScaleEffect(_isV,currentVal,event);

                    })(event);
                        break;
                }
            }

            function moveWithNormalEffect(isV,current,event){
                //偏移量
                var dist=_positions.current =  current;

                if(dist>0){
                    _way=_isV?"down":"right";
                    _siblingElement =  _curElement.prev(_selector) ;
                }else if(dist<0){
                    _way=isV?"up":"left";
                    _siblingElement =  _curElement.next(_selector) ;
                }else{
                    _way="";
                }
                if (!_siblingElement || _siblingElement.size() === 0) {
                    _isTouched = false;
                    return;
                }


                var curTransformVal,
                    sibTransformVal;

                if(_way==="up"){
                    curTransformVal="translate(0,"+dist+"px)";
                    sibTransformVal="translate(0,"+(dist+_height)+"px)";
                }else if(_way==="down"){
                    curTransformVal="translate(0,"+dist+"px)";
                    sibTransformVal="translate(0,"+(dist-_height)+"px)";
                }else if(_way=="left"){
                    curTransformVal="translate("+dist+"px,0)";
                    sibTransformVal="translate("+(dist+_width)+"px,0)";
                }else{
                    curTransformVal="translate("+dist+"px,0)";
                    sibTransformVal="translate("+(dist-_width)+"px,0)";
                }

                _isMoving = true;


                _curElement.css({
                    '-webkit-transition' : 'none',
                    '-webkit-transform' : curTransformVal
                });

                _siblingElement.css({
                    '-webkit-transition' : 'none',
                    '-webkit-transform' : sibTransformVal
                });


            }


            function moveWithScaleEffect(isV,current,event){
                //偏移量
                var dist=_positions.current =  current;

                if(dist>0){
                    _way=_isV?"down":"right";
                    _siblingElement =  _curElement.prev(_selector) ;
                }else if(dist<0){
                    _way=isV?"up":"left";
                    _siblingElement =  _curElement.next(_selector) ;
                }else{
                    _way="";
                }
                if (!_siblingElement || _siblingElement.size() === 0) {
                    _isTouched = false;
                    return;
                }


                var curTransformVal,
                    sibTransformVal,
                    transOrigin;

                if(_way==="up"){
                    curTransformVal="scale(" + (1 - Math.abs(dist / _height)) + ")";
                    sibTransformVal="translate(0,"+(dist+_height)+"px)";
                    transOrigin="50% 0%";
                }else if(_way==="down"){
                    curTransformVal="scale(" + (1 - Math.abs(dist / _height)) + ")";
                    sibTransformVal="translate(0,"+(dist-_height)+"px)";
                    transOrigin="50% 100%";
                }else if(_way==="left"){
                    curTransformVal="scale(" + (1 - Math.abs(dist / _width)) + ")";
                    sibTransformVal="translate("+(dist+_width)+"px,0)";
                    transOrigin="0% 50%";
                }else{
                    curTransformVal="scale(" + (1 - Math.abs(dist / _width)) + ")";
                    sibTransformVal="translate("+(dist-_width)+"px,0)";
                    transOrigin="100% 50%";
                }

                _isMoving = true;


                _curElement.css({
                    '-webkit-transition' : 'none',
                    '-webkit-transform' : curTransformVal,
                    '-webkit-transform-origin' : transOrigin
                });

                _siblingElement.css({
                    '-webkit-transition' : 'none',
                    '-webkit-transform' : sibTransformVal
                });


            }


            function onTouchEnd(event){
                if ( !_isMoving || !_isTouched) {
                    return;
                }

                moveEndTransition(event);
                _isTouched = false;

                if(_settings.onTouchEndFunc){
                    _bindObj={
                        index:_index,
                        movePenc:Math.abs(_positions.current)/totalRang,
                        distX:_positions.currentX,
                        distY:_positions.currentX
                    };
                    _settings.onTouchEndFunc(_bindObj);
                }

            }


            function endWithNormalEffect(){
                if(_way===""){
                    return;
                }

                var curTransformVal,
                    sibTransformVal;
                var totalRange=_isV?_height:_width;
                //console.dir(Math.abs(_positions.current)/totalRange);
                //console.dir(_movePenc);
                if(Math.abs(_positions.current)/totalRange<_movePenc){
                    if(_way==="up") {
                        curTransformVal = "translate(0, 0)";
                        sibTransformVal="translate(0, 100%)";
                    }else if(_way==="down") {
                        curTransformVal = "translate(0, 0)";
                        sibTransformVal="translate(0,-100%)";
                    }else if(_way==="left") {
                        curTransformVal = "translate(0, 0)";
                        sibTransformVal="translate(100%,0)";
                    }else if(_way==="right") {
                        curTransformVal = "translate(0, 0)";
                        sibTransformVal="translate(-100%,0)";
                    }

                }else{
                    if(_way==="up"){
                        curTransformVal="translate(0,-100%)";
                        sibTransformVal="translate(0, 0)";
                        _index++;
                    }else if(_way==="down"){
                        curTransformVal="translate(0,100%)";
                        sibTransformVal="translate(0, 0)";
                        _index--;
                    }else if(_way=="left"){
                        curTransformVal="translate(-100%,0)";
                        sibTransformVal="translate(0, 0)";
                        _index++;
                    }else{
                        curTransformVal="translate(100%,0)";
                        sibTransformVal="translate(0, 0)";
                        _index--;
                    }
                }


                //console.dir(_index);
                _curElement.css({
                    '-webkit-transition' : '-webkit-transform 0.4s ease-out',
                    '-webkit-transform' : curTransformVal

                }).one('webkitTransitionEnd', function () {

                    $(this).css({
                        '-webkit-transform' : curTransformVal
                    });
                    //console.dir($(this));
                    _isMoving = false;
                    _curElement = null;
                    _siblingElement = null;
                });

                _siblingElement.css({
                    '-webkit-transition' : '-webkit-transform 0.4s ease-out',
                    '-webkit-transform' :sibTransformVal
                }).one('webkitTransitionEnd', function () {
                    $(_selector).removeClass(_settings.activeClass);
                    var el = $(this);
                    el.addClass(_settings.activeClass);

                });
            }

            function endWithScaleEffect(){
                if(_way===""){
                    return;
                }

                var curTransformVal,
                    sibTransformVal,
                    transOrigin;
                var totalRange=_isV?_height:_width;

                if(Math.abs(_positions.current)/totalRange<_movePenc){
                    if(_way==="up") {
                        curTransformVal = "translate(0, 0)";
                        sibTransformVal="translate(0, 100%) scale(1)";
                        transOrigin="50% 0%";
                    }else if(_way==="down") {
                        curTransformVal = "translate(0, 0)";
                        sibTransformVal="translate(0,-100%) scale(1)";
                        transOrigin="50% 100%";
                    }else if(_way==="left") {
                        curTransformVal = "translate(0, 0)";
                        sibTransformVal="translate(100%,0) scale(1)";
                        transOrigin="100% 50%";
                    }else if(_way==="right") {
                        curTransformVal = "translate(0, 0)";
                        sibTransformVal="translate(-100%,0) scale(1)";
                        transOrigin="0% 50%";
                    }

                }else{
                    if(_way==="up"){
                        curTransformVal="scale(0)";
                        sibTransformVal="translate(0, 0)";
                        transOrigin="50% 0%";
                        _index++;
                    }else if(_way==="down"){
                        curTransformVal="scale(0)";
                        sibTransformVal="translate(0, 0)";
                        transOrigin="50% 100%";
                        _index--;
                    }else if(_way=="left"){
                        curTransformVal="scale(0)";
                        sibTransformVal="translate(0, 0)";
                        transOrigin="0% 50%";
                        _index++;
                    }else{
                        curTransformVal="scale(0)";
                        sibTransformVal="translate(0, 0)";
                        transOrigin="100% 50%";
                        _index--;
                    }
                }


                //console.dir(_index);
                _curElement.css({
                    '-webkit-transition' : '-webkit-transform 0.4s ease-out',
                    '-webkit-transform' : curTransformVal,
                    '-webkit-transform-origin':transOrigin

                }).one('webkitTransitionEnd', function () {

                    $(this).css({
                        '-webkit-transform' : curTransformVal
                    });
                    //console.dir($(this));
                    _isMoving = false;
                    _curElement = null;
                    _siblingElement = null;
                });

                _siblingElement.css({
                    '-webkit-transition' : '-webkit-transform 0.4s ease-out',
                    '-webkit-transform' :sibTransformVal
                }).one('webkitTransitionEnd', function () {
                    $(_selector).removeClass(_settings.activeClass);
                    var el = $(this);
                    el.addClass(_settings.activeClass);

                });
            }

            function moveEndTransition(event){
                var effect=_transition;
                switch (effect){
                    case "none":(function(event){


                    })(event);
                        break;
                    case "normal":(function(event){
                        endWithNormalEffect();

                    })(event);
                        break;
                    case "scale":(function(event){
                        endWithScaleEffect();

                    })();
                        break;
                }
            }



        }

    }

    /**
     * 插件的默认值
     */
    $.fn.QSwipe.defaults = {
        mode: 'vertical',
        //移动屏幕百分比
        movePercent:"0.2",
        //过渡时间
        inter: '300',
        //激活动画样式名
        activeClass:"play",
        //默认没有过度动画
        effect:"normal"
    };



})(window.Zepto || window.jQuery);