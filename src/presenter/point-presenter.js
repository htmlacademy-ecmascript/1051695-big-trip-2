import PointView from '../view/point-view';
import EditPointView from '../view/edit-point-view';
import { render, replace, remove } from '../framework/render';

export default class PointPresenter {
  #pointComponent = null;
  #editPointComponent = null;
  #pointsContainer = null;
  #point = null;
  #destinations = null;
  #offers = null;
  #onClickFavoriteButton = null;
  #onClickFormOpen = null;
  #isOpenEdit = false;
  constructor({ pointsContainer, onClickFavoriteButton, onFormOpen, destinations, offers }) {
    this.#pointsContainer = pointsContainer;
    this.#onClickFavoriteButton = onClickFavoriteButton;
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
      onSaveBtnClick: this.#onSaveBtnClick,
      onDeleteBtnClick: this.#onDeleteBtnClick,
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

  #onSaveBtnClick = () => {
    replace(this.#pointComponent, this.#editPointComponent);
    document.removeEventListener('keydown', this.#onEscKeydown);
    this.#isOpenEdit = false;
  };

  #onDeleteBtnClick = () => {
    this.destroy();
  };

  #onToggleFavoriteState = () => {
    this.#onClickFavoriteButton({ ...this.#point, isFavorite: !this.#point.isFavorite });
  };

}
