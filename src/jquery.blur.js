
	var noSpecialChars = /[^a-zA-Z0-9]/g;
	noSpecialChars.regexp = function() {
		noSpecialChars.lastIndex = 0;
		return noSpecialChars;
	};
	typeof Storage === 'undefined' && (Storage = {});
	Storage.prototype.cacheChecksum = function(opts, formattedSource) {
		var newData = '';
		for(var key in opts) {
			var obj = opts[key];
			if($.isPlainObject(obj)) {
				newData += (obj.x.toString() + obj.y.toString() + ",").replace(noSpecialChars.regexp(), "");
			} else if(typeof obj === 'object') { // DOM element
				newData += obj.nodeName + '#' + obj.id + '.' + obj.className;
			} else {
				newData += (obj + ",").replace(noSpecialChars.regexp(), "");
			}
		}
		var originalData = this.getItem(opts.cacheKeyPrefix + opts.selector + '-' + formattedSource + '-options-cache');
		if(originalData != newData) {
			this.removeItem(opts.cacheKeyPrefix + opts.selector + '-' + formattedSource + '-options-cache');
			try {
				this.setItem(opts.cacheKeyPrefix + opts.selector + '-' + formattedSource + '-options-cache', newData);
			} catch(err) {
				typeof console !== 'undefined' && console.warn(err);
			}
			opts.debug && console.log('Settings Changed, Cache Emptied');
		}
	};



	$.fn.blurjs = function(options) {
		if(!this.length) {
			if(options.onReady) options.onReady();
			return this;
		}
		var _this = this;
		var canvas = document.createElement('canvas');
		if(!canvas.getContext) {
			return this;
		}
		options = $.extend({
			source: document.body,
			selector: this.selector.replace(noSpecialChars.regexp(), ""),
			radius: 5,
			overlay: '',
			offset: {
				x: 0,
				y: 0
			},
			optClass: '',
			cache: false,
			cacheKeyPrefix: 'blurjs-',
			draggable: false,
			debug: false,
			useCss: true,
			onReady: null
		}, options);
		var $source = $(options.source);
		var formattedSource = $source.css('backgroundImage').replace(/"/g, "").replace(/url\(|\)$/ig, "");
		var sourceOffset = $source.offset();
		var sourceCss = {
			'background-repeat': $source.css('backgroundRepeat'),
			'background-size': $source.css('backgroundSize'),
			'background-attachment': $source.css('backgroundAttachment')
		};

		function setBlurredImg($glue, blurredData) {
			$glue = $($glue);
			var glueOffset = $glue.offset();
			var finalCss = $.extend({
				'background-image': 'url("' + blurredData + '")',
				'background-position': (sourceCss['background-attachment'] == 'fixed') ? '' : '-' + ((glueOffset.left) - (sourceOffset.left) - (options.offset.x)) + 'px -' + ((glueOffset.top) - (sourceOffset.top) - (options.offset.y)) + 'px'
			}, sourceCss);

			if(options.optClass) {
				$glue.addClass(options.optClass);
			}
			if(options.draggable) {
				$.extend(finalCss, {
					'background-attachment': 'fixed',
					'background-position': '0 0'
				});
				$glue.draggable();
			}
			if(options.useCss) {
				var outCss = '{';
				for(var x in finalCss) {
					if(finalCss[x] && finalCss.hasOwnProperty(x)) {
						outCss += x + ":" + finalCss[x] + ";";
					}
				}
				$('head style[data-selector="blurjs-' + _this.selector +'"]').remove();
				$('<style data-selector="blurjs-' + _this.selector +'">' + _this.selector + outCss + '}<style>').appendTo('head');
				return false; //break $.each loop
			}
			$glue.css(finalCss);
		}

		var cachedData;
		if(options.cache) {
			localStorage.cacheChecksum(options, formattedSource);
			cachedData = localStorage.getItem(options.cacheKeyPrefix + options.selector + '-' + formattedSource + '-data-image');
		}
		if(cachedData) {
			options.debug && console.log('Cache Used');
			this.each(function() {
				return setBlurredImg(this, cachedData);
			});
			options.onReady && options.onReady();
			return _this;
		} else {
			var ctx = canvas.getContext('2d'),
					tempImg = new Image();

			tempImg.onload = function() {
				var blurredData;
				canvas.style.display = "none";
				canvas.width = tempImg.width;
				canvas.height = tempImg.height;
				ctx.drawImage(tempImg, 0, 0);
				stackBlur(canvas, 0, 0, canvas.width, canvas.height, options.radius, 1);
				if(options.overlay) {
					ctx.beginPath();
					ctx.rect(0, 0, tempImg.width, tempImg.width);
					ctx.fillStyle = options.overlay;
					ctx.fill();
				}
				blurredData = canvas.toDataURL();
				if(options.cache) {
					try {
						options.debug && console.log('Cache Set');
						localStorage.setItem(options.cacheKeyPrefix + options.selector + '-' + formattedSource + '-data-image', blurredData);
					} catch(e) {
						typeof console !== 'undefined' && console.log(e);
					}
				}
				options.debug && console.log('Source Used');
				_this.each(function() {
					return setBlurredImg(this, blurredData);
				});
				options.onReady && options.onReady();
			};
			tempImg.src = formattedSource;
			return _this;
		}
	};
 return $; // return jQuery
});
