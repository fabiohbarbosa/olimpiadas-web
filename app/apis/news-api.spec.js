import request from 'supertest';
import HttpStatus from 'http-status-codes';

import {app} from '../server';

describe('GET /api/news', () => {
/*
  describe('GET /', () => {
    it('respond with json', (done) => {
      request(app)
        .get('/api/news')
        .expect('Content-Type', /json/)
        .expect(HttpStatus.OK)
        .end((err, res) => {
          if (err) throw err;
          done();
        });
    });
  });
*/
  describe('GET /pageable', () => {
    it('respond 200 for correct lte date and limit', (done) => {
      request(app)
        .get('/api/news/pageable?limit=10&lteDate=2016-02-09 09:01:00.-0300')
        .expect('Content-Type', /json/)
        .expect(HttpStatus.OK)
        .end((err, res) => {
          if (err) throw err;
          done();
        });
    });
/*
    it('respond 200 for correct gte date and limit', (done) => {
      request(app)
        .get('/api/news/pageable?limit=10&gteDate=2016-02-09 09:01:00.-0300')
        .expect('Content-Type', /json/)
        .expect(HttpStatus.OK)
        .end((err, res) => {
          if (err) throw err;
          done();
        });
    });


    it('respond 400 for correct limit but empty dates', (done) => {
      request(app)
        .get('/api/news/pageable?limit=10')
        .expect('Content-Type', /json/)
        .expect(HttpStatus.NO_CONTENT)
        .end((err, res) => {
          if (err) throw err;
          done();
        });
    });

    it('respond 400 for empty limit', (done) => {
      request(app)
        .get('/api/news/pageable?date=2016-02-09 09:01:00.-0300')
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST)
        .end((err, res) => {
          if (err) throw err;
          done();
        });
    });

    it('respond 400 for incorrect limit', (done) => {
      request(app)
        .get('/api/news/pageable?limit=abc&date=2016-02-09 09:01:00.-0300')
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST)
        .end((err, res) => {
          if (err) throw err;
          done();
        });
    });

    it('respond 400 for incorrect date', (done) => {
      request(app)
        .get('/api/news/pageable?limit=10&date=2016-02-09')
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST)
        .end((err, res) => {
          if (err) throw err;
          done();
        });
    });
 */
  });
});
