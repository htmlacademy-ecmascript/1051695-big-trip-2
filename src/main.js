import BoardPresenter from './presenter/board-presenter';
import FilterPresenter from './presenter/filter-presenter.js';
import PointModel from './model/point-model.js';
import FilterModel from './model/filter-model.js';


const filtersContainer = document.querySelector('.trip-controls__filters');
const pointsContainer = document.querySelector('.trip-events');
const pointsModel = new PointModel();
const filterModel = new FilterModel();
const boardPresenter = new BoardPresenter(pointsContainer, pointsModel, filterModel);
const filterPresenter = new FilterPresenter(filtersContainer,pointsModel, filterModel);

filterPresenter.init();
boardPresenter.init();

