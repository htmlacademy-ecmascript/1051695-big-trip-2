
import { humanizeTaskDueDate } from '../utils/utils.js';
import { DateFormat } from '../consts.js';
// import { POINT_TYPES } from '../consts.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

function createNewPointTemplate(point, destinations, offers = []) {
  const { basePrice, dateFrom, dateTo, type } = point;
  const typeOffers = offers.find((offer) => offer.type === point.type)?.offers || [];
  const pointOffers = typeOffers.filter((typeOffer) => point.offers.includes(typeOffer.id));
  const pointDestination = destinations.find((dest) => point.destination === dest.id) || null;
  const pointId = point.id || 0;

  const createButtonsTemplate = () => {
    if (!pointId) {
      return `
        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Cancel</button>`;
    }
    return `
      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Delete</button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>`;
  };

  const createDestinationTemplate = (dest) => {
    if (!dest || dest.id === 0 || dest.description === '' || !dest.description) {
      return ('');
    }

    return `
      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${dest.description}</p>
        <div class="event__photos-container">
          <div class="event__photos-tape">
          ${dest.pictures?.map((pic) => `<img class="event__photo" src="${pic.src}" alt="${pic.description}">`).join('')}
          </div>
        </div>
      </section>`;

  };

  const createOffersTemplate = (offersByType) => {
    if (offersByType.length === 0) {
      return '';
    }
    return `
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
        ${offersByType.map((offer) => (`
          <div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" id="event-offer-${pointId}-${offer.id}" type="checkbox" name="event-${offer.title}"  ${pointOffers.map((off) => off.id).includes(offer.id) ? 'checked' : ''} data-offer-id="${offer.id}">
            <label class="event__offer-label" for="event-offer-${pointId}-${offer.id}">
              <span class="event__offer-title">${offer.title}</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">${offer.price}</span>
            </label>
          </div>`)).join('')}
      </section>`;
  };
  return `
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-${pointId}">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="${type} icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-${pointId}" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${(offers.map((offer) => `
                  <div class="event__type-${offer.type}">
                    <input id="event-type-${offer.type}-${pointId}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${offer.type}" ${offer.type === point.type ? 'checked' : ''}>
                    <label class="event__type-label  event__type-label--${offer.type}" for="event-type-${offer.type}-${pointId}">${offer.type.charAt(0).toUpperCase() + offer.type.slice(1)}</label>
                  </div>`)).join('')}

                ${/*(POINT_TYPES.map((el) => `
                  <div class="event__type-${el}">
                    <input id="event-type-${el}-${pointId}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${el}" ${el === point.type ? 'checked' : ''}>
                    <label class="event__type-label  event__type-label--${el}" for="event-type-${el}-${pointId}" >${el.slice(0, 1).toUpperCase() + el.slice(1)}</label>
                  </div>`)).join('')*/''}
              </fieldset>
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-${pointId}">
              ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-${pointId}" type="text" name="event-destination" value="${pointDestination ? pointDestination?.name : ''}" list="destination-list-${pointId}" required>
            <datalist id="destination-list-${pointId}">
            ${destinations.map((dest) => `<option value="${dest.name}"></option>`).join('')}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-${pointId}">From</label>
            <input class="event__input  event__input--time" id="event-start-time-${pointId}" type="text" name="event-start-time" value="${humanizeTaskDueDate(dateFrom, DateFormat.dateTime)}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-${pointId}">To</label>
            <input class="event__input  event__input--time" id="event-end-time-${pointId}" type="text" name="event-end-time" value="${humanizeTaskDueDate(dateTo, DateFormat.dateTime)}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-${pointId}">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-${pointId}" type="number" name="event-price" value="${basePrice}">
          </div>
          ${createButtonsTemplate()}
        </header>
        ${pointDestination || typeOffers.length > 0 ? `
          <section class="event__details">
            ${typeOffers.length > 0 ? createOffersTemplate(typeOffers) : ''}
            ${pointDestination ? createDestinationTemplate(pointDestination) : ''}
          </section>
        ` : ''}
      </form>
    </li>`;
}

export default class EditPointView extends AbstractStatefulView {

