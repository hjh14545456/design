//颜文字
(function($, faceData,undefined) {
	var configs = {
		classs: 'J_FaceDialog'
	};

	function faceImg(ele, cfg) {
		this.box = $(ele);
		this.ele = this.box.find(".J_FaceDialog");
		this.hdWidth = 0;
		this.tmpData = [];
		this.tmpArrange = 0;

		this.init(cfg);
	}

	$.extend(faceImg.prototype, {
		init: function(cfg) {
			this.config = $.extend(true, {}, configs, cfg);

            this.creatHtml(faceData);
            this._cal();
            this._bindEvent();
		},
		creatHtml: function(faceData) {
			var html = '';
			html += this._creatCateHtml(faceData);
			html += this._creatFaceHtml(faceData);
			// console.log(html);
			this.ele.html(html);
			this._rearrange();
		},
		_creatCateHtml: function(faceData) {
			var html = '';
		    html += '<div class="hd">';
				html += '<a class="prev" href="javascript:;"><b></b></a>';
				html += '<ul>';
				for (var i=0; i<faceData.cate.length; i++) {
					html += '<li><a href="javascript:;"';
					if (i==0) {
						html += ' class="selected"';
					}
					html += '>' + faceData.cate[i] + '</a></li>';
				}
				html += '</ul>';
				html += '<a class="next" href="javascript:;"><b></b></a>';
			html += '</div>';

			return html;
		},
		_creatFaceHtml: function(faceData) {
			var html = '';
		    html += '<div class="bd">';
		    for (var i=0; i<faceData.faceList.length; i++) {
		    	html += '<div class="cnt J_mCustomScrollbar">';
		    	// if (i==0) {
					// html += '<div class="cnt J_mCustomScrollbar">';
		    	// } else {
					// html += '<div style="display:none" class="cnt J_mCustomScrollbar">';
		    	// }
				for(var j=0; j<faceData.faceList[i].length; j++) {
					html += '<a href="javascript:;" title="'+faceData.faceList[i][j].title +' '+ faceData.faceList[i][j].face +'">'+faceData.faceList[i][j].face+'</a>';
				}
				html += '</div>';
		    }
			html += '</div>';

			return html;
		},
		_bindEvent: function() {
			var self = this;
			var node = this.ele;
			node.find('.hd li a').click(function() {
				node.find('.hd a').removeClass('selected');
				$(this).addClass('selected');
				var index = $(this).parent().index();
				$(node.find('.bd .cnt').get(index)).show().siblings().hide();
			});

			node.find('.bd a').click(function() {
				self.returnFace = $(this).text();
				if (self.config.area.length) {
					var v = self.config.area.val() + self.returnFace;
					self.config.area.val(v);
					self.config.area.trigger('focus');
				}
			});

			node.find('.hd .prev').click(function() {
				if (parseInt(node.find(".hd ul").css("margin-left")) == 0) return false;
				node.find(".hd ul").animate({
					'margin-left': 0
				}, 'normal');
			});
			node.find('.hd .next').click(function() {
				node.find(".hd ul").animate({
					'margin-left': -(self.hdWidth - self.width + 2*self.btnWidth)
				}, 'normal');
			});

			// debugger;
			self.box.hover(function(){
				self.ele.css("visibility", 'visible');
			}, function() {
				self.ele.css("visibility", 'hidden');
			});
		},
		_cal: function() {
			var self = this;
			for(var i=0; i<self.ele.find(".hd li").length; i++) {
				self.hdWidth += $(self.ele.find(".hd li")[i]).outerWidth();
			}
			self.width = self.ele.find('.hd').outerWidth();
			self.btnWidth = self.ele.find(".hd .next").outerWidth();

			self.ele.find(".hd ul").css('width', self.hdWidth);
		},
		_queue: function(num) {
			if (this.tmpArrange + num > 5) {
				return false;
			} else if (this.tmpArrange + num == 5) {
				this.tmpArrange = 0;
			} else {
				this.tmpArrange = num + this.tmpArrange;
			}
			return true;
		},
		_rearrange: function() {
			// debugger;
			var self = this;
			this.ele.find('.cnt').each(function(index) {
				if (index != 0) {
					$(this).hide();
				}
				self.tmpData = [];
				this.tmpArrange = 0;
				var cnt = $(this);

				cnt.find('a').each(function() {
					var arr = classNameHandle($(this).outerWidth());
					$(this).addClass(arr[1]);
					// if (self._queue(arr[0]) == false) {
					// 	self.tmpData.push([
					// 		arr[0],
					// 		$(this).clone()
					// 	]);
					// }
				});

			});

			function classNameHandle(x) {
				var arrClass = ['l1', 'l2', 'l3', 'l4', 'l5'];
				var arrWidth = [77, 155, 233, 311, 389];
				
				for (var i = arrWidth.length; i >= 0; i--) {
					if (x > arrWidth[i] || (x < arrWidth[i] && x >= arrWidth[i-1]) || i == 0) {

						return [i+1, arrClass[i]];
					}
				}

			}
		}
	});


	$.fn.qfcfaceimg = function(opt) {
		return new faceImg($(this).get(0), opt);
	}
})(jQuery, faceData);