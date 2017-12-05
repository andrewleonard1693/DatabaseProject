module.exports=function(grunt){

//grunt configuration
grunt.initConfig({
    concat:{
        js:{
            src:["public/js/*"],
            dest:"build/scripts.js"
        }
    }
});

//load plugins
grunt.loadNpmTasks('grunt-contrib-concat')

//register tasks



}