  #destinations = null;
  #offers = null;
  #handleRollupBtnClick = null;
  #handleFormSubmit = null;
  #handleResetBtnClick = null;
  #datepickerFrom = null;
  #datepickerTo = null;
  constructor({ point, destinations, offers, onRollupBtnFormClick, onFormSubmit, onResetBtnClick }) {
    super();
    this.#destinations = destinations;
    this.#offers = offers;
    this.#handleRollupBtnClick = onRollupBtnFormClick;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleResetBtnClick = onResetBtnClick;
    this._setState(EditPointView.parsePointToState(point));
    this._restoreHandlers();

  }

  get template() {
    return createNewPointTemplate(this._state, this.#destinations, this.#offers);
  }

  resetPoint = (point) => this.updateElement(point);
  _restoreHandlers() {
    this.#setHandlers();
    this.#setDatepickers();
  }

  #setHandlers() {
    if (this.element.querySelector('.event__rollup-btn')) {
      this.element.querySelector('.event__rollup-btn')
        .addEventListener('click', this.#rollupBtnHandler);
    }
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#priceChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelectorAll('.event__offer-checkbox').forEach((el) => el.addEventListener('change', this.#offerChangeHandler));
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#resetBtnClick);
  }

  #typeChangeHandler = (evt) => {
    evt.preventDefault();
    const newType = evt.target.value;
    this.updateElement({
      ...this._state,
      type: newType,
      offers: []
    });
  };

  #priceChangeHandler = (evt) => {
    evt.preventDefault();
    const newPrice = Number(evt.target.value) > 0 ? Number(evt.target.value) : this._state.basePrice;
    this._setState({
      ...this._state,
      basePrice: newPrice,
    });
  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();
    const newDestination = this.#destinations.find((dest) => dest.name === evt.target.value);
    if (newDestination) {
      this.updateElement({
        ...this._state,
        destination: newDestination.id,
      });
    } else {
      evt.target.value = this.#destinations.find((dest) => dest.id === this._state.destination)?.name;
    }
  };

  #offerChangeHandler = (evt) => {
    const { checked, dataset } = evt.target;
    const offerId = dataset.offerId;
    const oldOffers = this._state.offers ?? [];

    let newOffers;

    if (checked) {
      newOffers = oldOffers.includes(offerId) ? oldOffers : [...oldOffers, offerId];
    } else {
      newOffers = oldOffers.filter((id) => id !== offerId);
    }

    this._setState({
      ...this._state,
      offers: newOffers,
    });
  };


  #rollupBtnHandler = (evt) => {
    evt.preventDefault();
    this.#handleRollupBtnClick();
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(EditPointView.parseStateToPoint(this._state));
  };

  #resetBtnClick = (evt) => {
    evt.preventDefault();
    this.#handleResetBtnClick();
  };

  #setDatepickers = () => {

    this.#datepickerFrom?.destroy();
    this.#datepickerFrom = null;
    this.#datepickerTo?.destroy();
    this.#datepickerTo = null;

    const [datepickerFromElement, datepickerToElement] = this.element.querySelectorAll('.event__input--time');

    const datepickerCommonConfig = {
      'time_24hr': true,
      enableTime: true,
      dateFormat: 'd/m/y H:i',
      locale: { firstDayOfWeek: 1 }
    };

    this.#datepickerFrom = flatpickr(
      datepickerFromElement,
      {
        ...datepickerCommonConfig,
        defaultDate: this._state.dateFrom,
        onChange: this.#OnDateFromClose,
        maxDate: this._state.dateTo,
      }
    );

    this.#datepickerTo = flatpickr(
      datepickerToElement,
      {
        ...datepickerCommonConfig,
        defaultDate: this._state.dateTo,
        onChange: this.#OnDateToClose,
        minDate: this._state.dateFrom,
      }
    );
  };

  #OnDateFromClose = ([newStartDate]) => {
    this._setState({
      ...this._state,
      dateFrom: newStartDate
    });

    this.#datepickerTo.set('minDate', newStartDate);
  };

  #OnDateToClose = ([newEndDate]) => {
    this._setState({
      ...this._state,
      dateTo: newEndDate
    });

    this.#datepickerFrom.set('maxDate', newEndDate);
  };

  static parsePointToState = (point) => ({
    ...point,
  });

  static parseStateToPoint = (state) => {
    const point = { ...state };
    return point;
  };
}
