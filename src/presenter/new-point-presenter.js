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
  #newPointButton = null;
  #point = getDefaultPoint();
  #cancelHandler = null;

  constructor({ pointsContainer, onDataChange, destinations, offers, newPointButton, cancelHandler }) {
    this.#pointsContainer = pointsContainer;
    this.#handleDataChange = onDataChange;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#newPointButton = newPointButton;
    this.#cancelHandler = cancelHandler;
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
    document.addEventListener('keydown', this.#documentEscKeydownHandler);
  }

  destroy() {
    remove(this.#newPointComponent);
  }

  reset() {
    this.#newPointButton.disabled = false;
    remove(this.#newPointComponent);
  }

  setSaving() {
    document.removeEventListener('keydown', this.#documentEscKeydownHandler);
    this.#newPointComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setResetting() {
    document.removeEventListener('keydown', this.#documentEscKeydownHandler);
    const resetFormState = () => {
      this.#newPointComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
      document.addEventListener('keydown', this.#documentEscKeydownHandler);
    };
    this.#newPointComponent.shake(resetFormState);
  }

  #documentEscKeydownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      remove(this.#newPointComponent);
      this.#cancelHandler();
      this.#newPointButton.disabled = false;
      document.removeEventListener('keydown', this.#documentEscKeydownHandler);
    }
  };

  #formSubmitHandler = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MAJOR,
      point);
    this.#newPointButton.disabled = false;
  };

  #onCancelBtnClick = () => {
    remove(this.#newPointComponent);
    this.#cancelHandler();
    this.#newPointButton.disabled = false;
    document.removeEventListener('keydown', this.#documentEscKeydownHandler);
  };
}
