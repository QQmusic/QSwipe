QSwipe
======

QSwipe 是一款移动端滑屏插件,基于Zepto开发，目前支持移动端平台。

* [下载最新版本的QSwipe](https://github.com/inzrb/QSwipe)

使用教程
-----------

1. 首先，需要在你的项目中引入 Zepto  on your page.
   
   你可以通过以下地址
    ```html
    http://zeptojs.com/
    ```
   下载最新版的 `Zepto` .
   `Zepto` 的用法跟 `jQuery` 非常类似。具体可以参考以上官网的API
   然后在页面底部用一个script标签引入 `Zepto` 
    ```html
    ...
    <script src=zepto.min.js></script>
    </body>
    </html>
    ```

2. 在页面中引入 `QSwipe`  插件.
   ```html
    <script src="QSwipe.min.js"></script>
    ```
    
3. 现在，你可以通过选择器（selector)在页面中调用QSwipe了。

    ```html
    <script>$(selector).QSwipe();</script>
    ```
    
## 常用设置参数 API
```html
设置
mode:模块的滑屏方向
默认值："vertical",垂直方向
可选值："horizonal",水平方向

effect：滑屏的转场效果
默认值："normal",简单滑屏过渡
可选值："none",无效果，一般需要搭配 callback 使用   

回调函数，包括如下函数：
onTouchStartFunc(swipeObj):首次手指触摸屏幕时触发函数，传参swipeObj，
  swipeObj目前包含以下属性：
    index：当前节点的序号
    movePenc：当前页面滑动所占百分比
    distX:水平偏移量
    distY:垂直偏移量
    width：滑屏的宽度
    height:滑屏的高度

  使用范例：
  $(selector).QSwipe({
      //模块的滑屏方向
      mode:"vertical",
      //滑屏的转场效果
      effect:"normal",
      //callback回调范例
      onTouchMoveFunc:function(mySwipe){
          console.dir("mySwipe.distX="+mySwipe.distX+",mySwipe.distY="+mySwipe.distY);
      }
  });

onTouchMoveFunc(swipeObj):手指触摸屏幕并在滑屏中，手指没有离开屏幕时触发函数，传参swipeObj，函数会循环调用
  使用方法同上面onTouchStartFunc一致

onTouchEndFunc(swipeObj):手指离开屏幕时触发函数，传参swipeObj
  使用方法同上面onTouchStartFunc一致


```

## 默认参数

```js
$.fn.QSwipe.defaults = {
    //模块的滑屏方向
    mode: 'vertical',
    //移动屏幕百分比 当滑动距离超过指定的屏幕百分比时才执行滑动到 下一页 的动作，否则 回滚到当前页
    movePercent:"0.2",
    //过渡时间 单位为秒
    inter: '0.3',
    //激活动画样式名
    activeClass:"play",
    //默认没有过渡动画
    effect:"normal"
};
```

## 版本更新
0.1  首次发布
    * 实现基本功能，搭建插件框架
0.2  更新功能
    * 增加"scale"过渡效果
    * 优化性能，对手势响应动作进行优化 
    * 脱离样式依赖，不需要引入任何CSS文件和样式辅助
    * 增加回调函数
    * 加入移动屏幕百分比判断机制
    * 增加过渡动画时间的设置

## 联系我

Weibo:[inzrb's Weibo](http://weibo.com/inzrb)
QQ:601346641  Leon.


## 许可 License

Licensed under GPL & MIT  

Copyright (C) 2010-2014 [inzrb's Website] 
