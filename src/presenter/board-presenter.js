import SortView from '../view/sort-view.js';
import PointListView from '../view/point-list-view.js';
import { render } from '../framework/render.js';
import PointPresenter from './point-presenter.js';
// import { RenderPosition, remove } from '../framework/render.js';
import ListEmptyView from '../view/list-empty-view.js';
// import { getDefaultPoint } from '../utils.js';

export default class BoardPresenter {

  #pointListView = new PointListView();
  #pointModel = null;
  #tripEvents = null;

  constructor(tripEvents, pointModel) {
    this.#tripEvents = tripEvents;
    this.#pointModel = pointModel;
  }

  init() {
    const points = this.#pointModel.points || [];
    const destinations = this.#pointModel.destinations || [];
    const offers = this.#pointModel.offers;

    if (points.length) {
      render(new SortView(), this.#tripEvents);
      render(this.#pointListView, this.#tripEvents);
      this.#renderPoints(points,destinations,offers);
    } else {
      render(new ListEmptyView(), this.#tripEvents);
    }
  }

  #renderPoints(points, destinations, offers) {
    for (const point of points) {
      this.#renderPoint(point, destinations, offers);
    }
  }

  #renderPoint(point, destinations, offers) {
    const pointPresenter = new PointPresenter(this.#pointListView);
    pointPresenter.init(point, destinations, offers);
  }
}
