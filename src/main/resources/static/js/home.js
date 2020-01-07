//个人中心
$(function() {
    var csrf_token = HB.util.Cookie.get('login_token');
    $(".act-tab-btn").on("click", function () {
        var _self = $(this),
            act_tab_titles = _self.next();
        if (_self.hasClass("opened")) {
            _self.removeClass("opened");
            act_tab_titles.hide();
        } else {
            _self.addClass("opened");
            act_tab_titles.show();
        }
    });
    $(".act-tab-titles").on("click", "a", function () {
        var _self = $(this),
            text = _self.text(),
            obj = _self.closest(".act-tab-titles").prev();
        if (obj.hasClass("act-tab-btn")) {
            obj.text(text);
            $(".act-tab-btn").trigger("click");
        }
    });
    //书架切换
    $("#J_BookShelf h3 a").click(function(event) {
        var $box = $('#J_BookShelf');
        var $list = $box.find('#J_BookShelfList');
        var index = $(this).parent('span').index();
        $box.find('h3 a').removeClass('selected');
        $(this).addClass('selected');

        $($list.find('ul').get(index-1)).show().siblings('ul').hide();
    });

  //模块切换
    $(".J_ToggleTitle li a").on("click",function(){
        var self = $(this),
            parent = self.parent(),
            type = self.attr("data-toggle");
        parent.addClass('selected').siblings("li").removeClass("selected");
        $('.J_ToggleBox').hide();
        $('.J_ToggleBox[data-toggle="'+ type +'"]').show();
    });

    //私信
    (function(){
        //发送私信
        var dialogMsg, boxMsg, reader_id;
        $(document).on('click', '.J_SendMsg', function() {
            var self = $(this);

            reader_id = self.attr('data-reader-id');
            $("#J_SendMsgBox").find("#J_SendMsgUser").text(self.attr('data-name'));

            if (HB.userinfo.reader_id) {
            	var content = '<div id="J_SendMsgBox" class="msg-box">' +
                '<textarea class="J_CommentInput" name="message_content" placeholder="说点什么\^o^/"></textarea>' +
                '<div class="btn-group ly-mt10">' +
                '<span class="J_CommentWordsCount">0</span>/ <span class="J_CommentWordsCountLimit">1000</span><a class="J_BoxSubmit btn btn-md btn-warning" href="javascript:;">发送</a>' +
                '</div>' +
                '</div>';
            dialogMsg = dialog({
                title: '给'+ self.attr('data-name') + '发私信：',
                fixed: true,
                skin: "dialog-box dialog-msg",
                content: content
            });
            dialogMsg.showModal();

            } else {
                HB.util.loginDialog();
            }
        });
        $(document).on('click', "#J_SendMsgBox .J_BoxSubmit", function () {
        	if (!HB.userinfo.tel_num && !HB.userinfo.license) {
                HB.util.identifyDialog(HB.urlinfo.redirect);
                return;
            } 
        	if (!HB.userinfo.tel_num && HB.userinfo.license && HB.userinfo.redis_license) {
            	HB.util.alert("请耐心等待，我们会在12小时内进行实名制备案。谢谢您的配合！", 3);
                return;
            } 
        	 var self = $(this);
             if(self.prop('disabled')) return false;

             boxMsg = self.closest('#J_SendMsgBox');
             var message_content = $.trim($("#J_SendMsgBox").find('textarea').val());
             if (message_content.length == 0) {
                 HB.util.alert('私信内容不能为空！', 3);
                 return false;
             }
            $.ajax({
                url: HB.config.rootPath + 'reader/send_message',
                data: {
                    message_content: message_content,
                    reader_id: reader_id,
                    csrf_token:csrf_token
                },
                beforeSubmit: function() {
                    self.prop("disabled", true);
                },
                success: function (res) {
                    if (res.code == 100000) {
                        var msg = res.tip ? res.tip : '消息发送成功！';
                        $("#J_SendMsgBox").find('textarea').val("");
                        $("#J_SendMsgBox").find('.J_WordNum').text(0);
                        HB.util.alert(msg,1);
                        dialogMsg.remove();
                    } else {
                        HB.util.alert(res.tip,1);
                    }
                },
                complete: function () {
                    self.prop("disabled", false);
                }
            });
        });

        
        $(document).on('keyup', '.J_CommentInput', function() {
            numLimit($(this));
        });
        $(document).on('focus', '.J_CommentInput', function() {
            numLimit($(this));
        });

        function numLimit(obj) {
            var val = obj.val();
            var num = val.length;

            var limit = parseInt(obj.next().find(".J_CommentWordsCountLimit").text());
            if (num>limit) {
                num = limit;
                obj.val(HB.util.cut_str(val, limit));
            }
            obj.next().find(".J_CommentWordsCount").text(num);
        }
    })();

    //书评显示全部
    if ($(".J_PerCommentList").length) {
        var h = 52;
        $(".J_PerCommentList .J_DescContent").each(function() {
            var self = $(this);
            if (self.height() > h) {

                var $btn = self.next(".J_ShowAllBar").find('.J_ShowAllBtn');
                self.css('height', h+'px');
                $btn.show().one('click', function() {
                    self.css('height', 'auto');
                    $btn.hide();
                });
            }
        });
    }

    //更改头像
    $(".J_ChangeAvater").hoverClass();
    var dialogAvater;
    $(".J_ChangeAvaterA").click(function() {

        var elem = document.getElementById('MsgMain');
        dialogAvater = dialog({
            title:'修改头像',
            fixed: true,
            content: elem
        });
        dialogAvater.showModal();
    });

    //我的书架
    $("#J_BookShelfList li").hoverClass();
    //切换至书架
    $(".J_Bookshelf-l").on("mouseover",function(){
        $(this).find("ul").show();
    });
    $(".J_Bookshelf-l ul").on("mouseout",function(){
        $(this).hide();
    });
    $("#J_BookShelfList > ul > li").on("mouseout",function(){
        if(!$(this).hasClass("hover")){
            $(".J_Bookshelf-l ul",$(this)).hide();
        }
    });

    //书架移动
    (function(){
        $("#J_BookShelfList .J_BookMoveFlag").click(function() {
            var self = $(this);
            self.closest('li').toggleClass('selected');
        });
    })();

    //修改个人信息
    $(".J_InfoModify").on("click", function () {
        var info_list = $(".J_InfoList"),
            $nickname = info_list.find(".nickname"),
            $oldNickname = $(".J_Nickname"),
            $newNickname = $("input[name='newNickname']"),
            $sex = info_list.find(".sex"),
            gender = $sex.attr("data-value"),
            $selectSex = info_list.find(".selectSex");

        //修改昵称
        $newNickname.val($nickname.text());
        $newNickname.parent().show().next(".wrongBox").removeClass("hide");
        $nickname.hide();

        //修改性别
        $selectSex.find("select").val(gender).trigger('change');
        $selectSex.show();
        $sex.hide();

        //换绑和修改按钮
        info_list.find(".btn-modify").removeClass("hide").next(".wrongBox").removeClass("hide");

        //保存按钮
        $(this).hide().siblings(".J_InfoSubmit").show();
    });

    //保存个人信息
    $(".J_InfoSubmit").on("click", function () {
        var self = $(this),
            info_list = $(".J_InfoList"),
            $nickname = info_list.find(".nickname"),
            $oldNickname = $(".J_Nickname"),
            $newNickname = $("input[name='newNickname']"),
            $sex = info_list.find(".sex"),
            $selectSex = info_list.find(".selectSex"),
            gender = $selectSex.find("select").val();

        //用户昵称
        var newNickname = $newNickname.val(),
            cnt = $.trim(newNickname);
        if(cnt.length === 0){
            HB.util.alert("请输入昵称",1);
            return false;
        }
        $.ajax({
            type: "post",
            url: HB.config.rootPath + 'reader/mod_my_info',
            data: {
                reader_name: newNickname,
                gender: gender,
                csrf_token: csrf_token
            },
            beforeSubmit: function() {
                self.prop("disabled", true);
            },
            success: function (res) {
                if (res.code == 100000 || res.code == 310015) {
                    var msg = res.tip ? res.tip : '修改个人信息成功！';
                    HB.util.alert(msg,1);

                    //保存昵称
                    $newNickname.parent().hide().next(".wrongBox").addClass("hide");
					if(res.code == 310015){
						$nickname.text($oldNickname.text()).show();
					} else {
						$nickname.text(newNickname).show();
						$oldNickname.text(newNickname);
					}

                    //保存性别
                    var sex = $selectSex.find("option:selected").text();
                    $selectSex.hide();
                    $sex.attr("data-value", gender).text(sex).show();

                    //换绑和修改按钮
                    info_list.find(".btn-modify").addClass("hide").next(".wrongBox").addClass("hide");

                    //修改按钮
                    self.hide().siblings(".J_InfoModify").show();
                } else {
                    HB.util.alert(res.tip,1);
                }
            },
            complete: function () {
                self.prop("disabled", false);
            }
        });
    });

    //换绑手机
    $(".J_BindMobile").on("click", function () {
    	var self = $(this);
    	var url = self.attr("data-value");
        //$(".J_InfoSubmit").trigger("click");
        window.location.href = url;
    });

    //修改密码
    $(".J_ModifyPwd").on("click", function () {
    	var self = $(this);
    	var url = self.attr("data-value");
        //$(".J_InfoSubmit").trigger("click");
        window.location.href = url;
    });

    //管理书架
    var manageBookshelf;
    $("#J_ManageBookshelf").click(function(){
        var elem = document.getElementById('J_DialogManage');
        manageBookshelf = dialog({
            title: '管理书架',
            fixed: true,
            skin: 'dialog-box dialog-manage',
            content: elem
        });
        manageBookshelf.showModal();
    });
    //重命名书架
    $(".bookshelf-item .btn-modify").each(function(i, val){
        var self = $(val);
        self.click(function(){
            var val = self.prev().text();
            self.parent().hide();
            self.parent().next().show().find("input[name='bookshelf']").val('').focus().val(val);
        })
    });
    $(".bookshelf-item .btn-confirm").each(function(i, val){
        var self = $(val),
            parent = self.parent(),
            bookshelf_item = self.closest('.bookshelf-item'),
            bookshelf_id = bookshelf_item.find(".bookshelf").attr("data-bookshelf-id");
        self.click(function(){
            var bookshelf = $.trim(self.prev().val());
            if( bookshelf.length == 0 ){
                HB.util.alert("请输入书架名称,9字以内", 3);
                return;
            }
            $.ajax({
                type: 'post',
                url: HB.config.rootPath + 'bookshelf/mod_shelf_name',
                data: {
                    reader_id: HB.userinfo.reader_id,
                    shelf_id: bookshelf_id,
                    shelf_name: bookshelf,
                    csrf_token:csrf_token
                },
                beforeSend: function() {
                    self.prop("disabled", true);
                },
                success: function (res) {
                    if(res.code == 100000){
                        self.prev().val("");
                        parent.hide();
                        bookshelf_item.find(".cnt-box").show();
                        bookshelf_item.find(".bookshelf").text(bookshelf);
                        $('.homepage-hd li[data-bookshelf-id="' + bookshelf_id + '"]').text(bookshelf);
                    }else {
                        HB.util.alert(res.tip, 1);
                    }
                },
                complete: function () {
                    self.prop("disabled", false);
                }
            });
        })
    });
    //新建书架
    $(document).on('click', '.J_NewBookshelf', function () {
        var flag = true;
        //前段按新规则检测是否可以添加书架
        $.ajax({
            url : HB.config.rootPath + "bookshelf/check_add_shelf",
            data : {},
            type : 'post',
            dataType : 'json',
            async : false,
            success : function(res){
                if(res.code == 100000){
                    flag = true;
                }else{
                    HB.util.alert(res.tip,1);
                    flag = false;
                }
            }
        });

        if(!flag){
            return;
        }

            manageBookshelf.close();

            var content = '<div class="input-group">' +
                '<input type="text" class="form-control" name="newBookshelf" placeholder="给你的书架起个个性的名字吧" autofocus/>' +
                '</div>';

            var d = dialog({
                title: '新建书架',
                fixed: true,
                skin: 'dialog-box dialog-new-bookshelf',
                content: content,
                button: [
                    {
                        value: '取消',
                        callback: function () {
                        }
                    },
                    {
                        value: '新建书架',
                        callback: function () {
                            //alert($.trim($("input[name='newBookshelf']").val()));
                            if($.trim($("input[name='newBookshelf']").val()).length == 0 ){
                                HB.util.alert("请输入书架名称，15字以内", 3);
                                return false;
                            }
                            $.ajax({
                                type: 'post',
                                url: HB.config.rootPath + "bookshelf/add_shelf",
                                data:{
                                    shelf_name: $("input[name='newBookshelf']").val(),
                                    csrf_token:csrf_token
                                },
                                cache: false,
                                success: function(res){
                                    if(res.code == 100000){
                                        window.location.reload();
                                    }else {
                                        HB.util.alert(res.tip,1);
                                    }
                                }
                            });
                        },
                        autofocus: true
                    }
                ]
            });
            d.showModal();
    });
    $(document).on('click', '.J_BtnConfirm', function () {
        //保存书架
        var self = $(this),
            parent = self.parent(),
            bookshelf_item = parent.siblings();
        $("input[name='bookshelf']", bookshelf_item).each(function (i, val) {
            var value = $.trim($(val).val()),
                bookshelf = $.trim($(val).parent().prev().find(".bookshelf").text());
            if ((value != "") && (value != bookshelf)) {
                $(val).next().trigger("click");
            }
        });
        manageBookshelf.close();
        window.location.reload();
    });

    //批量操作
    $(".J_BtnOperateAll").on("click", function () {
        $(this).hide();
        $(".J_BtnComplete").css("display", "inline-block");
        $(".book-list li").each(function (i, val) {
            $(val).find(".item").eq(0).addClass("checkbox")
        });
        $(".operate-all-books").stop().fadeIn('fast');
        $(".J_BtnSelect").stop().fadeIn('fast');
    });
    $(".J_BtnComplete").on("click", function () {
        $(this).hide();
        $(".J_BtnOperateAll").css("display", "inline-block");
        $(".book-list li").each(function (i, val) {
            $(val).find(".item").eq(0).removeClass("checkbox")
        });
        $(".operate-all-books").stop().fadeOut('fast');
        $(".J_BtnSelect").stop().hide().removeClass("selected");
        $(".J_BtnSelectAll").removeClass("selected");
    });

    //全选
    $(".J_BookshelfTabTitles li").on("click", function () {
        var self = $(this);
        if (self.hasClass("selected")) {
            return false;
        }
        $(".J_BtnOperateAll").show();
        $(".J_BtnComplete").hide();
        $(".J_BtnSelect").removeClass("selected").hide();
        $(".operate-all-books").stop().fadeOut('fast', function () {
            $(".J_BtnSelectAll").removeClass("selected");
            $('.J_IsTop[data-type="multiple"]').text("置顶").attr("data-is-top", 0);
        });
    });

    $(".J_BtnSelect").on("click", function () {
        $(this).toggleClass("selected");
        if ($(".book-list .J_BtnSelect").length == $(".book-list .J_BtnSelect.selected").length) {
            $(".J_BtnSelectAll").addClass("selected");
        } else {
            $(".J_BtnSelectAll").removeClass("selected");
        }
        var selected = $(".book-list .J_BtnSelect.selected"),
            box = selected.closest("li");
        if (selected.length == box.find('.J_IsTop[data-is-top="1"]').length && (selected.length != 0)) {
            $('.J_IsTop[data-type="multiple"]').text("取消置顶").attr("data-is-top", 1);
        } else {
            $('.J_IsTop[data-type="multiple"]').text("置顶").attr("data-is-top", 0);
        }
    });
    $(".J_BtnSelectAll").on("click", function () {
        var self = $(this);
        if (self.hasClass("selected")) {
            self.removeClass("selected");
            $(".book-list .J_BtnSelect").each(function (i, val) {
                $(val).removeClass("selected");
            });
        } else {
            self.addClass("selected");
            $(".book-list .J_BtnSelect").each(function (i, val) {
                $(val).addClass("selected");
            });
        }
        var selected = $(".book-list .J_BtnSelect.selected"),
            box = selected.closest("li");
        if (selected.length == box.find('.J_IsTop[data-is-top="1"]').length && (selected.length != 0)) {
            $('.J_IsTop[data-type="multiple"]').text("取消置顶").attr("data-is-top", 1);
        } else {
            $('.J_IsTop[data-type="multiple"]').text("置顶").attr("data-is-top", 0);
        }
    });
    //单本书操作按钮
    $(".J_OperateBox").hoverClass();
    
    //删除书籍
    $(".J_DeleteBook").each(function(i, val){
        $(val).click(function(){
            var self = $(this),
                box , book, book_id, content;
            var shelf_id=$('#current_shelf').data("shelf-id");
            if (self.attr("data-type") == "multiple") {
                if ($(".J_BtnSelect.selected").length == 0) {
                    HB.util.alert("请选择需要删除的书籍", 3);
                    return false;
                }
                box = $(".J_BtnSelect.selected").closest("li");
                book_id = [];
                box.each(function (i, val) {
                    book_id.push(parseInt($(val).attr("data-book-id")));
                });
                content = ' <h3 class="sub-tit">是否确认删除全部选中书籍</h3>' +
                    '<p class="tips">删除书籍后，<br/>您的阅读记录、书签将同步删除</p>';
            } else {
                box = self.closest(".operate-box").closest("li");
                book = box.find(".title a").text();
                book_id = box.attr("data-book-id");
                content = ' <h3 class="sub-tit">是否确认删除《'+ book +'》</h3>' +
                    '<p class="tips">删除书籍后，<br/>您的阅读记录、书签将同步删除</p>';
            }
            var d = dialog({
                title: '删除书籍',
                fixed: true,
                skin: "dialog-box dialog-tips",
                content: content,
                button: [
                    {
                        value: '确认删除',
                        callback: function () {
                            $.ajax({
                                type: 'post',
                                url: HB.config.rootPath + "bookshelf/delete_shelf_book",
                                data:{
                                    book_id: book_id ,
                                    shelf_id:shelf_id,
                                    csrf_token:csrf_token
                                },
                                cache: false,
                                success: function(res){
                                    if(res.code == 100000){
                                        box.remove();
                                        var book_amount = $("#J_BookAmount");
                                        book_amount.text(parseInt(book_amount.text()) - 1);
                                    }else {
                                        HB.util.alert(res.tip,1);
                                    }
                                }
                            });
                        },
                        autofocus: true
                    },
                    {value: '取消'}
                ]
            });
            d.showModal();
        });
    });
    //书籍移动至书架
    $(".J_MoveBook").hoverClass();
    $(".J_MoveBook li a").each(function(i, val){
        $(val).click(function(){
            var self = $(this),
                move_book = self.closest(".J_MoveBook"),
                box, book, book_id,
                bookshelf = self.text(),
                to_shelf_id = self.attr("data-bookshelf-id"),
                shelf_id=$('#current_shelf').data("shelf-id"),
                content;
            if (move_book.attr("data-type") == "multiple") {
                if ($(".J_BtnSelect.selected").length == 0) {
                    HB.util.alert("请选择需要移动的书籍", 3);
                    return false;
                }
                box = $(".J_BtnSelect.selected").closest("li");
                book_id = [];
                box.each(function (i, val) {
                    book_id.push(parseInt($(val).attr("data-book-id")));
                });
                content = ' <h3 class="sub-tit">是否将全部选中书籍移动至 '+ bookshelf +'</h3>' +
                    '<p class="tips">移动至书架后，阅读记录及书签将会保留</p>';
            } else {
                box = self.closest(".operate-box").closest("li");
                book = box.find(".title a").text();
                book_id = box.attr("data-book-id");
                content = '<h3 class="sub-tit">是否将《'+ book +'》<br/>移动至 '+ bookshelf +'</h3>' +
                    '<p class="tips">移动至书架后，阅读记录及书签将会保留</p>';
            }
            var d = dialog({
                title: '移动至书架',
                fixed: true,
                skin: "dialog-box dialog-tips",
                content: content,
                button: [
                    {
                        value: '确认移动至书架',
                        callback: function () {
                            $.ajax({
                                type: 'post',
                                url: HB.config.rootPath + 'bookshelf/move_to_shelf',
                                data:{
                                    book_id: book_id,
                                    to_shelf_id: to_shelf_id,
                                    shelf_id:shelf_id,
                                    csrf_token:csrf_token
                                },
                                cache: false,
                                success: function(res){
                                    if(res.code == 100000){
                                        window.location.reload();
                                    }else {
                                        HB.util.alert(res.tip,1);
                                    }
                                }
                            });
                        },
                        autofocus: true
                    },
                    {value: '取消'}
                ]
            });
            d.showModal();
        });
    });
    //置顶
    $(".J_IsTop").on("click", function () {
        var self = $(this),
            box, book_id,
            is_top = self.attr("data-is-top"),
            shelf_id=$('#current_shelf').data("shelf-id");

        if (self.attr("data-type") == "multiple") {
            if ($(".J_BtnSelect.selected").length == 0) {
                HB.util.alert("请选择需要置顶的书籍", 3);
                return false;
            }
            box = $(".J_BtnSelect.selected").closest("li");
            book_id = [];
            box.each(function (i, val) {
                book_id.push(parseInt($(val).attr("data-book-id")));
            });
        } else {
            box = self.closest(".operate-box").closest("li");
            book_id = box.attr("data-book-id");
        }

        $.ajax({
            type: 'post',
            url: HB.config.rootPath + 'bookshelf/set_to_top',
            data:{
                book_id: book_id,
                is_top: is_top,
                shelf_id: shelf_id,
                csrf_token:csrf_token
            },
            cache: false,
            success: function(res){
                if(res.code == 100000){
                    window.location.reload();
                }else {
                    HB.util.alert(res.tip,1);
                }
            }
        });
    });
    //自动订阅
    $(".J_IsAutoBuy").on("click", function () {
        var self = $(this),
            box =self.closest(".operate-box").closest("li"),
            book_id = box.attr("data-book-id"),
            is_auto_buy = self.attr("data-auto-buy");
            shelf_id=$('#current_shelf').data("shelf-id");
        $.ajax({
            type: 'post',
            url: HB.config.rootPath + 'bookshelf/set_is_auto_buy_pub',
            data:{
                book_id: book_id,
                is_auto_buy_pub: is_auto_buy,
                shelf_id:shelf_id,
                csrf_token:csrf_token
            },
            cache: false,
            success: function(res){
                if(res.code == 100000){
                    is_auto_buy == 0 ? self.text("取消自动订阅").attr("data-auto-buy", 1) : self.text("自动订阅").attr("data-auto-buy", 0);
                    HB.util.alert(res.data.tip,1);
                }else {
                    HB.util.alert(res.data.tip,1);
                }
            }
        });
    });
    
    
    
});