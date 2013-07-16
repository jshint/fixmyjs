module.exports = cli

var fs = require('fs')
var path = require('path')
var fixmyjs = require('../')


function cli(args) {
  console.log(fixmyjs(fs.readFileSync(args[0]).toString()))
}

//fix.on('fixed', function (io) {
//  if (commander.dryRun || commander.diff) {
//    io.diff();
//  } else if (commander.patch) {
//    io.patch();
//  } else {
//    io.write();
//  }
//});
