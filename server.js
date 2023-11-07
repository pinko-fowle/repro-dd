var trace = require('dd-trace');
trace.init();

var restify = require('restify');
var launchdarkly = require('@launchdarkly/node-server-sdk');
var ldClient = launchdarkly.init(process.env.LD_SDK_KEY)

const server = restify.createServer({
  name: 'repro-dd',
  version: '0.1.0'
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

const LD_CONTEXT = {
  kind: "user",
  id: "nobody",
}

async function pickKey(req, res, next) {
  req.key = await ldClient.variation('echo-key', LD_CONTEXT, req.query.key);
}

async function echoName(req, res, next) {
  const value = {
    [req.key || "name"]: req.params.name
  };
  res.send(value);
}

server.get('/echo/:name', pickKey, echoName);

server.listen(8080, function () {
  console.log('%s listening at %s', server.name, server.url);
});
