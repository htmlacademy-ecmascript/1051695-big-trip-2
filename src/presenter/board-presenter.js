import SortView from '../view/sort-view.js';
import PointListView from '../view/point-list-view.js';
import { render, remove, replace, RenderPosition } from '../framework/render.js';
import PointPresenter from './point-presenter.js';
import ListEmptyView from '../view/list-empty-view.js';
import LoadingFailView from '../view/loading-fail-view.js';
import { filter } from '../utils/filter-utils.js';
import { sortByPrice, sortByTime, sortByDate } from '../utils/sort-utils.js';
import { SortType, UserAction, UpdateType, FilterType, TimeLimit } from '../consts.js';
import NewPointPresenter from './new-point-presenter.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

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
  #isLoading = true;
  #newPointPresenter = null;

  #loadingFailComponent = new LoadingFailView();
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor({ pointsContainer, pointsModel, filterModel, newPointButton }) {
    this.#filterModel = filterModel;
    this.#tripEvents = pointsContainer;
    this.#pointsModel = pointsModel;
    this.#newPointButton = newPointButton;
    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#listEmptyComponent = null;
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
    if (this.#isLoading) {
      this.#newPointButton.disabled = true;
      this.#renderLoading();
      return;
    }
    if (this.points.length) {
      this.#renderSort();
      this.#renderPoints(this.points);
    } else {
      this.#renderEmptyList();
    }
  }

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenters.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch (err) {
          this.#pointPresenters.get(update.id).setResetting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
          this.#newPointPresenter.destroy();
        } catch (err) {
          this.#newPointPresenter.setResetting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenters.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
          if (this.points.length === 0) {
            remove(this.#sortComponent);
            render(this.#listEmptyComponent, this.#tripEvents);
          }
        } catch (err) {
          this.#pointPresenters.get(update.id).setResetting();
        }
        break;
    }
    this.#uiBlocker.unblock();
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
        this.#isLoading = false;
        remove(this.#listEmptyComponent);
        this.#renderSort();
        this.#renderPoints(this.points);
        break;
      case UpdateType.ERROR:
        this.#isLoading = false;
        replace(this.#loadingFailComponent, this.#listEmptyComponent);
        break;
    }

  };

  #renderEmptyList() {
    this.#listEmptyComponent = new ListEmptyView((this.#filterModel.filter));
    render(this.#listEmptyComponent, this.#tripEvents);
  }

  #renderLoading() {
    this.#listEmptyComponent = new ListEmptyView((this.#filterModel.filter), true);
    render(this.#listEmptyComponent, this.#tripEvents);
  }

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
    this.#newPointButton.disabled = false;
    if (!points.length) {
      this.#renderEmptyList();
      remove(this.#sortComponent);
      render(this.#listEmptyComponent, this.#tripEvents);
    }
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
    this.#newPointPresenter = new NewPointPresenter({
      destinations: destinations,
      offers: offers,
      pointsContainer: this.#pointListView,
      onDataChange: this.#handleViewAction,
      newPointButton: this.#newPointButton,
      cancelHandler: this.#handleNewPointFormClose,
    });

    this.#pointPresenters.set(newId, this.#newPointPresenter);
    this.#newPointPresenter.init();
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
    remove(this.#listEmptyComponent);
    this.#renderNewPoint(this.#pointsModel.destinations, this.#pointsModel.offers);
    this.#newPointButton.disabled = true;
  };

  #handleNewPointFormClose = () => {
    this.#newPointButton.disabled = false;
    if (this.points.length === 0) {
      this.#pointListView.element.replaceChildren();
      render(this.#listEmptyComponent, this.#tripEvents);
    }
  };
}
