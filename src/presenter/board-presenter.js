import SortView from '../view/sort-view.js';
import PointView from '../view/point-view.js';
import PointListView from '../view/point-list-view.js';
import EditPointView from '../view/edit-point-view.js';
import { render, replace } from '../framework/render.js';
// import { RenderPosition, remove } from '../framework/render.js';
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
    const points = this.#pointModel.points;
    const destinations = this.#pointModel.destinations || [];
    const offers = this.#pointModel.offers;

    render(new SortView(), this.#tripEvents);
    render(this.#pointListView, this.#tripEvents);
    // this.#renderPoint(getDefaultPoint(), destinations, offers);
    // this.#renderPoint(points[3], destinations, offers);

    for (const point of points) {
      this.#renderPoint(point, destinations, offers);
    }
  }

  #renderPoint(point, destinations, offers) {


    const pointComponent = new PointView(point, destinations, offers, onRollupBtnPointClick);
    const editPointComponent = new EditPointView(point, destinations, offers, onRollupBtnFormClick, onRollupBtnFormClick);
    const onEscKeydown = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replace(pointComponent, editPointComponent);
        document.removeEventListener('keydown', onEscKeydown);
      }
    };
    function onRollupBtnFormClick () {
      replace(pointComponent, editPointComponent);
      document.removeEventListener('keydown', onEscKeydown);
    }
    function onRollupBtnPointClick () {
      replace(editPointComponent, pointComponent);
      document.addEventListener('keydown', onEscKeydown);
    }

    render(pointComponent, this.#pointListView.element);

  }
}
