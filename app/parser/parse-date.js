import moment from 'moment-timezone';

import ErrorException from '../exceptions/error-exception';

function dateRSS(date) {
  return moment(date, 'ddd, DD MMM YYYY HH:mm:ss ZZ').toDate();
}

function dateHTML(txt, now) {
  if (!now) {
    txt = txt.replace('h', ':');
    txt += ':00 -0300';
    return moment(txt, 'DD/MM/YYYY HH:mm:ss ZZ').toDate();
  }
  if (!txt) throw new ErrorException('Txt is undefined');

  now = moment(now).toDate();
  let dateTxt = txt.toLowerCase().split('há')[1].trim();

  if (!dateTxt) throw new ErrorException('Invalid txt ' + txt);

  let number = parseInt(dateTxt.split(' ')[0], 0);
  let duration = dateTxt.split(' ')[1].toLowerCase();

  if (!number || !duration) throw new ErrorException('Invalid txt' + txt);

  // chain
  if (duration === 'horas' || duration === 'hora') {
    return moment(now).subtract(number, 'hours').toDate();
  }
  if (duration === 'dias' || duration === 'dia') {
    return moment(now).subtract(number, 'days').toDate();
  }
}

exports.dateRSS = dateRSS;
exports.dateHTML = dateHTML;
