$(function() {
    (function() {
        if ($('.has-title-container > .errorStr-area').is(':visible')) {
            setTimeout(function() {
                $('.has-title-container > .errorStr-area').slideUp();
            }, 1000);
        }
    }());

    $('.selectAll').live('click', function() {
        if($('.subSelect:checked').length != $('.subSelect').length){
            $('.subSelect:enabled').attr('checked', true);
            $('#selectAll').attr('checked', true);
        }else{
            $('.subSelect:enabled').attr('checked', false);
            $('#selectAll').attr('checked', false);
        }
    });
    $('.subSelect').live('click', function() {
        if($('.subSelect:checked').length != $('.subSelect').length){
            $('#selectAll').attr('checked', false);
        }else{
            $('#selectAll').attr('checked', true);
        }
    });
    $('.checkReverse').live('click',function(){
        $('.subSelect:enabled').each(function(e){
            if($(this).is(':checked')){
                $(this).attr('checked', false);
            }else{
                $(this).attr('checked', true);
            }
        });
        if($('.subSelect:checked').length != $('.subSelect').length){
            $('#selectAll').attr('checked', false);
        }else{
            $('#selectAll').attr('checked', true);
        }
    });
    //搜索域操作
    $('.search-tips').live('click',function(event){
        event.preventDefault();
        var type = $(this).attr('type');
        var value = $(this).html();
        $('#'+type).val(value);
        $('#searchFrom').submit();
        return false;
    });
    //表单验证
    var showError = function(element,error){
        element.removeClass('success').addClass('error');
        var tips = element.parent("div").siblings(".error-tips");
        element.parent("div").siblings(".rule-tips").addClass('hidden');
        tips.removeClass('hidden').html(error);
    };

    jQuery.fn.checkElement = function(option){
        if(option.rule.required){
            if(!$(this).val()){
                showError($(this),option.message.required);
                return false;
            }
        }
        if($(this).val()){
            if(option.rule.minlength){
                if($(this).val().length<option.rule.minlength){
                    showError($(this),option.message.minlength);
                    return false;
                }
            }
            if(option.rule.maxlength){
                if($(this).val().length>option.rule.maxlength){
                    showError($(this),option.message.maxlength);
                    return false;
                }
            }
            if(option.rule.email){
                if(!/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test($(this).val())){
                    showError($(this),option.message.email);
                    return false;
                }
            }
            if(option.rule.equalTo){
                if($(this).val()!=$(option.rule.equalTo).val()){
                    showError($(this),option.message.equalTo);
                    return false;
                }
            }
            if(option.rule.idCard){
                if(!/^(\d{14}[x\d]{1}|\d{17}[x\d]{1})$/i.test($(this).val())){
                    showError($(this),option.message.idCard);
                    return false;
                }
            }
            if(option.rule.phoneNum){
                var phoneNumPattern, phoneNumCode;
                if (option.rule.phoneNumPattern) {
                    phoneNumPattern = new RegExp(option.rule.phoneNumPattern || ".+");
                    phoneNumCode = option.rule.phoneNumCode
                } else {
                    phoneNumPattern = /^(86){0,1}1\d{10}$/;
                    phoneNumCode = 86
                }
                if (!phoneNumPattern.test(phoneNumCode + $(this).val())) {
                    showError($(this), option.message.phoneNum);
                    return false
                }
            }
            if(option.rule.userName){
                var mobile = /^[1][0-9]{10}$/;
                var email = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
                if(!mobile.test($(this).val()) && !email.test($(this).val())){
                    showError($(this),option.message.userName);
                    return false;
                }
            }
            if(option.rule.userName2){
                var mobile = /^[0-9]*$/;
                var email = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
                if(!mobile.test($(this).val()) && !email.test($(this).val())){
                    showError($(this),option.message.userName2);
                    return false;
                }
            }
            if(option.rule.remote){
                var that = $(this);
                var ajaxStat = false;
                var name = $(this).attr('name');
                var value = $(this).val();
                var param = option.rule.remote.param||{};
                param[name] = value;
                $.ajax({
                    url : option.rule.remote.url,
                    type : "get",
                    data : param,
                    async : false,
                    cache : false,
                    dataType : 'json',
                    success : function(data){
                        if(data==false){
                            showError(that,option.message.remote);
                            ajaxStat = false;
                        }else{
                            ajaxStat = true;
                        }
                    }
                });
                if(ajaxStat==false){
                    return false;
                }
            }
        }
        $(this).removeClass('error').addClass('success');
        var tips = $(this).parent("div").siblings('.error-tips');
        $(this).parent("div").siblings('.rule-tips').removeClass('hidden');
        tips.addClass('hidden').html('');
        return true;
    };
//
    jQuery.standardPost = function(url,args){
        var body = $(document.body),
            form = $("<form method='post'></form>"),
            input;
        form.attr({"action":url});
        $.each(args,function(key,value){
            input = $("<input type='hidden'>");
            input.attr({"name":key});
            input.val(value);
            form.append(input);
        });

        form.appendTo(document.body);
        form.submit();
        document.body.removeChild(form[0]);
    };

    //密码是否可见
    function passwordSwitch(obj) {
        var password_switch = obj,
            password_obj = password_switch.prev();
        if(!password_switch.hasClass('invisible-pwd')){
            password_switch.addClass('invisible-pwd'); //密码可见
            password_obj.prop('type','text');
        }else{
            password_switch.removeClass('invisible-pwd'); //密码不可见
            password_obj.prop('type','password');
        }
    }
    $(".J_PasswordSwitch").each(function () {
        var self = $(this);
        self.on("click", function () {
            passwordSwitch(self);
        });
    });

    jQuery.dialogIdentify = function(url) {
        var is_identified = top.$("#J_UserInfo").attr("data-is-identified");
        if (is_identified == 0) {
            parent.$("#mask").show();
            var elem = '<div class="dialog-identify">' +
                '<h3 class="title">实名认证</h3>' +
                '<p class="msg">根据《移动互联网程序信息管理规定》<br/>我们需要对作者的真实身份进行认证<br/>请前往<span class="grey">作者信息-修改个人资料</span>完善个人信息</p>' +
                '</div>';
            layer.open({
                title: " ",
                type: 1,
                area: ['410px', '280px'],
                offset: top,
                content: elem,
                btn: ['去认证','以后再说'],
                yes: function (index) {
                    layer.close(index);
                    parent.$("#mask").hide();
                    window.location.href = AUTHOR.config.rootPath + 'uploader_info/mod_uploader_info';
                },
                cancel:function(){
                    if(!url){
                        parent.$("#mask").hide();
                        parent.$(".cms-nav a").eq(1).trigger("click");
                    } else {
                        parent.$("#mask").hide();
                    }
                }
            });
        } else {
            if(url){
                window.location.href = url;
            }
        }
    }

    //新建作品实名认证提醒弹窗
    $(".J_BtnNewBook").on("click", function () {
        $.dialogIdentify(AUTHOR.config.rootPath + 'book_list/add_new');
    });

    // 登录方式
    $('.J_ChangeLoginType li').on('click', function () {
        var self, type, box, account_box, input_box;
        self = $(this);
        type = self.data('type');
        box = self.parent();
        account_box = box.siblings('.account-login-box');
        input_box = box.siblings('.input-login-box');

        self.addClass('active').siblings('li').removeClass('active');
        if (type == 'account') {
            //if (account_box.length) {
            //    account_box.removeClass('hide');
            //    input_box.addClass('hide');
            //} else {
            //    account_box.addClass('hide');
            //    input_box.removeClass('hide');
            //}
            location.reload();
            return;
        } else if (type == 'email') {
            account_box.addClass('hide');
            input_box.removeClass('hide');
        }

        $('[class^="type-"]').addClass('hide');
        $('.type-' + type).removeClass('hide');

    });
    // 使用其他账号登录
    $('.J_LoginOther').on('click', function () {
        var self, account_box, input_box;
        self = $(this);
        account_box = self.closest('.account-login-box');
        input_box = account_box.siblings('.input-login-box');
        account_box.addClass('hide');
        input_box.removeClass('hide');
    });
    $('.J_LoginThis').on('click', function () {
        var self, account_box, input_box;
        self = $(this);
        input_box = self.closest('.input-login-box');
        account_box = input_box.siblings('.account-login-box');
        input_box.addClass('hide');
        account_box.removeClass('hide');
    });
});