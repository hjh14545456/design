//弹框表单 
(function($) {
    //阅读页面
    var book_id;
    var csrf_token = HB.util.Cookie.get('login_token');
  //文字提示弹窗模板
    function createHtml(tips) {
        var html = '';
        html += '<div class="dialog-tips">'+ tips +'</div>';
        return html;
    }
	//分类选择，点击隐藏和重选
    $(".yincang").click(function () {
        $(".yincang").hide();
        $(".search-classify").hide();
        $(".search-classify1").toggle();
    });
    $(".xuanzhongbutton").click(function () {
        $(".yincang").toggle();
        $(".search-classify").toggle();
        $(".search-classify1").hide();
    });
    //收藏
    $(".J_ShouCang").click(function() {
        if (HB.userinfo.reader_id==0) {
            HB.util.loginDialog();
            return;
        }
        var self = $(this);
        if(self.prop('disabled')) return false;

        if ($(this).attr('data-list') == 1) {
            book_id = $(this).closest('li').attr('data-book-id');
        } else {
            book_id = HB.book.book_id;
        }

        if ($(this).hasClass('shoucanged')) {

            return;
        } else {
            $.ajax({
                url: HB.config.rootPath + 'bookshelf/favor',
                data: {
                    book_id: book_id,
                    csrf_token:csrf_token
                },
                beforeSend: function() {
                    self.prop('disabled', true);
                },
                complete: function() {
                    self.prop('disabled', false);
                },
                success: function (res) {
                    if (res.code == 100000) {
                        if (self.attr('data-btn')=='1') {
                            self.addClass('shoucanged').find('p').html("已放入书架");
                        } else {
                            self.addClass('shoucanged').html("已放入书架");
                        }
                        if( typeof load_right === 'function' ) {
                            $(".J_Stock_Favor_total").text(parseInt($(".J_Stock_Favor_total").text())+1);
                        }
                        //var msg = res.tip ? res.tip : '您已成功将这本书加入书架！';
                        //$("#J_BookReadBox").addClass('book-read-box-fav');
                        //HB.util.alert(res.tip,1);
                        $.ajax({
    						url: HB.config.rootPath + 'reader/auto_reg_daily_task',
    						success: function (res) {
    							if (res.code == 100000) {
    			                    // 新用户收藏成功第一本书的时候跳出提示框
    				                  var elem = createHtml("为保护您的账号安全，<br/>请尽快完善您的个人资料。");
    				                  var d = dialog({
    				                      title:' ',
    				                      fixed: true,
    				                      width: "290px",
    				                      content: elem,
    				                      okValue: '去完善',
    				                      ok: function () {
    				                          location.href = HB.config.rootPath + 'reader/my_info';
    				                      },
    				                      cancelValue: '以后',
    				                      cancel: function () {}
    				                  });
    				                  d.showModal();
    							} 
    							else{
    								var msg='已放入书架';
    								HB.util.alert(msg,1);
    							}
    						}
    					});
                    }else{
                        HB.util.alert(res.tip);
                        return;
                    }
                }
            });
        }
    });
    //推荐
    var dialogTuiJian, boxTuiJian;
    $(".J_TuiJian").click(function() {
        if (HB.userinfo.reader_id==0) {
            HB.util.loginDialog();
            return;
        }
        var self = $(this);

        if (self.attr('data-list') == 1) {
            book_id = self.closest('li').attr('data-book-id');
        } else {
            book_id = HB.book.book_id;
        }

        var elem = document.getElementById('J_TuiJianBox');
        dialogTuiJian = dialog({
            title: '投推荐票',
            fixed: true,
            skin: 'dialog-read',
            content: elem
        });
        dialogTuiJian.showModal();
    });
    $(document).on('click', "#J_TuiJianBox .J_BoxSubmit", function () {
        var self = $(this);
        if(self.hasClass('disabled')) return false;

        boxTuiJian = self.closest('#J_TuiJianBox');
        var num = parseInt($("#J_TuiJianBox .J_NumResult").val());
        num = isNaN(num) ? 1 : num;
        if (num <= 0) {
            HB.util.alert("数量错误", 2);
            return;
        }

        $.ajax({
            url: HB.config.rootPath + 'book/give_recommend',
            data: {
                book_id: book_id,
                count: num,
                csrf_token:csrf_token
            },
            beforeSend: function() {
                self.addClass("disabled");
            },
            complete: function () {

            },
            success: function (res) {
                self.removeClass("disabled");
                if (res.code == 100000) {
                    var msg = res.tip ? res.tip : '投推荐票成功！';
                    // boxTuiJian.find(".J_HLB").text(res.data.prop_info.rest_hlb);
                    // boxTuiJian.find(".J_Recommend").text(res.data.prop_info.rest_recommend);
                    //$(".J_HLB").text(res.data.prop_info.rest_hlb);
                    $(".J_Recommend").text(res.data.prop_info.rest_recommend);
                    HB.util.alert(msg,1);
                    if( typeof load_right === 'function' ) {
                        $(".J_Recommend_Rec_total").text(parseInt($(".J_Recommend_Rec_total").text())+num);
                        $(".J_Recommend_Rec_month").text(parseInt($(".J_Recommend_Rec_month").text())+num);
                        $(".J_Recommend_Rec_week").text(parseInt($(".J_Recommend_Rec_week").text())+num);
                    }
                    if(res.data.prop_info.rest_recommend<=0)
                        $("#J_TuiJianBox .J_NumResult").val(0);
                    else $("#J_TuiJianBox .J_NumResult").val(1);
                } else {
                    HB.util.alert(res.tip,1);
                }
                dialogTuiJian.close();
            }
        });
    });
    //月票
    var dialogYuePiao, boxYuePiao;
    $(".J_YuePiao").click(function() {
        if (HB.userinfo.reader_id==0) {
            HB.util.loginDialog();
            return;
        }
        var self = $(this);
        var elem = document.getElementById('J_YuePiaoBox');
        dialogYuePiao = dialog({
            title: '投月票 ',
            fixed: true,
            skin: 'dialog-read',
            content: elem
        });
        dialogYuePiao.showModal();
    });
    $(document).on('click', "#J_YuePiaoBox .J_BoxSubmit", function () {
        var self = $(this);
        if(self.hasClass('disabled')) return false;

        boxYuePiao = self.closest('#J_YuePiaoBox');
        var num = parseInt($("#J_YuePiaoBox .J_NumResult").val());
        num = isNaN(num) ? 1 : num;
        if (num <= 0) {
            HB.util.alert("数量错误", 2);
            return;
        }
        $.ajax({
            url: HB.config.rootPath + 'book/give_yp',
            data: {
                book_id: HB.book.book_id,
                count: num,
                csrf_token:csrf_token
            },
            beforeSend: function() {
                self.addClass("disabled", true);
            },
            complete: function () {

            },
            success: function (res) {
                self.removeClass('disabled');
                if (res.code == 100000) {
                    var msg = res.tip ? res.tip : '投月票成功！';
                    HB.util.alert(msg,1);
                    // boxYuePiao.find(".J_HLB").text(res.data.prop_info.rest_hlb);
                    // boxYuePiao.find(".J_Stock").text(res.data.prop_info.rest_yp);
                    //$(".J_HLB").text(res.data.prop_info.rest_hlb);
                    $(".J_Stock").text(res.data.prop_info.rest_yp);
                    if( typeof load_right === 'function' ) {
                        load_right();
                    }
                    if(res.data.prop_info.rest_yp<=0)
                        $("#J_YuePiaoBox .J_NumResult").val(0);
                    else $("#J_YuePiaoBox .J_NumResult").val(1);
                } else {
                    HB.util.alert(res.tip,1);
                }
                dialogYuePiao.close();
            }
        });
    });

    //订阅
    var dialogDingYue;
    $(".J_DingYue").click(function() {
        if (HB.userinfo.reader_id==0) {
            HB.util.loginDialog();
            return;
        }
        if (HB.book.is_paid==0) {
            HB.util.alert("免费书籍,无需订阅");
            return;
        }
        var self = $(this);
        if ($(this).attr("data-dingyueall") == 1) {
            HB.util.alert("您已全本订阅！",3);
            return false;
        }
        if ($(this).attr("data-dingyuealll") == 1) {
            HB.util.alert("您已订阅此章节！",3);
            return false;
        }
        var elem = document.getElementById('J_DingYueBox');
        dialogDingYue = dialog({
            title: '章节订阅',
            fixed: true,
            skin: 'dialog-read',
            content: elem
        });
        dialogDingYue.showModal();
    });
    $(document).on('click', "#J_DingYueBox .J_BoxSubmit", function () {
        var self = $(this);
        if(self.hasClass('disabled')) return false;
        var num = $("#J_DingYueBox .J_NumResult[checked]").val();
        // alert(num);
		var buy_paid = false;
        var ajaxOpt = {
            beforeSend: function() {
                self.addClass("disabled");
            },
            complete: function () {
                if(HB.book.chapter_id > 0 && buy_paid){
                    location.reload();
                }
            },
            success: function (res) {
                self.removeClass("disabled");
            	dialogDingYue.close();
                if (res.code == 100000) {
                    var msg = res.tip ? res.tip : '订阅成功！';
                    //HB.util.alert(msg,1);
                    if (num==1) {
                        $("#J_DingYue").attr("data-dingyueall", 1);
                    }

                    $(".J_HLB").text(res.data.prop_info.rest_hlb);
                    $(".J_Stock").text(res.data.prop_info.rest_yp);
                    buy_paid = true;
                    $.ajax({
						url: HB.config.rootPath + 'reader/auto_reg_daily_task',
						success: function (res) {
							if (res.code == 100000) {
			                    // 订阅成功后弹框提醒
				                  var elem = createHtml("为保护您的账号安全，<br/>请尽快绑定手机号或邮箱。");
				                  var d = dialog({
				                      title:' ',
				                      fixed: true,
				                      width: "290px",
				                      content: elem,
				                      okValue: '去绑定',
				                      ok: function () {
				                          location.href = HB.config.rootPath + 'reader/my_info';
				                      },
				                      cancelValue: '以后',
				                      cancel: function () {}
				                  });
				                  d.showModal();
							} 
							else{
								var msg = res.tip ? res.tip : '订阅成功！';
								HB.util.alert(msg,1);
							}
						}
					});
                } else {
                    HB.util.alert(res.tip,1);
                    if(res.code==220003){
                        setTimeout(function () {
                    	//猫饼干余额不足提醒
                        var elem = createHtml('<p class="dialog-recharge">您的猫饼干余额不足，<br/>是否前往充值中心？</p>');
                        var d = dialog({
                            title: '请充值',
                            fixed: true,
                            skin: 'dialog-box',
                            width: "290px",
                            content: elem,
                            okValue: '充值',
                            ok: function () {
                                window.open(HB.config.rootPath + 'recharge/index');
                            },
                            cancelValue: '以后再说',
                            cancel: function () {}
                        });
                        d.showModal();
                    }, 1000);
                    }
                    
                }
                dialogDingYue.close();
            }
        };
        if(num==1){
            ajaxOpt.url = HB.config.rootPath + 'book/buy';
            ajaxOpt.data = {
                book_id: HB.book.book_id,
                csrf_token:csrf_token
            };
        }
        else{
            ajaxOpt.url = HB.config.rootPath + 'chapter/buy';
            //增加一个is_auto_buy发送参数
            var is_auto_buy=$("input[name='is_auto_buy'][checked]").val();
            if (is_auto_buy==1) ajaxOpt.data = {chapter_id: HB.book.chapter_id,is_auto_buy:is_auto_buy,csrf_token:csrf_token};
            else ajaxOpt.data = {
                chapter_id: HB.book.chapter_id,
                csrf_token:csrf_token
            };

        }
        $.ajax(ajaxOpt);
    });

    //打赏
    var dialogDaShang, boxDaShang;
    $(".J_DaShang").each(function(){
        $(this).click(function(event) {
            if (HB.userinfo.reader_id==0) {
                HB.util.loginDialog();
                return;
            }
            var self = $(this),
                type = self.attr("data-type"),
                $type = $("#J_DaShangBox .account-type a[data-type='"+ type +"']");
            var elem = document.getElementById('J_DaShangBox');
            dialogDaShang = dialog({
                title:' ',
                fixed: true,
                skin: 'dialog-reward',
                content: elem
            });
            dialogDaShang.showModal();
            $type.trigger("click");

            if (self.hasClass('simple')) {
                var prop_type = self.prev().find('.selected').data('prop-type');
                $('.J_AccountShang .J_InputRadio a').removeClass('selected');
                $('.J_AccountShang .J_InputRadio a[data-prop-type="'+ prop_type +'"]').addClass('selected');
            }
        });
    });

    $(document).on('click', "#J_DaShangBox .account-type li", function () {
        var self = $(this),
            i = self.index(),
            accountInfo = self.closest("#J_DaShangBox").find(".account-info");
        accountInfo.eq(i).show().siblings(".account-info").hide();
    });
    $(document).on('click', ".J_AccountShang .J_BoxSubmit", function () {
    	if (HB.userinfo.reader_id==0) {
            HB.util.loginDialog();
            return;
        }
        var self = $(this);
        if(self.hasClass('disabled')) return false;
        boxDaShang = self.closest('#J_DaShangBox');

        var accountShang = boxDaShang.find(".J_AccountShang"),
            prop_type = accountShang.find('.J_InputRadio a.selected').attr("data-prop-type"), //道具类型
            prop_count = parseInt(accountShang.find('.J_InputRadio a.selected span').text()), //拥有的道具数量

            prop_price = parseInt(accountShang.find('.J_InputRadio .J_NumResult[checked]').val()), //道具单价
            hlb_rest = parseInt(accountShang.find(".J_HLB").text()),
            consume_sum = 0,
            consume_num = parseInt(accountShang.find(".J_NumCalculate .J_NumResult").val()); //打赏的道具数量
	        if (consume_num <= 0) {
	            HB.util.alert("数量错误", 2);
	            return;
	        }
        
            if (prop_count >= consume_num) {
                consume_sum = 0;
            } else if (prop_count > 0 && prop_count < consume_num) {
                consume_sum = (consume_num - prop_count) * prop_price;
            } else {
                consume_sum = consume_num * prop_price;
            }

		    if (consume_sum > hlb_rest) {
		    	//猫饼干余额不足提醒
		        var elem = createHtml('<p class="dialog-recharge">您的猫饼干余额不足，<br/>是否前往充值中心？</p>');
		        var d = dialog({
		            title: '请充值',
		            fixed: true,
		            skin: 'dialog-box',
		            width: "290px",
		            content: elem,
		            okValue: '充值',
		            ok: function () {
		                window.open(HB.config.rootPath + 'recharge/index');
		            },
		            cancelValue: '以后再说',
		            cancel: function () {}
		        });
		        d.showModal();
		        dialogDaShang.close();
		        return false;
		    }
        
        $.ajax({
            url: HB.config.rootPath + 'book/give_reward_prop',
            data: {
                book_id: HB.book.book_id,
                prop_id: prop_type,
                num: consume_num,
                csrf_token:csrf_token
            },
            beforeSend: function() {
                self.addClass("disabled");
            },
            complete: function () {

            },
            success: function (res) {
                self.removeClass("disabled");
                if (res.code == 100000) {
                    var msg = res.tip ? res.tip : '打赏成功！';
                    HB.util.alert(msg,1);

                    accountShang.find('.J_InputRadio a[data-prop-type="'+ prop_type +'"] span').text(res.data.prop_info.rest_prop_count);//剩余道具数量
                    // $(".J_HLB").text(res.data.prop_info.rest_hlb);
                    $(".J_HLB").text(parseInt(res.data.prop_info.rest_hlb-res.data.prop_info.rest_gift_hlb));
                    //$(".J_Stock").text(res.data.prop_info.rest_yp);
                    if( typeof load_right === 'function' ) {
                        load_right();
                    }else{
                        load_down();
                    }
                    accountShang.find(".J_NumCalculate .J_NumResult").val(1);
                } else {
                    HB.util.alert(res.tip,1);
                }
                dialogDaShang.close();
            }
        });
    });
    $(document).on('click', ".J_AccountProp .J_BoxSubmit", function () {
        if (HB.userinfo.reader_id==0) {
            HB.util.loginDialog();
            return;
        }
        var self, prop_box, elem;
        self = $(this);
        prop_box = self.closest(".J_AccountProp");
        if(self.hasClass('disabled')) return false;
        boxDaShang = self.closest('#J_DaShangBox');

        var num = parseInt(prop_box.find(".J_NumResult").val());  //投出刀片数
        if (num <= 0) {
            HB.util.alert("数量错误", 2);
            return;
        }

        if (!self.hasClass("simple")) { // 投刀片弹窗
            var consume_hlb = parseInt(prop_box.find(".J_Consume").text());
            if(consume_hlb > parseInt(prop_box.find(".J_HLB").text())){
                //HB.util.alert("您的猫饼干余额不足",1);
                //猫饼干余额不足提醒
                elem = createHtml('<p class="dialog-recharge">您的猫饼干余额不足，<br/>是否前往充值中心？</p>');
                var d = dialog({
                    title: '请充值',
                    fixed: true,
                    skin: 'dialog-box',
                    width: "290px",
                    content: elem,
                    okValue: '充值',
                    ok: function () {
                        window.open(HB.config.rootPath + 'recharge/index');
                    },
                    cancelValue: '以后再说',
                    cancel: function () {}
                });
                d.showModal();
                dialogDaShang.close();
                return false;
            }
        } else {  // 详情页打赏
            var own_num = parseInt(prop_box.find(".J_OwnBlade").text());
            if (num > own_num) {
                var type = self.attr("data-type"),
                    $type = $("#J_DaShangBox .account-type a[data-type='"+ type +"']");
                elem = document.getElementById('J_DaShangBox');
                dialogDaShang = dialog({
                    title: ' ',
                    fixed: true,
                    skin: 'dialog-reward',
                    content: elem
                });
                dialogDaShang.showModal();
                $type.trigger("click");
                $(elem).find('.J_NumResult').val(num).trigger('keyup');
                return;
            }
        }

        $.ajax({
            url: HB.config.rootPath + 'book/give_blade',
            data: {
                book_id: HB.book.book_id,
                num: num,
                csrf_token:csrf_token
            },
            beforeSend: function() {
                self.addClass("disabled");
            },
            complete: function () {
            },
            success: function (res) {
                self.removeClass("disabled");
                if (res.code == 100000) {
                    var msg = res.tip ? res.tip : '投出道具成功！';
                    HB.util.alert(msg,1);
                    $(".J_HLB").text(res.data.prop_info.rest_hlb);
                    //$(".J_Stock").text(res.data.prop_info.rest_yp);
                    $(".J_OwnBlade").text(res.data.prop_info.rest_total_blade);
                    //$(".J_OwnBlade").text();
                    if( typeof load_right === 'function' ) {
                        load_right();
                    }else{
                        load_down();
                    }
                } else {
                    HB.util.alert(res.tip,1);
                }
                 if (!self.hasClass("simple")) {
                    dialogDaShang.close();
                }
            }
        });
    });
	
	//漫画提示
    var dialogprompt;
    $(".J_prompt").click(function() {
        var elem = document.getElementById('J_promptBox');
        dialogprompt = dialog({
            title: ' ',
            fixed: true,
            skin: 'dialog-read',
            content: elem
        });
        dialogprompt.showModal();
    });
})(jQuery);
