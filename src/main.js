import BoardPresenter from './presenter/board-presenter';
import FilterPresenter from './presenter/filter-presenter.js';
import PointModel from './model/point-model.js';
import FilterModel from './model/filter-model.js';
import PointsApiService from './points-api-service.js';
import { API_SERVER, TOKEN } from './consts.js';

const pointsApiService = new PointsApiService(API_SERVER, TOKEN);
const filtersContainer = document.querySelector('.trip-controls__filters');
const pointsContainer = document.querySelector('.trip-events');
const newPointButton = document.querySelector('.trip-main__event-add-btn');
const pointsModel = new PointModel(pointsApiService);
const filterModel = new FilterModel();
const boardPresenter = new BoardPresenter({ pointsContainer, pointsModel, filterModel, newPointButton });
const filterPresenter = new FilterPresenter({ filtersContainer, pointsModel, filterModel, newPointButton });

filterPresenter.init();
boardPresenter.init();
pointsModel.init();

