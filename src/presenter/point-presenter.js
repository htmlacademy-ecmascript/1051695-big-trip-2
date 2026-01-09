import PointView from '../view/point-view';
import EditPointView from '../view/edit-point-view';
import { render, replace, remove } from '../framework/render';

export default class PointPresenter {
  #pointComponent = null;
  #editPointComponent = null;
  #pointsContainer = null;
  #point = null;
  #currentDestination = null;
  #currentOffers = null;
  #destinations = null;
  #offers = null;
  #onClickFavoriteButton = null;
  #onClickFormOpen = null;
  #isOpenEdit = false;
  constructor({ pointsContainer, destinations, offers, onClickFavoriteButton, onFormOpen }) {
    this.#pointsContainer = pointsContainer;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#onClickFavoriteButton = onClickFavoriteButton;
    this.#onClickFormOpen = onFormOpen;
  }

  init(point) {
    this.#point = point;
    this.#currentDestination = this.#destinations.find((dest) => point.destination === dest.id);
    this.#currentOffers = this.#offers.find((offer) => offer.type === point.type)?.offers.filter((typeOffer) => point.offers.includes(typeOffer.id));

    const prevPointComponent = this.#pointComponent;
    const prevEditPointComponent = this.#editPointComponent;


    this.#pointComponent = new PointView({
      point: this.#point,
      destination: this.#currentDestination,
      offers: this.#currentOffers,
      onRollupBtnClick: this.#onRollupBtnPointClick,
      onFavoriteBtnClick: this.#onToggleFavoriteState,
    });

    this.#editPointComponent = new EditPointView({
      point: this.#point,
      destination: this.#currentDestination,
      offers: this.#currentOffers,
      onRollupBtnFormClick: this.#onRollupBtnFormClick,
      onSaveBtnClick: this.#onSaveBtnClick
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
      replace(this.#pointComponent, this.#editPointComponent);
      this.#isOpenEdit = false;
      document.removeEventListener('keydown', this.#onEscKeydown);
    }
  };

  #onRollupBtnFormClick = () => {
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

  #onToggleFavoriteState = () => {
    this.#onClickFavoriteButton({ ...this.#point, isFavorite: !this.#point.isFavorite });
  };

}
