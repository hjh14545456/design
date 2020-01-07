//登录
$(function(){
    jQuery.validator.addMethod("isUserName", function(value, element) {
    	var mobile = /^[\+\-0-9]{0,35}$/;///^[1][0-9]{10}$/;
        var email = /^([a-zA-Z0-9]+[_|\_|\.\-]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.\-]?)*[a-zA-Z0-9]+\.[a-zA-Z]{1,3}$/;
        return this.optional(element) || (mobile.test(value) || email.test(value));
    }, "手机号或邮箱不合法");
	
    $("#J_LoginForm").validate({
        rules: {
            username:{
                required: true,
				isUserName: true
            },
            password: "required",
            code: {
                required: true,
                remote : {url:"checkVerify",
						  type:"post",    //数据发送方式
                          dataType:"json", //接受数据格式  
						  data:{username:function(){return $("#username").val();}} }
            }
        },
        messages:{
            username: {
                required: "请填写手机号或邮箱"
            },
            password: {
                required: "请填写密码"
            },
            code: {
                required: "请填写验证码",
                remote: "验证码不正确"
            }       
        },
        submitHandler: function(form) {
            J_LoginForm.submit();
        }
    });


    //注册
    // 国家代码下拉列表
    var mobilePattern = $('#J_MobileAreaBox .dropdown-menu li.selected').data('pattern');
    var mobileCode = $('#J_MobileAreaBox .dropdown-menu li.selected').data('code');
    var mobileVal = $('#J_MobileAreaBox .dropdown-menu li.selected').data('value');
    $('#J_MobileAreaBox .dropdown-menu li').click(function () {
        $(this).addClass('selected').siblings().removeClass('selected');
        $(this).parent().prev().text($(this).find('b').text());
        $(this).parent().next().val($(this).data('value'));
        mobilePattern = $(this).data('pattern');
        mobileCode = $(this).data('code');
        mobileVal = $(this).data('value');
    });

    jQuery.validator.addMethod("isMobile", function(value, element) {
        mobilePattern = new RegExp(mobilePattern || ".+");
        return this.optional(element) || mobilePattern.test(mobileCode + value);
    }, "请输入手机号码");

    jQuery.validator.addMethod("isPassword", function(value, element) {
        var password = /^[A-Za-z0-9]{6,15}$/;
        return this.optional(element) || password.test(value);
    }, "密码长度为6~15位，只能由a-z不限大小写英文字母或0-9的数字组成");

    var regValidator = $("#J_RegisterForm").validate({
	    onkeyup: false,
        rules: {
            mobile:{
                required: true,
                isMobile: true,
                remote : {url:"checkPhoneNum",
						  data:{'toCode':function() {return mobileVal;} }
				}
            },
            email:{
                required: true,
                remote : {url:"checkEmail"}
            },
            password: {
                required: true,
                isPassword: true
            },
            'receive-code-mobile': {
                required: true,
                rangelength: [4,5],
                remote : {
                    url:"checkVerCode",
                    data:{'to':function() {return $("#J_RegisterForm .mobile").val();},
							'ver_code':function() {return $("#J_RegisterForm .receive-code-mobile").val();},
							'type':1,
							'toCode':function() {return mobileVal;}}
                }
            },
            'real-name' : {
                required: true
            },
            'card-type' : {
                required: true
            },
            'card-num' : {
                required: true
            },
//            'password-confirm': {
//                required: true,
//                equalTo: '.password'
//            },
//            code: {
//                required: true,
//                remote : {url:"checkVerify"}
//            },
//            nickname: {
//                required: true,
//                remote : {url:"checkReaderName"}
//            }
        },
        messages:{
            mobile: {
                required: "请填写手机号码",
                isMobile: "手机号格式不对",
                remote: "手机号被占用"
            },
            email: {
                required: "请填写常用邮箱",
                remote: "邮箱被占用"
            },
            password: {
                required: "请填写密码"
            },
//            'password-confirm': {
//                required: "请填写密码",
//                equalTo: "两次填写的密码不正确"
//            },
            'receive-code-mobile': {
                required: "请填写短信验证码",
                rangelength: '短信验证码长度为4-5位',
                remote: '验证码不正确'
            },
            'receive-code-email': {
                required: "请填写邮件验证码",
                rangelength: '邮件验证码长度为4位'
            },
            'real-name' : {
                required: "请填写真实姓名"
            },
            'card-type' : {
                required: "请填写证件类型"
            },
            'card-num' : {
                required: "请填写证件号码"
            },
//            code: {
//                required: "请填写验证码",
//                rangelength: '验证码长度为4位',
//                remote: '图形验证码不正确'
//            },
//            nickname: {
//                required: "请输入昵称",
//                remote: '昵称已被占用'
//            }       
        },
        errorPlacement: function(error, element) {
            error.appendTo(element.parent());
            element.parent().find(".wrongBox").hide();
        },
        success: function(label) {
        },
        submitHandler: function() {
            var formParam = $("#J_RegisterForm").serialize();//序列化表格内容为字符串
            // alert($("input[name='sex'][checked]").val());//name='sex'会在表单中消失
            //formParam=formParam+'&sex='+$("input[name='sex'][checked]").val();
            var url = $("#J_RegisterForm").attr('action');
            // console.log(url);
            $.ajax({
                type:'post',
                url:url,
                data:formParam,
                cache:false,
                success:function(data){
                    if(data.code == 100000){
                        var cnt = '<div class="dialog-tip">注册成功!</div>';
                        var dl = new dialog({title: ' ', fixed: true, content: cnt}).showModal();
						//var dl = HB.util.alert(cnt);
                        setTimeout(function(){
                            dl.close();
                            location.href = data.data.url;
                        },1000);
                    }else{
                        var cnt = data.tip;
                        //new dialog({title: ' ', fixed: true, content: cnt}).showModal();
						HB.util.alert(cnt);
                    }
                },
                error:function(e){
                    var cnt = '请求失败，请稍后重试';
                    //new dialog({title: ' ', fixed: true, content: cnt}).showModal();
					HB.util.alert(cnt);
                }
            });
        }
    });

    var modifyPassValidator = $("#J_ModifyPassForm").validate({
        onkeyup: false,
        rules: {
            mobile:{
                required: true,
                isMobile: true,
                remote : {url:"checkPhoneNumNotExist",
							data:{'toCode':function() {return mobileVal;}}
				}
            },
            email:{
                required: true,
                remote : {url:"checkEmailNotExist"}
            },
            password: {
                required: true,
                isPassword: true
            },
            'receive-code-mobile': {
                required: true,
                rangelength: [4,5],
                remote : {
                    url:"checkVerCode",
                    data:{'to':function() {return $("#J_ModifyPassForm .mobile").val();},
							'ver_code':function() {return $("#J_ModifyPassForm .receive-code-mobile").val();},
							'type':1,
							'toCode':function() {return mobileVal;}}
                }
            },
            'password-confirm': {
                required: true,
                equalTo: '.password'
            },
            code: {
                required: true,
                remote : {url:"checkVerify"}
            }
        },
        messages:{
            mobile: {
                required: "请填写手机号码",
                isMobile: "手机号格式不对",
                remote: "此手机号未注册"
            },
            email: {
                required: "请填写常用邮箱",
                remote: "此邮箱未注册"
            },
            password: {
                required: "请填写密码"
            },
            'password-confirm': {
                required: "请填写密码",
                equalTo: "两次填写的密码不正确"
            },
            'receive-code-mobile': {
                required: "请填写短信验证码",
                rangelength: '短信验证码长度为4-5位',
                remote: '验证码不正确'
            },
            'receive-code-email': {
                required: "请填写邮件验证码",
                rangelength: '邮件验证码长度为4位'
            },
            code: {
                required: "请填写验证码",
                rangelength: '验证码长度为4位',
                remote: '图形验证码不正确'
            }
        },
        errorPlacement: function(error, element) {
            error.appendTo(element.parent());
            element.parent().find(".wrongBox").hide();
        },
        success: function(label) {
        },
        submitHandler: function() {
            var formParam = $("#J_ModifyPassForm").serialize();//序列化表格内容为字符串
            var url = $("#J_ModifyPassForm").attr('action');
            // console.log(url);
            $.ajax({
                type:'post',
                url:url,
                data:formParam,
                cache:false,
                success:function(data){
                    if(data.code == 100000){
                        var cnt = data.data.tip;//'<div class="dialog-tip">密码修改成功!</div>';
                        var dl = new dialog({title: ' ', fixed: true, content: cnt}).showModal();
                        //var dl = HB.util.alert(cnt);
                        setTimeout(function(){
                            dl.close();
                            location.href = data.data.url;
                        },2000);
                    }else{
                        var cnt = data.data.tip;
                        HB.util.alert(cnt);
                    }
                },
                error:function(e){
                    var cnt = '请求失败，请稍后重试';
                    //new dialog({title: ' ', fixed: true, content: cnt}).showModal();
                    HB.util.alert(cnt);
                }
            });
        }
    });

    //更换手机
    var modifyMobileValidator = $("#J_ModifyMobileForm").validate({
        onkeyup: false,
        rules: {
            mobile:{
                required: true,
                isMobile: true,
                remote : {url:HB.config.rootPath+"signup/checkPhoneNum",
							data:{'toCode':function() {return mobileVal;}} 
				}
            },
            password: {
                required: true
            },
            code: {
                required: true,
                rangelength: [4,5],
                remote : {url:HB.config.rootPath+"signup/checkVerify"}
            },
            'receive-code-mobile': {
                required: true,
                rangelength: [4,5],
                remote : {
                    url:HB.config.rootPath+"signup/checkVerCode",
                    data:{'to':function() {return $("#J_ModifyMobileForm .mobile").val();},
						'ver_code':function() {return $("#J_ModifyMobileForm .receive-code-mobile").val();},
						'type':1,
						'toCode':function() {return mobileVal;}}
                }
            }
        },
        messages:{
            mobile: {
                required: "请填写手机号码",
                isMobile: "手机号格式不对",
                remote: "此手机号被占用"
            },
            password: {
                required: "请填写密码"
            },
            code: {
                required: "请填写图片验证码",
                rangelength: '图片码长度为4位',
                remote: '验证码不正确'
            },
            'receive-code-mobile': {
                required: "请填写短信验证码",
                rangelength: '短信验证码长度为4-5位',
                remote: '验证码不正确'
            }
        },
        errorPlacement: function(error, element) {
            error.appendTo(element.parent());
            element.parent().find(".wrongBox").hide();
        },
        success: function(label) {
        },
        submitHandler: function() {
            var formParam = $("#J_ModifyMobileForm").serialize();
            var url = $("#J_ModifyMobileForm").attr('action');
            var redirect = $("#redirect").val();
            $.ajax({
                type:'post',
                url:url,
                data:formParam,
                cache:false,
                success:function(data){
                    if(data.code == 100000){
                        var cnt = data.data.tip;//'<div class="dialog-tip">更换手机成功!</div>';
                        var dl = new dialog({title: ' ', fixed: true, content: cnt}).showModal();
                        setTimeout(function(){
                            dl.close();
                            location.href = redirect;
                        },2000);
                    }else{
                        var cnt = data.tip;
                        HB.util.alert(cnt);
                    }
                },
                error:function(e){
                    var cnt = '请求失败，请稍后重试';
                    HB.util.alert(cnt);
                }
            });
        }
    });


    $(".J_ChangeRegType").click(function(){
        // $(this).hide().siblings('a').show();
        $(this).addClass("active").siblings('li').removeClass("active");
        $('input[name="type"]').val($(this).attr("data-type"));
        if ($(this).attr("data-type") == "email") {
        	$("#email_or_mobile").val("email");
            $(".form-box").find(".type-mobile").hide();
            $(".form-box").find(".type-email").show();

            $("input[name='mobile']").rules("remove", 'required');
            $("input[name='email']").rules("add", 'required');
            $("input[name='receive-code-mobile']").rules("remove", 'required rangelength');
            $("input[name='receive-code-email']").rules("add", {
                required: true,
                rangelength: [4,4]
            });

        } else if ($(this).attr("data-type") == "mobile") {
        	$("#email_or_mobile").val("mobile");
            $(".form-box").find(".type-mobile").show();
            $(".form-box").find(".type-email").hide();

            if ($('input[name="type"]').val() == 'mobile') {
                $("input[name='mobile']").rules("add", 'required');
                $("input[name='email']").rules("remove", 'required');
            } else if ($('input[name="type"]').val() == 'email') {
                $("input[name='mobile']").rules("remove", 'required');
                $("input[name='email']").rules("add", 'required');
            }

            $("input[name='mobile']").rules("add", 'required');
            $("input[name='email']").rules("remove", 'required');
            $("input[name='receive-code-email']").rules("remove", 'required rangelength');
            $("input[name='receive-code-mobile']").rules("add", {
                required: true,
                rangelength: [4,5]
            });
        }
    });

    //获取手机验证码
    $("#J_GetMobileReceiveCode").click(function() {	
        var self = $(this);
		if(self.prop('disabled')) return false;
        var mobile = $(".form-box .mobile").val();
        var verify_type = $("#verify_type").val();
		var post_data = {};
		if(window.geetestCaptchaObj) {			
                window.geetestCaptchaObj.verify();
				window.geetestCaptchaObj.onSuccess(function () {
				post_data = {'mobile':mobileVal+'-'+mobile,'verify_type':verify_type};
				var validateDict = window.geetestCaptchaObj.getValidate();
				for(var key in validateDict) {
					post_data[key] = validateDict[key];
				}
				if ($(".form-box").validate().element('.mobile')) {
					$.ajax({
						url: HB.config.rootPath+'signup/send_verify_code',
						data: post_data,
						beforeSend: function() {
							//$("#J_GetMobileReceiveCode").prop('disabled', true);
							self.prop('disabled', true);
						},
						complete: function() {

						},
						success: function(res) {
							if (res.code == 100000) {
								self.find("span").hide();
								var $time = self.find(".J_Timer");

								$time.show();
								var t = p = parseInt($time.find('i').text());
								var timer = setInterval(function(){
									$time.find('i').text(--t);
									if (t==0) {
										clearInterval(timer);
										self.find("span").show();
										$time.hide().find('i').text(p);
										//$("#J_GetMobileReceiveCode").prop('disabled', false);
										if(window.geetestCaptchaObj) {
											window.geetestCaptchaObj.reset();
										}
										self.prop('disabled', false);
									}
								}, 1000);
							}else{
								var cnt = res.tip;
								//new dialog({title: ' ', fixed: true, content: cnt}).showModal();
								HB.util.alert(cnt);
								self.prop('disabled', false);
							}
						}
					});
				}	
			});
			window.geetestCaptchaObj.show();
			return;
		} else {
			var code = $("input[name=code]").val();
			if(code==''){
				HB.util.alert("请输入验证码!");
				return;
			}
			post_data = {'mobile':mobile,'verify_type':verify_type,'code':code};
		}
        //if($("#J_GetMobileReceiveCode").prop('disabled')) return false;

        if ($(".form-box").validate().element('.mobile')) {
            $.ajax({
                url: HB.config.rootPath+'signup/send_verify_code',
                data: post_data,
                beforeSend: function() {
                    //$("#J_GetMobileReceiveCode").prop('disabled', true);
                    self.prop('disabled', true);
                },
                complete: function() {

                },
                success: function(res) {
                    if (res.code == 100000) {
                        self.find("span").hide();
                        var $time = self.find(".J_Timer");

                        $time.show();
                        var t = p = parseInt($time.find('i').text());
                        var timer = setInterval(function(){
                            $time.find('i').text(--t);
                            if (t==0) {
                                clearInterval(timer);
                                self.find("span").show();
                                $time.hide().find('i').text(p);
                                //$("#J_GetMobileReceiveCode").prop('disabled', false);
								if(window.geetestCaptchaObj) {
									window.geetestCaptchaObj.reset();
								}
                                self.prop('disabled', false);
                            }
                        }, 1000);
                    }else{
                        var cnt = res.tip;
                        //new dialog({title: ' ', fixed: true, content: cnt}).showModal();
			            HB.util.alert(cnt);
                        self.prop('disabled', false);
                    }
                }
            });
        }
    });
    //获取邮箱验证码
    $("#J_GetEmailReceiveCode").click(function() {
        var self = $(this);
		if(self.prop('disabled')) return false;
        var email = $(".form-box .email").val();
        var verify_type = $("#verify_type").val();
		var post_data = {};
		if(window.geetestCaptchaObj) {
                    window.geetestCaptchaObj.verify();
			window.geetestCaptchaObj.onSuccess(function () {
				post_data = {'email':email,'verify_type':verify_type};
				var validateDict = window.geetestCaptchaObj.getValidate();
				for(var key in validateDict) {
					post_data[key] = validateDict[key];
				}
				if ($(".form-box").validate().element('.email')) {
					$.ajax({
						url: HB.config.rootPath+'signup/send_verify_code',
						data: post_data,
						beforeSend: function() {
							//$("#J_GetEmailReceiveCode").prop('disabled', true);
							self.prop('disabled', true);
						},
						complete: function() {

						},
						success: function(res) {
							if (res.code == 100000) {
								self.find("span").hide();
								var $time = self.find(".J_Timer");

								$time.show();
								var t = p = parseInt($time.find('i').text());
								var timer = setInterval(function(){
									$time.find('i').text(--t);
									if (t==0) {
										clearInterval(timer);
										self.find("span").show();
										$time.hide().find('i').text(p);
										//$("#J_GetEmailReceiveCode").prop('disabled', false);
										if(window.geetestCaptchaObj) {
											window.geetestCaptchaObj.reset();
										}
										self.prop('disabled', false);
									}
								}, 1000);
							}else{
								var cnt = res.tip;
								//new dialog({title: ' ', fixed: true, content: cnt}).showModal();
								HB.util.alert(cnt);
								self.prop('disabled', false);
							}
						}
					});
				}	
			});
			window.geetestCaptchaObj.show();
			return;	
		} else {
			var code = $("input[name=code]").val();
			if(code==''){
				HB.util.alert("请输入验证码!");
				return;
			}
			post_data = {'email':email,'verify_type':verify_type,'code':code};
		}
        
        //if($("#J_GetEmailReceiveCode").prop('disabled')) return false;       
        if ($(".form-box").validate().element('.email')) {
            $.ajax({
                url: HB.config.rootPath+'signup/send_verify_code',
                data: post_data,
                beforeSend: function() {
                    //$("#J_GetEmailReceiveCode").prop('disabled', true);
                    self.prop('disabled', true);
                },
                complete: function() {

                },
                success: function(res) {
                    if (res.code == 100000) {
                        self.find("span").hide();
                        var $time = self.find(".J_Timer");

                        $time.show();
                        var t = p = parseInt($time.find('i').text());
                        var timer = setInterval(function(){
                            $time.find('i').text(--t);
                            if (t==0) {
                                clearInterval(timer);
                                self.find("span").show();
                                $time.hide().find('i').text(p);
                                //$("#J_GetEmailReceiveCode").prop('disabled', false);
								if(window.geetestCaptchaObj) {
									window.geetestCaptchaObj.reset();
								}
                                self.prop('disabled', false);
                            }
                        }, 1000);
                    }else{
                        var cnt = res.tip;
                        //new dialog({title: ' ', fixed: true, content: cnt}).showModal();
			            HB.util.alert(cnt);
                        self.prop('disabled', false);
                    }
                }
            });
        }
    });
	
	//是否同意用户服务协议
    $("#J_AgreeProtocol").change(function () {
        var button = $('#J_RegisterForm button[type="submit"]');
        $(this).is(':checked') ? button.removeAttr("disabled") : button.attr("disabled", "true");
    });

});