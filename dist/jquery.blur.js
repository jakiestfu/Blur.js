/**
 * Blur.js (jQuery module)
 *
 * @see {@link https://github.com/jakiestfu/Blur.js|GitHub}
 * @see {@link http://blurjs.com/}
 * @author Jacob Kelley <jakie8@gmail.com>, Cezary Daniel Nowak <cezary.nowak@gmail.com>
 * @license MIT
 */

(function (define) {
define(['jquery'], function ($) {

// Stackblur, courtesy of Mario Klingemann: https://github.com/Quasimondo/QuasimondoJS/blob/master/blur/StackBlur.js
// #fbe3561e65afc7b3f1c745ff61372c1aaf7d732b
var stackBlur = (function() {
	var mul_table = [
		512, 512, 456, 512, 328, 456, 335, 512, 405, 328, 271, 456, 388, 335, 292, 512,
		454, 405, 364, 328, 298, 271, 496, 456, 420, 388, 360, 335, 312, 292, 273, 512,
		482, 454, 428, 405, 383, 364, 345, 328, 312, 298, 284, 271, 259, 496, 475, 456,
		437, 420, 404, 388, 374, 360, 347, 335, 323, 312, 302, 292, 282, 273, 265, 512,
		497, 482, 468, 454, 441, 428, 417, 405, 394, 383, 373, 364, 354, 345, 337, 328,
		320, 312, 305, 298, 291, 284, 278, 271, 265, 259, 507, 496, 485, 475, 465, 456,
		446, 437, 428, 420, 412, 404, 396, 388, 381, 374, 367, 360, 354, 347, 341, 335,
		329, 323, 318, 312, 307, 302, 297, 292, 287, 282, 278, 273, 269, 265, 261, 512,
		505, 497, 489, 482, 475, 468, 461, 454, 447, 441, 435, 428, 422, 417, 411, 405,
		399, 394, 389, 383, 378, 373, 368, 364, 359, 354, 350, 345, 341, 337, 332, 328,
		324, 320, 316, 312, 309, 305, 301, 298, 294, 291, 287, 284, 281, 278, 274, 271,
		268, 265, 262, 259, 257, 507, 501, 496, 491, 485, 480, 475, 470, 465, 460, 456,
		451, 446, 442, 437, 433, 428, 424, 420, 416, 412, 408, 404, 400, 396, 392, 388,
		385, 381, 377, 374, 370, 367, 363, 360, 357, 354, 350, 347, 344, 341, 338, 335,
		332, 329, 326, 323, 320, 318, 315, 312, 310, 307, 304, 302, 299, 297, 294, 292,
		289, 287, 285, 282, 280, 278, 275, 273, 271, 269, 267, 265, 263, 261, 259
	];


	var shg_table = [
		9, 11, 12, 13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17,
		17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19,
		19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20,
		20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21,
		21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21,
		21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22,
		22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22,
		22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23,
		23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
		23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
		23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
		23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
		24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
		24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
		24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
		24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24
	];

	function stackBlurCanvasRGB(canvasIDOrElement, top_x, top_y, width, height, radius /*, iterations */) {
		if (isNaN(radius) || radius < 1) return;
		radius |= 0;

		var canvas = stackBlurGetElement(canvasIDOrElement);
		var context = canvas.getContext("2d");
		var imageData;

		try {
			try {
				imageData = context.getImageData(top_x, top_y, width, height);
			} catch (e) {

				// NOTE: this part is supposedly only needed if you want to work with local files
				// so it might be okay to remove the whole try/catch block and just use
				// imageData = context.getImageData( top_x, top_y, width, height );
				try {
					netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
					imageData = context.getImageData(top_x, top_y, width, height);
				} catch (e) {
					alert("Cannot access local image");
					throw new Error("unable to access local image data: " + e);
				}
			}
		} catch (e) {
			alert("Cannot access image");
			throw new Error("unable to access image data: " + e);
		}

		var pixels = imageData.data;

		var x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum,
			r_out_sum, g_out_sum, b_out_sum,
			r_in_sum, g_in_sum, b_in_sum,
			pr, pg, pb, rbs, stackEnd;

		var div = radius*2 + 1;
		var widthMinus1 = width - 1;
		var heightMinus1 = height - 1;
		var radiusPlus1 = radius + 1;
		var sumFactor = radiusPlus1 * (radiusPlus1 + 1) / 2;

		var stackStart = new BlurStack();
		var stack = stackStart;
		for (i = 1; i < div; i++) {
			stack = stack.next = new BlurStack();
			if (i === radiusPlus1) stackEnd = stack;
		}
		stack.next = stackStart;
		var stackIn = null;
		var stackOut = null;

		yw = yi = 0;

		var mul_sum = mul_table[radius];
		var shg_sum = shg_table[radius];

		for (y = 0; y < height; y++) {
			r_in_sum = g_in_sum = b_in_sum = r_sum = g_sum = b_sum = 0;

			r_out_sum = radiusPlus1 * (pr = pixels[yi]);
			g_out_sum = radiusPlus1 * (pg = pixels[yi + 1]);
			b_out_sum = radiusPlus1 * (pb = pixels[yi + 2]);

			r_sum += sumFactor * pr;
			g_sum += sumFactor * pg;
			b_sum += sumFactor * pb;

			stack = stackStart;

			for (i = 0; i++ < radiusPlus1;) {
				stack.r = pr;
				stack.g = pg;
				stack.b = pb;
				stack = stack.next;
			}

			for (i = 0; ++i < radiusPlus1;) {
				p = yi + ((widthMinus1 < i ? widthMinus1 : i) << 2);
				r_sum += (stack.r = (pr = pixels[p])) * (rbs = radiusPlus1 - i);
				g_sum += (stack.g = (pg = pixels[p + 1])) * rbs;
				b_sum += (stack.b = (pb = pixels[p + 2])) * rbs;

				r_in_sum += pr;
				g_in_sum += pg;
				b_in_sum += pb;

				stack = stack.next;
			}

			stackIn = stackStart;
			stackOut = stackEnd;
			for (x = 0; x < width; x++) {
				pixels[yi] = (r_sum * mul_sum) >> shg_sum;
				pixels[yi + 1] = (g_sum * mul_sum) >> shg_sum;
				pixels[yi + 2] = (b_sum * mul_sum) >> shg_sum;

				r_sum -= r_out_sum;
				g_sum -= g_out_sum;
				b_sum -= b_out_sum;

				r_out_sum -= stackIn.r;
				g_out_sum -= stackIn.g;
				b_out_sum -= stackIn.b;

				p = (yw + ((p = x + radius + 1) < widthMinus1 ? p : widthMinus1)) << 2;

				r_in_sum += (stackIn.r = pixels[p]);
				g_in_sum += (stackIn.g = pixels[p + 1]);
				b_in_sum += (stackIn.b = pixels[p + 2]);

				r_sum += r_in_sum;
				g_sum += g_in_sum;
				b_sum += b_in_sum;

				stackIn = stackIn.next;

				r_out_sum += (pr = stackOut.r);
				g_out_sum += (pg = stackOut.g);
				b_out_sum += (pb = stackOut.b);

				r_in_sum -= pr;
				g_in_sum -= pg;
				b_in_sum -= pb;

				stackOut = stackOut.next;

				yi += 4;
			}
			yw += width;
		}


		for (x = 0; x < width; x++) {
			g_in_sum = b_in_sum = r_in_sum = g_sum = b_sum = r_sum = 0;

			yi = x << 2;
			r_out_sum = radiusPlus1 * (pr = pixels[yi]);
			g_out_sum = radiusPlus1 * (pg = pixels[yi + 1]);
			b_out_sum = radiusPlus1 * (pb = pixels[yi + 2]);

			r_sum += sumFactor * pr;
			g_sum += sumFactor * pg;
			b_sum += sumFactor * pb;

			stack = stackStart;

			for (i = 0; i < radiusPlus1; i++) {
				stack.r = pr;
				stack.g = pg;
				stack.b = pb;
				stack = stack.next;
			}

			yp = width;

			for (i = 1; i <= radius; i++) {
				yi = (yp + x) << 2;

				r_sum += (stack.r = (pr = pixels[yi])) * (rbs = radiusPlus1 - i);
				g_sum += (stack.g = (pg = pixels[yi + 1])) * rbs;
				b_sum += (stack.b = (pb = pixels[yi + 2])) * rbs;

				r_in_sum += pr;
				g_in_sum += pg;
				b_in_sum += pb;

				stack = stack.next;

				if (i < heightMinus1) {
					yp += width;
				}
			}

			yi = x;
			stackIn = stackStart;
			stackOut = stackEnd;
			for (y = 0; y < height; y++) {
				p = yi << 2;
				pixels[p] = (r_sum * mul_sum) >> shg_sum;
				pixels[p + 1] = (g_sum * mul_sum) >> shg_sum;
				pixels[p + 2] = (b_sum * mul_sum) >> shg_sum;

				r_sum -= r_out_sum;
				g_sum -= g_out_sum;
				b_sum -= b_out_sum;

				r_out_sum -= stackIn.r;
				g_out_sum -= stackIn.g;
				b_out_sum -= stackIn.b;

				p = (x + (((p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1) * width)) << 2;

				r_sum += (r_in_sum += (stackIn.r = pixels[p]));
				g_sum += (g_in_sum += (stackIn.g = pixels[p + 1]));
				b_sum += (b_in_sum += (stackIn.b = pixels[p + 2]));

				stackIn = stackIn.next;

				r_out_sum += (pr = stackOut.r);
				g_out_sum += (pg = stackOut.g);
				b_out_sum += (pb = stackOut.b);

				r_in_sum -= pr;
				g_in_sum -= pg;
				b_in_sum -= pb;

				stackOut = stackOut.next;

				yi += width;
			}
		}

		context.putImageData(imageData, top_x, top_y);

	}
	function BlurStack() {
		this.r = this.b = this.g = 0;
		this.next = null;
	}
	function stackBlurGetElement(elementOrID) {
		if (elementOrID.nodeType == 1)
			return elementOrID;

		return document.getElementById(elementOrID);
	}


	return stackBlurCanvasRGB;
})();

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
					ctx.rect(0, 0, tempImg.width, tempImg.height);
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

})(
	typeof define === 'function' && define.amd
		? define
		: function (r, factory) { factory(jQuery); }
);
