import HttpStatus from 'http-status-codes';
import {log} from '../utils';

module.exports = (router) => {
  log.debug('Health check API loaded');

  log.debug('Mapped GET /health-check');
  router.get('/health-check', healthCheck);
};

function healthCheck(req, res, next) {
  res.status(HttpStatus.OK).json({'message': 'OK'});
}
