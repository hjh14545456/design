$(function(){
    var csrf_token = HB.util.Cookie.get('login_token');
    var app_csrf_token = HB.util.Cookie.get('app_csrf_token');
    //计算文本域字数
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

    //评论
  //评论
	(function() {
		var $commentList = $(".J_CommentList");

		//首次加载
		setTimeout(function(){
			//loadComment($commentList, url.get_review_list_all, {book_id: HB.book.book_id});
			loadComment($commentList, url.get_comment_list_all, {type: 1,activity_id :HB.activity.activity_id});
		}, 2000);

        var url = {
        		add_review: HB.config.rootPath + 'anniversary/add_comment',
    			add_review_comment: HB.config.rootPath + 'anniversary/add_review_comment',
    			add_review_comment_reply: HB.config.rootPath + 'anniversary/add_review_comment',
    			get_comment_list_all: HB.config.rootPath + 'anniversary/get_comment_list_all',
    			get_comment_reply_list: HB.config.rootPath + 'anniversary/get_comment_reply_list', //第二层评论
    			//get_reply_list_all: HB.config.rootPath + 'book/get_reply_list_all' //第三层评论
    		};

      //加载评论列表
		function loadComment(ele, url, data, jump) {
			ele.load(url, data, function() {
				showAll();
			});
		    if (jump == 1){
		        $('html,body').animate({scrollTop: ele.offset().top - 400}, 800);
		    }
		}

        //发表评论
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
                    activity_id: HB.activity.activity_id,
                    review_content: cnt,
					csrf_token:csrf_token,
					app_csrf_token:app_csrf_token,
                },
                beforeSend: function() {
                    self.prop('disabled', true);
                },
                complete: function() {
                    self.prop('disabled', false);
                },
                success: function(res) {
                    if (res.code == 100000) {
                        loadComment($commentList, url.get_comment_list_all, {type: 1,activity_id :HB.activity.activity_id}, 1);
                        $input.val("").trigger('keyup');
                        $('.J_Ctime').addClass("current").siblings().removeClass("current");
                        //手动修改评论数
                        $("#J_CommentNum").text(parseInt($("#J_CommentNum").text())+1);
                    } else {
                        HB.util.alert(res.tip,1);
                    }
                }
            });
        });
        
      //第一层评论的回复框
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

		//发表第一层评论的评论
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

			var $bookChapterComment = self.closest('.J_BookChapterComment'),
				$input = $bookChapterComment.find(".J_CommentInput"),
				$li = self.closest('.J_Review'),
				
				$reply = $li.find(".J_FormReply"),
				$bd = $li.find(".bd"),
				$comment_list_in = $bd.find(".comment-list-in"),
				comment_id = $li.attr('data-review-id'),
				comment_content = $.trim($input.val());
			    old_reader_id=$li.attr('data-reader-id');
			$.ajax({
				type: "POST",
				url: url.add_review_comment,
				data: {
					comment_id: comment_id,
					reply_content: comment_content,
					old_reader_id: old_reader_id,
                    csrf_token:csrf_token,
                    app_csrf_token:app_csrf_token,
				},
				beforeSend: function() {
					self.prop('disabled', true);
				},
				complete: function() {
					self.prop('disabled', false);
				},
				success: function(res) {
					if (res.code == 100000) {
						if ($reply.hasClass("num")) {
							$reply.find('i').text(parseInt($reply.find('i').text()) + 1);
						} else {
							$reply.addClass("num").html("<i>1</i>");
						}
						var url_comment = url.get_comment_reply_list;
						var $commentList2 = $("#commentid_" + comment_id);
						$commentList2.load(url_comment, {comment_id: comment_id}, function() {
							showAll();
						});
						$bookChapterComment.remove();
						HB.util.alert(res.tip,1);
						$('html,body').animate({scrollTop:$commentList2.offset().top - 400}, 800);
					} else {
						HB.util.alert(res.tip);
					}
				}
			});
		});

		//第二层评论的回复框
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
			var html = replyComment('add_review_comment_reply', $li.find(".name a").text());
			$state.after(html);
			$state.next().find(".J_Face").qfcfaceimg({area:$state.next(".J_BookChapterComment").find('.J_CommentInput')});

			HB.util.require('jquery.nicescroll', function(){
				$state.next().find(".J_Face").find(".J_mCustomScrollbar").each(function() {
					var option = $.extend({
						cursorcolor: '#c8c8c8'
					}, $(this).data(option));
					$(this).niceScroll(option);
				});
			});
		});

		//发表第二层评论的评论
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

			var $bookChapterComment = self.closest('.J_BookChapterComment'),
				$input = $bookChapterComment.find(".J_CommentInput"),
				$li = self.closest('.J_Review'),
				//$bd = $li.closest(".bd"),
				$reply = $li.find(".J_FormReply"),
				//$comment_list_in = $bd.find(".comment-list-in"),
				comment_id = $li.attr('data-review-id'),
				reply_content = $.trim($input.val()),
				old_reader_id = $li.attr('data-reader-id');
			$.ajax({
				type: 'POST',
				url: url.add_review_comment_reply,
				data: {
					comment_id: comment_id,
					reply_content: reply_content,
					old_reader_id: old_reader_id,
                    csrf_token:csrf_token,
                    app_csrf_token:app_csrf_token,
				},
				beforeSend: function() {
					self.prop('disabled', true);
				},
				complete: function() {
					self.prop('disabled', false);
				},
				success: function(res) {
					if (res.code == 100000) {
						if ($reply.hasClass("num")) {
							$reply.find('i').text(parseInt($reply.find('i').text()) + 1);
						} else {
							$reply.addClass("num").html("<i>1</i>");
						}
						var url_comment = url.get_comment_reply_list;
						var $commentList2 = $("#commentid_" + comment_id);
						$commentList2.load(url_comment, {comment_id: comment_id}, function() {
							showAll();
						});
						$bookChapterComment.remove();
						HB.util.alert(res.tip,1);
						$('html,body').animate({scrollTop:$commentList2.offset().top - 400}, 800);
					} else {
						HB.util.alert(res.tip);
					}
				}
			});
		});

		//回复框模板
		//回复框模板
		function replyComment(type, at) {
			var html = '';
			if (type == 'add_review_comment') {
				html += '\
					<div class="J_BookChapterComment book-chapter-comment">\
						<textarea class="J_CommentInput comment-input" maxlength="500" placeholder="回复这条评论："></textarea>\
						<div class="comment-operate">\
							<div class="J_Face comment-face ly-fl">\
								<div class="face-btn"><i></i>颜文字</div>\
								<div class="J_FaceDialog face-dialog" style="display:block;visibility:hidden"></div>\
							</div>\
							<div class="ly-fr"><span class="J_CommentWordsCount">0</span>/<span class="J_CommentWordsCountLimit">100</span> <a href="javascript:;" class="J_AddReviewComment btn btn-md btn-warning ly-ml10">回复</a></div>\
						</div>\
					</div>';
			} else if (type == 'add_review_comment_reply') {
				html += '\
					<div class="J_BookChapterComment book-chapter-comment">\
						<textarea class="J_CommentInput comment-input" maxlength="500" placeholder="@'+at+'"></textarea>\
						<div class="comment-operate">\
							<div class="J_Face comment-face ly-fl">\
								<div class="face-btn"><i></i>颜文字</div>\
								<div class="J_FaceDialog face-dialog" style="display:block;visibility:hidden"></div>\
							</div>\
							<div class="ly-fr"><span class="J_CommentWordsCount">0</span>/<span class="J_CommentWordsCountLimit">100</span> <a href="javascript:;" class="J_AddReviewCommentReply btn btn-md btn-warning ly-ml10">回复</a></div>\
						</div>\
					</div>';
			}
			return html;
		}

        //排序规则
        $(document).on("click", ".J_Ctime", function() {
        	var $commentList = $(".J_CommentList");
            var $this=$(this);
            if ( $this.hasClass('current')) return;
            $(this).addClass("current").siblings().removeClass("current");
            loadComment($commentList,url.get_comment_list_all, {type: 1,activity_id :HB.activity.activity_id},1);
        });

        $(document).on("click", ".J_Likes", function() {
        	var $commentList = $(".J_CommentList");
            var $this=$(this);
            if ( $this.hasClass('current')) return;
            $(this).addClass("current").siblings().removeClass("current");
            loadComment($commentList,url.get_comment_list_all, {type: 2,activity_id :HB.activity.activity_id},1);
        });

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


    //评论 赞黑
    function commentOpt(type, id, self) {
        // if (self.hasClass('done')) return;
        if (self.attr("disabled")) return;

        var url = {
            zanComment:	'anniversary/like_comment',
            delComment:	'anniversary/del_like_comment'
        };		
        $.ajax({
            url: HB.config.rootPath + url[type],
			data: {
				comment_id: id,
				csrf_token:csrf_token,
				app_csrf_token:app_csrf_token,
			},
            beforeSend: function() {
                self.attr("disabled", true);
            },
            complete: function() {
                self.attr("disabled", false);
            },
            // error: function() {
            // 	var res = {};
            // 	res.code = 100000;
            // 	res.tip = 100000;
            // 	if (res.code == 100000) {
            // 		self.addClass("done").find('i').text(1+parseInt(self.find('i').text()));
            // 		if (sibling.hasClass('done')) {
            // 			sibling.removeClass('done').find('i').text(parseInt(sibling.find('i').text())-1);
            // 		}
            // 	} else {
            // 		HB.util.alert(res.tip);
            // 	}
            // },
            success: function(res) {
                if (res.code == 100000) {
                	if (type == 'zanComment'){
						self.addClass("done");
						if (self.hasClass('num')) {
							self.find('i').text(parseInt(self.find('i').text()) + 1);
						} else {
							self.addClass("num").html("<i>1</i>");
						}
					}else if (type == 'delComment'){
						self.removeClass('done');
						var num = parseInt(self.find('i').text()) - 1;
						if (num == 0) {
							self.removeClass("num").html("点赞");
						} else {
							self.find('i').text(num);
						}
					}
				} else {
					HB.util.alert(res.tip,1);
				}
            }
        })
    }
    $(document).on("click", ".J_CommentOpt_A .J_Zan", function() {
        if (HB.userinfo.reader_id==0) {
            HB.util.loginDialog();
            return;
        }
        var self = $(this);
        var id = self.closest("li").attr('data-review-id');

        self.hasClass('done') ? commentOpt('delComment', id, self) : commentOpt('zanComment', id, self);
    });


    $(document).on("click", ".J_CommentOpt_A .done", function() {
        if (HB.userinfo.reader_id==0) {
            HB.util.loginDialog();
            return;
        }
        var self = $(this);
        var id = self.closest("li").attr('data-review-id');

        commentOpt('delComment', id, self);
    });
    
	//点击展开全部回复
	$(document).on('click', '.J_ReviewAllComment', function() {
		var $this = $(this),
			$replyHide = $this.parent().siblings(".comment-list-in").find("li.J_ReplyHide");
		$replyHide.show();
		$this.hide();
		if ($this.next(".pagination-review").length) {
			$this.next(".pagination-review").show();
		}
	});
});