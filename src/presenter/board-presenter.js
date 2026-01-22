import SortView from '../view/sort-view.js';
import PointListView from '../view/point-list-view.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import PointPresenter from './point-presenter.js';
import ListEmptyView from '../view/list-empty-view.js';
import { filter } from '../utils/filter-utils.js';
import { FilterType } from '../consts.js';

import { sortByPrice, sortByTime, sortByDate } from '../utils/sort-utils.js';
import { SortType, UserAction, UpdateType } from '../consts.js';
export default class BoardPresenter {

  #pointListView = new PointListView();
  #tripEvents = null;
  #filterModel = null;
  #pointsModel = null;
  #destinations = null;
  #pointPresenters = new Map();
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.EVERYTHING;


  constructor(tripEventsContainer, pointModel, filterModel) {
    this.#filterModel = filterModel;
    this.#tripEvents = tripEventsContainer;
    this.#pointsModel = pointModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  init() {
    if (this.points.length) {
      this.#renderSort();
      this.#renderPoints(this.points);
    } else {
      render(new ListEmptyView(), this.#tripEvents);
    }
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        remove(this.#pointListView);
        this.#renderPoints(this.points, this.#pointsModel.destinations, this.#pointsModel.offers);
        this.#handleSortTypeChange(this.#currentSortType);
        break;
      case UpdateType.MAJOR:
        remove(this.#pointListView);
        this.#renderPoints(this.points, this.#pointsModel.destinations, this.#pointsModel.offers);
        break;
    }
  };

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);
    switch (this.#currentSortType) {
      case SortType.TIME:
        return filteredPoints.sort(sortByTime);
      case SortType.PRICE:
        return filteredPoints.sort(sortByPrice);
    }
    return filteredPoints.sort(sortByDate);
  }


  #renderSort() {
    render(new SortView({ onSortTypeChange: this.#handleSortTypeChange }), this.#tripEvents, RenderPosition.AFTERBEGIN);
  }

  #renderPoints(points) {
    render(this.#pointListView, this.#tripEvents);

    for (const point of points) {
      this.#renderPoint(point, this.#pointsModel.destinations, this.#pointsModel.offers);
    }
  }

  #renderPoint(point, destinations, offers) {
    const pointPresenter = new PointPresenter({
      point: point,
      destinations: destinations,
      offers: offers,
      pointsContainer: this.#pointListView,
      onDataChange: this.#handleViewAction,
      onFormOpen: this.#handleFormOpen,
    });
    this.#pointPresenters.set(point.id, pointPresenter);
    pointPresenter.init(point, destinations, offers);
  }


  #handleFormOpen = () => {
    this.#pointPresenters.forEach((pointPresenter) => pointPresenter.reset());
  };

  #handleSortTypeChange = (sortType) => {
    if (sortType === this.#currentSortType) {
      return;
    }
    this.#currentSortType = sortType;
    remove(this.#pointListView);
    this.#renderPoints(this.points, this.#pointsModel.destinations, this.#pointsModel.offers);
  };
}
