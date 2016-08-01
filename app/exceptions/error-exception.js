import HttpStatus from 'http-status-codes';
import { log } from '../utils';

module.exports = class ErrorException {
  constructor(message, status) {
    this.message = message || 'ErrorException';
    this.status = status || HttpStatus.INTERNAL_SERVER_ERROR;
    this.stack = (new Error()).stack;
  }

  printStacktrace() {
    log.error(this.stack);
  }

  toString() {
    return '(' + this.message + ',' + this.status + ')';
  }
}
