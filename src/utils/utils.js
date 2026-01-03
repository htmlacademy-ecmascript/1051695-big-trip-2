import dayjs from 'dayjs';
import { MILISECONDS_IN_MINUTE, MINUTES_IN_DAY, MINUTES_IN_HOUR } from '../consts';


const getDefaultPoint = () => ({
  basePrice: 0,
  dateFrom: '',
  dateTo: '',
  destination: 0,
  isFavorite: false,
  offers: [],
  type: 'taxi',
});

function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function humanizeTaskDueDate(dueDate, dateFormat) {
  return dueDate ? dayjs(dueDate).format(dateFormat).toUpperCase() : '';
}

function getTimePeriod(start, end) {
  const period = dayjs(end).diff(start) / MILISECONDS_IN_MINUTE;
  if (period < 0) {
    return 'неверные даты';
  }
  if (period < MINUTES_IN_HOUR) {
    return `${String(period.toFixed()).padStart(2,'0')} M`;
  }
  if (period < MINUTES_IN_DAY) {
    return `${String(~~(period / MINUTES_IN_HOUR)).padStart(2,'0')}H ${String(Math.ceil((period % MINUTES_IN_HOUR))).padStart(2,'0')}M`;
  }

  return `${String(~~(period / MINUTES_IN_DAY)).padStart(2,'0')}D ${String(~~(period % MINUTES_IN_DAY / MINUTES_IN_HOUR)).padStart(2,'0')}H ${String(Math.ceil((period % MINUTES_IN_HOUR))).padStart(2,'0')}M`;
}

export { getRandomArrayElement, humanizeTaskDueDate, getTimePeriod, getDefaultPoint };
