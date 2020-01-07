//小说详情页
$(function(){
    var csrf_token = HB.util.Cookie.get('login_token');
	//查看全部章节
	$("#J_ReadAll").click(function() {
		$(this).parent().find(".book-chapter-box").removeClass('less');
		$(this).remove();
	});
	
	//作者信息
	(function () {
		var step = 0;
		$(".J_BookListBox a").on("click", function () {
			var self = $(this),
				book_list_box = self.closest(".J_BookListBox"),
				book_list = book_list_box.find(".book-list"),
				left = parseInt(book_list.css("left")),
				li_num = book_list.find("li").length,
				num = Math.floor(li_num / 5),
				distance = 500;
			if (self.hasClass("prev")) {
				if (left >= 0) {
					return false;
				}
				step -= 1;
				book_list.animate({left: "+="+ distance +"px"}, 600);
			} else if (self.hasClass("next")) {
				if (step >= num) {
					return false;
				}
				step += 1;
				book_list.animate({left: "-="+ distance +"px"}, 600);
			}
		});
	})();
	//打赏作者
	/*$("#J_BtnDaShang").click(function() {
        if (HB.userinfo.reader_id) {
            var self = $(this);
            if(self.prop('disabled')) return false;
            var hlb = $('input[name=hlb][checked]').val();

            $.ajax({
                url: HB.config.rootPath + 'book/reward',
                data: {book_id: HB.book.book_id,hlb:hlb,csrf_token:csrf_token},
                beforeSend: function() {
                    self.prop('disabled', true);
                },
                success: function (res) {
                    if (res.code == 100000) {
                        var tip = res.tip ? res.tip : '打赏成功！';
                        HB.util.alert(tip,1);
						//  欢乐币余额
                        $(".J_HLB").text(res.data.prop_info.rest_hlb);
						//  月票余量
                        $(".J_Stock").text(res.data.prop_info.rest_yp);
                        if( typeof load_right === 'function' ) {
                            load_right();
                        }
                    } else {
                        HB.util.alert(res.tip,1);
                    }
                },
                complete: function() {
                    self.prop('disabled', false);
                }
            });
        } else {
            HB.util.loginDialog();
        }
	});*/


	//评论
	//字数  事件委托
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

	// $(".J_Face").qfcfaceimg();

	//评论
	(function() {
		//首次加载
		// setTimeout(function(){
		// 	loadComment(url.get_review_list_all, {book_id: HB.book.book_id});
		// }, 2000);


		$commentList = $(".J_CommentList");

		var url = {
			get_review_list_all: HB.config.rootPath + 'book/get_review_list_all',
			add_review: HB.config.rootPath + 'book/add_review',
			add_review_comment: HB.config.rootPath + 'book/add_review_comment',
			add_review_comment_reply: HB.config.rootPath + 'book/add_review_comment_reply'
		};

		//加载书评列表
		function loadComment(url, data, jump) {
			$commentList.load(url, data, function() {
				showAll();
			});
		    if (jump == 1){
		        $('html,body').animate({scrollTop:$commentList.offset().top-400}, 800);
		    }
		}

		//发表书评
		$(document).on("click", '.J_ReplayBtn', function() {
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

			var $input = self.closest('.J_BookChapterComment').find(".J_CommentInput");
			var cnt = $input.val();
			$.ajax({
				url: url.add_review,
				data: {
					book_id: HB.book.book_id,
					review_content: cnt,
					csrf_token:csrf_token
				},
				beforeSend: function() {
					self.prop('disabled', true);
				},
				complete: function() {
					self.prop('disabled', false);
				},
				// error: function() {
				//	var res = {};
				//	res.code = 100000;
				//	if (res.code == 100000) {
				//		loadComment(url.get_review_list_all, {book_id: HB.book.book_id}, 1);
				//		$input.val("").trigger('keyup');
				//	}
				// },
				success: function(res) {
					if (res.code == 100000) {
						loadComment(url.get_review_list_all, {book_id: HB.book.book_id}, 1);
						HB.util.alert(res.tip,1);
						$input.val("").trigger('keyup');
						//手动修改评论数
						$("#J_CommentNum").text(parseInt($("#J_CommentNum").text())+1);
					} else {
						HB.util.alert(res.tip);
					}
				}
			});
		});

		//书评回复框
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
            var $state = $(this).closest('.J_State');

			if ($state.next(".J_BookChapterComment").length) {
				$state.next(".J_BookChapterComment").remove();
				return false;
			}
			var html = replyComment('add_review_comment');
			$state.after(html);

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

		//发表书评的评论
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
			var $li = self.closest('.J_Review');
			var $reply = $li.find(".J_FormReply");
			$.ajax({
				url: url.add_review_comment,
				data: {
					review_id: $li.attr('data-review-id'),
					comment_content: $input.val(),
					csrf_token:csrf_token
				},
				beforeSend: function() {
					self.prop('disabled', true);
				},
				complete: function() {
					self.prop('disabled', false);
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
						$reply.addClass("done");
						if ($reply.hasClass("num")) {
							$reply.find('i').text(parseInt($reply.find('i').text()) + 1);
						} else {
							$reply.addClass("num").html("<s></s><i>1</i>");
						}
						var url2 = HB.config.rootPath + 'book/get_comment_list_all';
						url2 = url2+'/'+1;
						var review_id=$li.attr('data-review-id');
						$commentList2=$("#review_id"+review_id);
						$commentList2.load(url2, {review_id: review_id}, function() {
							showAll();
						});
						$('.J_BookChapterComment').not('#book_review_box').remove();
						HB.util.alert(res.tip,1);
						$('html,body').animate({scrollTop:$commentList2.offset().top-400}, 800);
						// var curr_page = $("#curr_page").val();
						// loadComment(url.get_review_list_all+'/'+curr_page, {book_id: HB.book.book_id}, 1);
						// $bookChapterComment.remove();
					} else {
						HB.util.alert(res.tip);
					}
				}
			});
		});


		//书评的评论回复框
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
            var $state = $(this).closest('.J_State');
			var $li = $(this).closest('.J_Review_Comment');

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


		//发表书评的评论的回复 
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
			var $li = self.closest('.J_Review_Comment');
			var $reply = $li.find(".J_FormAddReviewComment");
			$.ajax({
				url: url.add_review_comment_reply,
				data: {
					comment_id: $li.attr('data-comment-id'),
					reply_content: $input.val(),
					old_reader_id: $li.attr('data-reader-id'),
					csrf_token:csrf_token
				},
				beforeSend: function() {
					self.prop('disabled', true);
				},
				complete: function() {
					self.prop('disabled', false);
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
						$reply.addClass("done");
						if ($reply.hasClass("num")) {
							$reply.find('i').text(parseInt($reply.find('i').text()) + 1);
						} else {
							$reply.addClass("num").html("<s></s><i>1</i>");
						}
						var url3 = HB.config.rootPath + 'book/get_reply_list_all';
						url3 = url3+'/'+1;
						var comment_id=$li.attr('data-comment-id');
						$replyList=$("#commentid_"+comment_id);
						$replyList.show();
						$replyList.load(url3, {comment_id: comment_id}, function() {
							showAll();
						});
						$('.J_BookChapterComment').not('#book_review_box').remove();
						HB.util.alert(res.tip,1);
						$('html,body').animate({scrollTop:$replyList.offset().top-400}, 800);
						// var curr_page = $("#curr_page").val();
						// loadComment(url.get_review_list_all+'/'+curr_page, {book_id: HB.book.book_id}, 1);
						// $bookChapterComment.remove();
					} else {
						HB.util.alert(res.tip);
					}
					
				}
			});
		});

		$(document).on('click', '.J_ReplyHideShow', function() {
			var $parent = $(this).closest('.J_ReviewCommentReply');
			if ($(this).attr('data-open') == 1) {
				$parent.find('.J_ReplyHide').hide();
				$(this).text('点击查看');
				$(this).attr('data-open', 0);
				$(this).prev().show();
				//$(this).next().hide();
			} else {
				$parent.find('.J_ReplyHide').show();
				$(this).text('点击收起');
				$(this).attr('data-open', 1);
				$(this).prev().hide();
				//判断是否显示分页导航
//				var count = parseInt($(this).prev().find("span").text());
//				if(count > 10){
					$(this).next().show();
//				}
			}
		});
		//书评区点击展开全部回复
		$(document).on('click', '.J_ReviewAllComment', function() {
			var $replyHide = $(this).parent().siblings(".comment-list-in").find(".J_Review_Comment.J_ReplyHide");
			$replyHide.show();
			$(this).hide();
			//var count = parseInt($(this).attr("data-count"));
			//if(count > 10){
			$(this).next().show();
			//}
		});

		function replyComment(type, at) {
			var html = '';
			if (type == 'add_review_comment') {
				html += '\
					<div class="J_BookChapterComment book-chapter-comment">\
						<textarea class="J_CommentInput comment-input" maxlength="500" placeholder="回复这条书评："></textarea>\
						<div class="comment-operate">\
							<div class="J_Face comment-face ly-fl">\
								<div class="face-btn"><i></i>颜文字</div>\
								<div class="J_FaceDialog face-dialog" style="display:block;visibility:hidden"></div>\
							</div>\
							<div class="ly-fr"><span class="J_CommentWordsCount">0</span>/500<a href="javascript:;" class="J_AddReviewComment btn btn-md btn-warning ly-ml10">回复</a></div>\
						</div>\
					</div>';
			} else if (type == 'add_review_comment_reply') {
				html += '\
					<div class="J_BookChapterComment book-chapter-comment">\
						<textarea class="J_CommentInput comment-input" maxlength="150" placeholder="@'+at+'"></textarea>\
						<div class="comment-operate">\
							<div class="J_Face comment-face ly-fl">\
								<div class="face-btn"><i></i>颜文字</div>\
								<div class="J_FaceDialog face-dialog" style="display:block;visibility:hidden"></div>\
							</div>\
							<div class="ly-fr"><span class="J_CommentWordsCount">0</span>/150<a href="javascript:;" class="J_AddReviewCommentReply  btn btn-md btn-warning ly-ml10">回复</a></div>\
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

	})();
	//弹窗模板
	function createHtml(title, detail, tips) {
		var html = '';
		html += '<div class="dialog-box dialog-delete" style="width: 290px;text-align: center;">'+
			'<h1 class="title">'+ title +'</h1>' +
			'<p style="padding: 10px 0 0;font-size: 18px;">'+ detail +'</p>' +
			'<p style="padding: 0 0 20px;font-size: 14px;color:#999;">'+ tips +'</p>'+
			'</div>';
		return html;
	}
	
	//删除书评
	$(document).on("click", ".J_Delete" , function() {
		var self = $(this);
		var review_id = self.closest(".J_Review").attr("data-review-id");
		var title = "删除书评",
			detail = "您是否确认删除本条书评？",
			tips = "删除书评后将无法恢复本条书评。";
		var elem = createHtml(title, detail, tips);
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
							url: HB.config.rootPath+"book/del_review",
							data: {review_id: review_id,book_id: HB.book.book_id},
							cache: false,
							success: function(res) {
								if(res.code == 100000){
									self.closest(".J_Review").remove();
									//修改评论数
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

	//删除书评的回复
	$(document).on("click", ".J_DeleteComment" , function() {
		var self = $(this);
		var $li = self.closest('.J_Review');
		var $reply = $li.find(".J_FormReply");
		var comment_id = self.closest(".J_Review_Comment").attr("data-comment-id");
		var title = "删除书评评论",
			detail = "您是否确认删除本条书评评论？",
			tips = "删除后将无法恢复本条书评评论。";
		var elem = createHtml(title, detail, tips);
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
							url: HB.config.rootPath + "book/del_review_comment",
							data: {comment_id: comment_id,book_id: HB.book.book_id},
							cache: false,
							success: function(res) {
								if(res.code == 100000){
									var num = parseInt($reply.find('i').text()) - 1;
									if (num == 0) {
										$reply.removeClass("num").html("<s></s>回复");
									} else {
										$reply.find('i').text(num);
									}
									self.closest(".J_Review_Comment").remove();
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
	//删除书评回复的回复
	$(document).on("click", ".J_DeleteCommentReply" , function() {
		var self = $(this);
		var $li = self.closest('.J_Review_Comment');
		var $reply = $li.find(".J_FormAddReviewComment");
		var reply_id = self.parent().attr("data-comment-reply-id");
		var title = "删除书评评论的回复",
			detail = "您是否确认删除本条书评的回复？",
			tips = "删除后将无法恢复本条书评评论的回复。";
		var elem = createHtml(title, detail, tips);
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
							url: HB.config.rootPath + "book/del_review_comment_reply",
							data: {reply_id: reply_id,book_id: HB.book.book_id},
							cache: false,
							success: function(res) {
								if(res.code == 100000){
									var num = parseInt($reply.find('i').text()) - 1;
									if (num == 0) {
										$reply.removeClass("num").html("<s></s>回复");
									} else {
										$reply.find('i').text(num);
									}
									self.parent().remove();
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
		var reader= self.attr("data-reader");
		var	dataId;
		if (forbid_type == 0) {
			dataId = self.closest(".J_Review").attr("data-review-id");
		} else if (forbid_type == 1) {
			dataId = self.closest(".J_Review_Comment").attr("data-comment-id");
		} else if(forbid_type == 2){
			dataId = self.parent().attr("data-comment-reply-id");
		} else {
			HB.util.alert('重新提交操作',1);
		}
		if (!self.hasClass("done")) {
			$("#J_TimeList li:first").trigger("click");
			var elem = document.getElementById("J_ForbidBox");
			var d = dialog({
				title: ' ',
				fixed: true,
				content: elem,
				button: [
					{
						value: '禁言',
						callback: function () {
							var forbid_time = $("#J_SelectTime").attr("data-time");
							$.ajax({
								type: 'post',
								url: HB.config.rootPath + "book/blocked_bookreview",
								data: {dataId: dataId,forbid_type:forbid_type,book_id: HB.book.book_id,forbid_time: forbid_time},
								cache: false,
								success: function(res) {
									if(res.code == 100000){
										//var btn_forbid = $("[data-reader-id='"+ reader +"'] .J_Forbid[data-type='"+ forbid_type +"']");
										var btn_forbid = $(".J_Forbid[data-reader='"+ reader +"'] ");
										btn_forbid.addClass("done");
										if (forbid_type == 0 || forbid_type == 1) {
											btn_forbid.html("<s></s>已禁言");
										} else if (forbid_type == 2) {
											btn_forbid.html("已禁言");
										}
										//self.addClass("done");
										//self.html("<s></s>已禁言");
										HB.util.alert(res.tip,1);
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
		} else {
			$.ajax({
				type: 'post',
				url: HB.config.rootPath + "book/unblocked_bookreview",
				data: {dataId: dataId,forbid_type:forbid_type,book_id: HB.book.book_id},
				cache: false,
				success: function(res) {
					if(res.code == 100000){
						var btn_forbid = $(".J_Forbid[data-reader='"+ reader +"'] ");
						btn_forbid.removeClass("done");
						if (forbid_type == 0 || forbid_type == 1) {
							btn_forbid.html("<s></s>禁言");
						} else if (forbid_type == 2) {
							btn_forbid.html("禁言");
						}
						//self.removeClass("done");
						//self.html("<s></s>禁言");
						HB.util.alert(res.tip,1);
					}else {
						HB.util.alert(res.tip,1);
					}
				}
			});
		}
	});

	//全本折扣倒计时
	var days = parseInt($(".J_DiscountD").text()),
		hours = parseInt($(".J_DiscountH").text()),
		minutes = parseInt($(".J_DiscountM").text()),
		seconds = parseInt($(".J_DiscountS").text());
	var sec_timer,min_timer,hour_timer,day_timer,
		TimerM,TimerH,TimerD;
	TimerM = setTimeout(function () {
		if (minutes <= 0) {
			minutes = 60;
		}
		minutes--;
		if (minutes < 10) {
			$(".J_DiscountM").text("0" + minutes);
		}else {
			$(".J_DiscountM").text(minutes);
		}
		min_timer = setInterval(function () {
			if (minutes <= 0) {
				minutes = 60;
			}
			minutes--;
			if (minutes < 10) {
				$(".J_DiscountM").text("0" + minutes);
			}else {
				$(".J_DiscountM").text(minutes);
			}
		}, 60 * 1000);
	}, (seconds + 1) * 1000);
	TimerH = setTimeout(function () {
		if (hours <= 0) {
			hours = 24;
		}
		hours--;
		if (hours < 10) {
			$(".J_DiscountH").text("0" + hours);
		}else {
			$(".J_DiscountH").text(hours);
		}
		hour_timer = setInterval(function () {
			if (hours <= 0) {
				hours = 24;
			}
			hours--;
			if (hours < 10) {
				$(".J_DiscountH").text("0" + hours);
			}else {
				$(".J_DiscountH").text(hours);
			}
		}, 60 * 60 * 1000);
	}, minutes * 60 * 1000 + (seconds + 1) * 1000);
	TimerD = setTimeout(function () {
		if (days <= 0) {
			days = 1;
		}
		days--;
		$(".J_DiscountD").text(days);
		day_timer = setInterval(function () {
			if (days <= 0) {
				days = 1;
			}
			days--;
			$(".J_DiscountD").text(days);
		}, 24 * 60 * 60 * 1000);
	},  hours * 60 * 60 * 1000 + minutes * 60 * 1000 + (seconds + 1) * 1000);
	sec_timer = setInterval(function () {
		if (seconds <= 0) {
			seconds = 60;
		}
		seconds--;
		if (seconds < 10) {
			$(".J_DiscountS").text("0" + seconds);
		}else {
			$(".J_DiscountS").text(seconds);
		}
		//倒计时结束
		if (days <=0 && hours <= 0 && minutes <= 0 && seconds <= 0) {
			clearInterval(sec_timer);
			clearInterval(min_timer);
			clearInterval(hour_timer);
			clearInterval(day_timer);
			clearTimeout(TimerM);
			clearTimeout(TimerH);
			clearTimeout(TimerD);
			return false;
		}
	}, 1000);

});