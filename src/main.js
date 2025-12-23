import BoardPresenter from './presenter/board-presenter';
import FilterView from './view/filter-view.js';
import { render } from './framework/render.js';
import PointModel from './model/point-model.js';

const filtersContainer = document.querySelector('.trip-controls__filters');
const eventsContainer = document.querySelector('.trip-events');
const pointModel = new PointModel();
const boardPresenter = new BoardPresenter(eventsContainer, pointModel);

render(new FilterView(), filtersContainer);
boardPresenter.init();

