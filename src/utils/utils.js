import dayjs from 'dayjs';
import { MILISECONDS_IN_MINUTE, MINUTES_IN_DAY, MINUTES_IN_HOUR } from '../consts';


const getDefaultPoint = () => ({
  basePrice: 0,
  dateFrom: null,
  dateTo: null,
  destination: '',
  isFavorite: false,
  offers: [],
  type: 'flight',
});

function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function humanizeTaskDueDate(dueDate, dateFormat) {
  return dueDate ? dayjs(dueDate).format(dateFormat).toUpperCase() : '';
}

function getTimePeriod(start, end) {
  const period = dayjs(end).diff(start) / MILISECONDS_IN_MINUTE;
  if (period < MINUTES_IN_HOUR) {
    return `${String(period.toFixed()).padStart(2, '0')} M`;
  }
  if (period < MINUTES_IN_DAY) {
    return `${String(~~(period / MINUTES_IN_HOUR)).padStart(2, '0')}H ${String(Math.ceil((period % MINUTES_IN_HOUR))).padStart(2, '0')}M`;
  }

  return `${String(~~(period / MINUTES_IN_DAY)).padStart(2, '0')}D ${String(~~(period % MINUTES_IN_DAY / MINUTES_IN_HOUR)).padStart(2, '0')}H ${String(Math.ceil((period % MINUTES_IN_HOUR))).padStart(2, '0')}M`;
}

function updatePoint(points, updatedPoint) {
  return points.map((point) => point.id === updatedPoint.id ? updatedPoint : point);
}


export { getRandomArrayElement, humanizeTaskDueDate, getTimePeriod, getDefaultPoint, updatePoint };
