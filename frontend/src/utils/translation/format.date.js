import moment from 'moment';

export function getViewReadyDate(ISODate) {
    return moment(ISODate).format('YYYY-MM-DD');
}