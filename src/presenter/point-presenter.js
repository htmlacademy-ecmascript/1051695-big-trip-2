import PointView from '../view/point-view';
import EditPointView from '../view/edit-point-view';
import { render, replace } from '../framework/render';

export default class PointPresenter {
  #pointComponent = null;
  #editPointComponent = null;
  #pointsContainer = null;
  #point = null;
  #destinations = null;
  #offers = null;

  constructor(pointsContainer) {
    this.#pointsContainer = pointsContainer;
  }

  init(point, destinations, offers) {
    this.#point = point;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#pointComponent = new PointView(this.#point, this.#destinations, this.#offers, this.#onRollupBtnPointClick);
    this.#editPointComponent = new EditPointView(this.#point, this.#destinations, this.#offers, this.#onRollupBtnFormClick, this.#onRollupBtnFormClick);

    render(this.#pointComponent, this.#pointsContainer.element);
  }

  #onEscKeydown = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      replace(this.#pointComponent, this.#editPointComponent);
      document.removeEventListener('keydown', this.#onEscKeydown);
    }
  };

  #onRollupBtnFormClick = () => {
    replace(this.#pointComponent, this.#editPointComponent);
    document.removeEventListener('keydown', this.#onEscKeydown);
  };

  #onRollupBtnPointClick = () => {
    replace(this.#editPointComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#onEscKeydown);
  };

}
