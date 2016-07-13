import request from 'supertest';
import HttpStatus from 'http-status-codes';

import {app} from '../server';

describe('GET /api/health-check', () => {
  it('respond with json', (done) => {
    request(app)
      .get('/api/health-check')
      .expect('Content-Type', /json/)
      .expect(HttpStatus.OK)
      .end((err, res) => {
        if (err) throw err;
        done();
      });
  });
});
