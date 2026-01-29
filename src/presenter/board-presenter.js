import SortView from '../view/sort-view.js';
import PointListView from '../view/point-list-view.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import PointPresenter from './point-presenter.js';
import ListEmptyView from '../view/list-empty-view.js';
import { filter } from '../utils/filter-utils.js';
import { sortByPrice, sortByTime, sortByDate } from '../utils/sort-utils.js';
import { SortType, UserAction, UpdateType, FilterType } from '../consts.js';
import NewPointPresenter from './new-point-presenter.js';
export default class BoardPresenter {

  #pointListView = new PointListView();
  #tripEvents = null;
  #filterModel = null;
  #pointsModel = null;
  #newPointButton = null;
  #pointPresenters = new Map();
  #listEmptyComponent = {};
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.EVERYTHING;
  #sortComponent = null;

  constructor({ pointsContainer, pointsModel, filterModel, newPointButton }) {
    this.#filterModel = filterModel;
    this.#tripEvents = pointsContainer;
    this.#pointsModel = pointsModel;
    this.#newPointButton = newPointButton;
    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#listEmptyComponent = new ListEmptyView((this.#filterModel.filter), this.#tripEvents);
    this.#sortComponent = new SortView({ onSortTypeChange: this.#handleSortTypeChange });
    this.#newPointButton.addEventListener('click', this.#newPointButtonHandler);
  }

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

  init() {
    if (this.points.length) {
      this.#renderSort();
      this.#renderPoints(this.points);
    } else {
      render(this.#listEmptyComponent, this.#tripEvents);
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
        if (this.points.length === 0) {
          this.#listEmptyComponent = new ListEmptyView((this.#filterModel.filter), this.#tripEvents);
          render(this.#listEmptyComponent, this.#tripEvents);
        }
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderPoints(this.points, this.#pointsModel.destinations, this.#pointsModel.offers);
        break;
      case UpdateType.MAJOR:
        this.#clearBoard();
        this.#changeSort();
        this.#renderPoints(this.points, this.#pointsModel.destinations, this.#pointsModel.offers);
        this.#handleSortTypeChange();
        break;
      case UpdateType.INIT:
        remove(this.#listEmptyComponent);
        this.#renderSort();
        this.#renderPoints(this.points);
    }
  };

  #renderSort() {
    render(this.#sortComponent, this.#tripEvents, RenderPosition.AFTERBEGIN);
  }

  #changeSort() {
    remove(this.#sortComponent);
    this.#sortComponent = null;
    this.#sortComponent = new SortView({ onSortTypeChange: this.#handleSortTypeChange });
    this.#renderSort();
  }

  #clearBoard() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
    remove(this.#listEmptyComponent);
    if (this.#pointsModel.points.length === 0) {
      remove(this.#sortComponent);
    }
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
    pointPresenter.init(point);
  }

  #renderNewPoint(destinations, offers) {
    const newId = Date.now();
    const newPointPresenter = new NewPointPresenter({
      destinations: destinations,
      offers: offers,
      pointsContainer: this.#pointListView,
      onDataChange: this.#handleViewAction,
      onFormOpen: this.#handleFormOpen,
      newId: newId,
      newPointButton: this.#newPointButton,
    });

    this.#pointPresenters.set(newId, newPointPresenter);
    newPointPresenter.init();
  }


  #handleFormOpen = () => {
    this.#pointPresenters.forEach((pointPresenter) => pointPresenter.reset());
  };

  #handleSortTypeChange = (sortType = SortType.DEFAULT) => {
    if (sortType === this.#currentSortType) {
      return;
    }
    this.#newPointButton.disabled = false;
    this.#currentSortType = sortType;
    remove(this.#pointListView);
    if (this.points.length === 0) {
      render(this.#listEmptyComponent, this.#tripEvents);
    } else {
      remove(this.#listEmptyComponent);
      this.#renderPoints(this.points, this.#pointsModel.destinations, this.#pointsModel.offers);
    }
  };

  #newPointButtonHandler = () => {
    this.#currentSortType = SortType.DEFAULT;
    this.#changeSort();
    this.#filterType = FilterType.EVERYTHING;
    this.#filterModel.setFilter(UpdateType.MINOR, this.#filterType);
    this.#renderNewPoint(this.#pointsModel.destinations, this.#pointsModel.offers);
    this.#newPointButton.disabled = true;
  };
}
