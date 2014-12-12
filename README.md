QSwipe
======

QSwipe 是一款移动端滑屏插件,基于Zepto开发，目前支持移动端平台，。

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
    <script>$('.item').QSwipe();</script>
    ```
    
