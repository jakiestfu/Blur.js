# blur.js

blur.js is a jQuery plugin that produces psuedo-transparent blurred elements over other elements.

This fork fixes the background-size property which now enable us to have full page blur over the background. 

## Usage

````
$('.target').blurjs({
	source: 'body',
	radius: 7,
	overlay: 'rgba(255,255,255,0.4)'
});
````

The plugin will get other background properties (background-size, background-repeat, etc.) from the styles specified in the element (inline style), or in your CSS. 

## Options

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
## Note

This is a fork of Blur.js (https://github.com/jakiestfu/Blur.js). Credit goes to original author, Jacob Kelley (https://github.com/jakiestfu). 

## Licensing
The MIT License (MIT)

Copyright (c) 2014 Ignatius Steven (https://github.com/isteven)

Original author: Jacob Kelley (https://github.com/jakiestfu)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


