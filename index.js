module.exports = function(method) {
	if (method === 'stack-box-blur') {
		return require('./dist/jquery.stack-box-blur.js');
	}

	return require('./dist/jquery.blur.js');
};
