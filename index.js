'use strict';

require('epipebomb')()
var inspect = require('util').inspect;
var fs = require('fs')
var sprintf = require('sprintf-js').sprintf;
var pcap = require("pcap");
var packets = require('./lib/packet');
var argv = require('minimist')(process.argv.slice(2), {
  boolean: ['f']
})
var EventEmitter = require('events').EventEmitter
var json = require('JSONStream')
var through = require('through2').obj

var isBnet = function(s){
  return s.sport === 1119 || s.dport === 1119
      || s.sport === 3724 || s.dport === 3724;
}

function handlePacket (emitter, data) {
  emitter.emit('data', data)
  var parser = packets(data);
  var id = data.readUInt32LE(0)
  if (parser) {
    var parsed = parser(data.slice(4))
    //console.log("%s %s", parser.name, sprintf("%032b", parsed.end_mask))
    if (parser.pretty) {
      var pretty = parser.pretty(parsed, data);
      if (pretty)
      if (!argv.i || +argv.i === id)
        console.log("%s", pretty)
    }
  }
  else if (!argv.i) {
    var command = data.readUInt32LE(0)
    if (command < 100000)
      console.log("unk %d %s\n", command, data.slice(4).toString('hex'))
  }
}

function capture (session) {
  var emitter = new EventEmitter()
  session.on('packet', function (raw_packet) {
    var packet = pcap.decode.packet(raw_packet),
        data = packet.link.ip.tcp.data;

    if (data && isBnet(packet.link.ip.tcp)) {
      handlePacket(emitter, data)
    }
  });
  return emitter
}

//
// capture
//
if (argv.c) {
  var session = pcap.createSession(argv.d || "eno1", "tcp");
  console.log("Listening on " + session.device_name);

  var packetEvents = capture(session)

  var ws = fs.createWriteStream(argv.c)
  console.error("logging raw data to", argv.c)
  packetEvents.on('data', function (data) {
    var out = {
        time: new Date().getTime()
      , data: data
    }
    ws.write(JSON.stringify(out) + "\n")
  })
}

//
// simulation
//
var slow = argv.f
if (argv.s) {
  var queue = []
  var session = new EventEmitter()
  var sim = fs.createReadStream(argv.s)
  sim.pipe(json.parse(false))
  .pipe(through(function (next, enc, done) {
    next.data = new Buffer(next.data)
    queue.push(next)
    if (queue.length === 1) return done()

    var current = queue.shift()
    handlePacket(session, current.data)
    session.emit('packet', next)
    var wait = next.time - current.time

    if (!slow) return done()
    setTimeout(done, wait)
  }))
}


