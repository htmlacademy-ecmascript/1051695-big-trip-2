import SortView from '../view/sort-view.js';

import PointView from '../view/point-view.js';
import PointListView from '../view/point-list-view.js';
import EditPointView from '../view/edit-point-view.js';
import { render, /*RenderPosition*/ } from '../framework/render.js';
// import { getDefaultPoint } from '../utils.js';


export default class BoardPresenter {

  #editPointView = new EditPointView();
  #pointListView = new PointListView();
  #pointModel = null;
  #tripEvents = null;


  constructor(tripEvents, pointModel) {
    this.#tripEvents = tripEvents;
    this.#pointModel = pointModel;
  }

  init() {
    const points = this.#pointModel.points;
    const destinations = this.#pointModel.destinations || [];
    const offers = this.#pointModel.offers;

    render(new SortView(), this.#tripEvents);
    render(this.#pointListView, this.#tripEvents);
    // render(new EditPointView(getDefaultPoint(), destinations, offers), this.#pointListView.element, RenderPosition.AFTERBEGIN);
    // render(new EditPointView(points[3], destinations, offers), this.#pointListView.element);

    for (const point of points) {
      this.#renderEvent(point, destinations, offers);
    }
  }

  #renderEvent(point, destinations, offers) {
    const eventComponent = new PointView(point, destinations, offers);
    // const editPointComponent = new EditPointView(point, destinations, offers);

    render(eventComponent, this.#pointListView.element);

  }
}
