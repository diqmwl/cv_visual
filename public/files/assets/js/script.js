"use strict";
$(document).ready(function() {
    var $window = $(window);
    //add id to main menu for mobile menu start
    var getBody = $("body");
    var bodyClass = getBody[0].className;
    $(".main-menu").attr('id', bodyClass);
    //add id to main menu for mobile menu end

    // card js start
    $(".card-header-right .close-card").on('click', function() {
        var $this = $(this);
        $this.parents('.card').animate({
            'opacity': '0',
            '-webkit-transform': 'scale3d(.3, .3, .3)',
            'transform': 'scale3d(.3, .3, .3)'
        });

        setTimeout(function() {
            $this.parents('.card').remove();
        }, 800);
    });

    $(".card-header-right .minimize-card").on('click', function() {
        var $this = $(this);
        var port = $($this.parents('.card'));
        var card = $(port).children('.card-block').slideToggle();
        $(this).toggleClass("icon-minus").fadeIn('slow');
        $(this).toggleClass("icon-plus").fadeIn('slow');
    });
    $(".card-header-right .full-card").on('click', function() {
        var $this = $(this);
        var port = $($this.parents('.card'));
        port.toggleClass("full-card");
        $(this).toggleClass("icon-maximize");
        $(this).toggleClass("icon-minimize");
    });

    $("#more-details").on('click', function() {
        $(".more-details").slideToggle(500);
    });
    $(".mobile-options").on('click', function() {
        $(".navbar-container .nav-right").slideToggle('slow');
    });
    // card js end
    $.mCustomScrollbar.defaults.axis = "yx";
    $("#styleSelector .style-cont").slimScroll({
        setTop: "10px",
        height:"calc(100vh - 440px)",
    });
    $(".main-menu").mCustomScrollbar({
        setTop: "10px",
        setHeight: "calc(100% - 80px)",
    });
    /*chatbar js start*/

    /*chat box scroll*/
    var a = $(window).height() - 80;
    $(".main-friend-list").slimScroll({
        height: a,
        allowPageScroll: false,
        wheelStep: 5,
        color: '#1b8bf9'
    });

    // search
    $("#search-friends").on("keyup", function() {
        var g = $(this).val().toLowerCase();
        $(".userlist-box .media-body .chat-header").each(function() {
            var s = $(this).text().toLowerCase();
            $(this).closest('.userlist-box')[s.indexOf(g) !== -1 ? 'show' : 'hide']();
        });
    });

    // open chat box
    $('.displayChatbox').on('click', function() {
        var my_val = $('.pcoded').attr('vertical-placement');
        if (my_val == 'right') {
            var options = {
                direction: 'left'
            };
        } else {
            var options = {
                direction: 'right'
            };
        }
        $('.showChat').toggle('slide', options, 500);
    });


    //open friend chat
    $('.userlist-box').on('click', function() {
        var my_val = $('.pcoded').attr('vertical-placement');
        if (my_val == 'right') {
            var options = {
                direction: 'left'
            };
        } else {
            var options = {
                direction: 'right'
            };
        }
        $('.showChat_inner').toggle('slide', options, 500);
    });
    //back to main chatbar
    $('.back_chatBox').on('click', function() {
        var my_val = $('.pcoded').attr('vertical-placement');
        if (my_val == 'right') {
            var options = {
                direction: 'left'
            };
        } else {
            var options = {
                direction: 'right'
            };
        }
        $('.showChat_inner').toggle('slide', options, 500);
        $('.showChat').css('display', 'block');
    });
    // /*chatbar js end*/
    $(".search-btn").on('click', function() {
        $(".main-search").addClass('open');
        $('.main-search .form-control').animate({
            'width': '200px',
        });
    });
    $(".search-close").on('click', function() {
        $('.main-search .form-control').animate({
            'width': '0',
        });
        setTimeout(function() {
            $(".main-search").removeClass('open');
        }, 300);
    });
    $('#mobile-collapse i').addClass('icon-toggle-right');
    $('#mobile-collapse').on('click', function() {
        $('#mobile-collapse i').toggleClass('icon-toggle-right');
        $('#mobile-collapse i').toggleClass('icon-toggle-left');
    });
});
$(document).ready(function() {
    $(function() {
        $('[data-toggle="tooltip"]').tooltip()
    })
    $('.theme-loader').fadeOut('slow', function() {
        $(this).remove();
    });
});

