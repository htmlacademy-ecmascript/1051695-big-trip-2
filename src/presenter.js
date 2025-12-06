import SortView from './view/sort-view.js';
import FilterView from './view/filter-view.js';
import PointView from './view/point-view.js';
import PointListView from './view/point-list-view.js';
import EventEditView from './view/event-edit-view.js';
import { render } from './render.js';


export default class BoardPresenter {
  pointListView = new PointListView();

  constructor({ tripControls, tripEvents }) {
    this.tripControls = tripControls;
    this.tripEvents = tripEvents;
  }

  init() {
    render(new FilterView(), this.tripControls);
    render(new SortView(), this.tripEvents);
    render(this.pointListView, this.tripEvents);
    render(new EventEditView(), this.pointListView.getElement());
    for (let i = 0; i < 3; i++) {
      render(new PointView(), this.pointListView.getElement());
    }
  }
}
