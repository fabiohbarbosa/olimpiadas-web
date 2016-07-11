import moment from 'moment-timezone';

import ErrorException from '../exceptions/error-exception';

function dateRSS(date) {
  return moment(date, 'ddd, DD MMM YYYY HH:mm:ss ZZ').toDate();
}

function dateHTML(txt, now) {
  if (!txt) throw new ErrorException('Txt is undefined');

  // executor 1 and 2
  if (!now) {
    if (txt.indexOf('às') >= 1) {
      txt = txt.replace('às', '');
    } else {
      txt = txt.replace('h', ':');
    }
    return moment(txt + ':00 -0300', 'DD/MM/YYYY HH:mm:ss ZZ').toDate();
  }

  // executor 3
  now = moment(now).toDate();
  let dateExec2 = txt.toLowerCase().split('há')[1].trim();
  if (dateExec2) {
    let number = parseInt(dateExec2.split(' ')[0], 0);
    let duration = dateExec2.split(' ')[1].toLowerCase();

    if (!number || !duration) throw new ErrorException('Invalid txt' + txt);

    // chain
    if (duration === 'horas' || duration === 'hora') {
      return moment(now).subtract(number, 'hours').toDate();
    }
    if (duration === 'dias' || duration === 'dia') {
      return moment(now).subtract(number, 'days').toDate();
    }
  }
}

exports.dateRSS = dateRSS;
exports.dateHTML = dateHTML;
