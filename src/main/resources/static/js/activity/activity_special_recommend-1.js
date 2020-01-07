$.fn.toggleModule = function (options) {
    var defaults = {
        style: '' ,          // 切换方式，默认/filter滤镜
        scroll: false,      // 是否滚动
        speed: 200
    };
    var opt = $.extend({}, defaults, options);
    var that = $(this),
        style = opt.style ? opt.style : '',
        item = that.data('item'),
        toggleModule = that.closest('.J_ToggleModule'),
        moduleTop = toggleModule.offset().top;
    if (style == 'filter') {
        toggleModule.find('.toggle-item').fadeOut();
        toggleModule.find('.toggle-item[data-item="' + item + '"]').fadeIn();
    } else {
        toggleModule.find('.toggle-item').hide();
        toggleModule.find('.toggle-item[data-item="' + item + '"]').show();
    }
    if (opt.scroll) {
        $('html, body').animate({scrollTop: moduleTop - 10}, opt.speed);
    }
    toggleModule.attr('data-item', item);
};

// tab切换
$(".character-nav li").on("click", function () {
    var i = $(this).data("index");
    if (!i) return false;
    $(this).addClass("selected").siblings().removeClass("selected");
    $(".character-box").fadeOut(100);
    $(".character-box0" + i).fadeIn(100);
    $('.container').attr('data-index', i);
});

$(function () {
    //加入书架
    $(".J_BtnCollect").on("click", function () {
        if (HB.userinfo.reader_id == 0) {
            HB.util.loginDialog();
            return;
        }
        var self = $(this),
            book_info = self.closest(".book-info"),
            reader_id = HB.userinfo.reader_id,
            book_id = book_info.attr("data-book-id"),
            csrf_token = HB.util.Cookie.get('login_token');

        $.ajax({
            type: "post",
            url: HB.config.rootPath + 'bookshelf/favor',
            data: {
                reader_id: reader_id,
                book_id: book_id,
                csrf_token:csrf_token
            },
            beforeSubmit: function() {
                self.prop("disabled", true);
            },
            success: function (res) {
                if (res.code == 100000) {
                    var msg = res.tip ? res.tip : '加入书架成功！';
                    HB.util.alert(msg,1);
                } else {
                    HB.util.alert(res.tip,1);
                }
            },
            complete: function () {
                self.prop("disabled", false);
            }
        });
    });

    //关注书单
    $(".J_FavorBooklist").on("click", function () {
        if (HB.userinfo.reader_id == 0) {
            HB.util.loginDialog();
            return;
        }

        //防止多次请求，只有等异步完成的时候才可以进行
        var self = $(this);
        if(self.prop('disabled'))
            return false;
        var csrf_token = HB.util.Cookie.get('login_token'),
            list_id = self.attr("data-list-id");

        $.ajax({
            type: "post",
            url: HB.config.rootPath + 'booklist/favor_booklist',
            data: {
                list_id: list_id,
                csrf_token:csrf_token
            },
            beforeSubmit: function() {
                self.prop("disabled", true);
            },
            success: function (res) {
                if (res.code == 100000) {
                    $(".img0").hide();
                    $(".img1").toggle();
                    $(".img1").fadeOut(2000);
                    var msg = res.tip ? res.tip : '关注书单成功！';
                    HB.util.alert(msg,1);
                } else {
                    HB.util.alert(res.tip,1);
                }
            },
            complete: function () {
                self.prop("disabled", false);
            }
        });
    });
});