// toggle full screen
function toggleFullScreen() {
    var a = $(window).height() - 10;
    if (!document.fullscreenElement && // alternative standard method
        !document.mozFullScreenElement && !document.webkitFullscreenElement) { // current working methods
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    } else {
        if (document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
    }
    $('.full-screen').toggleClass('icon-maximize');
    $('.full-screen').toggleClass('icon-minimize');
}
//시각화 차트 수정할때 함수
$(document).ready(function() {
    $("#chart_type").on('change', function() {
        chartType = this.value
        selectsubclass(subclass)
    });
})

// X축 버튼 클릭시 함수
$(document).ready(function() {
    $(".x_value").click(function() {
        $(".x_value").css("background-color", "white");
        this.style.background = "#5BC0DE";

        if(this.value == "CAR_ID"){
            x_value = "CAR_ID"
            $("#carID_img").attr('src','id_white.png')
            $("#calender_div").css('display','none');
            $("#carID_div").css('display','block');
        } else if(this.value == "Year"){
            x_value = "Year"
            $("#carID_div").css('display','none');
            $("#calender_div").css('display','block');
            $("#yearpicker").css('display','block');
            $("#monthpicker").css('display','none');
            $("#datepicker").css('display','none');

        } else if(this.value == "Month"){
            x_value = "Month"
            $("#carID_div").css('display','none');
            $("#calender_div").css('display','block');
            $("#yearpicker").css('display','none');
            $("#monthpicker").css('display','block');
            $("#datepicker").css('display','none');
        } else if(this.value == "Day"){
            x_value = "Day"
            $("#carID_div").css('display','none');
            $("#calender_div").css('display','block');
            $("#yearpicker").css('display','none');
            $("#monthpicker").css('display','none');
            $("#datepicker").css('display','block');
        }
    });
});

// y축 버튼 클릭시 함수
$(document).ready(function() {
    $(".y_value").click(function() {
        $(".y_value").css("background-color", "white");
        this.style.background = "#5BC0DE";

        if(this.value == "avg"){
            y_value = "avg"
        } else if(this.value == "count"){
            y_value = "Count"
        } else if(this.value == "max"){
            y_value = "max"
        } else if(this.value == "min"){
            y_value = "min"
        }
    });
});

// 디폴트 클릭 함수
$(document).ready(function() {
    $("#x_default").trigger("click");
    $("#y_default").trigger("click");
});

//slider 함수
$(document).ready(function() {
    $(".js-range-slider").ionRangeSlider({
		from: 60,
        grid: true,
        onFinish: function (data) {
            rangeslider_value = data['from_pretty'];
            selectsubclass(subclass)
        },
    });
});

//드롭다운 이벤트
$(document).ready(function() {
    $('.dropbtn').click(function() {
        if($(".dropdown-content").css('opacity') == 0){
            $(".dropdown-content").css('opacity','1');

        } else {
            $(".dropdown-content").css('opacity','0');

        }
    })
});

//페이징 함수
function paging(x){
    if(x == 0){
        if(car_location >= 1){
            car_location --;
            console.log('left');
            getcarList(calender_start, calender_end);
        }
    } else{
        var max;
        if(car_mlocation%10) max = parseInt(car_mlocation/10) + 1;
        else max = parseInt(car_mlocation/10);
        if(car_location < max-1){
            car_location ++;
            getcarList(calender_start, calender_end);
        }
    }
}

/* --------------------------------------------------------
        Color picker - demo only
        --------------------------------------------------------   */
$('#styleSelector').append('' +
    '<div class="selector-toggle">' +
        '<a href="javascript:void(0)"></a>' +
    '</div>' +
    '<ul>' +
        '<li>' +
            '<p class="selector-title main-title st-main-title"><b>시각화 </b>차트 설정</p>' +
            '<select id="chart_type" name="chart_type" class="form-control minimal">' +
                '<option name="chart_type"  style="background-image:url(barchart.png);" value="simplebar">막대 차트</option>' +
                '<option name="chart_type" value="groupbar">그룹바 차트</option>' +
                '<option name="chart_type" value="line">라인 차트</option>' +
                '<option name="chart_type" value="donut_chart">도넛 차트</option>' +
            '</select>' +
        '</li>' +
        '<li>' +
            '<p class="selector-title">X축 설정</p>' +
        '</li>' +
        '<li>' +
        /* 시작 */
        '<div class="process">' +
        '<div class="process-row">' +
            '<div class="process-step">' +
                '<button type="button" class="btn btn-default btn-circle x_value" id="x_default" value="CAR_ID"><img src="id.png" id="carID_img" alt="" style="max-width: 60%; height: auto;><i class="fa fa-user fa-3x"></i></button>' +
                '<p>Car ID</p>' +
            '</div>' +
            '<div class="process-step">' +
                '<button type="button" class="btn btn-default btn-circle x_value" value="Year"><img src="calendar.png" id="calendar_img" alt="" style="max-width: 60%; height: auto;><i class="fa fa-comments-o fa-3x"></i></button>' +
                '<p>연도별</p>' +
            '</div>' +
            '<div class="process-step">' +
                '<button type="button" class="btn btn-default btn-circle x_value" value="Month"><i class="fa fa-thumbs-up fa-3x"></i></button>' +
                '<p>월별</p>' +
            '</div>' +
             '<div class="process-step">' +
                '<button type="button" class="btn btn-default btn-circle x_value" value="Day"><i class="fa fa-eur fa-3x"></i></button>' +
                '<p>일별</p>' + 
            '</div> ' +
        '</div>' +
        '</li>' +
        
        '<li>' +
 //슬라이더
        '<div id=carID_div>'+
            '<input type="text" class="js-range-slider" name="my_range" value="" />'+
        '</div>'+
        '</li>' +

//캘린더
/*
        '<div id=year_div class="process-row">'+
            '<input type="text" name="daterange" value="01/01/2018 - 01/15/2018" />'+
        '</div>'+
*/

'<div id=calender_div class="calender_div" >'+
        '<li>' +
            '<p class="selector-title">날짜선택</p>' +
        '</li>' +
        '<li>' +
        '<input type="text" id="yearpicker" class=" calender datepicker-here" data-range="true" data-language="en" data-multiple-dates-separator=" - " data-min-view="years" data-view="years" data-date-format="yyyy-mm-dd" />'+
        '<input type="text" id="monthpicker" class=" calender datepicker-here" data-range="true" data-language="en" data-multiple-dates-separator=" - " data-min-view="months" data-view="months" data-date-format="yyyy-mm-dd" />'+
        '<input type="text" id="datepicker" class=" calender datepicker-here" data-range="true" data-language="en" data-multiple-dates-separator=" - " data-date-format="yyyy-mm-dd" />'+


        '<p class="selector-title">차량선택</p>' +
                '<div class="dropdown">'+
                    '<button class="dropbtn">차량을 선택하세요</button>'+
                    '<div class="dropdown-content" >'+
                    '<div class="dropdown-content-inner" >'+

                    '<div class="dropdown-left"><a href="#" onclick="paging(0)"><img src="Left.png" style="width:15px; height:15px;"/></a></div>'+

                    '<div class="dropdown-center">'+
                    '<a href="#">데이터가 없습니다</a>'+
                    '</div>'+

                    '<div class="dropdown-right"><a href="#" onclick="paging(1)"><img src="Right.png" style="width:15px; height:15px;"/></a></div>'+

                    '</div>'+
                    '</div>'+
                '</div>'+
        '</li>' +
        '</div>'+

        
        '<li>' +
            '<p class="selector-title">Y축 설정</p>' +
        '</li>' +
        '<li>' +
        '<div class="process">' +
        '<div class="process-row">' +
            '<div class="process-step">' +
                '<button type="button" class="btn btn-default btn-circle y_value" id="y_default" value="count"><i class="fa fa-user fa-3x"></i></button>' +
                '<p>횟수</p>' +
            '</div>' +
            '<div class="process-step">' +
                '<button type="button" class="btn btn-default btn-circle y_value" value="avg"><i class="fa fa-comments-o fa-3x"></i></button>' +
                '<p>평균</p>' +
            '</div>' +
            '<div class="process-step">' +
                '<button type="button" class="btn btn-default btn-circle y_value" value="max"><i class="fa fa-thumbs-up fa-3x"></i></button>' +
                '<p>최댓값</p>' +
            '</div>' +
             '<div class="process-step">' +
                '<button type="button" class="btn btn-default btn-circle y_value" value="min"><i class="fa fa-eur fa-3x"></i></button>' +
                '<p>최솟값</p>' + 
            '</div> ' +
        '</div>' +
        '</li>' +
    '</ul>' +
    
'</div>' +
'<ul>'+
    '<li>' +
        '<a href="http://html.codedthemes.com/Adminty/doc" target="_blank" class="btn btn-primary btn-block m-r-15 m-t-5 m-b-10">Online Documentation</a>' +
    '</li>' +
    '<li class="text-center">' +
        '<span class="text-center f-18 m-t-15 m-b-15 d-block">Thank you for sharing !</span>' +
        '<a href="#!" target="_blank" class="btn btn-facebook soc-icon m-b-20"><i class="feather icon-facebook"></i></a>' +
        '<a href="#!" target="_blank" class="btn btn-twitter soc-icon m-l-20 m-b-20"><i class="feather icon-twitter"></i></a>' +
    '</li>' +
'</ul>'+
'');
