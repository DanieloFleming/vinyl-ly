var webpack = require("webpack");
var path = require("path");
 
var DEV = path.resolve(__dirname, "dev");
var OUTPUT = path.resolve(__dirname, "output");
 
var config = {
  entry: DEV + "/index.jsx",
  output: {
    path: OUTPUT,
    filename: "main.js",
  },
  module: {
    loaders: [{
    include: DEV,
    loader: "babel-loader"
    }]
}


};
 
module.exports = config;

//./node_modules/.bin/webpack -d --watch
// npm run dev