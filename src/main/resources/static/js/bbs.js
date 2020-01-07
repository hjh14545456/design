$(function(){
    var csrf_token = HB.util.Cookie.get('login_token');
    //讨论区版规隐藏/显示
    $(".J_BtnLaw").click(function() {
        var self = $(this);
        if (self.hasClass('btn-law-show')) {
            self.hide().prev("div").height('auto');
            self.next('a').show();
        } else if (self.hasClass('btn-law-hide')) {
            var div = self.prev().prev("div");
            self.hide();
            div.height(div.attr('data-height')+'px');
            self.prev('a').show();
        }
    });

    //回复字数限制
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

    //论坛
    (function() {
        //首次加载
        // setTimeout(function(){
        //     loadComment(url.get_review_list_all, {book_id: HB.book.book_id});
        // }, 2000);
        //
        //
        // $commentList = $(".J_CommentList");
        //
        //
        // //加载帖子列表
        // function loadComment(url, data, jump) {
        //     $commentList.load(url, data, function() {
        //         showAll();
        //     });
        //     if (jump == 1){
        //         $('html,body').animate({scrollTop:$commentList.offset().top-400}, 800);
        //     }
        // }

        var url = {
            // add_bbs_comment: HB.config.rootPath + 'bbs/add_bbs_comment',
            add_bbs_comment_reply: HB.config.rootPath + 'bbs/add_bbs_comment_reply'
        };

        //帖子回复框
        $(document).on("click", '.J_FormReply', function() {
            if (HB.userinfo.reader_id==0) {
                HB.util.loginDialog();
                return;
            }
            if (!HB.userinfo.tel_num && !HB.userinfo.license) {
                HB.util.identifyDialog(HB.urlinfo.redirect);
                return;
            } 
            if (!HB.userinfo.tel_num && HB.userinfo.license && HB.userinfo.redis_license) {
            	HB.util.alert("请耐心等待，我们会在12小时内进行实名制备案。谢谢您的配合！", 3);
                return;
            } 
            
            $('.J_BookChapterComment').remove();
            // console.log($(this));
            var $state = $(this).parent().prev('.J_DescBox').find(".J_Desc");
            if ($state.next(".J_BookChapterComment").length) {
                $state.next(".J_BookChapterComment").remove();
                return false;
            }
            var html =  replyComment('add_review_comment');
            $state.after(html);
            $('html,body').animate({scrollTop:$state.offset().top-200}, 800);
            $state.next().find(".J_Face").qfcfaceimg({area: $state.next(".J_BookChapterComment").find('.J_CommentInput')});

            HB.util.require('jquery.nicescroll', function(){
                $state.next().find(".J_Face").find(".J_mCustomScrollbar").each(function() {
                    var option = $.extend({
                        cursorcolor: '#c8c8c8'
                    }, $(this).data(option));
                    $(this).niceScroll(option);
                });
            });
        });

        //发表帖子的回复
        $(document).on("click", '.J_AddReviewComment ', function() {
            if (HB.userinfo.reader_id==0) {
                HB.util.loginDialog();
                return;
            }
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

            var $bookChapterComment = self.closest('.J_BookChapterComment');
            var $input = $bookChapterComment.find(".J_CommentInput");
            var $li = $bookChapterComment.closest('.J_BbsComment');
            //console.log($li);
            var comment_id=$li.attr('data-comment-id');
			var old_reader_id=$li.attr('data-reader-id');
            // alert($li.attr('data-comment-id'));
            // alert($input.val());
			var bbs_type=$('#bbs-detail').attr('data-bbstype');
            $.ajax({
                url: url.add_bbs_comment_reply,
                data: {
                    comment_id: comment_id,
                    reply_content: $input.val(),
					old_reader_id: old_reader_id,
					bbs_type:bbs_type,
                    csrf_token:csrf_token
                },
                beforeSend: function() {
                    self.prop('disabled', true);
                },
                complete: function() {
                    self.prop('disabled', false);
                    $('.J_BookChapterComment').remove();
                },
                success: function(res) {
                    if (res.code == 100000) {
                        HB.util.alert('回复成功',1);
                        change_reply_page(1,comment_id);
                        // var url3 = HB.config.rootPath + 'book/get_reply_list_all';
                        // url3 = url3+'/'+page;
                        // $replyList=$("#commentid_"+comment_id);
                        // $replyList.load(url3, {comment_id: comment_id}, function() {
                        //     showAll();
                        // });
                        // $('html,body').animate({scrollTop:$replyList.offset().top-400}, 800);
                    } else {
                        HB.util.alert(res.tip);
                    }
                }
            });
        });

        //帖子的评论回复框
        $(document).on("click", '.J_FormAddReviewComment', function() {
            if (HB.userinfo.reader_id==0) {
                HB.util.loginDialog();
                return;
            }
            if (!HB.userinfo.tel_num && !HB.userinfo.license) {
                HB.util.identifyDialog(HB.urlinfo.redirect);
                return;
            } 
            if (!HB.userinfo.tel_num && HB.userinfo.license && HB.userinfo.redis_license) {
            	HB.util.alert("请耐心等待，我们会在12小时内进行实名制备案。谢谢您的配合！", 3);
                return;
            } 
            $('.J_BookChapterComment').remove();
            var $state = $(this).closest('.J_State');
            var $li = $(this).closest('.J_ReviewComment');

            if ($state.next(".J_BookChapterComment").length) {
                $state.next(".J_BookChapterComment").remove();
                return false;
            }

            var html = replyComment('add_review_comment_reply', $li.attr('data-reader-name'));
            $state.after(html);

            $state.next().find(".J_Face").qfcfaceimg({area:$state.next(".J_BookChapterComment").find('.J_CommentInput')});
            //  美化滚动条
            HB.util.require('jquery.nicescroll', function(){
                $state.next().find(".J_Face").find(".J_mCustomScrollbar").each(function() {
                    var option = $.extend({
                        cursorcolor: '#c8c8c8'
                    }, $(this).data(option));
                    $(this).niceScroll(option);
                });
            });
        });


        //发表帖子的评论的回复
        $(document).on("click", '.J_AddReviewCommentReply', function() {
            if (HB.userinfo.reader_id==0) {
                HB.util.loginDialog();
                return;
            }
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

            var $bookChapterComment = self.closest('.J_BookChapterComment');
            var $input = $bookChapterComment.find(".J_CommentInput");
            var $li = self.closest('.J_ReviewComment');
            var comment_id=$li.attr('data-comment-id');
            var old_reader_id=$li.attr('data-reader-id');
            // alert($li.attr('data-reply-id'));
            // alert($li.attr('data-reader-id'));
            // alert($input.val());
			var bbs_type=$('#bbs-detail').attr('data-bbstype');
            $.ajax({
                url: url.add_bbs_comment_reply,
                data: {
                    comment_id: comment_id,
                    reply_content: $input.val(),
                    old_reader_id: old_reader_id,
					bbs_type:bbs_type,
                    csrf_token:csrf_token
                },
                beforeSend: function() {
                    self.prop('disabled', true);
                },
                complete: function() {
                    self.prop('disabled', false);
                    $('.J_BookChapterComment').remove();
                },
                // error: function() {
                // 	var res = {};
                // 	res.code = 100000;
                // 	if (res.code == 100000) {
                // 		loadComment(url.get_review_list_all, {book_id: HB.book.book_id}, 1);
                // 		$bookChapterComment.remove();
                // 	} else {
                // 		alert(res.tip);
                // 	}
                // },
                success: function(res) {
                    if (res.code == 100000) {
                        HB.util.alert('回复成功',1);
                        change_reply_page(1,comment_id);
                        // var curr_page = $("#curr_page").val();
                        // loadComment(url.get_review_list_all+'/'+curr_page, {book_id: HB.book.book_id}, 1);
                        // $bookChapterComment.remove();
                    } else {
                        HB.util.alert(res.tip);
                    }

                }
            });
        });

        function replyComment(type, at) {
            var html = '';
            if (type == 'add_review_comment') {
                html += '\
					<div class="book-chapter-comment book-chapter-comment J_BookChapterComment">\
						<textarea class="J_CommentInput comment-input" maxlength="150" placeholder="发表回复："></textarea>\
						<div class="clearfix ly-mt10 repo">\
							<div class="ly-fl">\
								<div class="comment-face J_Face">\
									<div class="face-btn"><i></i>颜文字</div>\
									<div class="J_FaceDialog face-dialog" style="display:block;visibility:hidden">\
									</div>\
								</div>\
							</div>\
							<div class="ly-fr"><span class="J_CommentWordsCount">0</span>/150<a href="javascript:;" class="J_AddReviewComment btn btn-md btn-warning ly-ml10">回复</a></div>\
						</div>\
					</div>';
            } else if (type == 'add_review_comment_reply') {
                html += '\
					<div class="book-chapter-comment book-chapter-comment-inner J_BookChapterComment">\
						<textarea class="J_CommentInput comment-input" maxlength="150" placeholder="@'+at+'"></textarea>\
						<div class="clearfix ly-mt10 repo">\
							<div class="ly-fl">\
								<div class="comment-face J_Face">\
									<div class="face-btn"><i></i>颜文字</div>\
									<div class="J_FaceDialog face-dialog" style="display:block;visibility:hidden">\
									</div>\
								</div>\
							</div>\
							<div class="ly-fr"><span class="J_CommentWordsCount">0</span>/150<a href="javascript:;" class="J_AddReviewCommentReply replay-btn ly-ml10">回复</a></div>\
						</div>\
					</div>';
            }
            return html;
        }

        function showAll() {
            var h = 78;
            $(".J_CommentList").find(".J_DescContent").each(function() {
                var self = $(this);
                if (self.outerHeight() > h) {
                    var $btn = self.next(".J_ShowAllBar").find('.J_ShowAllBtn');
                    self.css('height', h+'px');
                    $btn.show().one('click', function() {
                        self.css('height', 'auto');
                        $btn.hide();
                    });
                }
            });
        }

        //点击展开全部回复
        $(document).on('click', '.J_ReviewAllComment', function() {
            var $replyHide = $(this).parent().prev("ul").children(".J_ReplyHide");
            $replyHide.show();
            $(this).hide();
            $(this).next(".pagination-review").show();
        });

    })();

    //删除帖子
    function createHtml(tips) {
        var html = '';
        html += '<div class="dialog-box dialog-delete">'+
            '<p class="tips" style="width: 320px;">'+ tips +'</p>'+
            '</div>';
        return html;
    }
    $(document).on("click", "#J_DeletePost" , function() {
        var bbs_id = $("#bbs-host").attr("data-bbs-id");
        var title = "删除帖子",
            tips = "删除此帖子后，其中的所有回复都会被删除。";
        var elem = createHtml(tips);
        var d = dialog({
            title: title,
            fixed: true,
            content: elem,
            button: [
                {
                    value: '删除',
                    callback: function () {
                        $.ajax({
                            type: 'post',
                            url: HB.config.rootPath+"bbs/del_bbs",
                            data: {bbs_id: bbs_id},
                            cache: false,
                            success: function(res) {
                                if(res.code == 100000){
                                    window.location.href=HB.config.rootPath+"bbs";
                                }else {
                                    HB.util.alert(res.tip,1);
                                }
                            }
                        });
                    },
                    autofocus: true
                },
                {
                    value: '取消',
                    callback: function () {
                    }
                }
            ]
        });
        d.showModal();
    });

    //删除帖子的回复
    $(document).on("click", ".J_DeleteComment", function() {
        var $li = $(this).closest(".J_BbsComment");
        var comment_id = $li.attr("data-comment-id"),
            reader_id = $li.attr("data-reader-id");
		var title = "删除帖子评论",
            tips = "删除此帖子评论后，其中此评论所有回复都会被删除。";
        var elem = createHtml(title, tips);
		var d = dialog({
            title: ' ',
            fixed: true,
            content: elem,
            button: [
                {
                    value: '删除',
                    callback: function () {
                        $.ajax({
							type: 'post',
							url: HB.config.rootPath + "bbs/del_bbs_comment",
							data: {
								comment_id: comment_id ,
								reader_id: reader_id
							},
							cache: false,
							success: function(res) {
								if(res.code == 100000){
									HB.util.alert('删除成功',1);
									$li.remove();
									//修改回复数
									$("#J_CommentNum").text(parseInt($("#J_CommentNum").text())-1);
								}else {
									HB.util.alert(res.tip,1);
								}
							}
						});
                    },
                    autofocus: true
                },
                {
                    value: '取消',
                    callback: function () {
                    }
                }
            ]
        });
        d.showModal();
    });

    //删除帖子的回复内容
    $(document).on("click", ".J_DeleteCommentReply", function() {
        var $li = $(this).closest(".J_ReviewComment");
        var bbs_id = $("#bbs-host").attr("data-bbs-id"),
            reply_id = $li.attr("data-reply-id"),
			bbs_id_other=$(".J_BbsComment").attr("data-bbs-id");
		if(typeof(bbs_id)=="undefined"){
			bbs_id = bbs_id_other;
		}
		var title = "删除帖子评论的回复",
            tips = "确认删除此帖子评论的回复。";
        var elem = createHtml(title, tips);
		var d = dialog({
            title: ' ',
            fixed: true,
            content: elem,
            button: [
                {
                    value: '删除',
                    callback: function () {
                        $.ajax({
							type: 'post',
							url: HB.config.rootPath+"bbs/del_bbs_comment_reply",
							data: {
								bbs_id: bbs_id ,
								reply_id: reply_id
							},
							cache: false,
							success: function(res) {
								if(res.code == 100000){
									HB.util.alert('删除成功',1);
									$li.remove();
								}else {
									HB.util.alert(res.tip,1);
								}
							}
						});
                    },
                    autofocus: true
                },
                {
                    value: '取消',
                    callback: function () {
                    }
                }
            ]
        });
        d.showModal();
    });
	
	//禁言
    $(document).on("click", ".J_Forbid", function() {
        var self = $(this);
        var forbid_type = self.attr("data-type");
        var reader_id,bbs_type;
		bbs_type = $('#bbs-detail').attr('data-bbstype');
        if (forbid_type == 0) {
			reader_id = self.closest("li").attr("data-reader-id");
        } else if (forbid_type == 1) {
			reader_id = self.closest("li").attr("data-reader-id");
        } else if(forbid_type == 2){
			reader_id = self.closest(".J_ReviewComment").attr("data-reader-id");
		}
        var title, tips, elem, d;
        if (!self.hasClass("done")) {
            $("#J_TimeList li:first").trigger("click");
            elem = document.getElementById("J_ForbidBox");
            d = dialog({
                title: '',
                fixed: true,
                content: elem,
                button: [
                    {
                        value: '禁言',
                        callback: function () {
                            var forbid_time = $("#J_SelectTime").attr("data-time");
                            $.ajax({
                                type: 'post',
                                url: HB.config.rootPath + "bbs/blocked_bbs",
                                data: {
                                    reader_id: reader_id, forbid_type:forbid_type ,bbs_type:bbs_type,forbid_time:forbid_time
                                },
                                cache: false,
                                success: function (res) {
                                    if (res.code == 100000) {
                                        var btn_forbid = $("[data-reader-id='"+ reader_id +"'] .J_Forbid[data-type='"+ forbid_type +"']");
                                        btn_forbid.addClass("done").html("解禁");
                                    } 
                                    HB.util.alert(res.tip, 1);
                                }
                            });
                        },
                        autofocus: true
                    },
                    {
                        value: '取消',
                        callback: function () {
                        }
                    }
                ]
            });
            d.showModal();
        } else {
            title = "解除禁言";
            tips = "是否解除禁止此用户发言？";
            elem = createHtml(tips);
            d = dialog({
                title: ' ',
                fixed: true,
                content: elem,
                button: [
                    {
                        value: '解禁',
                        callback: function () {
                            $.ajax({
                                type: 'post',
                                url: HB.config.rootPath + "bbs/unblocked_bbs",
                                data: {reader_id: reader_id, forbid_type:forbid_type , bbs_type:bbs_type},
                                cache: false,
                                //error: function() {
                                //    var res = {};
                                //    res.code = 100000;
                                //    if(res.code == 100000){
                                //        self.removeClass("done").html("禁言");
                                //    }else {
                                //        HB.util.alert(res.tip,1);
                                //    }
                                //},
                                success: function(res) {
                                    if(res.code == 100000){
                                        //self.removeClass("done").html("禁言");
										var btn_forbid = $(".J_Forbid[data-reader='"+ reader_id +"']");
                                        btn_forbid.removeClass("done").html("禁言");
                                    }
									 HB.util.alert(res.tip,1);
                                }
                            });
                        },
                        autofocus: true
                    },
                    {
                        value: '取消',
                        callback: function () {
                        }
                    }
                ]
            });
            d.showModal();
        }
    });
	
	//置顶
    $(".J_BtnTop").on("click", function () {
        var self = $(this);
        var bbs_id = $("#bbs-host").attr("data-bbs-id");
        var title, tips, elem, d;
        if (!self.hasClass("done")) {
            title = "置顶此贴";
            tips = "你是否要对此贴设置在本区置顶？";
            elem = createHtml(tips);
            d = dialog({
                title: title,
                fixed: true,
                content: elem,
                button: [
                    {
                        value: '置顶',
                        callback: function () {
                            $.ajax({
                                type: 'POST',
                                url: HB.config.rootPath + "bbs/set_top",
                                data: {bbs_id: bbs_id,set_top:1},
                                cache: false,
                                success: function (res) {
                                    if (res.code == 100000) {
                                        self.addClass("done").html("取消置顶");
                                        $(".J_BBSTitle").append('<i class="top"></i>');
                                    } 
									HB.util.alert(res.tip, 1);
                                }
                            });
                        },
                        autofocus: true
                    },
                    {
                        value: '取消',
                        callback: function () {
                        }
                    }
                ]
            });
            d.showModal();
        } else {
            title = "取消置顶";
            tips = "你是否要取消此贴在本区置顶？";
            elem = createHtml(tips);
            d = dialog({
                title: title,
                fixed: true,
                content: elem,
                button: [
                    {
                        value: '取消置顶',
                        callback: function () {
                            $.ajax({
                                type: 'POST',
                                url: HB.config.rootPath + "bbs/set_top",
                                data: {bbs_id: bbs_id,set_top:0},
                                cache: false,
                                success: function (res) {
                                    if (res.code == 100000) {
                                        self.removeClass("done").html("置顶");
                                        $(".J_BBSTitle .top").remove();
                                    } 
									HB.util.alert(res.tip, 1);
                                }
                            });
                        },
                        autofocus: true
                    },
                    {
                        value: '返回',
                        callback: function () {
                        }
                    }
                ]
            });
            d.showModal();
        }
    });
	
    //画师区发帖选择分类
    $("#J_SelectType").on("click", function() {
        $("#J_TypeList").show();
    });
    $("#J_TypeList").on("click", "li", function() {
        //console.log($(this).text());
        var type = $(this).text();
        $("#J_SelectType").css("color","#333").text(type);
        $(this).parent().hide();
    });
    
  //画师区发帖选择分类
    $("#J_SelectType").on("click", function () {
        if ($(this).hasClass("open")) {
            $(this).removeClass("open");
            $("#J_TypeList").hide();
        } else {
            $(this).addClass("open");
            $("#J_TypeList").show();
        }
    });
    $("#J_TypeList").on("click", "li", function () {
        var type = $(this).text(),
            ind = $(this).index() + 1;
        $("#J_SelectType").css("color", "#333").text(type).attr("data-type", ind).removeClass("open");
        $(this).parent().hide();
    });

    //画师区发表帖子
    $(document).on("click", "#J_PainterSubmit", function () {
        var bbs_type = $("#bbs_type").val();
        var bbs_title = $("#J_BbsTitle").val();
        var paint_type = $("#J_SelectType").attr("data-type");
        var editor_content = $("#editor_content").html();
        if (!HB.userinfo.tel_num && !HB.userinfo.license) {
            HB.util.identifyDialog(HB.urlinfo.redirect);
            return;
        } 
        if (!HB.userinfo.tel_num && HB.userinfo.license && HB.userinfo.redis_license) {
        	HB.util.alert("请耐心等待，我们会在12小时内进行实名制备案。谢谢您的配合！", 3);
            return;
        }
        var validate_bbs_title = bbs_title.replace(/<[^>]+>|&[^>]+;/g,"").trim();
        var validate_editor_content = editor_content.replace(/<[^>]+>|&[^>]+;/g,"").trim();
        if (validate_bbs_title.length == 0 || validate_editor_content.length == 0){
            HB.util.alert('不能发空贴哦~');
            return;
        }
        if (paint_type == 0){
            HB.util.alert('请选择分类~');
            return;
        }
        if (HB.userinfo.reader_id) {
            $.ajax({
                url: HB.config.rootPath + 'bbs/add_bbs',
                data: {
                    bbs_type: bbs_type,
                    bbs_title: bbs_title,
                    paint_type: paint_type,
                    bbs_content:editor_content,
                    csrf_token:csrf_token
                },
                success: function (res) {
                    if (res.code == 100000) {
                        HB.util.alert(res.tip,1);
                        setTimeout(function () {
                            window.location = HB.config.rootPath +'bbs/bbs_detail?bbs_id=' + res.bbs_id;
                        },1000);
                    }
                    else {
                        HB.util.alert(res.tip,1);
                    }
                }
            });
        } else {
            HB.util.loginDialog();
        }
    });
});