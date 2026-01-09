import dayjs from 'dayjs';

function sortByPrice(point1, point2) {
  return point2.basePrice - point1.basePrice;
}

function sortByTime(point1, point2) {
  return dayjs(point2.dateTo).diff(dayjs(point2.dateFrom)) - dayjs(point1.dateTo).diff(dayjs(point1.dateFrom));
}

function sortByDate(point1, point2) {
  return dayjs(point1.dateFrom).diff(dayjs(point2.dateFrom));
}

export { sortByPrice, sortByTime, sortByDate};
