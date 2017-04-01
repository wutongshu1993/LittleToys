/**
 * Created by lh on 2017/2/20.
 */
;
(function () {
    var _$ = function (_this) {
        return _this.constructor == jQuery ? _this : $(_this);
    };//获取jquery对象
    //获取当前时间
    function now() {
        return +new Date();//转化为数字
    }
    //转化为整数
    function toInterger(text) {
        text = parseInt(text);
        return isFinite(text) ? text : 0;
    }
    var Parabola = function (options) {
        console.log(this);
        this.initialize(options);
    };
    Parabola.prototype = {
        constructor : Parabola,
        /**
         * 初始化
         * @param options
         * options中参数包括
         * 参数名	数据类型	默认值	描述
         el	jQuery||String（选择器）	null	必须填写的参数，要移动的元素，可以是jQuery对象或选择器
         offset	Array	[0, 0]	表示移动元素在X，Y轴的偏移位置，设置了targetEl参数后，该参数将失效
         targetEl	jQuery||String（选择器）	null	终点元素，这时就会自动获取该元素的left、top值，来表示移动元素在X，Y轴的偏移位置；设置了这个参数，offset将失效
         duration	Number	500	运动的时间，默认500毫秒
         curvature	Number	0.001	抛物线曲率，就是弯曲的程度，越接近于0越像直线，默认0.001
         callback	Function	null	运动后执行的回调函数，this指向该对象
         stepCallback	Function	null	运动过程中执行的回调函数，this指向该对象，接受x，y参数，分别表示X，Y轴的偏移位置。
         autostart	Boolean	false	是否自动开始运动，默认为false
         */
        initialize : function (options) {
           this.options = this.options || this.getOptions(options);
            var ops = this.options;

            if(!this.options.el){
                return;
            }
            // var temp = _$("#bool");
           this.$el = _$(options.el);
            this.timerId = null;
            this.elOriginalLeft = toInterger(this.$el.css("left"));
            this.elOriginalTop = toInterger(this.$el.css("top"));
            console.log(this.elOriginalLeft);
            //获取偏移量,如果设置了目标元素，则计算；否则采用默认的offset数组中的偏移量
            if(options.targetEl){
                this.driftX = toInterger(_$(ops.targetEl).css('left')) - this.elOriginalLeft;
                this.driftY = toInterger(_$(ops.targetEl).css('top')) - this.elOriginalTop;
            }
            else {
                this.driftX = options.offset[0];
                this.driftY = options.offset[1];
            }
            console.log(this.driftX);
            this.duration = ops.duration;
            this.curvature = ops.curvature;//a
            /**
             *根据两点坐标及曲率确定用去曲线函数
             * y = a * x * x + b * x +c
             * a = this.curvature
             * 将抛物线的起点定为（0,0），因此c=0，
             * 再带入第二个点（x2, y2）得到b = (y2-a *x2＊x2) / x2
             * 这里的y2，x2是针对初始坐标，即为driftX，driftY
             */
            this.b = (this.driftY - this.curvature * this.driftX * this.driftX) / this.driftX;
            //自动开始
            if (ops.autostart){
                this.start();
            }
        },
        /**
         * 初始化配置参数，返回MAP
         * @param options
         */
        getOptions : function (options) {
            if(typeof options !== "object"){
                options = {};
            }
            options = $.extend({}, defaultSetting, _$(options.el).data(), (this.options || {}), options);////////这里怎么这么多参数???/
            return options;
        },
        /**
         * 定位
         * @param x
         * @param y
         */
        domove : function (x, y) {
            this.$el.css({
                position : "absolute",
                left : this.elOriginalLeft + x,
                top : this.elOriginalTop + y
            });
            return this;
        },
        /**
         * 每一步执行
         * @param now
         */
        step : function (now) {
            var ops = this.options;
            var x, y;
            if(now > this.end){
                //运行结束
                x = this.driftX;
                y = this.driftY;
                this.domove(x, y);
                this.stop();
                if(typeof ops.callback === 'function'){
                    ops.callback.call(this);
                }
            }
            else {
                x = this.driftX * (now - this.begin) / this.duration;
                y = this.curvature * x * x + this.b * x;
                this.domove(x, y);
               /* if(typeof ops.callback === 'function'){
                    ops.callback.call(this);
                }*/
            }
            return this;

        },
        setOptions : function (options) {
            this.reset();
            if(typeof options !== "object"){
                options = {};
            }
            this.options = this.getOptions(options);
            this.initialize('parabola', this.options);//////????????这个参数为何
            return this;
        },
    start : function () {
        var self = this;
        //设置起始时间
        this.begin = now();
        this.end = this.begin + this.duration;
        if(this.driftX === 0 && this.driftY === 0){
            return ;
        }
        if(!!this.timerId){
            clearInterval(this.timerId);
            this.stop();
        }
        this.timerId = setInterval(function () {
            var t = now();
            self.step(t);
        }, 13);
        return this;
    },
      reset : function (x, y) {
          this.stop();
          x = x ? x : 0;
          y = y ? y : 0;
          this.domove(x, y);
          return this;
      },
        stop : function () {
            if(!!this.timerId){
                clearInterval(this.timerId);
            }
            return this;
        },
    };
    var defaultSetting = {
        el: null,
        //偏移位置
        offset: [0, 0],
        //终点元素，这时就会自动获取该元素的left、top，设置了这个参数，offset将失效
        targetEl: null,
        //运动的时间，默认500毫秒
        duration: 500,
        //抛物线曲率，就是弯曲的程度，越接近于0越像直线，默认0.001
        curvature: 0.001,
        //运动后执行的回调函数
        callback: null,
        // 是否自动开始，默认为false
        autostart: false,
        //运动过程中执行的回调函数
        stepCallback: null
    };
    window.Parabola = Parabola;
})();
var bool = new Parabola({
    el: "#bool",
    offset: [500, 100],
    curvature: 0.005,
    duration: 3000,
    targetEl : "#target",
    callback: function () {
        alert("完成后回调")
    },
    stepCallback: function (x, y) {
        console.log(x, y);
        $("<div>").appendTo("body").css({
            "position": "absolute",
            "top": this.elOriginalTop + y,
            "left": this.elOriginalLeft + x,
            "background-color": "#CDCDCD",
            "width": "5px",
            "height": "5px",
            "border-radius": "5px"
        });
    }
});
window.onload = function () {
    $("#start").click(function () {
        bool.start();
    });
};