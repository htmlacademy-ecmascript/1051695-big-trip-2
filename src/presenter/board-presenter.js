import SortView from '../view/sort-view.js';
import PointListView from '../view/point-list-view.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import PointPresenter from './point-presenter.js';
import ListEmptyView from '../view/list-empty-view.js';
import FilterView from '../view/filter-view.js';
// import { getDefaultPoint } from '../utils/utils.js';
// import { updatePoint } from '../utils/utils.js';
import { sortByPrice, sortByTime, sortByDate } from '../utils/sort-utils.js';
import { SortType } from '../consts.js';
import { generateFilter } from '../mocks/filter.js';
export default class BoardPresenter {

  #pointListView = new PointListView();
  #tripEvents = null;
  // #points = null;
  #pointsModel = null;
  #offers = null;
  #destinations = null;
  #pointPresenter = new Map();
  #currentSortType = SortType.DEFAULT;
  #filterContainer = null;
  // #defaultSortPoints = [];

  constructor(filterContainer, tripEventsContainer, pointModel) {
    this.#filterContainer = filterContainer;
    this.#tripEvents = tripEventsContainer;
    this.#pointsModel = pointModel;
    // this.#destinations = pointModel.destinations || [];
    // this.#offers = pointModel.offers;
    this.#pointsModel.addObserver(this.#handleModelEvent);
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
    console.log(actionType, updateType, update);
    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные
  };

  #handleModelEvent = (updateType, data) => {
    console.log(updateType, data);
    // В зависимости от типа изменений решаем, что делать:
    // - обновить часть списка (например, когда поменялось описание)
    // - обновить список (например, когда задача ушла в архив)
    // - обновить всю доску (например, при переключении фильтра)
  };

  get points() {
    switch (this.#currentSortType) {
      // case SortType.DAY:
      //   return [...this.#pointsModel.points].sort(sortByDay);
      case SortType.DEFAULT:
        return [...this.#pointsModel.points].sort(sortByDate);
      case SortType.TIME:
        return [...this.#pointsModel.points].sort(sortByTime);
      case SortType.PRICE:
        return [...this.#pointsModel.points].sort(sortByPrice);
    }

    return this.#pointsModel.points;
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
      onDataChange: this.#handlePointChange,
      onFormOpen: this.#handleFormOpen,
    });
    this.#pointPresenter.set(point.id, pointPresenter);
    pointPresenter.init(point, destinations, offers);
  }

  #renderFilters() {
    const filters = generateFilter(this.points);
    render(new FilterView({ filters }), this.#filterContainer);
  }

  #handlePointChange = (actionType, updateType, updatedPoint) => {
    console.log(actionType, updateType);
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint);
  };

  #handleFormOpen = () => {
    this.#pointPresenter.forEach((pointPresenter) => pointPresenter.reset());
  };

  #handleSortTypeChange = (sortType) => {
    if (sortType === this.#currentSortType) {
      return;
    }
    this.#currentSortType = sortType;
    remove(this.#pointListView);
    this.#renderPoints(this.points, this.#pointsModel.destinations, this.#pointsModel.offers);
  };


  // #sortPoints = (sortType) => {
  //   switch (sortType) {
  //     case 'default':
  //       this.#points = [...this.#defaultSortPoints];
  //       break;
  //     case 'time':
  //       this.#points.sort(sortByTime);
  //       break;
  //     case 'price':
  //       this.#points.sort(sortByPrice);
  //       break;
  //   }
  // };
}
