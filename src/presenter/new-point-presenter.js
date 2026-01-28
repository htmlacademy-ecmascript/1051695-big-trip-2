import EditPointView from '../view/edit-point-view';
import { render, RenderPosition, remove } from '../framework/render';
import { UserAction, UpdateType } from '../consts';
import { getDefaultPoint } from '../utils/utils';

export default class NewPointPresenter {
  #newPointComponent = null;
  #pointsContainer = null;
  #destinations = null;
  #offers = null;
  #handleDataChange = null;
  #onClickFormOpen = null;
  #newId = null;
  #newPointButton = null;
  #point = getDefaultPoint();

  constructor({ pointsContainer, onDataChange, onFormOpen, destinations, offers, newId, newPointButton }) {
    this.#pointsContainer = pointsContainer;
    this.#handleDataChange = onDataChange;
    this.#onClickFormOpen = onFormOpen;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#newId = newId;
    this.#newPointButton = newPointButton;
  }

  init() {
    this.#newPointComponent = new EditPointView({
      point: this.#point,
      destinations: this.#destinations,
      offers: this.#offers,
      onFormSubmit: this.#formSubmitHandler,
      onResetBtnClick: this.#onCancelBtnClick,
    });

    render(this.#newPointComponent, this.#pointsContainer.element, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#onEscKeydown);
  }

  destroy() {
    remove(this.#newPointComponent);
  }

  reset() {
    this.#newPointButton.disabled = false;
    remove(this.#newPointComponent);
  }


  #formSubmitHandler = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MAJOR,
      { ...point, id: this.#newId });
    this.#onClickFormOpen();
    this.#newPointButton.disabled = false;
    document.removeEventListener('keydown', this.#onEscKeydown);

  };

  #onCancelBtnClick = () => {
    remove(this.#newPointComponent);
    this.#newPointButton.disabled = false;
    document.removeEventListener('keydown', this.#onEscKeydown);
  };

  #onEscKeydown = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      remove(this.#newPointComponent);
      this.#newPointButton.disabled = false;
      document.removeEventListener('keydown', this.#onEscKeydown);
    }
  };
}
