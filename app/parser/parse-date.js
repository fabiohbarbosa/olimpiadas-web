import moment from 'moment-timezone';

function dateRSS(date) {
  return moment(date, 'ddd, DD MMM YYYY HH:mm:ss ZZ').toDate();
}

function dateHTML(now, txt) {
  let dateTxt = txt.toLowerCase().split('há')[1].trim();
  if (!dateTxt) {
    throw new ErrorException('Invalid date');
  }

  let number = parseInt(dateTxt.split(' ')[0]);
  let duration = dateTxt.split(' ')[1].toLowerCase();

  if (!number || !duration) {
    throw new ErrorException('Invalid date');
  }

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
