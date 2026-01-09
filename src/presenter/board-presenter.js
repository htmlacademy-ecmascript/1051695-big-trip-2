import SortView from '../view/sort-view.js';
import PointListView from '../view/point-list-view.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import PointPresenter from './point-presenter.js';
import ListEmptyView from '../view/list-empty-view.js';
// import { getDefaultPoint } from '../utils/utils.js';
import { updatePoint } from '../utils/utils.js';
import { sortByPrice, sortByTime, sortByDate } from '../utils/sort-utils.js';
import { SortType } from '../consts.js';

export default class BoardPresenter {

  #pointListView = new PointListView();
  #tripEvents = null;
  #points = null;
  #offers = null;
  #destinations = null;
  #pointPresenter = new Map();
  #currentSortType = SortType.DEFAULT;
  #defaultSortPoints = [];

  constructor(tripEventsContainer, pointModel) {
    this.#tripEvents = tripEventsContainer;
    this.#points = pointModel.points || [];
    this.#destinations = pointModel.destinations || [];
    this.#offers = pointModel.offers;
  }

  init() {
    this.#defaultSortPoints = [...this.#points].sort(sortByDate);
    if (this.#points.length) {
      render(new SortView({ onSortTypeChange: this.#handleSortTypeChange }), this.#tripEvents, RenderPosition.AFTERBEGIN);
      this.#renderPoints(this.#defaultSortPoints);
    } else {
      render(new ListEmptyView(), this.#tripEvents);
    }
  }


  #renderPoints(points) {
    render(this.#pointListView, this.#tripEvents);
    for (const point of points) {
      this.#renderPoint(point);
    }
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointsContainer: this.#pointListView,
      destinations: this.#destinations,
      offers: this.#offers,
      onClickFavoriteButton: this.#handlePointChange,
      onFormOpen: this.#handleFormOpen,
    });
    this.#pointPresenter.set(point.id, pointPresenter);
    pointPresenter.init(point);
  }

  #handlePointChange = (updatedPoint) => {
    this.#points = updatePoint(this.#points, updatedPoint);
    this.#defaultSortPoints = updatePoint(this.#defaultSortPoints,updatedPoint);
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint);
  };

  #handleFormOpen = () => {
    this.#pointPresenter.forEach((pointPresenter) => pointPresenter.reset());
  };

  #handleSortTypeChange = (sortType) => {
    if (sortType === this.#currentSortType) {
      return;
    }
    this.#sortPoints(sortType);
    remove(this.#pointListView);
    this.#renderPoints(this.#points);
    this.#currentSortType = sortType;
  };


  #sortPoints = (sortType) => {
    switch (sortType) {
      case 'default':
        this.#points = [...this.#defaultSortPoints];
        break;
      case 'time':
        this.#points.sort(sortByTime);
        break;
      case 'price':
        this.#points.sort(sortByPrice);
        break;
    }
  };
}
