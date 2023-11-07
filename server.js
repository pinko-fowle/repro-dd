var trace = require('dd-trace');
trace.init();

var restify = require('restify');

const server = restify.createServer({
  name: 'repro-dd',
  version: '0.1.0'
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

function logSomething(req, res, next) {
  console.log({something: 42})
  return next();
}
function echoName(req, res, next) {
  res.send(req.params);
  return next();
}
server.get('/echo/:name', logSomething, echoName);

async function logSomethingAsync(req, res) {
  console.log({something: "someday"})
}
async function echoNameAsync(req, res) {
  res.send(req.params);
}
server.get('/async/:name', logSomethingAsync, echoNameAsync);

server.listen(8080, function () {
  console.log('%s listening at %s', server.name, server.url);
});
