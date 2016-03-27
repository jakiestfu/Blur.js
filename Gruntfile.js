grunt = require('grunt');
grunt.loadNpmTasks('grunt-contrib-concat');

grunt.initConfig({
  concat: {
    stackboxblur: {
      src: ['src/amdHead.js', 'src/StackBoxBlur.js', 'src/jquery.blur.js', 'src/amdFoot.js'],
      dest: 'dist/jquery.stack-box-blur.js'
    },
    stackblur: {
      src: ['src/amdHead.js', 'src/StackBlur.js', 'src/jquery.blur.js', 'src/amdFoot.js'],
      dest: 'dist/jquery.blur.js'
    },
  },
});
