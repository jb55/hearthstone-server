
var parseBuffer = require('buffer-parser')
var util = require('util')
var split = require('buffer-split')
var hex = require('hexy').hexy
var format = util.format;
var inspect = util.inspect

var state = module.exports = function stateParser(buf) {
  var parser = parseBuffer(buf)
  var parsed = {}
  var size = parsed.size = parser.uint32le()
  return parsed
}

state.name = 'state';
state.pretty = function(parsed, raw){
  var buf = raw.slice(8)
  return format("\nstate change %s \n\n%s",
                JSON.stringify(parsed),
                hex(buf))
}

function parseEntry(parser) {
}

function prettySplit(buf) {
  var delim = new Buffer([0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF])
  var buffers = split(buf, delim)
  return buffers.map(function(buf){
    return hex(buf)
  }).join("\n")
}
