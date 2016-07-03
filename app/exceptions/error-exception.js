function ErrorException(message) {
  this.name = 'ErrorException';
  this.message = message || 'ErrorException';
  this.stack = (new Error()).stack;
}
ErrorException.prototype = Object.create(Error.prototype);
ErrorException.prototype.constructor = ErrorException;

module.exports = ErrorException;
