import request from 'supertest';
import HttpStatus from 'http-status-codes';

import {app} from '../server';

describe('GET /api/news', () => {
  describe('GET /pageable', () => {
    it('respond 200 for correct pubDate and limit', (done) => {
      request(app)
        .get('/api/news/pageable?limit=10&pubDate=2016-02-09,09:01:00.199,-0300')
        .expect(HttpStatus.NO_CONTENT)
        .end((err, res) => {
          if (err) throw err;
          done();
        });
    });

    it('respond 400 for correct limit but empty date', (done) => {
      request(app)
        .get('/api/news/pageable?limit=10')
        .end((err, res) => {
          if (err) console.log(err);
          done();
        });
    });

    it('respond 400 for empty limit', (done) => {
      request(app)
        .get('/api/news/pageable?pubDate=2016-02-09,09:01:00.000,-0300')
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST)
        .end((err, res) => {
          if (err) throw err;
          done();
        });
    });

    it('respond 400 for incorrect limit', (done) => {
      request(app)
        .get('/api/news/pageable?limit=abc&pubDate=2016-02-09,09:01:00.000,-0300')
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST)
        .end((err, res) => {
          if (err) throw err;
          done();
        });
    });

    it('respond 400 for incorrect date', (done) => {
      request(app)
        .get('/api/news/pageable?limit=10&pubDate=2016-02-09')
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST)
        .end((err, res) => {
          if (err) throw err;
          done();
        });
    });
  });
});
