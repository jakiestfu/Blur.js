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

var stackBlur = (function() {
/*
StackBoxBlur - a fast almost Box Blur For Canvas

Version:  0.3
Author:   Mario Klingemann
Contact:  mario@quasimondo.com
Website:  http://www.quasimondo.com/
Twitter:  @quasimondo
*/

var mul_table = [1, 171, 205, 293, 57, 373, 79, 137, 241, 27, 391, 357, 41, 19, 283, 265, 497, 469, 443, 421, 25, 191, 365, 349, 335, 161, 155, 149, 9, 278, 269, 261, 505, 245, 475, 231, 449, 437, 213, 415, 405, 395, 193, 377, 369, 361, 353, 345, 169, 331, 325, 319, 313, 307, 301, 37, 145, 285, 281, 69, 271, 267, 263, 259, 509, 501, 493, 243, 479, 118, 465, 459, 113, 446, 55, 435, 429, 423, 209, 413, 51, 403, 199, 393, 97, 3, 379, 375, 371, 367, 363, 359, 355, 351, 347, 43, 85, 337, 333, 165, 327, 323, 5, 317, 157, 311, 77, 305, 303, 75, 297, 294, 73, 289, 287, 71, 141, 279, 277, 275, 68, 135, 67, 133, 33, 262, 260, 129, 511, 507, 503, 499, 495, 491, 61, 121, 481, 477, 237, 235, 467, 232, 115, 457, 227, 451, 7, 445, 221, 439, 218, 433, 215, 427, 425, 211, 419, 417, 207, 411, 409, 203, 202, 401, 399, 396, 197, 49, 389, 387, 385, 383, 95, 189, 47, 187, 93, 185, 23, 183, 91, 181, 45, 179, 89, 177, 11, 175, 87, 173, 345, 343, 341, 339, 337, 21, 167, 83, 331, 329, 327, 163, 81, 323, 321, 319, 159, 79, 315, 313, 39, 155, 309, 307, 153, 305, 303, 151, 75, 299, 149, 37, 295, 147, 73, 291, 145, 289, 287, 143, 285, 71, 141, 281, 35, 279, 139, 69, 275, 137, 273, 17, 271, 135, 269, 267, 133, 265, 33, 263, 131, 261, 130, 259, 129, 257, 1];
var shg_table = [0, 9, 10, 11, 9, 12, 10, 11, 12, 9, 13, 13, 10, 9, 13, 13, 14, 14, 14, 14, 10, 13, 14, 14, 14, 13, 13, 13, 9, 14, 14, 14, 15, 14, 15, 14, 15, 15, 14, 15, 15, 15, 14, 15, 15, 15, 15, 15, 14, 15, 15, 15, 15, 15, 15, 12, 14, 15, 15, 13, 15, 15, 15, 15, 16, 16, 16, 15, 16, 14, 16, 16, 14, 16, 13, 16, 16, 16, 15, 16, 13, 16, 15, 16, 14, 9, 16, 16, 16, 16, 16, 16, 16, 16, 16, 13, 14, 16, 16, 15, 16, 16, 10, 16, 15, 16, 14, 16, 16, 14, 16, 16, 14, 16, 16, 14, 15, 16, 16, 16, 14, 15, 14, 15, 13, 16, 16, 15, 17, 17, 17, 17, 17, 17, 14, 15, 17, 17, 16, 16, 17, 16, 15, 17, 16, 17, 11, 17, 16, 17, 16, 17, 16, 17, 17, 16, 17, 17, 16, 17, 17, 16, 16, 17, 17, 17, 16, 14, 17, 17, 17, 17, 15, 16, 14, 16, 15, 16, 13, 16, 15, 16, 14, 16, 15, 16, 12, 16, 15, 16, 17, 17, 17, 17, 17, 13, 16, 15, 17, 17, 17, 16, 15, 17, 17, 17, 16, 15, 17, 17, 14, 16, 17, 17, 16, 17, 17, 16, 15, 17, 16, 14, 17, 16, 15, 17, 16, 17, 17, 16, 17, 15, 16, 17, 14, 17, 16, 15, 17, 16, 17, 13, 17, 16, 17, 17, 16, 17, 14, 17, 16, 17, 16, 17, 16, 17, 9];

function stackBoxBlurCanvasRGB(canvas, top_x, top_y, width, height, radius, iterations) {
	function BlurStack() {
		this.b = this.g = this.r = 0;
		this.next = null;
	}

	if (isNaN(radius) || radius < 1) return;
	radius |= 0;

	if (isNaN(iterations)) iterations = 1;
	iterations |= 0;
	if (iterations > 3) iterations = 3;
	if (iterations < 1) iterations = 1;

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
		pr, pg, pb;

	var div = radius + radius + 1;
	var widthMinus1 = width - 1;
	var heightMinus1 = height - 1;
	var radiusPlus1 = radius + 1;

	var stackStart = new BlurStack();
	var stack = stackStart;
	for (i = 1; i < div; i++) {
		stack = stack.next = new BlurStack();
	}
	stack.next = stackStart;
	var stackIn = null;



	var mul_sum = mul_table[radius];
	var shg_sum = shg_table[radius];

	while (iterations-- > 0) {
		yw = yi = 0;

		for (y = height; --y > -1;) {
			r_sum = radiusPlus1 * (pr = pixels[yi]);
			g_sum = radiusPlus1 * (pg = pixels[yi + 1]);
			b_sum = radiusPlus1 * (pb = pixels[yi + 2]);

			stack = stackStart;

			for (i = radiusPlus1; --i > -1;) {
				stack.r = pr;
				stack.g = pg;
				stack.b = pb;
				stack = stack.next;
			}

			for (i = 1; i < radiusPlus1; i++) {
				p = yi + ((widthMinus1 < i ? widthMinus1 : i) << 2);
				r_sum += (stack.r = pixels[p++]);
				g_sum += (stack.g = pixels[p++]);
				b_sum += (stack.b = pixels[p]);

				stack = stack.next;
			}

			stackIn = stackStart;
			for (x = 0; x < width; x++) {
				pixels[yi++] = (r_sum * mul_sum) >>> shg_sum;
				pixels[yi++] = (g_sum * mul_sum) >>> shg_sum;
				pixels[yi++] = (b_sum * mul_sum) >>> shg_sum;
				yi++;

				p = (yw + ((p = x + radius + 1) < widthMinus1 ? p : widthMinus1)) << 2;

				r_sum -= stackIn.r - (stackIn.r = pixels[p++]);
				g_sum -= stackIn.g - (stackIn.g = pixels[p++]);
				b_sum -= stackIn.b - (stackIn.b = pixels[p]);

				stackIn = stackIn.next;
			}
			yw += width;
		}


		for (x = 0; x < width; x++) {
			yi = x << 2;

			r_sum = radiusPlus1 * (pr = pixels[yi++]);
			g_sum = radiusPlus1 * (pg = pixels[yi++]);
			b_sum = radiusPlus1 * (pb = pixels[yi]);

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

				r_sum += (stack.r = pixels[yi++]);
				g_sum += (stack.g = pixels[yi++]);
				b_sum += (stack.b = pixels[yi]);

				stack = stack.next;

				if (i < heightMinus1) yp += width;
			}

			yi = x;
			stackIn = stackStart;
			for (y = 0; y < height; y++) {
				p = yi << 2;
				pixels[p] = (r_sum * mul_sum) >>> shg_sum;
				pixels[p + 1] = (g_sum * mul_sum) >>> shg_sum;
				pixels[p + 2] = (b_sum * mul_sum) >>> shg_sum;

				p = (x + (((p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1) * width)) << 2;

				r_sum -= stackIn.r - (stackIn.r = pixels[p]);
				g_sum -= stackIn.g - (stackIn.g = pixels[p + 1]);
				b_sum -= stackIn.b - (stackIn.b = pixels[p + 2]);

				stackIn = stackIn.next;

				yi += width;
			}
		}
	}
	context.putImageData(imageData, top_x, top_y);

}

return stackBoxBlurCanvasRGB;

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
