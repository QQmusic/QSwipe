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
            _bindObj,
            _canElemMove,
            _container,
            _tempTElem;

            //滑屏模式
            _isV=_settings.mode==="vertical";
            _transition=_settings.effect;
            _movePenc=parseFloat(_settings.movePercent);
            _width=_this.width();
            _height=_this.height();
            _container=_this.parent();
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
                        movePenc:Math.abs(_positions.current)/_isV?_height:_width,
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
                        movePenc:Math.abs(_positions.current)/_isV?_height:_width,
                        distX:_positions.currentX,
                        distY:_positions.currentY
                    };
                    _settings.onTouchMoveFunc(_bindObj);
                }

            }

            function moveTransition(event){
                var effect=_transition;

                var currentVal= 0,siblingVal=0;
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
                        siblingVal= currentVal;
                        moveWithNormalTran(event,currentVal,siblingVal);
                    })(event);
                        break;
                    case "scale":(function(event){
                        siblingVal= currentVal;
                        moveWithScaleTran(event,currentVal,siblingVal);
                    })(event);
                        break;
                    case "fade":(function(event){
                        siblingVal= currentVal;
                        moveWithFadeTran(event,currentVal,siblingVal);
                    })(event);
                        break;
                    case "ease":(function(event){
                        siblingVal= currentVal;
                        moveWithEaseTran(event,currentVal,siblingVal);
                    })(event);
                        break;
                    case "bounce":(function(event){
                        siblingVal= currentVal;
                        moveWithBounceTran(event,currentVal,siblingVal);
                    })(event);
                        break;
                    case "gule":(function(event){
                        siblingVal= currentVal;
                        moveWithGuleTran(event,currentVal,siblingVal);
                    })(event);
                        break;   
                    case "cubein":(function(event){
                        siblingVal= currentVal;
                        moveWithCubeInTran(event,currentVal,siblingVal);
                    })(event);
                        break;        
                }
            }

            function refreshElement(currentVal,initPos){
                //偏移量
                var dist=_positions.current =  currentVal;

                if(dist>0){
                    _way=_isV?"down":"right";
                    _siblingElement =  _curElement.prev(_selector) ;
                }else if(dist<0){
                    _way=_isV?"up":"left";
                    _siblingElement =  _curElement.next(_selector) ;
                }
                if (!_siblingElement || _siblingElement.size() === 0) {
                    _isMoving=false;
                    _isTouched = false;
                    if(initPos){
                        initPos();
                    }
                    return;
                }
                return dist;

            }

            function initPos(){
                if(_way==="up"){
                    _this.css({
                        "-webkit-transform":"translate(0,-100%)"
                    });
                    _curElement.css({
                        "-webkit-transform":"translate(0,0)"
                    });

                }else if(_way==="down"){
                    _this.css({
                        "-webkit-transform":"translate(0,100%)"
                    });
                    _curElement.css({
                        "-webkit-transform":"translate(0,0)"
                    });

                }else if(_way==="left"){
                    _this.css({
                        "-webkit-transform":"translate(-100%,0)"
                    });
                    _curElement.css({
                        "-webkit-transform":"translate(0,0)"
                    });

                }else if(_way==="right"){
                    _this.css({
                        "-webkit-transform":"translate(100%,0)"
                    });
                    _curElement.css({
                        "-webkit-transform":"translate(0,0)"
                    });

                }
            }

            function moveWithNormalTran(event,currentVal,siblingVal){


                var dist=refreshElement(currentVal,initPos);
                if(!dist){   return;}
                var curTransformVal,
                    sibTransformVal;

                if(_way==="up"){
                    curTransformVal="translate(0,"+currentVal+"px)";
                    sibTransformVal="translate(0,"+(siblingVal+_height)+"px)";
                }else if(_way==="down"){
                    curTransformVal="translate(0,"+currentVal+"px)";
                    sibTransformVal="translate(0,"+(siblingVal-_height)+"px)";
                }else if(_way=="left"){
                    curTransformVal="translate("+currentVal+"px,0)";
                    sibTransformVal="translate("+(siblingVal+_width)+"px,0)";
                }else{
                    curTransformVal="translate("+currentVal+"px,0)";
                    sibTransformVal="translate("+(siblingVal-_width)+"px,0)";
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


            function moveWithScaleTran(event,currentVal,siblingVal){
                var dist=refreshElement(currentVal,initPos);

                if(!dist){ return;}
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

            function moveWithFadeTran(event,currentVal,siblingVal){


                moveWithNormalTran(event,currentVal,siblingVal);
                var totalRange;
                if(_isV){
                    totalRange=parseFloat(Math.abs(currentVal)/_height);
                }else{
                    totalRange=parseFloat(Math.abs(currentVal)/_width);
                };
    
                //正在触屏中
                if(_isTouched){
                    _curElement.css({
                    'opacity' : Math.max(1-totalRange*3/2,0)
                    });
                    _siblingElement.css({
                        'opacity' : Math.min(1,totalRange*2)
                    });
                }
                
                

            }

            function moveWithEaseTran(event,currentVal,siblingVal){

                moveWithNormalTran(event,currentVal*0.6,siblingVal);
                _curElement.css({
                    'z-index':"999"
                });
            }

            function moveWithBounceTran(event,currentVal,siblingVal){

                //偏移量
                var dist=refreshElement(currentVal,initPos);

                if(!dist){ return;}
                var curTransformVal,
                    sibTransformVal,
                    sceVal,opaVal,tmpVal;

                //缩放量
                tmpVal=parseFloat(Math.abs(dist / _height)/6);
                sceVal=Math.max(1 -tmpVal,0.85) ;
                opaVal=Math.max(1 -tmpVal*4,0.3);
                if(_way==="up"){
                    curTransformVal="scale(" + sceVal + ")";
                    sibTransformVal="translate(0,"+(dist+_height)+"px)";
                }else if(_way==="down"){
                    curTransformVal="scale(" + sceVal + ")";
                    sibTransformVal="translate(0,-"+(_height-dist)+"px)";
                }else if(_way==="left"){
                    curTransformVal="scale(" + sceVal + ")";
                     sibTransformVal="translate("+(dist+_width)+"px,0)";
                }else if(_way==="right"){
                    curTransformVal="scale(" + sceVal + ")";
                     sibTransformVal="translate("+(dist-_width)+"px,0)";
                }
                
               
                _isMoving = true;

                _curElement.css({
                    '-webkit-transition' : 'none',
                    '-webkit-transform':curTransformVal,
                    'opacity' : opaVal,
                    'z-index':"9"
                });

                _siblingElement.css({
                    '-webkit-transition' : 'none',
                    '-webkit-transform' : sibTransformVal,
                    'z-index':"999",
                    "opacity":"1"

                });


            }

            function rotatingEffect(rotatingVal,opaVal,currentVal,siblingVal){
                var curTransformVal,sibTransformVal,transOrigin;

                if(_way==="up"){
                    transOrigin="50% 0%";
                    sibTransformVal="translate(0,"+(_height+siblingVal)+"px)";
                    curTransformVal="rotateX(" + (-rotatingVal) + "deg)";
                }else if(_way==="down"){
                    transOrigin="50% 100%";
                    sibTransformVal="translate(0,"+(currentVal-_height)+"px)";
                    curTransformVal="rotateX(" + rotatingVal + "deg)"; 
                }else if(_way=="left"){
                    transOrigin="0% 50%";
                    sibTransformVal="translate("+(_width+siblingVal)+"px,0)";
                    curTransformVal="rotateY(" + rotatingVal + "deg)"; 
                }else if(_way=="right"){
                    transOrigin="100% 50%";
                    sibTransformVal="translate("+(currentVal-_width)+"px,0)";
                    curTransformVal="rotateY(" + (-rotatingVal) + "deg)"; 
                }

                _container.css({
                    "position": "relative",
                    "-webkit-perspective": "1200px"
                });
                _curElement.css({
                    '-webkit-transition' : 'none',
                    '-webkit-transform' : curTransformVal,
                    '-webkit-transform-origin' : transOrigin,
                    'transform-style': "preserve-3d",
                    "z-index":"9",
                    'opacity' : Math.max(1-opaVal,0.3)
                });

                _siblingElement.css({
                    '-webkit-transition' : 'none',
                    '-webkit-transform' : sibTransformVal,
                    "z-index":"999",
                    'opacity' : "1"
                });
            }


            function moveWithGuleTran(event,currentVal,siblingVal){
                var dist=refreshElement(currentVal,initPos);
                if(!dist){   return;}
                
                var rotatingVal,guleVal,opaVal,degVal;

                //缩放量
                guleVal=parseFloat(Math.abs(dist / _height)/6);
                opaVal=Math.min(guleVal*10,0.7);
                degVal=_settings.tranRange||20;
                rotatingVal=Math.min(opaVal*degVal,80);

                rotatingEffect(rotatingVal,opaVal,currentVal,siblingVal);


                _isMoving = true;

                if(_way==="down"||_way==="right"){
                    _curElement.css({
                        'opacity' : Math.max(1-opaVal,0.3),
                        "z-index":"9"
                    });
                    _siblingElement.css({
                        "z-index":"999",
                        'opacity' : "1"
                    });
                }

            }

            function cubingEffect(cubingVal,opaVal,currentVal,siblingVal){
                var curTransformVal,sibTransformVal,curTransOrigin,sibTransOrigin;

                if(_way==="up"){
                    sibTransOrigin="50% 0%";
                    curTransOrigin="50% 100%";
                    sibTransformVal= "translate(0,"+(_height+siblingVal)+"px) rotateX(" + (cubingVal-90) + "deg)"
                    curTransformVal="translate(0,"+(currentVal)+"px)  rotateX(" + cubingVal + "deg)";
                }else if(_way==="down"){
                    sibTransOrigin="50% 100%";
                    curTransOrigin="50% 0%";
                    sibTransformVal= "translate(0,"+(siblingVal-_height)+"px) rotateX(" + (90-cubingVal) + "deg)"
                    curTransformVal="translate(0,"+(currentVal)+"px)  rotateX(" + (-cubingVal) + "deg)";
                }else if(_way=="left"){
                    sibTransOrigin="0% 50%";
                    curTransOrigin="100% 50%";
                    sibTransformVal= "translate("+(_width+siblingVal)+"px,0) rotateY(" + (90-cubingVal) + "deg)"
                    curTransformVal="translate("+(currentVal)+"px,0)  rotateY(" + (-cubingVal) + "deg)"; 
                }else if(_way=="right"){
                    sibTransOrigin="100% 50%";
                    curTransOrigin="0% 50%";
                    sibTransformVal= "translate("+(siblingVal-_width)+"px,0) rotateY(" + (cubingVal-90) + "deg)"
                    curTransformVal="translate("+(currentVal)+"px,0)  rotateY(" + (cubingVal) + "deg)"; 
                }


                _container.css({
                    "position": "relative",
                    "-webkit-perspective": "1200px"
                });

                //页面
                if(_way==="up"){
                    _this.css({
                            '-webkit-transform':"translate(0,-100%) rotateY(-90deg)"
                    });
                }else if(_way==="down"){
                    _this.css({
                            '-webkit-transform':"translate(0,100%) rotateY(-90deg)"
                    });
                }else if(_way==="left"){
                    _this.css({
                            '-webkit-transform':"translate(-100%,0) rotateY(90deg)"
                    });
                }else if(_way==="right"){
                    _this.css({
                            '-webkit-transform':"translate(100%,0) rotateY(-90deg)"
                    });
                }
                

                _curElement.css({
                    '-webkit-transition' : 'none',
                    '-webkit-transform' : curTransformVal,
                    '-webkit-transform-origin' : curTransOrigin,
                    'transform-style': "preserve-3d",
                    "z-index":"999",
                    'opacity' : "1"
                });

                _siblingElement.css({
                    '-webkit-transition' : 'none',
                    '-webkit-transform' : sibTransformVal,
                    '-webkit-transform-origin' : sibTransOrigin,
                    "z-index":"9",
                    'opacity' : Math.max(1-opaVal,0.6)
                });


            }


            function initCubePos(){
                if(_way==="up"){
                    _this.css({
                        "-webkit-transform":"translate(0,-100%)"
                    });
                    _curElement.css({
                        "-webkit-transform":"translate(0,0)"
                    });

                }else if(_way==="down"){
                    _this.css({
                        "-webkit-transform":"translate(0,100%)"
                    });
                    _curElement.css({
                        "-webkit-transform":"translate(0,0)"
                    });

                }else if(_way==="left"){
                    _this.css({
                        "-webkit-transform":"translate(-100%,0)"
                    });
                    _curElement.css({
                        "-webkit-transform":"translate(0,0)"
                    });

                }else if(_way==="right"){
                    _this.css({
                        "-webkit-transform":"translate(100%,0)"
                    });
                    _curElement.css({
                        "-webkit-transform":"translate(0,0)"
                    });

                }
            }

            function moveWithCubeInTran(event,currentVal,siblingVal){
                var dist=refreshElement(currentVal,initPos);
                if(!dist){   return;}
                
                var cubingVal,guleVal,opaVal,totalPenc;
                if(_isV){
                    totalPenc=Math.abs(dist)/_height;
                }else{
                    totalPenc=Math.abs(dist)/_width;
                }
                cubingVal=totalPenc*90;
                opaVal=Math.min(totalPenc,0.8);
                _isMoving = true;
                cubingEffect(cubingVal,opaVal,currentVal,siblingVal);

                

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
                        movePenc:Math.abs(_positions.current)/_isV?_height:_width,
                        distX:_positions.currentX,
                        distY:_positions.currentX
                    };
                    _settings.onTouchEndFunc(_bindObj);
                }

            }


            function endWithNormalTran(){
                var curTransformVal,
                    sibTransformVal;
                var totalRange=_isV?_height:_width,_canElemMove;
                //console.dir(Math.abs(_positions.current)/totalRange);
                _canElemMove=Math.abs(_positions.current)/totalRange>_movePenc?true:false;
                if(!_canElemMove){
                    if(_way==="up") {
                        curTransformVal = "translate(0, 0)";
                        sibTransformVal = "translate(0, 100%)";
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
                    '-webkit-transition' : '-webkit-transform 0.4s ease-out,opacity 0.4s ease-out',
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
                    '-webkit-transition' : '-webkit-transform 0.4s ease-out,opacity 0.4s ease-out',
                    '-webkit-transform' :sibTransformVal
                });

                if(_canElemMove){

                    _siblingElement.one('webkitTransitionEnd', function () {
                        $(_selector).removeClass(_settings.activeClass);
                        var el = $(this);
                        el.addClass(_settings.activeClass);

                    });

                }

                

                
            }

            function endWithScaleTran(){

                var curTransformVal,
                    sibTransformVal,
                    transOrigin;
                var totalRange=_isV?_height:_width;
                _canElemMove=Math.abs(_positions.current)/totalRange>_movePenc?true:false;
                if(!_canElemMove){
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
                        transOrigin="0% 50%";
                    }else if(_way==="right") {
                        curTransformVal = "translate(0, 0)";
                        sibTransformVal="translate(-100%,0) scale(1)";
                        transOrigin="100% 50%";
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

            function endWithFadeTran(){
                endWithNormalTran();
                var totalRange=_isV?_height:_width,_canElemMove;
                //console.dir(Math.abs(_positions.current)/totalRange);
                _canElemMove=Math.abs(_positions.current)/totalRange>_movePenc?true:false;
                if(_canElemMove){
                    _curElement.css({
                        '-webkit-transition' : '-webkit-transform 0.4s ease-out,opacity 0.4s ease-out',
                        "opacity":"0"
                    });
                    _siblingElement.css({
                        '-webkit-transition' : '-webkit-transform 0.4s ease-out,opacity 0.4s ease-out',
                        "opacity":"1"
                    });
                }else{
                    _curElement.css({
                        '-webkit-transition' : '-webkit-transform 0.4s ease-out,opacity 0.4s ease-out',
                        "opacity":"1"
                    });
                    _siblingElement.css({
                        '-webkit-transition' : '-webkit-transform 0.4s ease-out,opacity 0.4s ease-out',
                        "opacity":"0"
                    });
                }
                
            }

            function endWithEaseTran(){
                endWithNormalTran();

                _curElement.css({
                    '-webkit-transition' : '-webkit-transform 0.7s ease',
                    'z-index':"999"
                });

                _siblingElement.css({
                    '-webkit-transition' : '-webkit-transform 0.4s ease-out'
                });
            }

            function endWithBounceTran(){
                endWithNormalTran();
                var totalRange=_isV?_height:_width,
                    curElemStyle,sibElemStyle;
                _canElemMove=Math.abs(_positions.current)/totalRange>_movePenc?true:false;
                if(!_canElemMove){
                    curElemStyle={
                        '-webkit-transition' : '-webkit-transform 0.5s ease-out,opacity  0.5s ease-out',
                        '-webkit-transform': "scale(1) translate(0,0)",
                        "opacity":"1",
                        'z-index':"9"

                    };
                    sibElemStyle={
                        '-webkit-transition' : '-webkit-transform 0.5s ease-out,opacity  0.5s ease-out',
                        "opacity":"0",
                        'z-index':"999"
                    }

                }else{
                    curElemStyle={
                        '-webkit-transition' : '-webkit-transform 0.5s ease-out,opacity  0.5s ease-out',
                        '-webkit-transform': "scale(0.8) translate(0,0)",
                        "opacity":"0",
                        'z-index':"9"

                    };
                    sibElemStyle={
                        '-webkit-transition' : '-webkit-transform 0.6s ease',
                        "opacity":"1",
                        'z-index':"999"
                    }
                }
                _curElement.css(curElemStyle);

                _siblingElement.css(sibElemStyle);
            }

            function endWithGuleTran(){
                endWithNormalTran();
                var totalRange=_isV?_height:_width,
                    curElemStyle,sibElemStyle;
                _canElemMove=Math.abs(_positions.current)/totalRange>_movePenc?true:false;
                if(_canElemMove){
                    if(!_settings.isEndRestore){
                        curElemStyle={
                            "-webkit-transform": "scale(0.8) translateZ(-200px)",
                            "opacity":"0",
                            "transition-timing-function":"ease" 
                        };
                        sibElemStyle={
                            "-webkit-transform": "scale(1) translate3d(0,0,0)",
                            "opacity":1,
                            "transition-timing-function":"ease" 
                        }
                    }else{
                        curElemStyle={
                            "-webkit-transform": "scale(1) translate3d(0,0,0)",
                            "opacity":"0",
                            "transition-timing-function":"ease" 
                        };
                        sibElemStyle={
                            "-webkit-transform": "scale(1) translate3d(0,0,0)",
                            "opacity":1,
                            "transition-timing-function":"ease" 
                        }
                    }
                    
                }
                _curElement.css(curElemStyle);

                _siblingElement.css(sibElemStyle);
            }

            function endWithCubeTran(){
                endWithNormalTran();
                var totalRange=_isV?_height:_width,
                    curElemStyle,sibElemStyle;
                _canElemMove=Math.abs(_positions.current)/totalRange>_movePenc?true:false;
                if(_canElemMove){


                    curElemStyle={
                        "opacity":"0",
                        "transition-timing-function":"ease"
                    };

                    sibElemStyle={
                        "-webkit-transform":  "translateY(0) rotateX(0deg) ",
                        "opacity":1,
                        "transition-timing-function":"ease"
                    }

                    
                    if(_way==="up"){
                        curElemStyle={
                            "-webkit-transform": "translateY(-100%) rotateX(90deg) ",
                            "z-index":"9" 
                        };
                    }else if(_way==="down"){
                        
                        curElemStyle={
                            "-webkit-transform": "translateY(100%) rotateX(-90deg) ",
                            "z-index":"999" ,
                            "opacity":0
                        };
                        sibElemStyle={
                            "z-index":"9",
                            "opacity":"1"
                        }
                    }else if(_way==="left"){
                        curElemStyle={
                            "-webkit-transform": "translateX(-100%) rotateY(-90deg) "
                        };
                    }else if(_way==="right"){
                        curElemStyle={
                            "-webkit-transform": "translateX(100%) rotateY(90deg) "
                        };
                    }
                    
                    
                    
                }else{
                    curElemStyle={
                        "opacity":"1"
                    };

                    sibElemStyle={
                        "opacity":"0"
                    }
                    if(_way==="up"){
                        sibElemStyle={
                            "-webkit-transform":  "translate3d(0,100%,0) rotateX(-90deg)"
                        }
                    }else if(_way==="down"){
                        sibElemStyle={
                            "-webkit-transform":  "translate3d(0,-100%,0) rotateX(90deg)"
                        }
                    }else if(_way==="left"){
                        sibElemStyle={
                            "-webkit-transform":  "translate3d(100%,0,0) rotateY(90deg)"
                        }
                    }else if(_way==="right"){
                        sibElemStyle={
                            "-webkit-transform":  "translate3d(-100%,0,0) rotateY(-90deg)"
                        }
                    }
                    
                    
                }

                _curElement.css(curElemStyle);

                _siblingElement.css(sibElemStyle);

            }


            function moveEndTransition(event){
                var effect=_transition;
                switch (effect){
                    case "none":(function(event){

                    })(event);
                        break;
                    case "normal":(function(event){
                        endWithNormalTran();
                    })(event);
                        break;
                    case "scale":(function(event){
                        endWithScaleTran();
                    })();
                        break;
                    case "fade":(function(event){
                        endWithFadeTran();
                    })();
                        break;
                    case "ease":(function(event){
                        endWithEaseTran();
                    })();
                        break;
                    case "bounce":(function(event){
                        endWithBounceTran();
                    })();
                        break;
                    case "gule":(function(event){
                        endWithGuleTran();
                    })();
                        break;    
                    case "cubein":(function(event){
                        endWithCubeTran();
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
        effect:"normal",
        //默认动画过渡数值，在xxxEffect函数中判断
        tranRange:"15",
        //结束过渡动画是否复原
        isEndRestore:true
    };



})(window.Zepto || window.jQuery);