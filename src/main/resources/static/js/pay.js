//选择支付方式
$(function(){
    $(".selectPayment").on("click",function(){
    var recharge_type = $(this).attr("data-recharge-type");
    $("."+ recharge_type +"PayList").show().siblings("[class*='PayList']").hide();
    $("."+ recharge_type +"PayList").siblings("[class*='PayList']").find("a").removeClass("selected").find("input[type='radio']").attr('checked', false);
    clearCustomAmount();
    if(recharge_type == "mobile"){
        $(".mobilePayList .mobileCard a:first").trigger("click");
    }
    });
    //手机充值卡支付
    $(".mobilePayList .mobileCard a").on("click",function(){
        var i = $(this).parent().index();
        $(".mobilePay ul").eq(i).show().siblings().hide();
        $(".mobilePay").find("a").removeClass("selected").find("input[type='radio']").attr('checked', false);
    });
    //清空自定义金额输入框
    function clearCustomAmount(){
        var paymentArr = ["alipay","weixin","llpay"];
        for(var i=0; i< paymentArr.length; i++){
            $("."+ paymentArr[i] +"PayList").find(".amount_r").val("");
            $("."+ paymentArr[i] +"PayList").find(".tooltip span").attr('value', "").text("折合：1元=100猫饼干");
        }
        //清空手机充值卡和游戏卡下的input输入框
        $(".pay-box .form-box input[type='text']").val("");
    }
    
    $(".custom_amount .icon-select").click(function () {
        $(this).parent().find('.tooltip').show();
    });
    $(".J_AmountInput").on("focus", function () {
        $(this).closest("li").find(".icon-select").trigger("click");
        $(this).siblings('.tooltip').show();
    }).on("keyup", function () {
        this.value = this.value.replace(/[^\d]/g, '');
        change_rmb($(this), $(this).siblings(".tooltip").find(".J_OtherAmount"));
    }).on("blur", function () {
        $(this).siblings('.tooltip').hide();
    });

    //自定义金额
    function change_rmb(input, result, min, max){
        var num = parseInt(input.val());
//        if(num > parseInt(max) || num < parseInt(min)){
//            alert("请输入"+ min +"-" + max + "之间的数字");
//            input.val("");
//            result.html(result.data("value"));
//            return;
//        }
        var reg = /^[1-9]\d*$/;
        var rmb = $.trim(num);
        if( rmb == '' || !reg.test(rmb) ){
            result.html(result.data("value"));
        }else{
            var recharge_type = input.data('recharge-type');
            $.ajax({
                url: HB.config.rootPath + "/recharge/get_bonus_hlb",
                type: 'post',
                data: {
                    rmb: rmb,
                    recharge_type: recharge_type
                },
                success: function(res){
                    if(res.code == 100000){
                        result.html('折合：'+ res.data.rmb_hlb +'猫饼干，送'+ res.data.bonus_hlb +'代币');
                    }
                },
                error: function(){
                    var cnt = '网络错误!';
                    HB.util.alert(cnt, 1);
                }
            });
        }
    }

    $("#J_BtnNext").click(function() {
        var recharge_group = '';
        //支付方式
        var selectedRecheargeType = $(".selectPayment.selected").data('recharge-type'),
            wares_id,rmbamount_a,rmbamount_r,cardNum,cardPwd;
            
        var input = $('.'+ selectedRecheargeType +'PayList .J_AmountInput');
        if (input.length && input.closest('a').hasClass('selected')) {
            var num = parseInt(input.val()),
                min = parseInt(input.siblings(".tips").find(".J_Min").text()),
                max = parseInt(input.siblings(".tips").find(".J_Max").text());
            if(num > parseInt(max) || num < parseInt(min)){
                HB.util.alert("请输入"+ min +"-" + max + "之间的数字", 3);
                return;
            }
        }
            
        if(selectedRecheargeType=='mobile'){
            recharge_group = $(".mobilePayList .J_InputRadio.mobileCard .selected").data('recharge-group');
            wares_id = $(".mobilePayList .mobilePay .selected .wares_id").val();
            rmbamount_a = $(".mobilePayList .mobilePay .selected .amount").val();
            rmbamount_r = $(".mobilePayList .mobilePay .selected .amount_r").val();
            cardNum = $(".mobilePayList .cardno").val();
            cardPwd = $(".mobilePayList .cardpwd").val();
            if(cardNum == '' || cardPwd == ''){
                HB.util.alert('请输入充值卡号和密码', 3);
                return false;
            }
        } else if(selectedRecheargeType=='gamecard'){
            recharge_group = $(".gamecardPayList .J_InputRadio.gamecardCardList .selected").data('recharge-group');
            wares_id = $(".gamecardPayList .gamecardPay .wares_id").val();
            rmbamount_a = $(".gamecardPayList .gamecardPay .amount").val();
            rmbamount_r = $(".gamecardPayList .gamecardamount").val();
            cardNum = $(".gamecardPayList .gamecardno").val();
            cardPwd = $(".gamecardPayList .gamecardpwd").val();
            if(cardNum == '' || cardPwd == ''){
                HB.util.alert('请输入充值卡号和密码', 3);
                return false;
            }
        }else {
            wares_id = $(".J_InputRadio."+selectedRecheargeType+"PayList .selected .wares_id").val();
            rmbamount_a = $(".J_InputRadio."+selectedRecheargeType+"PayList .selected .amount").val();
            rmbamount_r = $(".J_InputRadio."+selectedRecheargeType+"PayList .selected .amount_r").val();
        }
        var rmbamount = '';
        if(typeof(rmbamount_a)=="undefined"){
            if(typeof(rmbamount_r)=="undefined"){
                rmbamount='';
            } else {
                rmbamount = rmbamount_r*100;
            }
        }else {
            rmbamount = rmbamount_a;
        }
        if((!wares_id && !rmbamount) || rmbamount==''){
            var elem = document.getElementById('J_DialogPayRemind');
            var d = dialog({
                title:'充值提醒',
                fixed: true,
                content: elem,
                button: [
                    {
                        value: '选择金额',
                        callback: function () {

                        },
                        autofocus: true
                    }
                ]
            });
            d.showModal();
            return false;
        }

        var url= "";
        var OutHtml= "";
        if(selectedRecheargeType=='alipay'){
            url = HB.config.rootPath+"recharge/alipay_order";
            OutHtml = "J_DialogAlipay_OutHtml";
        }else if(selectedRecheargeType=='weixin'){
            url = HB.config.rootPath+"recharge/weixin_order";
            OutHtml = "J_DialogPay_OutHtml";
        }else if(selectedRecheargeType=='ipay'){
            url = HB.config.rootPath+"recharge/ipay_order";
            OutHtml = "J_DialogPay_OutHtml";
        }else if(selectedRecheargeType=='paypal'){
            url = HB.config.rootPath+"recharge/paypal_order";
            OutHtml = "J_DialogPay_OutHtml";
        }else if(selectedRecheargeType=='llpay'){
            url = HB.config.rootPath+"recharge/llpay_order";
            OutHtml = "J_DialogPay_OutHtml";
        }else if(selectedRecheargeType=='mobile'){
            url = HB.config.rootPath+"recharge/mobile_order";
            OutHtml = "J_DialogPay_OutHtml";
        }else if(selectedRecheargeType=='gamecard'){
            url = HB.config.rootPath+"recharge/gamecard_order";
            OutHtml = "J_DialogPay_OutHtml";
        }else{
            return false;
        }
        var redirecturl = HB.config.rootPath+"recharge/index";
        var cpurl = HB.config.rootPath+"recharge/index";
        $.ajax({
            url:url,
            async:false,
            data:{
                wares_id:wares_id,
                redirecturl:redirecturl,
                cpurl:cpurl,
                rmbamount:rmbamount,
                group:recharge_group
            },
            dataType:'json',
            success:function(res){
                if(res.code == 100000){
                    $('#'+OutHtml+' #fee').text("充值："+$(".J_InputRadio."+selectedRecheargeType+"PayList .selected .rmb").first().text());
                    $('#'+OutHtml+' #plusContent').html("请您在新打开的页面完成支付！");
                    if(selectedRecheargeType=='weixin'){
                        $('#'+OutHtml+' #plusContent').html("请您在新打开的页面微信扫码完成支付！");
                    }
                    var elem = $('#'+OutHtml).html();
                    //又是根据类型特殊处理
                    var go_to_pay;
                    if(selectedRecheargeType=='mobile'){
                        go_to_pay = dialog({
                            title:' ',
                            fixed: true,
                            content: '请确认输入的卡面额和实际面额一致，否则可能导致支付失败，意外销卡或资金损失',
                            button: [
                                {
                                    value: '确定支付',
                                    callback: function () {
                                        var transdata = res.data.query_string;
                                        var cardTypeCombine = recharge_group;
                                        var cardMoney = rmbamount/100;
                                        $.ajax({
                                            url:HB.config.rootPath+"payment/mobile/mobile_api",
                                            async:false,
                                            dataType:'json',
                                            data:{
                                                transdata:transdata,
                                                cardTypeCombine:cardTypeCombine,
                                                cardMoney:cardMoney,
                                                cardNum:cardNum,
                                                cardPwd:cardPwd
                                            },
                                            success:function(res){
                                                if(res.code == 100000){
                                                    var d = dialog({
                                                        title:' ',
                                                        fixed: true,
                                                        content: '已提交处理，5分钟内充值金额会自动到帐',

                                                        cancel :false,
                                                        button: [
                                                            {
                                                                value: '确定',
                                                                callback: function () {
                                                                    //刷新余额
                                                                    $.ajax({
                                                                        url:HB.config.rootPath+"recharge/get_prop_info",
                                                                        dataType:'json',
                                                                        success:function(resProp){
                                                                            if(resProp.code == 100000){
                                                                                if(resProp.data.prop_info.rest_hlb){
                                                                                    $('.rest_hlb').text(resProp.data.prop_info.rest_hlb);
                                                                                }
                                                                            }
                                                                        }
                                                                    });
                                                                },
                                                                autofocus: true
                                                            }
                                                        ]
                                                    });
                                                    d.showModal();
                                                } else {
                                                    HB.util.alert(res.txt, 1);
                                                }
                                            },
                                            error:function(){
                                                var cnt = '网络错误!';
                                                HB.util.alert(cnt, 1);
                                            }
                                        });
                                    },
                                    autofocus: true
                                }
                            ]
                        });
                    } else if(selectedRecheargeType=='gamecard'){
                        go_to_pay = dialog({
                            title:' ',
                            fixed: true,
                            content: '请确认输入的卡面额和实际面额一致，否则可能导致支付失败，意外销卡或资金损失',
                            button: [
                                {
                                    value: '确定支付',
                                    callback: function () {
                                        var transdata = res.data.query_string;
                                        var cardType = recharge_group;
                                        var cardMoney = rmbamount/100;
                                        $.ajax({
                                            url:HB.config.rootPath+"payment/gamecard/gamecard_api",
                                            async:false,
                                            dataType:'json',
                                            data:{
                                                transdata:transdata,
                                                cardType:cardType,
                                                cardMoney:cardMoney,
                                                cardNum:cardNum,
                                                cardPwd:cardPwd
                                            },
                                            success:function(res){
                                                if(res.code == 100000){
                                                    var d = dialog({
                                                        title:' ',
                                                        fixed: true,
                                                        content: '已提交处理，5分钟内充值金额会自动到帐',

                                                        cancel :false,
                                                        button: [
                                                            {
                                                                value: '确定',
                                                                callback: function () {
                                                                    //刷新余额
                                                                    $.ajax({
                                                                        url:HB.config.rootPath+"recharge/get_prop_info",
                                                                        dataType:'json',
                                                                        success:function(resProp){
                                                                            if(resProp.code == 100000){
                                                                                if(resProp.data.prop_info.rest_hlb){
                                                                                    $('.rest_hlb').text(resProp.data.prop_info.rest_hlb);
                                                                                }
                                                                            }
                                                                        }
                                                                    });
                                                                },
                                                                autofocus: true
                                                            }
                                                        ]
                                                    });
                                                    d.showModal();
                                                } else {
                                                    HB.util.alert(res.txt, 1);
                                                }
                                            },
                                            error:function(){
                                                var cnt = '网络错误!';
                                                HB.util.alert(cnt, 1);
                                            }
                                        });
                                    },
                                    autofocus: true
                                }
                            ]
                        });
                    } else {
                        go_to_pay = dialog({
                            title:' ',
                            fixed: true,
                            content: elem,
                            button: [
                                {
                                    value: '去付钱',
                                    callback: function () {
                                        if(selectedRecheargeType=='alipay'){
                                            //$("#alipayform").attr("action","//create_direct_pay_by_user-PHP-UTF-8/alipayapi.php"+res.data.query_string);
                                            $("#alipayform").attr("action",HB.config.rootPath+"alipay/alipayapi?"+res.data.query_string);
                                            $("#alipayform").submit();
                                            //$.post(HB.config.rootPath+"create_direct_pay_by_user-PHP-UTF-8/alipayapi.php",{WIDout_trade_no:'test20160410111935',WIDsubject:'test商品123',WIDtotal_fee:'0.01',WIDbody:'即时到账测试'},function(){});
                                        }else if(selectedRecheargeType=='weixin'){
                                            window.open(HB.config.rootPath+"payment/weixinpay/weixin_api?"+res.data.query_string);
                                        }else if(selectedRecheargeType=='ipay'){
                                            window.open("https://web.iapppay.com/pc/exbegpay?"+res.data.query_string);
                                        }else if(selectedRecheargeType=='paypal'){
                                            $("#alipayform").attr("action",HB.config.rootPath+"paypal/paypalapi?"+res.data.query_string);
                                            $("#alipayform").submit();
                                        }else if(selectedRecheargeType=='llpay'){
                                            $("#alipayform").attr("action",HB.config.rootPath+"payment/llpay/llpay_api?"+res.data.query_string);
                                            $("#alipayform").submit();
                                        }

                                        var d = dialog({
                                            title:' ',
                                            fixed: true,
                                            content: elem,

                                            cancel :false,
                                            button: [
                                                {
                                                    value: '支付成功',
                                                    callback: function () {
                                                        //刷新余额
                                                        $.ajax({
                                                            url:HB.config.rootPath+"recharge/get_prop_info",
                                                            dataType:'json',
                                                            success:function(resProp){
                                                                if(resProp.code == 100000){
                                                                    if(resProp.data.prop_info.rest_hlb){
                                                                        $('.rest_hlb').text(resProp.data.prop_info.rest_hlb);
                                                                    }
                                                                    $.ajax({
                                                                        url: HB.config.rootPath+"reader/auto_reg_daily_task",
                                                                        success: function (res) {
                                                                            if (res.code == 100000) {
                                                                                // 订阅成功后弹框提醒
                                                                                var elem = "<div style='padding-top: 20px;font-size: 18px;text-align: center;'>为保护您的账号安全，<br/>请尽快绑定手机号或邮箱。</div>";
                                                                                var d = dialog({
                                                                                    title:' ',
                                                                                    fixed: true,
                                                                                    width: "290px",
                                                                                    content: elem,
                                                                                    okValue: '去绑定',
                                                                                    ok: function () {
                                                                                        location.href = HB.config.rootPath+"reader/my_info";
                                                                                    },
                                                                                    cancelValue: '以后',
                                                                                    cancel: function () {}
                                                                                });
                                                                                d.showModal();
                                                                            }
                                                                        }
                                                                    });
                                                                }
                                                            }
                                                        });
                                                    },
                                                    autofocus: true
                                                }, {
                                                    value: '重新支付',
                                                    callback: function () {
                                                    }
                                                }
                                            ]
                                        });
                                        d.showModal();
                                    },
                                    autofocus: true
                                }
                            ]
                        });
                    }
                    go_to_pay.showModal();
                }else{
                    var cnt = res.tip;
                    HB.util.alert(cnt, 1);
                }
            },
            error:function(){
                var cnt = '网络错误!';
                HB.util.alert(cnt, 1);
            }
        });
    });
});