import {log} from '../utils';

module.exports = (router) => {
  log.debug('Health check API loaded');

  router.get('/health-check', (req, res, next) => { // eslint-disable-line no-unused-vars
    res.status(200).json({'message': 'OK'});
  });
};
