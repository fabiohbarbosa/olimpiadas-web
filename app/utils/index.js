import YAML from 'yamljs';
import Log from 'log';

let properties = YAML.load(__dirname + '/../properties.yaml');

function logger() {
  let log = new Log(process.env.LOG_LEVEL || properties.log.level);
  let logger_info_old = log.info;
  let logger_debug_old = log.debug;
  let logger_error_old = log.error;

  log.info = function(msg) {
    let fileAndLine = traceCaller(1);
    fileAndLine = fileAndLine.replace('(', '');
    return logger_info_old.call(this, '- ' + fileAndLine + ": " + objectToJson(msg));
  }

  log.debug = function(msg) {
    let fileAndLine = traceCaller(1);
    fileAndLine = fileAndLine.replace('(', '');
    return logger_debug_old.call(this, '- ' + fileAndLine + ": " + objectToJson(msg));
  }

  log.error = function(msg) {
    let fileAndLine = traceCaller(1);
    fileAndLine = fileAndLine.replace('(', '');
    return logger_error_old.call(this, '- ' + fileAndLine + ": " + objectToJson(msg));
  }
  return log;
}

function traceCaller(n) {
  if (isNaN(n) || n < 0) n = 1;
  n += 1;
  let s = (new Error()).stack,
    a = s.indexOf('\n', 5);
  while (n--) {
    a = s.indexOf('\n', a + 1);
    if (a < 0) {
      a = s.lastIndexOf('\n', s.length);
      break;
    }
  }
  let b = s.indexOf('\n', a + 1);
  if (b < 0) b = s.length;
  a = Math.max(s.lastIndexOf(' ', b), s.lastIndexOf('/', b));
  b = s.lastIndexOf(':', b);
  s = s.substring(a + 1, b);
  return '[' + s + ']';
}

function nodeEnv() {
  return process.env.NODE_ENV || 'local';
}

function mongoUrl() {
  return process.env.MONGO_URL || properties[nodeEnv()].mongo.url;
}

function objectToJson(msg) {
  if (!(msg instanceof Object)) {
    return msg;
  }
  try {
    return JSON.parse(msg);
  } catch (e) {
    return msg;
  }
}

exports.properties = properties;
exports.log = logger();
exports.mongoUrl = mongoUrl();
exports.nodeEnv = nodeEnv();
