/**
 * Created by lh on 2017/2/19.
 */
$(document).ready(function () {
    var color = ["#626262","#787878","rgba(0,0,0,0.5)","#DCC722","white","#FF4350"];
    var info = ["谢谢参与","  1000","   10","  500","  100"," 4999","    1","   20"];
    var info1 = ['再接再厉','      元','     元','  淘金币','     元','  淘金币','     元','  淘金币'];
    var num = 3;//每人有三次抽奖机会
    var notice = null;
    var rotateAngle = 0;
    //开始按钮点击以后
    $('#lotBtn').click(function () {
       if (num >= 1){
           num--;//可抽奖次数-1
           runAnimation();
           $('#lotBtn').attr('disabled','disabled');
           setTimeout(function () {
              showAlert(notice);
               // console.log(notice);
               $('#lotBtn').removeAttr('disabled');
           }, 6000);
       }
       else {
           showAlert('抽奖次数已用完');
       }
    });

    canvasRun();
    
    //弹出提示消息
    function showAlert(msg) {

        $('#msg')[0].innerHTML = msg;
        $("#alertFram").show(1000);

    }
    function hideAlert() {
        $("#alertFram").hide(300);
    };
    $('#okBtn').click(hideAlert);
//获取各奖项对应的角度和中奖内容
    function getProbability() {
        var randNum = parseInt(Math.random()*7);
        // var randNum = 1;
        console.log(randNum);
        rotateAngle = 1800 + randNum * 45 + (3-num) * 2160;
        /*switch (randNum){
            case 0:
                // rotateAngle = (3-num) * 2160 + 1800;
                notice = info[0]+info1[0];
                break;
            case 1:
                // rotateAngle = (3-num) * 2160 + 1800;
                notice = info[1]+info1[1];
                break;
            case 2:
                notice = info[2]+info1[2];
        }*/
        randNum = randNum == 0 ? 0 : 8-randNum;
        notice = info[randNum] + info1[randNum];
    }
    
    //修改CSS，展示动画
    function runAnimation() {
        getProbability();
        var degValue = 'rotate('+rotateAngle+'deg)';
        $('#myCanvas').css('transform',degValue);
    }
    //初始化转盘,绘制转盘
    function canvasRun() {
       var myCanvas = $('#myCanvas')[0],
           myCanvas1 = $('#myCanvas1')[0],
           // myCanvas2 = $('#myCanvas2')[0],
           myCanvas3 = $('#myCanvas3')[0],
           ctx = myCanvas.getContext('2d'),
           ctx1 = myCanvas1.getContext('2d'),
           // ctx2 = myCanvas2.getContext('2d'),
           ctx3 = myCanvas3.getContext('2d');
        createCircle();
        createText();
        initPointer();
        //绘制外圆
        function createCircle() {
            var startAngle = 0,
                endAngle = 0;
            for(var i = 0; i < 8; i++){
                startAngle = Math.PI*(i/4 - 1/8);
                endAngle = startAngle + (1/4) * Math.PI;
                ctx.save();
                ctx.beginPath();
                ctx.arc(150, 150, 100, startAngle, endAngle, false);
                ctx.lineWidth = 120;
                if(i%2 == 0){
                    ctx.strokeStyle = color[0];
                }
                else {
                    ctx.strokeStyle = color[1];
                }
                ctx.stroke();
                ctx.restore();
            }
        };

        //绘制奖项文字
        function createText() {
            ctx.textAlign='start';
            ctx.textBaseline='middle';
            ctx.fillStyle = color[3];
            var step = 2 * Math.PI / 8;
            for(var i = 0; i < 8; i++){
                ctx.save();
                ctx.beginPath();
                ctx.translate(150, 150);
                ctx.rotate(step * i);
                ctx.font = "20px Microsoft YaHei";
                ctx.fillStyle = color[3];
                ctx.fillText(info[i], -30,-115, 60 );
                ctx.font = "16px Microsoft YaHei";
                ctx.fillText(info1[i], -30, -95, 60);
                ctx.closePath();
                ctx.restore();
            }

        }
        //初始化中间的指针
        function initPointer() {
            //箭头
            ctx1.save();
            ctx1.beginPath();
            ctx1.fillStyle = color[5];
            ctx1.moveTo(100,24);
            ctx1.lineTo(90, 62);
            ctx1.lineTo(110,62);
            ctx1.lineTo(100, 24);
            ctx1.fill();
            ctx1.closePath();
            ctx1.restore();
            //里面红色小圆圈
            ctx1.save();
            ctx1.beginPath();
            ctx1.fillStyle = color[5];
            ctx1.arc(100, 100, 40, 0, Math.PI*2);
            ctx1.fill();
            ctx1.restore();
            //小圆文字
            ctx1.save();
            ctx1.font = "Bold 20px Microsoft YaHei";
            ctx1.textAlign = "start";
            ctx1.textBaseline = "middle";
            ctx1.fillStyle = color[4];
            ctx1.beginPath();
            ctx1.fillText('开始', 80, 90, 40);
            ctx1.fillText('抽奖', 80, 110, 40);
            ctx1.fill();
            ctx1.closePath();
            ctx1.restore();
            //中间圆圈
            ctx3.beginPath();
            ctx3.arc(75,75,75,0, Math.PI * 2);
            ctx3.fillStyle = color[2];
            ctx3.fill();
            ctx3.closePath();
        }

    }

});