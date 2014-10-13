# Blur.js

blur.js is a jQuery plugin that produces psuedo-transparent blurred elements over other elements.

## Installation

### Manual
- attach jquery to your code.
- attach `dist/jquery.blur.js` or `dist/jquery.stack-box-blur.js`

### By Bower
- `bower install blurjs`
- attach `dist/jquery.blur.js` or `dist/jquery.stack-box-blur.js`

## Usage

````
$('.target').blurjs({
	source: 'body',
	radius: 7,
	overlay: 'rgba(255,255,255,0.4)'
});
````

## Defaults

````
$('.target').blurjs({
	source: 'body',		//Background to blur
	radius: 5,		//Blur Radius
	overlay: '',		//Overlay Color, follow CSS3's rgba() syntax
	offset: {		//Pixel offset of background-position
		x: 0,
		y: 0
	},
	optClass: '',		//Class to add to all affected elements
	cache: false,		//If set to true, blurred image will be cached and used in the future. If image is in cache already, it will be used.
	cacheKeyPrefix: 'blurjs-',	//Prefix to the keyname in the localStorage object
	draggable: false,	//Only used if jQuery UI is present. Will change background-position to fixed
	debug: false,		//put debug info in console
	useCss: true,		//Use <style>...</style> instead of inline styles. best for multiple targets
	onReady: null		//Callback triggered when image is loaded, blured and applied to dtarget.
});
````

## Building Blur.js by Grunt
- install grunt-cli
- run `grunt concat`

## Licensing
MIT
