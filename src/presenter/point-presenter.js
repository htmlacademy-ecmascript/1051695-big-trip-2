import PointView from '../view/point-view';
import EditPointView from '../view/edit-point-view';
import { render, replace, remove } from '../framework/render';
import { UserAction, UpdateType } from '../consts';

export default class PointPresenter {
  #pointComponent = null;
  #editPointComponent = null;
  #pointsContainer = null;
  #point = null;
  #destinations = null;
  #offers = null;
  #handleDataChange = null;
  #onClickFormOpen = null;
  #isOpenEdit = false;
  constructor({ pointsContainer, onDataChange, onFormOpen, destinations, offers }) {
    this.#pointsContainer = pointsContainer;
    this.#handleDataChange = onDataChange;
    this.#onClickFormOpen = onFormOpen;
    this.#destinations = destinations;
    this.#offers = offers;
  }

  init(point) {
    this.#point = point;
    const prevPointComponent = this.#pointComponent;
    const prevEditPointComponent = this.#editPointComponent;

    this.#pointComponent = new PointView({
      point: this.#point,
      destinations: this.#destinations,
      offers: this.#offers,
      onRollupBtnClick: this.#onRollupBtnPointClick,
      onFavoriteBtnClick: this.#onToggleFavoriteState,
    });

    this.#editPointComponent = new EditPointView({
      point: this.#point,
      destinations: this.#destinations,
      offers: this.#offers,
      onRollupBtnFormClick: this.#onRollupBtnFormClick,
      onFormSubmit: this.#formSubmitHandler,
      onResetBtnClick: this.#onDeleteBtnClick,
    });

    if (prevPointComponent === null || prevEditPointComponent === null) {
      render(this.#pointComponent, this.#pointsContainer.element);
      return;
    }

    if (this.#pointsContainer.element.contains(prevPointComponent.element)) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#pointsContainer.element.contains(prevEditPointComponent.element)) {
      replace(this.#editPointComponent, prevEditPointComponent);
    }

    remove(prevPointComponent);
    remove(prevEditPointComponent);
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#editPointComponent);
  }

  reset() {
    if (this.#isOpenEdit) {
      this.#onRollupBtnFormClick();
    }
  }

  setSaving() {
    if (this.#isOpenEdit) {
      this.#editPointComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setDeleting() {
    if (this.#isOpenEdit) {
      this.#editPointComponent.updateElement({
        isDisabled: true,
        isSaving: false,
        isDeleting: true,
      });
    }
  }


  setResetting() {
    if (!this.#isOpenEdit) {
      this.#pointComponent.shake();
      return;
    }

    const reset = () => {
      this.#editPointComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#editPointComponent.shake(reset);
  }

  #onEscKeydown = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#editPointComponent.resetPoint(this.#point);
      replace(this.#pointComponent, this.#editPointComponent);
      this.#isOpenEdit = false;
      document.removeEventListener('keydown', this.#onEscKeydown);
    }
  };

  #onRollupBtnFormClick = () => {
    this.#editPointComponent.resetPoint(this.#point);
    replace(this.#pointComponent, this.#editPointComponent);
    document.removeEventListener('keydown', this.#onEscKeydown);
    this.#isOpenEdit = false;
  };

  #onRollupBtnPointClick = () => {
    this.#onClickFormOpen();
    this.#isOpenEdit = true;
    replace(this.#editPointComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#onEscKeydown);
  };

  #formSubmitHandler = (point) => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      point);
    document.removeEventListener('keydown', this.#onEscKeydown);
  };

  #onDeleteBtnClick = () => {
    this.#handleDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      this.#point);
  };

  #onToggleFavoriteState = () => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      { ...this.#point, isFavorite: !this.#point.isFavorite });
  };

}
