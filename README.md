# Blur.js

blur.js is a jQuery plugin that produces psuedo-transparent blurred elements over other elements.


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
	radius: 5,			//Blur Radius
	overlay: '',		//Overlay Color, follow CSS3's rgba() syntax
	offset: {			//Pixel offset of background-position
		x: 0,
		y: 0
	},
	optClass: '',					//Class to add to all affected elements
	cache: false,					//If set to true, blurred image will be cached and used in the future. If image is in cache already, it will be used.
	cacheKeyPrefix: 'blurjs-',		//Prefix to the keyname in the localStorage object
	draggable: false				//Only used if jQuery UI is present. Will change background-position to fixed
});
````

## Licensing
MIT
