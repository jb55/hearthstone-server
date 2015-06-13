
var binary = require('binary');
var util = require('util');
var format = util.format;
var inspect = util.inspect;

var knownIds = {
  4: "P1 Avatar",
  5: "P1 Hero Power",
  36: "P2 Avatar",
  37: "P2 Hero Power"
}

var hover = module.exports = function hoverParser(buf) {
  return binary.parse(buf)
    .word32lu('cmd_part?')
    .word8('unk_byte')
    .word8('unk_byte2')
    .word8('unk_byte3')
    .word8('unk_byte4')
    .word8('unk_byte5')
    .word8('who')
    .word8('24')
    .word8('targetId')
    .word8('unk_byte6')
    .word8('unk_byte7')
    .word8('unk_byte8')
    .word8('unk_byte9')
    .vars
}

hover.name = 'hover';
hover.pretty = function(parsed){
  if (parsed.targetId === 0)
    return;
  var name = knownIds[parsed.targetId] || parsed.targetId;
  return format("entity %d hover over %s", parsed.who, name/*, inspect(parsed)*/)
}

