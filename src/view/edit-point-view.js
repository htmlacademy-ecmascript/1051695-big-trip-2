
import { humanizeTaskDueDate, DateFormat } from '../utils.js';
import AbstractView from '../framework/view/abstract-view.js';

const POINT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

function createNewPointTemplate(point, destinations, offers) {
  const { basePrice, dateFrom, dateTo, type } = point;
  const typeOffers = offers.find((offer) => offer.type === point.type).offers;
  const pointOffers = typeOffers.filter((typeOffer) => point.offers.includes(typeOffer.id));
  const pointDestination = destinations.find((dest) => point.destination === dest.id);
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

  const createDestinationTemplate = (destination) => {
    if (!destination || destination.id === 0 || destination.description === '' || !destination.description) {
      return ('');
    }

    return `
      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${destination.description}</p>
        <div class="event__photos-container">
          <div class="event__photos-tape">
          ${destination.pictures?.map((pic) => `<img class="event__photo" src="${pic.src}" alt="${pic.description}">`).join('')}
          </div>
        </div>
      </section>`;

  };

  const createOffersTemplate = (offersArray) => {
    if (offersArray.length === 0) {
      return '';
    }
    return `
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
        ${offersArray.map((offer) => (`
          <div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" id="event-offer-${pointId}-${offer.id}" type="checkbox" name="event-${offer.title}"  ${pointOffers.map((off) => off.id).includes(offer.id) ? 'checked' : ''}>
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
                ${/*(offers.map((offer) => `
                  <div class="event__type-${offer.type}">
                    <input id="event-type-${offer.type}-${pointId}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${offer.type}" ${ offer.type === point.type ? 'checked' : ''}>
                    <label class="event__type-label  event__type-label--${offer.type}" for="event-type-${offer.type}-${pointId}">${offer.type.charAt(0).toUpperCase() + offer.type.slice(1)}</label>
                  </div>`)).join('')*/''}

                ${(POINT_TYPES.map((el) => `
                  <div class="event__type-${el}">
                    <input id="event-type-${el}-${pointId}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${el}" ${el === point.type ? 'checked' : ''}>
                    <label class="event__type-label  event__type-label--${el}" for="event-type-${el}-${pointId}" >${el.slice(0, 1).toUpperCase() + el.slice(1)}</label>
                  </div>`)).join('')}
              </fieldset>
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-${pointId}">
              ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-${pointId}" type="text" name="event-destination" value="${pointDestination ? pointDestination.name : ''}" list="destination-list-${pointId}">
            <datalist id="destination-list-${pointId}">
            ${destinations.map((destination) => `<option value="${destination.name}"></option>`).join('')}
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
            <input class="event__input  event__input--price" id="event-price-${pointId}" type="text" name="event-price" value="${basePrice}">
          </div>
          ${createButtonsTemplate()}
        </header>
        ${pointDestination?.name && (pointDestination.description || pointOffers.length > 0) ? `
          <section class="event__details">
            ${createOffersTemplate(pointOffers)}
            ${createDestinationTemplate(pointDestination)}
          </section>
        ` : ''}
      </form>
    </li>`;
}

export default class EditPointView extends AbstractView {
  #point = null;
  #destinations = null;
  #offers = null;
  #handleRollupBtnClick = null;
  #handleFormSubmit = null;
  constructor(point, destinations, offers, onRollupBtnClick, onFormSubmit) {
    super();
    this.#point = point;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#handleRollupBtnClick = onRollupBtnClick;
    this.#handleFormSubmit = onFormSubmit;

    if (this.element.querySelector('.event__rollup-btn')) {
      this.element.querySelector('.event__rollup-btn')
        .addEventListener('click', this.#RollupBtnHandler);
    }
    this.element.querySelector('form').addEventListener('submit', this.#FormSubmitHandler);
  }

  get template() {
    return createNewPointTemplate(this.#point, this.#destinations, this.#offers);
  }

  #RollupBtnHandler = (evt) => {
    evt.preventDefault();
    this.#handleRollupBtnClick();
  };

  #FormSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleRollupBtnClick();
  };
}
