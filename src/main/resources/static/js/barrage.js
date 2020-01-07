/*
 *  弹幕 (c) 2015
 *  data.tsukkomi_list[]
 *  userinfo
 */
+(function($, undefined) {
	function Barrage(ele, opts) {
		this.ele = $(ele);

		//容器宽度
		this.boxWidth = $(window).width();
		this.opts = $.extend({
			
		}, opts);
		
		this.init();
	}

	Barrage.prototype = {
		//初始化泳道
		initChannel: function () {
			var channelCount = 3, channel, top;
			for(var i = 0; i < channelCount; i ++) {
				top = i * 40 + 10;
				channel = $('<div class="barrage-channel" style="top: ' + top + 'px"></div>');
				this._arrChannel.push(channel);
				this.ele.append(channel);
			}
		},

		init: function() {
			var self = this;

			self._arrChannel = []; //泳道dom
			self._barrageDataIndex = 0;//未加入弹幕的数据索引
			self._text = '';//自己发送的内容

			self.ele.empty();
			
			//构建dom
			// $.each(self.opts.data, function(index, data) {
			// 	var obj = $(self.html(data));
			// 	self.ele.append(obj);
			// });

			self.initChannel();

			self.run();
		},

		getBarrage: function () {
			var barrageData;
			if (this._text !== '') {
				var text = this._text;
				var d = {
					'reader_info' : {
						'avatar_thumb_url': this.opts.userinfo.avatar_thumb_url,
		                'reader_name': this.opts.userinfo.reader_name
					},
	                'tsukkomi_content': text,
	                'is_author': true
				}
				barrageData = $(this.html(d));
				this._text = '';
				this.opts.data.tsukkomi_list.push(d);
			}
			else {
				if (this._barrageDataIndex >= this.opts.data.tsukkomi_list.length){
					//数据池里的数据已经全部加入了弹幕泳道，则从第一个开始再次加入
					this._barrageDataIndex = 0;
				}
				barrageData = $(this.html(this.opts.data.tsukkomi_list[this._barrageDataIndex]));
				this._barrageDataIndex++;
			}
			return barrageData;
			
		},

		setBarrageToChannel: function (channelIndex) {
			var barrageData = this.getBarrage();
			this._arrChannel[channelIndex].append(barrageData);
			this.move(barrageData);
		},

		//轮询
		interval: function () {
			for(var i = 0; i < this._arrChannel.length; i ++) {
				var barrageItem = this._arrChannel[i].find('p:last');
				if (barrageItem && barrageItem.length) {
					var rightSpace = this.boxWidth - barrageItem.offset().left - barrageItem.outerWidth(); //右侧空隙
					if (rightSpace > 100 ) {
						this.setBarrageToChannel(i);
					}
				}
				else {
					this.setBarrageToChannel(i);
				}
			}
		},

		//开始运行
		run: function () {
			var self = this;
			self.interval();
			setInterval(function () {
				self.interval();
			}, 1000);
		},

		html: function(data) {
			if (data == undefined) return '';
			var str = '';
			str += '<p style="left:' + (this.boxWidth + Math.random()*100) + 'px" '+ (data.is_author ? ' class="my"' : '') +'>';
			str += '  <img src="'+data.reader_info.avatar_thumb_url+'" alt="' +data.reader_info.reader_name+ '">';
			str += data.tsukkomi_content;
			str += '</p>';
			return str;
		},

		move: function(obj) {
			var self = this;

			// self.setTrack(obj);

			// obj.animate({
			// 	'left': -obj.outerWidth()
			// }, 16000, 'linear', function () {
			// 	this.remove();
			// });
				// debugger;
			var timer = setInterval(function() {
				var left = parseInt(obj.css('left'));
				obj.css({'left': (left-1)+'px'});
				if (parseInt(obj.css('left')) <= - self.boxWidth) {
					clearInterval(timer);
					obj.remove();
				}
			}, 10);
		},
		//发送弹幕
		insert: function (text) {
			this._text = text;
		}

	}

	

	$.fn.qfcbarrage = function(opts) {
		return new Barrage(this.get(0), opts);
	};

})(jQuery);