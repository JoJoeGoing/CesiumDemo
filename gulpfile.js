'use strict';
const fs = require('file-system');
const gulp = require('gulp');
const path = require('path');

gulp.task('build', function (done) {
    createGalleryList();
    done();
});

function createGalleryList() {
    let output = path.join('../../templates', 'js', 'gallery.js');
    let dir = path.dirname(__filename);
    let input = path.join(dir, 'Apps', 'gallery');
    let contents = walk(input);

    fs.writeFileSync(output, contents);

}

function filePathToModuleId(moduleId) {
    return moduleId.substring(0, moduleId.lastIndexOf('.')).replace(/\\/g, '/');
}

function walk(fileDir, obj) {
    obj = obj || {};
    fs.readdirSync(fileDir).forEach(function (filename) {
        let file = fileDir + '\\' + filename;
        let stat = fs.statSync(file);

        if (stat && stat.isDirectory()) {
            obj[filename] = {};
            obj[filename].name = filename;
            obj[filename].content = [];
            walk(file, obj[filename]);
        } else {

            if (path.extname(filename) !== '.jpg') {

                let demo = filePathToModuleId(path.basename(filename));
                let demoObject = {
                    name: demo,
                    file: filename
                }
                
                let img = file.substring(file.lastIndexOf('Apps')-1,file.lastIndexOf(".")).replace(/\\/g, '/');
                demoObject.img = img + '.jpg';
              
                obj.content.push(demoObject);
            }

        }
    });
    var contents = '\
    var gallery_demos = ' + JSON.stringify(obj) + ';\n\ ';

    return contents;

}