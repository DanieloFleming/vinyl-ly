var combine = require('css-combine');
var fs = require('fs');
var path = require("path");
 
var path = path.resolve(__dirname, "output")
var raw = path + '/style.css';

combine(raw).pipe(
  fs.createWriteStream( path + '/style.min.css')
);