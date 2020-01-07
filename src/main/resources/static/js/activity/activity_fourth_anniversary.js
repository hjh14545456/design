$(function(){
    //判断屏幕高度低于450
    function altitude(){
        var height0 = $(window).height();
        console.log(height0);
        if(height0<450){
            $(".J_HLB").addClass("Small_screen")
        }
    }
    altitude()
    // 导航
    $('.nav a').on('click', function () {
        var self, nav, threshold, top;
        self = $(this);
        nav = self.parent().data('nav');
        threshold = 10;
        top = $('.section[data-nav="'+ nav +'"]').offset().top - threshold;
        $('html, body').animate({scrollTop: top}, 600);
    });

    // 移动端导航
    $('.nav-mobile li').click(function(){
        $(this).addClass('active').siblings().removeClass('active');
        // console.log($(".active")[0].className.substring(0,4));
        $(".section").each(function(i, val) {
            var class00 = $(val);
            var class01 = $(".active")[0].className.substring(0,4);
            console.log(class00.hasClass($(".active")[0].className.substring(0,4)));
            if(class00.hasClass($(".active")[0].className.substring(0,4))){
                // console.log($(this));
                $(this).addClass('selected');
            }else{
                $(this).removeClass('selected');
            }
            // if()
        });
    })

    var threshold = 10;
    $(window).on('scroll', function() {
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        $('.section').each(function (i, val) {
            var ele_top, ele_height, nav;
            ele_top = $(val).offset().top;
            ele_height = $(val).outerHeight();
            nav = $(val).data('nav');
            if (scrollTop >= ( ele_top - threshold ) && scrollTop < ( ele_top + ele_height - threshold )){
                $('.nav li').removeClass('current');
                $('.nav li[data-nav="'+ nav +'"]').addClass('current');
                return false;
            }
        });
    });
    $(window).on('resize', function () {
        $(window).trigger('scroll');
    });

    function actDialog(option) {
        $(".act-dialog-box").not(".act-dialog-address, .act-dialog-buy").remove();
        var id = option.id ? option.id : '',
            skin = option.skin ? option.skin : '',
            title = option.title ? option.title: '',
            content = option.content ? option.content : '';
        var dialog = '<div class="act-dialog-box '+ skin +'" id="'+ id +'">' +
            '<div class="act-dialog-mask"></div>' +
            '<div class="act-dialog-body">' +
            '<span class="act-dialog-close"></span>' +
            '<div class="act-dialog-content">' +
            '<h3 class="act-dialog-title">'+ title +'</h3>' +
            content +
            '</div>' +
            '</div>' +
            '</div>';
        $("body").append(dialog);
    }
    $(document).on('click', '.act-dialog-close', function () {
        $(this).closest(".act-dialog-box").hide();
    });

    /* ********************* 寄语 *********************** */
    $(".foreword-box-p1").click(function () {
        $(".foreword-box-p1").removeClass("nothing");
        $(".foreword-box-p2").addClass("nothing");
        $(".foreword-box-p3").addClass("hide");
        $(".boss_Message").removeClass("hide");
        $(".author_Message").addClass("hide");
    })
    $(".foreword-box-p2").click(function () {
        $(".foreword-box-p1").addClass("nothing");
        $(".foreword-box-p2").removeClass("nothing");
        $(".foreword-box-p3").removeClass("hide");
        if($(".author_Message_p1").text().length==0){
            $(".foreword-box-p3").trigger('click');
        }
        $(".boss_Message").addClass("hide");
        $(".author_Message").removeClass("hide").children(".author_Message_p").removeClass("hide");
        // $(".author_Message_p").show();
    })
    $(".foreword-box-p3").click(function () {
        var self = $(this);
        $.ajax({
            type: "GET",
            url: HB.config.rootPath + '/activity/get_random_author_wishes',
            data: {
            },
            beforeSend: function() {
                self.attr("disabled", true);
            },
            complete: function() {
                self.attr("disabled", false);
            },
            success: function (res) {
                if (res.code == 100000) {
                    $(".author_Message_p1").html(res.data.wishes);
                    var book_url = HB.config.rootPath + 'book/' + res.data.book_id;
                    $(".author_Message_p").html('by <span id="author">'+ res.data.reader_name+
                        '</span> &nbsp;&nbsp;代表作<span id="book_name"><a style="color: #fff;" target="_blank" href="'+
                        book_url+ '">《'+ res.data.book_name+ '》</a></span>');
                } else {
                    HB.util.alert(res.tip, 1);
                }
            },
            error: function () {

            }
        });
    });

    /* ********************* 福袋 *********************** */


    // 开启/购买福袋按钮
    $(".J_BagNum").each(function(i, val) {
        var num = parseInt($(val).text());
        if (num == 0) {
            $(this).parent().siblings(".J_OpenBag").hide();
            $(this).parent().siblings(".J_BuyBag").css("display","inline-block");
            // $(this).parent().siblings(".J_OpenBag_ten").removeClass("J_OpenBag_ten_on");
            // $(this).parent().siblings(".J_OpenBag_ten").addClass("J_OpenBag_ten_off");
        }else if(num < 10){
            // $(this).parent().siblings(".J_OpenBag_ten").removeClass("J_OpenBag_ten_on");
            // $(this).parent().siblings(".J_OpenBag_ten").addClass("J_OpenBag_ten_off");
        }
    });

    // 单次开启福袋
    $(".J_OpenBag").click(function() {
        if (HB.userinfo.reader_id == 0) {
            HB.util.loginDialog();
            return;
        }
        var self = $(this);
        if (self.attr("disabled")) return;
        var num = parseInt(self.siblings("p").find("span").text());
        if (num == 0) {
            var content = '<div class="tips-box"><p class="tips">福袋不足，请购买</p></div>';
            actDialog({
                skin: "act-dialog-tips",
                id: "act-dialog-bag-tips",
                content: content
            });
            return false;
        }

        var reader_id = HB.userinfo.reader_id,
            bag_type = self.closest("li").attr("data-type");

        $.ajax({
            type: "POST",
            url: HB.config.rootPath + 'activity/use_fudai_fourth_anniversary',
            data: {
                reader_id: reader_id,
                bag_type: bag_type,
                open_num: 1
            },
            beforeSend: function() {
                self.attr("disabled", true);
            },
            complete: function() {
                self.attr("disabled", false);
            },
            success: function (res) {
                if (res.code == 100000) {
                    var span = self.siblings("p").find("span");
                    span.text(parseInt(span.text())-1);
                    var num = parseInt(span.text());
                    if (num == 0) {
                        span.parent().siblings(".J_OpenBag").hide();
                        span.parent().siblings(".J_BuyBag").css("display","inline-block");
                    }
                    // console.log(res)
                    var content = '<div class="open-bag" id="J_luckyBag">' +
                        '<div class="prize prize0'+ res.data.bonus_info[0].prize_id + '"><b></b>'+ res.data.bonus_info[0].prize_title +'</div>' +
                        '<div class="btn-box">' +
                        '<a class="btn-again" id="J_BtnContinue" href="javascript:;" data-type="'+ bag_type +'"></a>' +
                        '</div>' +
                        '</div>';
                    actDialog({
                        skin: 'act-dialog-bag',
                        content: content
                    });
                    $(".act-dialog-close").show();
                    if ($('.nav-mobile').length == 1) {
                        $('#J_luckyBag .prize b').stop().animate({width: '3.42188rem', height: '2.92188rem', 'margin-top': '-1.71094rem'}, 100);
                    } else {
                        $('#J_luckyBag .prize b').stop().animate({width: '201px', height: '183px', 'margin-left': '82.5px', 'margin-top': '-51.5px'}, 200);
                    }

                    // 刷新“我的奖品”记录
                    var bonus_type = $(".J_MineRecordBox").find(".Selection").attr("data-type");
                    if ($(".exhibit01").css('display')=='none') {
                        loadFudaiBonusRank(HB.config.rootPath + 'activity/get_entity_and_virtual_bonus_list/1/'+bonus_type);
                    }
                } else {
                    HB.util.alert(res.tip, 1);
                }
            },

        });
    });
    $(document).on("click", ".act-dialog-bag .act-dialog-mask,#act-dialog-bag-tips .act-dialog-mask", function () {
        $(this).closest(".act-dialog-box").hide();
    });

    // 十次开启福袋
    $(".J_OpenBag_ten_on").click(function() {
        if (HB.userinfo.reader_id == 0) {
            HB.util.loginDialog();
            return;
        }
        var self = $(this);
        if (self.attr("disabled")) return;
        var num = parseInt(self.siblings("p").find("span").text()),
            bag_type01 = self.attr("data-type"),
            span = $('.J_LuckyBag li[data-type="' + bag_type01 +'"] .J_BagNum');
        var num = parseInt(self.siblings("p").find("span").text());
        if (num < 10) {
            span.parent().siblings(".J_BuyBag").trigger("click");
            $("#J_ConsumeBox").find(".J_OwnAmount").text(num);
            // var content = '<div class="tips-box failed"><p class="tips">福袋不足，请购买</p></div>';
            // actDialog({
            //     skin: "act-dialog-tips",
            //     id: "act-dialog-bag-tips",
            //     content: content
            // });
            return false;
        }

        var reader_id = HB.userinfo.reader_id,
            bag_type = self.closest("li").attr("data-type");
        $.ajax({
            type: "POST",
            url: HB.config.rootPath + 'activity/use_fudai_fourth_anniversary',
            data: {
                reader_id: reader_id,
                bag_type: bag_type,
                open_num: 10
            },
            beforeSend: function() {
                self.attr("disabled", true);
            },
            complete: function() {
                self.attr("disabled", false);
            },
            success: function (res) {
                if (res.code == 100000) {
                    var span = self.siblings("p").find("span");
                    span.text(parseInt(span.text())-10);
                    var num = parseInt(span.text());
                    if (num == 0) {
                        span.parent().siblings(".J_OpenBag").hide();
                        span.parent().siblings(".J_BuyBag").css("display","inline-block");
                    }
                    console.log(res.data);
                    var prize_str = '';

                    $.each(res.data.bonus_info,function(index,value){
                        prize_str += '<div class="prize prize0'+ value.prize_id + '"><b></b>' + '</div>'
                    });

                    var content = '<div class="open-tenbag" id="J_luckyBag">' +
                        prize_str +
                        '<div class="btn-box">' +
                        '<a class="btn-accept" id="J_Btnaccept" href="javascript:;" data-type="'+ bag_type +'"></a>' +
                        '</div>' +
                        '</div>';
                    actDialog({
                        skin: 'act-dialog-bag',
                        content: content
                    });
                    $(".act-dialog-close").hide();
                    if ($('.nav-mobile').length == 1) {
                        $('#J_luckyBag .prize b').stop().animate({width: '1.7125rem', height: '1.6875rem'}, 100);
                    } else {
                        $('#J_luckyBag .prize b').stop().animate({width: '201px', height: '183px', 'margin-left': '-10px', 'margin-top': '-11.5px'}, 200);
                    }

                    //刷新拥有福袋个数
                    $("#J_ConsumeBox").find(".J_OwnAmount").text(res.data.rest_amount);

                    // 刷新“我的奖品”记录
                    var bonus_type = $(".J_MineRecordBox").find(".Selection").attr("data-type");
                    if ($(".exhibit01").css('display')=='none') {
                        loadFudaiBonusRank(HB.config.rootPath + 'activity/get_entity_and_virtual_bonus_list/1/'+bonus_type);
                    }
                } else {
                    HB.util.alert(res.tip, 1);
                }
            },
        });
    });
    // 继续开福袋
    $(document).on('click', '#J_BtnContinue', function () {
        var self = $(this),
            bag_type = self.attr("data-type"),
            span = $('.J_LuckyBag li[data-type="' + bag_type +'"] .J_BagNum'),
            num = parseInt(span.text());
        if (num == 0) {
            // 关闭当前窗口
            self.closest('.act-dialog-box').remove();
            span.parent().siblings(".J_OpenBag").hide();
            // 弹出购买福袋窗口
            span.parent().siblings(".J_BuyBag").css("display","inline-block").trigger("click");
            //var content = '<div class="tips-box"><p class="tips">福袋不足，请购买</p></div>';
            //actDialog({
            //    id: "act-dialog-bag-tips",
            //    skin: "act-dialog-tips",
            //    content: content
            //});
            //return false;
        } else {
            $('.J_LuckyBag li[data-type="' + bag_type +'"] .J_OpenBag').trigger("click");
        }
    });
    //收下
    $(document).on('click', '#J_Btnaccept', function () {
        $(this).closest(".act-dialog-box").hide();
        // $(this).closest(".act-dialog-close").prop().display = display;
    });
    // 购买福袋
    $(document).on("click",".J_BuyBag", function() {
        if (HB.userinfo.reader_id == 0) {
            HB.util.loginDialog();
            return;
        }
        var self = $(this),
            li = self.closest("li"),
            bag = li.attr("class"),
            has_num = li.find('.J_BagNum').text();
            consumeType = li.data("type"),     // 消费（福袋）类型
            consumeBox = $("#J_ConsumeBox"),
            bagArr = {
                'bag-s': ['小福袋', 100, 100],
                'bag-m': ['中福袋', 2800, 2800],
                'bag-l': ['大福袋', 8800, 8800]
            };

        if(self.prop('disabled')) return false;
        if($(".J_HLB").html().length==0) {
            $.ajax({
                type: 'POST',
                url: HB.config.rootPath + 'activity/get_prop_info',
                data: {
                },
                beforeSend: function() {
                    self.prop("disabled", true);
                },
                complete: function () {
                    self.prop("disabled", false);
                },
                success: function (res) {
                    if (res.code == 100000) {
                        $(".J_HLB").text(res.data.rest_hlb-res.data.rest_gift_hlb);
                    } else {
                        HB.util.alert(res.tip,1);
                    }
                }
            });
        }

        consumeBox.find(".goods-info").attr("data-type", consumeType);
        consumeBox.find(".goods-pic").attr("class","goods-pic " + bag);
        consumeBox.find(".J_NumResult").val(1);
        consumeBox.find(".J_ConsumeNum").text(1);
        consumeBox.find(".J_GoodsTitle").text(bagArr[bag][0]);
        consumeBox.find(".J_GoodsPrice").text(bagArr[bag][1]);
        consumeBox.find(".J_ConsumeSum").text(bagArr[bag][2]);
        consumeBox.find(".J_OwnAmount").text(has_num);
        $("#J_DialogConsume").show();
        $(".act-dialog-close").show();
    });

    // 购买道具次数加减
    $(document).on("click", "#J_ConsumeBox .J_ConsumeAmount a", function() {
        var self = $(this),
            consumeBox = self.closest('#J_ConsumeBox'),
            numResult = consumeBox.find(".J_NumResult"),
            consumeNum = consumeBox.find(".J_ConsumeNum"),
            consumeSum = consumeBox.find(".J_ConsumeSum"),
            goodsPrice = parseInt(consumeBox.find(".J_GoodsPrice").text()),
            val = parseInt(numResult.val());
        val = isNaN(val) ? 0 : val;
        if(self.hasClass("J_NumPlus")){ // 加
            if (val >= (Math.round( Math.pow(10,10) ) - 1)) return false;
            val += 1;
        } else if($(this).hasClass("J_NumMinus")){ // 减
            val > 1 ? val -= 1: val;
        }
        numResult.val(val);
        consumeNum.text(val);
        consumeSum.text(val * goodsPrice);
    });
    $(document).on("keyup", "#J_ConsumeBox .J_NumResult", function() {
        var self = $(this);
        self.val(self.val().replace(/[^\d]/g,''));

        var consumeBox = self.closest('#J_ConsumeBox'),
            consumeNum = consumeBox.find(".J_ConsumeNum"),
            consumeSum = consumeBox.find(".J_ConsumeSum"),
            goodsPrice = parseInt(consumeBox.find(".J_GoodsPrice").text()),
            val = parseInt(self.val());
        val = isNaN(val) ? 0 : val;
        consumeNum.text(val);
        consumeSum.text(val * goodsPrice);
    });

    // 购买道具次数确认按钮
    $(document).on('click', "#J_ConsumeBox .J_BtnSubmit", function () {
        var self = $(this);
        if(self.prop('disabled')) return false;
        var consumeBox = self.closest("#J_ConsumeBox");
        var consumeType = consumeBox.find(".goods-info").attr("data-type"), // 消费类型
            consumeNum = parseInt(consumeBox.find(".J_ConsumeNum").text()),
            consumeSum = parseInt(consumeBox.find(".J_ConsumeSum").text()),
            hlb = parseInt(consumeBox.find(".J_HLB").text()),
            reader_id = HB.userinfo.reader_id;
        if (consumeNum <= 0) {
            HB.util.alert("请输入需购道具数量", 1);
            return false;
        }
        if(consumeSum > hlb){
            HB.util.alert("您的猫饼干余额不足", 1);
            return false;
        }
        $.ajax({
            url: HB.config.rootPath + 'activity/buy_fudai_fourth_anniversary',
            type: 'POST',
            data: {
                reader_id: reader_id,
                consume_type: consumeType, // 消费类型
                consume_num: consumeNum
            },
            beforeSend: function() {
                self.prop("disabled", true);
            },
            complete: function () {
                self.prop("disabled", false);
            },
            success: function (res) {
                if (res.code == 100000) {
                    var msg = res.tip ? res.tip : '购买成功！';
                    HB.util.alert(msg,1);
                    $(".J_HLB").text(hlb-consumeSum);
                    var li = $('.J_LuckyBag li[data-type="'+ consumeType +'"]');
                    var has_num = li.find('.J_BagNum').text();
                    li.find('.J_BagNum').text(consumeNum+parseInt(has_num));
                    li.find('.J_OpenBag').css("display", "inline-block");
                    li.find('.J_BuyBag').hide();
                } else {
                    HB.util.alert(res.tip,1);
                }
                $("#J_DialogConsume").hide();
            },
            error: function () {
                HB.util.alert("购买失败！", 1);
                $("#J_DialogConsume").hide();
            }
        });
    });

    function topCalc(bIsIosApp) {
        var sUserAgent = navigator.userAgent.toLowerCase();
        var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
        var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
        if ( bIsIpad || bIsIphoneOs || bIsIosApp ){
            var initTop = $(document).scrollTop(); //记录初始滚动高度
            scroll_top = initTop;
            $('body').css({'position': 'fixed', 'top': (-1) * initTop + 'px', 'width': '100%'});
        }
    }

    /* ********************* 地址 *********************** */
    // 填写地址
    $(document).on("click", ".btn-address", function () {
        var self = $(this),
            prop_other_id = self.attr('data-prop-other-id');
        // console.log($("#has_address_info").val());
        if ($("#has_address_info").val()==1) {
            //已填写地址
            var url = HB.config.rootPath + 'activity/get_user_address_list/'+prop_other_id;
            $("#J_DialogConfirmAddress").attr("data-prop-other-id", prop_other_id)
            $("#J_DialogConfirmAddress").load(url, function() {
            });
            $("#J_DialogConfirmAddress").show();
            $(".act-dialog-close").show();
        } else {
            $("#J_DialogAddress").attr("data-prop-other-id", prop_other_id).show();
            $("#distpicker").distpicker({autoSelect: false});
            $(".act-dialog-close").show();
        }
    });
    $(document).on("click", "#J_DialogAddress .btn-submit", function () {
        var self = $(this);
        var recipient = $.trim($("#recipient").val()),
            address = $.trim($("#address").val()),
            mobile = $.trim($("#mobile").val()),
            province = $.trim($("#province").val()),
            city = $.trim($("#city").val()),
            district = $.trim($("#district").val()),
            qq = $.trim($("#qq_num").val());
        var prop_other_id = $("#J_DialogAddress").attr('data-prop-other-id');
        var address_id = $("#J_DialogAddress").attr('data-address-id');
        var set_all = $("#J_DialogAddress").attr("data-set-all");

        if (recipient == "") {
            HB.util.alert("请输入收件人姓名！",1);
            return false;
        }
        if (address == "") {
            HB.util.alert("请输入详细的收货地址信息！",1);
            return false;
        }
        if (mobile == "") {
            HB.util.alert("请输入收件人的手机号码！",1);
            return false;
        }
        if (province == "" || city=="") {
            HB.util.alert("请选择地址！",1);
            return false;
        }

        $.ajax({
            type: 'POST',
            url: HB.config.rootPath + 'activity/set_fukubukuro_address',
            data: {
                prop_id: prop_other_id,
                address_id: address_id,
                recipient: recipient,
                address: address,
                mobile: mobile,
                province: province,
                city: city,
                district: district,
                qq: qq,
                set_all: set_all
            },
            beforeSend: function() {
                self.prop('disabled', true);
            },
            complete: function() {
                self.prop('disabled', false);
            },
            success: function(res) {
                if (res.code == 100000) {
                    HB.util.alert(res.tip,1);
                    // console.log(set_all);
                    var has_address =  $("#has_address_info").val();
                    $("#J_DialogAddress").hide();
                    $("#has_address_info").val(1);
                    // $("body").css({"position": "static", "top": 0}).scrollTop(scroll_top);
                    if (set_all == 1){
                        $('.btn-address').text('已填写');
                    }else {
                        if(has_address == 0){
                            $('.btn-address[data-prop-other-id="'+ prop_other_id +'"]').text('已填写');
                        }else{
                            //局部刷新并显示地址列表
                            var url = HB.config.rootPath + 'activity/get_user_address_list/'+prop_other_id;
                            $("#J_DialogConfirmAddress").load(url);
                            $("#J_DialogConfirmAddress").show();
                        }
                    }
                } else {
                    HB.util.alert(res.tip,1);
                }
            }
        });
    });

    // 单选
    $(document).on("click", ".J_BtnRadio", function () {
        $(this).closest("li").siblings("li").find(".J_BtnRadio").removeClass("selected");
        $(this).addClass("selected");
    });
    // 确认地址
    $(document).on("click", "#J_DialogConfirmAddress .btn-submit", function () {
        var self = $(this),
            box = self.closest("#J_DialogConfirmAddress"),
            address_id = $(".J_BtnSelecton").attr("data-address-id"),
            prop_other_id = box.attr('data-prop-other-id');

        // console.log(address_id)
        // console.log(prop_other_id)
        $.ajax({
            type: 'POST',
            url: HB.config.rootPath + 'activity/choose_address',
            data: {
                prop_id: prop_other_id,
                address_id: address_id
            },
            beforeSend: function() {
                self.prop('disabled', true);
            },
            complete: function() {
                self.prop('disabled', false);
            },
            success: function(res) {
                if (res.code == 100000) {
                    HB.util.alert(res.tip, 1);
                    $("#J_DialogConfirmAddress").hide();
                    $('.btn-address[data-prop-other-id="'+ prop_other_id +'"]').text('已填写');
                } else {
                    HB.util.alert(res.tip, 1);
                }
            }
        });
    });
    // 修改地址
    $(document).on("click", ".J_BtnModify", function () {
        var self = $(this),
            box = self.closest("#J_DialogConfirmAddress"),
            address_id = self.siblings(".J_BtnSelect").attr("data-address-id"),
            prop_other_id = box.attr('data-prop-other-id');
        box.hide();
        $("#J_DialogAddress").attr("data-prop-other-id", prop_other_id).show();
        $("#J_DialogAddress").attr("data-address-id", address_id).show();

        $("#distpicker").distpicker({autoSelect: true});
    });
    // 新增地址
    $(document).on("click", ".J_BtnAdd", function () {
        // if ($(".address-list").children().length>6) {
        //     HB.util.alert('最多只能添加六个地址哦')
        //     return;
        // }

        var self = $(this),
            box = self.closest("#J_DialogConfirmAddress"),
            prop_other_id = box.attr('data-prop-other-id');
        box.hide();
        $("#J_DialogAddress .btn-submit").attr("data-type", 1);
        $("#J_DialogAddress").attr("data-prop-other-id", prop_other_id).show();
        var address_id = $(".J_BtnSelect:last").data("address-id")+1;
        // console.log(address_id);
        $("#J_DialogAddress").attr("data-address-id",address_id);

        topCalc(HB.config.is_ios);
        $("#recipient").val("");
        $("#address").val("");
        $("#mobile").val("");
        $("#qq_num").val("");
        $("#province").attr("data-province", "— 选择省/市 —").val("");
        $("#city").attr("data-city", "— 选择市/县 —").val("");
        $("#district").attr("data-district", "— 选择县/区 —").val("");
        $("#distpicker").distpicker({autoSelect: false});
    });
    // 选择地址
    $(document).on("click", ".J_BtnSelect", function () {
        var self = $(this);
        self.parent().parent().addClass("J_BtnSelectbg");
        self.parent().parent().siblings().removeClass("J_BtnSelectbg");

        $(".J_BtnSelecton").removeClass("J_BtnSelecton").addClass("J_BtnSelectoff");
        // $(".J_BtnSelectoff").removeClass("J_BtnSelectoff");
        self.removeClass("J_BtnSelectoff").addClass("J_BtnSelecton");
        // $(".act-dialog-close").show();
    });
    //一键填写
    $(document).on("click",".Onekey",function () {
        var self = $(this);

        $("#J_DialogAddress").attr("data-set-all",1).show();
        $("#distpicker").distpicker({autoSelect: false});


       //  if(bool){
       //      $('.btn-address').addClass("done").html("已填写");
       //  }else{
       //      $("#J_DialogAddress").attr("data-prop-other-id", prop_other_id).show();
       //  }
    });

    /* ********************* 地址 end *********************** */

    function loadFudaiBonusRank(url) {
        $(".exhibit").load(url, function() {

        });
    }

    function change_fudai_bonus_page(page,type) {
        var url1 = HB.config.rootPath + 'activity/get_entity_and_virtual_bonus_list';
        url1 = url1+'/'+page+'/'+type;
        loadFudaiBonusRank(url1);
    }


//显示奖励
    $(document).on("click",".exhibit01",function () {
        if (HB.userinfo.reader_id == 0) {
            HB.util.loginDialog();
            return;
        }
        var bonus_type = $(".Selection").data("type");
        loadFudaiBonusRank(HB.config.rootPath + 'activity/get_entity_and_virtual_bonus_list/1/'+bonus_type);
        $(".exhibit").show();
        $(".exhibit01").hide();
    });


    //奖励切换
    $(document).on("click",".Selection01",function () {
        $(this).addClass("Selection");
        $(this).siblings().removeClass("Selection");

        if (HB.userinfo.reader_id == 0) {
            HB.util.loginDialog();
            return;
        }

        var self = $(this);
        if (self.attr("disabled"))
            return;
        var bonus_type = self.data('type');

        loadFudaiBonusRank(HB.config.rootPath + 'activity/get_entity_and_virtual_bonus_list/1/'+bonus_type);
        $(".exhibit").show();
        $(".exhibit01").hide();
    });



    // 公告滚动播放
    (function () {
        var step = 36;
        setInterval(function () {
            step = parseInt($(".J_NoticeBox p").eq(0).height());
            $(".J_NoticeBox .cnt-box").animate({top: (-1) * step + 'px'}, 500, function () {
                $(".J_NoticeBox .cnt-box").css("top", 0);
                $(".J_NoticeBox .cnt-box").append($(".J_NoticeBox p").eq(0));
            });
        }, 1500);
    })();

    // 兑换道具加减计算
    $(document).on("click", ".J_NumCalculate .J_NumPlus, .J_NumCalculate .J_NumMinus", function() {
        var self = $(this),
            numResult = self.siblings(".J_NumResult"),
            val = parseInt(numResult.val());
        val = isNaN(val) ? 0 : val;
        if(self.hasClass("J_NumPlus")){ // 加
            //判断最大值
            if (val >= (Math.round( Math.pow(10,3) ) - 1)) return false;
            val += 1;
        } else if($(this).hasClass("J_NumMinus")){ // 减
            val > 1 ? val -= 1: val;
        }
        numResult.val(val);
        self.closest('li').data('num', val);
    });
    $(document).on("keyup", ".J_NumCalculate .J_NumResult", function() {
        var self = $(this);
        self.val(self.val().replace(/[^\d]/g,''));
        self.closest('li').data('num', parseInt(self.val()));
    });
    //全部道具
    $(".num-all").click(function () {
        var self = $(this),
            numResult = self.siblings(".J_NumResult"),
            val = parseInt($(".J_OwnPropAmount").text());
        numResult.val(val);
    });

    // 兑换道具
    $('.btn-exchange').on('click', function () {
        if (HB.userinfo.reader_id==0) {
            HB.util.loginDialog();
            return;
        }
        var temporary =$('.temporary');
        var self = $(this),
            li = self.closest('li'),
            own_num = parseInt($('.J_OwnPropAmount').text()), // 拥有个数
            content = '';

        var consume_num = parseInt($(".J_NumResult ").val());// 消耗个数

        if (isNaN(consume_num) || consume_num == 0) {
            $(".J_NumResult ").val(1);
            return false;
        }
        if (self.prop('disabled')) return;
        if (own_num < consume_num) {  // 数量不足，不可兑换
            content = '<div class="tips-box failed"><p class="tips">生日帽不足，订阅VIP章节，获得更多生日帽哦~</p></div>';
            actDialog({
                id: "",
                skin: "act-dialog-tips act-dialog-exchange-tips",
                content: content
            });
            $(".act-dialog-close").hide();
            hide_dialog();
            return false;
        }else {  // 可兑换
            var reader_id = HB.userinfo.reader_id,
                type = li.data('type');            // 兑换道具类型
            $.ajax({
                type: 'POST',
                url: HB.config.rootPath + 'activity/use_birthday_hat',
                data: {
                    reader_id: reader_id,
                    change_type: type,
                    consume_num: consume_num // 消耗个数
                },
                beforeSend: function () {
                    self.prop("disabled", true);
                },
                complete: function () {
                    self.prop("disabled", false);
                },
                success: function (res) {
                    if (res.code == 100000) {
                        content = '<div class=" success"><p class="tips">兑换成功</p></div>';
                        actDialog({
                            id: "",
                            skin: "act-dialog-tips act-dialog-exchange-tips",
                            content: content
                        });
                        $('.J_OwnPropAmount').text(res.data.rest_amount);
                        $(".act-dialog-close").hide();
                        hide_dialog();
                        // 刷新记录
                        loadBirthdayHatRank(HB.config.rootPath + 'activity/get_birthday_hat_bonus_and_used_list');
                    } else {
                        HB.util.alert(res.tip, 3);
                    }
                }

            });
        }
    });


    function hide_dialog() {
        setTimeout(
            function () {
                $(".act-dialog-box").hide();
            },2000
        );
    }

    function change_birthday_hat_page(page) {
        var url1 = HB.config.rootPath + 'activity/get_birthday_hat_bonus_and_used_list';
        url1 = url1+'/'+page;
        loadBirthdayHatRank(url1);
    }
    function loadBirthdayHatRank(url) {
        $(".mine-box01").load(url, function() {
        });
    }

    $(".Obtain").on("click", function () {
        if (HB.userinfo.reader_id==0) {
            HB.util.loginDialog();
            return false;
        }
        var _this = $(this);
        if (!_this.hasClass("close")) {
            _this.addClass("close");
            loadBirthdayHatRank(HB.config.rootPath + 'activity/get_birthday_hat_bonus_and_used_list');
            $(".mine-box01").show();
        } else {
            _this.removeClass("close");
            $(".mine-box01").hide();
        }
    });



    //更新 battle
    (function () {
        $('.J_UpdateWords').each(function (i, val) {
            var self = $(val),
                num1 = parseInt(self.text()),
                num2 = 4000000,
                per = (num1 / num2) * 100,
                progressBar = self.parent().siblings('.progress-box').find('.progress-bar');
            progressBar.css("width", per + "%");
        });
    })();
    $('.J_BookPages a').click(function () {
        var self = $(this),
            li = self.parent(),
            ind = li.index(),
            bookLists = li.parent().siblings('.book-list');
        li.addClass('current').siblings('li').removeClass('current');
        bookLists.hide().eq(ind).show();
    });

    $('.battle-team .sub-tit').click(function () {
        $(this).siblings('.book-box').slideToggle(100);
    });

    $(".red").click(function () {
        if ($(".redteam").hasClass("off")) {
            $(".redteam").removeClass("off")
            $(".blueteam").addClass("off")
        }else {
            $(".redteam").addClass("off")
            $(".blueteam").removeClass("off")
        }
    })
    $(".blue").click(function () {
        if ($(".blueteam").hasClass("off")) {
            $(".redteam").addClass("off")
            $(".blueteam").removeClass("off")
        }else {
            $(".redteam").removeClass("off")
            $(".blueteam").addClass("off")
        }
    })

    // 关闭奖品图片预览
    $('.J_RewardBox span').on('mouseover mouseout', function () {
        $(this).find('img').stop().fadeToggle(10);
    });

    //点击出现图片
    $(".reward-entity").click(function () {
        $(this).children().addClass("reward-entity_hover");
        $(this).siblings().children().removeClass("reward-entity_hover");
        $(this).parent().siblings().children().children().removeClass("reward-entity_hover");
    })

});
