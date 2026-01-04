import BoardPresenter from './presenter/board-presenter';
import FilterView from './view/filter-view.js';
import { render } from './framework/render.js';
import PointModel from './model/point-model.js';
import { filter } from './utils/filter-utils.js';
import { generateFilter } from './mocks/filter.js';

const filtersContainer = document.querySelector('.trip-controls__filters');
const pointsContainer = document.querySelector('.trip-events');
const pointModel = new PointModel();
const boardPresenter = new BoardPresenter(pointsContainer, pointModel);

render(new FilterView(generateFilter(filter)), filtersContainer);

boardPresenter.init();

