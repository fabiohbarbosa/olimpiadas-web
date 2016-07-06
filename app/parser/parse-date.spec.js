import {
  assert
} from 'chai';
import moment from 'moment-timezone';

import {
  dateRSS,
  dateHTML
} from './parse-date';

describe('dateRSS', function() {
  it('parse string to date -0300', function() {
    let date = moment(dateRSS('Tue, 14 Jun 1999 21:57:16 -0300'));

    assert.equal('14', date.format("DD"));
    assert.equal('06', date.format("MM"));
    assert.equal('1999', date.format("YYYY"));
    assert.equal('21', date.format('HH'));
    assert.equal('57', date.format('mm'));
    assert.equal('16', date.format('ss'));
  });

  it('parse string to date +0000', function() {
    let date = moment(dateRSS('Tue, 14 Jun 1999 21:57:16 +0000'));

    assert.equal('14', date.format("DD"));
    assert.equal('06', date.format("MM"));
    assert.equal('1999', date.format("YYYY"));
    assert.equal('18', date.format('HH'));
    assert.equal('57', date.format('mm'));
    assert.equal('16', date.format('ss'));
  });
});

describe('dateHTML', function() {
  it('parse "horas" H', function() {
    let now = dateRSS('Tue, 03 Mar 1999 23:57:16 -0300');
    let date = moment(dateHTML(now, 'há 5 horas'));

    assert.equal('03', date.format("DD"));
    assert.equal('03', date.format("MM"));
    assert.equal('1999', date.format("YYYY"));
    assert.equal('18', date.format('HH'));
    assert.equal('57', date.format('mm'));
    assert.equal('16', date.format('ss'));
  });

  it('parse "horas" HH', function() {
    let now = dateRSS('Tue, 03 Mar 1999 23:57:16 -0300');
    let date = moment(dateHTML(now, 'há 10 horas'));

    assert.equal('03', date.format("DD"));
    assert.equal('03', date.format("MM"));
    assert.equal('1999', date.format("YYYY"));
    assert.equal('13', date.format('HH'));
    assert.equal('57', date.format('mm'));
    assert.equal('16', date.format('ss'));
  });


  it('parse "hora"', function() {
    let now = dateRSS('Tue, 03 Mar 1999 23:57:16 -0300');
    let date = moment(dateHTML(now, 'há 1 hora'));

    assert.equal('03', date.format("DD"));
    assert.equal('03', date.format("MM"));
    assert.equal('1999', date.format("YYYY"));
    assert.equal('22', date.format('HH'));
    assert.equal('57', date.format('mm'));
    assert.equal('16', date.format('ss'));
  });

  it('parse "dias" D', function() {
    let now = dateRSS('Tue, 26 Mar 1999 23:57:16 -0300');
    let date = moment(dateHTML(now, 'há 6 dias'));

    assert.equal('20', date.format("DD"));
    assert.equal('03', date.format("MM"));
    assert.equal('1999', date.format("YYYY"));
    assert.equal('23', date.format('HH'));
    assert.equal('57', date.format('mm'));
    assert.equal('16', date.format('ss'));
  });

  it('parse "dias" DD', function() {
    let now = dateRSS('Tue, 26 Mar 1999 23:57:16 -0300');
    let date = moment(dateHTML(now, 'há 10 dias'));

    assert.equal('16', date.format("DD"));
    assert.equal('03', date.format("MM"));
    assert.equal('1999', date.format("YYYY"));
    assert.equal('23', date.format('HH'));
    assert.equal('57', date.format('mm'));
    assert.equal('16', date.format('ss'));
  });

  it('parse "dia"', function() {
    let now = dateRSS('Tue, 26 Mar 1999 23:57:16 -0300');
    let date = moment(dateHTML(now, 'há 1 dia'));

    assert.equal('25', date.format("DD"));
    assert.equal('03', date.format("MM"));
    assert.equal('1999', date.format("YYYY"));
    assert.equal('23', date.format('HH'));
    assert.equal('57', date.format('mm'));
    assert.equal('16', date.format('ss'));
  });
});
