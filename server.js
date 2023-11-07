var trace = require('dd-trace');
trace.init();

var restify = require('restify');
var launchdarkly = require('@launchdarkly/node-server-sdk');
launchdarkly.init(process.env.LD_SDK_KEY)

const server = restify.createServer({
  name: 'repro-dd',
  version: '0.1.0'
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

function echoName(req, res, next) {
  res.send(req.params);
  return next();
}

server.get('/echo/:name', echoName);

server.listen(8080, function () {
  console.log('%s listening at %s', server.name, server.url);
});
