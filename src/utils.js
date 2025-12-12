import dayjs from 'dayjs';

const MILISECONDS_IN_MINUTE = 60000;
const MINUTES_IN_HOUR = 60;
const MINUTES_IN_DAY = 1440;

const DATE_FORMAT = {
  monthDay: 'MMM D',
  hourMinute: 'HH:mm',
  yearMonthDay: 'YYYY-MM-DD',
  dateTime:'DD/MM/YY HH:mm'
};

const getDefaultPoint = () => ({
  id: 0,
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
    return `${String(~~(period / MINUTES_IN_HOUR)).padStart(2,'0')}H ${String((period % MINUTES_IN_HOUR).toFixed()).padStart(2,'0')}M`;
  }

  return `${~~(period / MINUTES_IN_DAY)}D ${String(~~(period % MINUTES_IN_DAY / MINUTES_IN_HOUR)).padStart(2,'0')}H ${String((period % MINUTES_IN_HOUR).toFixed()).padStart(2,'0')}M`;
}

export { getRandomArrayElement, humanizeTaskDueDate, dayjs, getTimePeriod, getDefaultPoint, DATE_FORMAT };
