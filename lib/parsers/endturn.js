
var binary = require('binary');
var util = require('util');
var format = util.format;
var inspect = util.inspect;

var knownIds = {
}

var endturn = module.exports = function endTurnParser(buf) {
  return binary.parse(buf)
    .word32lu('cmd_part?')
}

hover.name = 'endturn';
hover.pretty = function(parsed){
  if (parsed.targetId === 0)
    return;
  var name = knownIds[parsed.targetId] || parsed.targetId;
  return format("entity %d hover over %s", parsed.who, name/*, inspect(parsed)*/)
}

