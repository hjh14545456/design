/*
 *banner (c) 2013
 * 2014-10-20 
 * 库存布市场新增 gobtn 属性 //liweifeng
 */
(function($, undefined) {
	function Slider(ele, opts) {
		this.ele = $(ele);
		this.current = -1;
		this.next = 0;
		this.prev = 0;
		this.animate = false;
		this.width = 0;
		this.height = 0;
		this.container = null;
		this.number = 0;
		this.timer = null;
		this.page = null;
		this.opts = $.extend({
			auto: true,
			/*
			 *@Property: {Number} style
			 *	speed - 轮播速度
			 */
			speed: 5000,

			/*
			 *@Property: {String} style
			 *	scroll - 滚动
			 *	filter - 滤镜
			 */
			style: 'filter',
			/*
			 *@Property: {String} direction
			 *	vertical - 竖向
			 *	horizontal - 横向
			 */
			direction: 'horizontal',
			/*
			@Property: {Bool} page
			*   whether show the page number
			*/
			page: true,
			title: [],
			gobtn: false,
			prev: ".prev",
			next: ".next",
			/*
			@Property: {Bool} pageOptions
			*   
			*/
			pageOptions: {

			}
		}, opts);

		this.init();
	}

	Slider.prototype = {
		//构建页面DOM
		init: function() {
			this.width = this.ele.width();
			this.height = this.ele.height();
			this.container = this.ele.children("ul");
			this.list = this.container.find("li");
			this.number = this.list.length;

			this.next = this.ele.next("div");
			this.nextWidth = this.next.width();
			this.nextHeight = this.next.height();
			this.nextContainer = this.next.children("ul");

			if (this.number < 2) return;

			var _this = this;
			//分页索引
			if (this.opts.page) {
				var page = this.page = $("<div>");
				var pageTitle = false;

				page.addClass("act-page");

				if (_this.list.eq(0).attr("data-title")) {
					pageTitle = true;
				}

				function _click(index) {
					return function() {
						//_this.resort(index);
						_this.move(index);
					};
				}

				for (var i = 0; i < this.number; i++) {
					var title;
					if (pageTitle) {
						title = _this.list.eq(i).attr("data-title");
					} else {
						title = i + 1;
					}

					$('<span><a href="javascript:void(0)">' + title + '</a></span>').appendTo(page)
						.bind("click", _click(i));
				}

				_this.ele.append(page);
			}

			if (this.opts.goBtn) {
				this.ele.find(this.opts.next).bind('click',function(){
					_this.move(_this.next);
				});
				this.ele.find(this.opts.prev).bind('click',function(){
					_this.move(_this.prev);
				});
			}

			this.move(0);

			if (this.opts.auto) {
				this.start();
				this.ele.bind("mouseover", function() {
					_this.stop();
				});
				this.ele.bind("mouseout", function() {
					_this.start();
				});
			}
		},
		move: function(index) {
			var _this = this;
			//console.log(_this.animate);
			if (_this.animate || this.current == index) {
				return
			}

			this.markPage(index);
			
			_this.animate = true;

			var opts = _this.opts;
			if (opts.style == "scroll" && opts.direction == "vertical") {
				_this.container.animate({
					marginTop: this.current * (-_this.height)
				}, 700, function() {
					_this.animate = false;
					//_this.resort(index);
				});
			} else if(opts.style == "scroll" && opts.direction == "horizontal") {
				this.container.css('width',this.width*this.number);
				this.nextContainer.css('height',this.nextHeight*this.number);
				_this.container.animate({
					marginLeft: this.current * (-_this.width)
				}, 700, function() {
					_this.animate = false;
					//_this.resort(index);
				});
				_this.nextContainer.animate({
					marginTop: this.current * (-_this.nextHeight)
				}, 700, function() {
					_this.animate = false;
					//_this.resort(index);
				});
			} else if(opts.style == "filter") {
				$(this.list[index]).fadeIn().siblings().hide();
				_this.animate = false;
			}
		},
		start: function() {
			var _this = this;
			_this.timer = window.setInterval(function() {
				// console.log(_this);
				_this.move(_this.next);
			}, _this.opts.speed);

		},
		stop: function() {
			if (!this.timer) {
				return;
			}
			window.clearInterval(this.timer);
			this.timer = null;
		},
		markPage: function(index) {
			this.page.children().eq(this.current).removeClass("selected");
			this.current = index;
			this.next = this.current + 1 >= this.number ? 0 : this.current + 1;
			this.prev = this.current - 1 < 0 ? this.number - 1 : this.current - 1;
			this.page.children().eq(this.current).addClass("selected");
		},
		resort: function(index) {
			// var container = this.ele.children("ul");
			// var list = container.find('li');
			// var len = list.length;
			// if (len > 2) {
			// 	var last = list.eq(len - 1);
			// 	var clone = last.clone();
			// 	last.remove();
			// 	clone.prependTo(container);
			// } else {

			// }

			this.container.css("margin-top", -this.height);
		},
		destroy: function() {
			this.ele = null;
			this.container = null;
			this.timer = null;
			this.animate = null;
			this.page = null;
		}
	};

	$.fn.qfcslider = function(opts) {
		return new Slider(this.get(0), opts);
	};
})(jQuery);