# blurjs

This repo is a fork of the original [Blur.js](https://github.com/jakiestfu/Blur.js) library by Jacob Kelley.  This fork adds the ability to add the Git repo as a dependency in npm or other Git-supporting package managers.

Say you wanted to use blurjs in a project, but you wanted to list it as a dependency in your `package.json`.  With this fork you could do exactly that:

```javascript
{
  ...
	"dependencies": {
		"blurjs": "git://github.com/jamen/blurjs.git"
	}
}
```
