/**
 * Created by lh on 2017/5/17.
 */
$(function () {
    var month_olympic = [31,29,31,30,31,30,31,31,30,31,30,31];
    var month_normal = [31,28,31,30,31,30,31,31,30,31,30,31];
    var month_name = ["January","Febrary","March","April","May","June","July","Auguest","September","October","November","December"];
    
    var holder = document.getElementById("days");
    var prev = document.getElementById("prev");
    var next = document.getElementById("next");
    var ctitle = document.getElementById("calendar-title");
    var cyear = document.getElementById("calendar-year");
    
    //获取当前的时间
    var my_date = new Date();
    var my_year = my_date.getFullYear();
    var my_month = my_date.getMonth();
    var my_day = my_date.getDate();

    //获取某月的第一天是星期几
    function getDayStart(month, year) {
        var tempDate = new Date(month, year, 1);
        return(tempDate.getDay());
    }
//获取某月一共有多少天
    function daysMonth(month, year) {
        var num = 0;
        if(month < 0){
            year = year -1;
            month = 11;
        }
        if(month > 11){
            year = year + 1;
            month = 0;
        }
        if(year % 4 === 0){//闰年
            num = month_olympic[month];
        }
        else {
            num = month_normal[month];
        }
        return num;
    }

//将日期显示在界面上
    function refreshDate() {
        var str = '';
        var totalDay = daysMonth(my_month, my_year);
        var firstDay = getDayStart(my_month, my_year);

        var lastMonthDays = daysMonth(my_month-1, my_year);
        var lastDayStart = lastMonthDays - firstDay + 1;

        var i;
        var myclass = '';
        //初始化上月剩余日期
        /*for(i = 1; i < firstDay; i++){
            str += '<li class="lightgrey">'+lastDayStart++ +'</li>'
        }*/
        for(i = 1; i <= totalDay; i++){
            if(i < my_day && my_year == my_date.getFullYear() && my_month == my_date.getMonth() || my_year < my_date.getFullYear() || (my_year == my_date.getFullYear() && my_month < my_date.getMonth())){
                myclass = ' class="lightgrey"'
            }
            else if(i == my_day  && my_year == my_date.getFullYear() && my_month == my_date.getMonth()){
                myclass = ' class="green greenbox"'
            }
            else {
                myclass = ' class="darkgrey"'
            }
            str += '<li'+myclass+'>'+i+'</li>'
        }
        holder.innerHTML = str;
        ctitle.innerHTML = month_name[my_month];
        cyear.innerHTML = my_year;

    }

    prev.addEventListener('click', function (e) {
        e.preventDefault();
        my_month--;
        if(my_month<0){
            my_year--;
            my_month = 11;
        }
        refreshDate();
    })

    next.addEventListener('click', function (e) {
        e.preventDefault();
        my_month++;
        if(my_month>11){
            my_year++;
            my_month = 0;
        }
        refreshDate();
    })

    refreshDate();
})

