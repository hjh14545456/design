$(function(){
    //加载iframe
	var doIFrameView = function(url){
	    $('#div-iframe-view').show();
	    $('#div-iframe-view').attr('src',url);
	};
    jQuery.loginViewResize = function(){
        var windowHeight = $(window).height();
        var loginBodyHeight = $('.content-out-container')[0].scrollHeight;
        var loginTopOffset = $('.content-out-container').offset().top;
        $('.content-out-container').css("min-height",windowHeight-loginTopOffset);
        //if(windowHeight >= loginBodyHeight + loginTopOffset){
        //    //$('.content-out-container').height(windowHeight-loginTopOffset);
        //}else{
        //    //$('.content-out-container').height(loginBodyHeight);
        //}
    };
    jQuery.loginViewResize();
    $(window).resize(jQuery.loginViewResize);
    //显示当前一级导航对应的二级导航
    var iframePreProcess = function(){
        $('#div-iframe-view').attr('src',$($('.cms-nav .active').attr('href')).find('.active a').attr('href'));
    };
    iframePreProcess();

    function creatHtml() {
        var html = '';
        html += '<div  class="dialog-deleteChapter layui-layer-wrap">' +
            '<h3 class="title">保存草稿</h3>' +
            '<div class="detail" style="text-align: center;margin-top: 30px;padding-bottom: 40px;border-bottom: 1px dotted #b2b2b2;">离开此页面将会失去当前写作进度，<br/>是否保存当前草稿？</div>' +
            '</div>';
        return html;
    }

    //加载对应的iframe
    $('.active-link').click(function(event){
        var self = $(this);
        if (self.hasClass("draft")) {
            event.preventDefault();
            var html = creatHtml();
            layer.open({
                title: " ",
                type: 1,
                area: ['410px', '260px'],
                content: html,
                btn: ['保存草稿','离开'], //按钮
                yes: function(index){
                    $('.active-link, .cms-nav-item, .url-forward').removeClass("draft");
                    layer.close(index);
                    $("#div-iframe-view").contents().find("#savedraft").trigger("click");
                },
                btn2: function () {
                    $('.active-link, .cms-nav-item, .url-forward').removeClass("draft");
                    self.trigger("click");
                }
            });
            return;
        }
        $('.cms-subnav-list li.active').removeClass('active');
        $(this).parent().addClass('active');
        $('head title').html($(this).text());
        iframePreProcess();
    });

    //二级导航操作
    $('.plus-link').live('click',function(event){
        event.preventDefault();
        if($('.minus-link').length > 0){
            $('.minus-link').removeClass('minus-link').addClass('plus-link').children('span').removeClass('glyphicon-minus-sign');
            $('.third-nav').hide();
        }
        $(this).next().show();
        $(this).removeClass('plus-link').addClass('minus-link');
        $(this).children('span').addClass('glyphicon-minus-sign');
        iframePreProcess();
        jQuery.iframeResize();
    });
    //二级导航操作（加）
    $('.minus-link').live('click',function(event){
        event.preventDefault();
        $(this).next().hide();
        $(this).removeClass('minus-link').addClass('plus-link');
        $(this).children('span').removeClass('glyphicon-minus-sign');
        iframePreProcess();
        jQuery.iframeResize();
    });

    //点击导航显示对应的二级导航
    $('.cms-nav-item').on('click',function(event){
        var self = $(this);
        if (self.hasClass("draft")) {
            event.preventDefault();
            var html = creatHtml();
            layer.open({
                title: " ",
                type: 1,
                area: ['410px', '260px'],
                content: html,
                btn: ['保存草稿','离开'], //按钮
                yes: function(index){
                    $('.active-link, .cms-nav-item, .url-forward').removeClass("draft");
                    layer.close(index);
                    $("#div-iframe-view").contents().find("#savedraft").trigger("click");
                },
                btn2: function () {
                    $('.active-link, .cms-nav-item, .url-forward').removeClass("draft");
                    self.trigger("click");
                }
            });
            return;
        }
        event.preventDefault();
        $(this).addClass('active').siblings('.active').removeClass('active');
        var href = $(this).attr('href');
        var subNav = href.substring((href.indexOf('#')+1));
        if (subNav == "navid-homepage") {
            window.location.reload();
        }
        //显示对应的二级导航
        $('.left-nav-detail #'+subNav).show().siblings().hide();
        //iframe加载该二级导航下的第一个链接
        $('.cms-subnav-list li.active').removeClass('active');
        $('.left-nav-detail #'+subNav).find('.active-link').eq(0).parent().addClass('active');
        var loadUrl = $('.left-nav-detail #'+subNav).find('.active-link').eq(0).attr('href');
        doIFrameView(loadUrl);
        iframePreProcess();
        jQuery.iframeResize();
    });

    //点击其他入口显示对应的二级导航
    $('.url-forward').on('click',function(event){
        var self = $(this);
        if (self.hasClass("draft")) {
            event.preventDefault();
            var html = creatHtml();
            layer.open({
                title: " ",
                type: 1,
                area: ['410px', '260px'],
                content: html,
                btn: ['保存草稿','离开'], //按钮
                yes: function(index){
                    $('.active-link, .cms-nav-item, .url-forward').removeClass("draft");
                    layer.close(index);
                    $("#div-iframe-view").contents().find("#savedraft").trigger("click");
                },
                btn2: function () {
                    $('.active-link, .cms-nav-item, .url-forward').removeClass("draft");
                    self.trigger("click");
                }
            });
            return;
        }
        event.preventDefault();
        var href = $(this).attr('href');
        var url = $.url(href);
        var segments = url.segment();
        var nav = segments[segments.length - 2];
        var sub_nav = segments[segments.length - 1];
        var nav_id = "navid-"+nav;
        $('.cms-nav-item[href=#'+nav_id+']').addClass('active').siblings('.active').removeClass('active');
        //显示对应的二级导航
        $('.left-nav-detail #'+nav_id).show().siblings().hide();
        //iframe加载该二级导航下的第一个链接
        $('.cms-subnav-list li.active').removeClass('active');
        $('.left-nav-detail #'+sub_nav+'.active-link').eq(0).parent().addClass('active');
        var loadUrl = $('.left-nav-detail #'+sub_nav).attr('href');
        doIFrameView(href);
        iframePreProcess();
    });
});

