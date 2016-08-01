import HttpStatus from 'http-status-codes';
import moment from 'moment';

import { log } from '../utils';
import ErrorException from '../exceptions/error-exception';

const DATE_FORMAT = 'YYYY-MM-DD,HH:mm:ss.SSS,ZZ';

module.exports = class NewsRequest {
  constructor(limit, pubDate, type) {
    this.limit = parseInt(limit, 0);
    if (pubDate) this.pubDate = moment(pubDate, DATE_FORMAT, true);
    type = type || 'PREVIOUS';
    this.type = type.toUpperCase();
  }

  validate() {
    let errMsg;
    if (!this.limit) {
      errMsg = 'limit was not specified';
    }
    if (!this.pubDate) {
      errMsg = 'pubDate was not specified';
    } else if (!this.pubDate.isValid()) {
      errMsg = 'Invalid date format';
    }
    if (this.type !== 'PREVIOUS' && this.type !== 'NEXT') {
      errMsg = 'Invalid type format';
    }

    if (errMsg) {
      log.error(errMsg);
      throw new ErrorException(errMsg, HttpStatus.BAD_REQUEST);
    }
  }

  isPrevious() {
    return this.type === 'PREVIOUS';
  }

  isNext() {
    return this.type === 'NEXT';
  }

  static hateoas(serverUrl, dt, callback) {
    let firstDate = dt.firstDate;
    let lastDate = dt.lastDate;

    let previousDate = moment(lastDate).subtract(1, 'milliseconds').format(DATE_FORMAT);
    let previousUrl = serverUrl + previousDate + '&type=PREVIOUS'

    let nextDate = moment(firstDate).add(1, 'milliseconds').format(DATE_FORMAT);
    let nextUrl = serverUrl + nextDate + '&type=NEXT';

    callback(previousUrl, nextUrl);
  }

  toString() {
    let pubDate;
    if (this.pubDate) {
      pubDate = this.pubDate.toDate();
    }
    return '( limit: ' + this.limit + ', pubDate: ' + pubDate + ' , type: ' + this.type + ')';
  }
}
