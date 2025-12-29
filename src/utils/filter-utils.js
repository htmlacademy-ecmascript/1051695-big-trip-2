import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { points } from '../mocks/points';

dayjs.extend(utc);

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'furure',
  PRESENT: 'present',
  PAST: 'past',
};

const filter = {
  [FilterType.EVERYTHING]: points.filter((point) => point),
  [FilterType.FUTURE]: points.filter((point) => dayjs(point.dateFrom).isAfter(dayjs().utc())),
  [FilterType.PAST]: points.filter((point) => dayjs(point.dateTo).isBefore(dayjs().utc())),
  [FilterType.PRESENT]: points.filter((point) => dayjs(point.dateFrom).isBefore(dayjs().utc()) && dayjs(point.dateTo).isAfter(dayjs().utc())),
};

export { filter };
