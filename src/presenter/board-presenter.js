import SortView from '../view/sort-view.js';
import FilterView from '../view/filter-view.js';
import PointView from '../view/point-view.js';
import PointListView from '../view/point-list-view.js';
import EventEditView from '../view/event-edit-view.js';
import NewPointView from '../view/new-point-view.js';
import { render, RenderPosition } from '../render.js';
import PointModel from '../model/point-model.js';
// import { getDefaultPoint } from '../utils.js';

export default class BoardPresenter {

  constructor({ tripControls, tripEvents }) {
    this.tripControls = tripControls;
    this.tripEvents = tripEvents;
    this.pointModel = new PointModel();
    this.pointListView = new PointListView();
  }

  init() {
    this.pointModel.init();
    const points = this.pointModel.getPoints();
    const destinations = this.pointModel.getDestinations();
    const offers = this.pointModel.getOffers();

    render(new FilterView(), this.tripControls);
    render(new SortView(), this.tripEvents);
    render(this.pointListView, this.tripEvents);
    render(new NewPointView(points[0], destinations, offers), this.pointListView.getElement(), RenderPosition.AFTERBEGIN);
    render(new EventEditView(points[1], destinations, offers), this.pointListView.getElement());

    for (const point of points) {
      render(new PointView (point, destinations, offers), this.pointListView.getElement());
    }
  }
}
