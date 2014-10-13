grunt = require('grunt');
grunt.loadNpmTasks('grunt-contrib-concat');

grunt.initConfig({
  concat: {
    stackboxblur: {
      src: ['src/StackBoxBlur.js', 'src/jquery.blur.js'],
      dest: 'dist/jquery.stack-box-blur.js'
    },
    stackblur: {
      src: ['src/StackBlur.js', 'src/jquery.blur.js'],
      dest: 'dist/jquery.blur.js'
    },
  },
});
