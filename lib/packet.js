
var format = require('util').format;
var binary = require('binary');

var parsers = module.exports = function(buf) {
  var id = buf.readUInt32LE(0)
  var parser = commands[id];
  return parser;
}

var commands = {
  115: syn
, 116: ack
, 19:  require('./parsers/state')
, 0xf: require('./parsers/hover')
, 0x9: hurryup
}

function hurryup(buf) {
  return binary.parse(buf)
    .word32lu('unk_int')
    .word8('unk_byte1')
    .word8('unk_byte2')
    .word8('unk_byte3')
    .word8('round')
    .word8('unk_byte4')
    .word8('unk_byte5')
    .vars
}

hurryup.name = function() { return "hurryup" }
hurryup.pretty = function(parsed, raw) {
  return format("Hurry up! Round %s", parsed.round, JSON.stringify(raw))
}

function syn(data) { return {} }
syn.name = function() { return "syn" }

function ack(data) { return {} }
ack.name = function() { return "ack" }
