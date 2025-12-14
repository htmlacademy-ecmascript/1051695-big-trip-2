import { createElement } from '../render.js';
import { humanizeTaskDueDate, DATE_FORMAT } from '../utils.js';

const POINT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

function createNewPointTemplate(point, destinations, offers, isNew = false) {
  const { basePrice, dateFrom, dateTo, type } = point;
  const typeOffers = offers.find((offer) => offer.type === point.type).offers;
  const pointOffers = typeOffers.filter((typeOffer) => point.offers.includes(typeOffer.id));
  const pointDestination = destinations.find((dest) => point.destination === dest.id);
  const pointId = point.id || 0;

  const createButtonsTemplate = () => {
    if (isNew) {
      return `<button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Cancel</button>`;
    }
    return `<button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>`;
  };

  const createDestinationTemplate = (destination) => {
    if (!destination || destination.id === 0) {
      return ('');
    }

    if (isNew) {
      return ` <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${destination.description}</p>


        <div class="event__photos-container">
          <div class="event__photos-tape">
          ${destination.pictures.map((pic) => `<img class="event__photo" src="${pic.src}" alt="${pic.description}">`).join('')}
          </div>
        </div>
      </section>`;
    }

    return ` <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${destination.description}</p>
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
              <input class="event__offer-checkbox  visually-hidden" id="event-offer-${type}-${offer.id}" type="checkbox" name="event-${offer.title}"  ${pointOffers.map((off) => off.id).includes(offer.id) ? 'checked' : ''}>
              <label class="event__offer-label" for="event-offer-${type}-${offer.id}">
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
                  <input id="event-type-${offer.type}-${pointId}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${offer.type}">
                  <label class="event__type-label  event__type-label--${offer.type}" for="event-type-${offer.type}-${pointId}">${offer.type.charAt(0).toUpperCase() + offer.type.slice(1)}</label>
                </div>`)).join('')*/''}

              ${(POINT_TYPES.map((el) => `
                <div class="event__type-${el}">
                  <input id="event-type-${el}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${el}">
                  <label class="event__type-label  event__type-label--${el}" for="event-type-${el}">${el.slice(0,1).toUpperCase() + el.slice(1)}</label>
                </div>`)).join('')}
            </fieldset>
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${pointDestination ? pointDestination.name : ''}" list="destination-list-1">
          <datalist id="destination-list-1">
           ${destinations.map((destination) => `<option value="${destination.name}"></option>`).join('')}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizeTaskDueDate(dateFrom, DATE_FORMAT.dateTime)}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizeTaskDueDate(dateTo, DATE_FORMAT.dateTime)}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
        </div>
        ${createButtonsTemplate()}
      </header>
      <section class="event__details">
        ${createOffersTemplate(pointOffers)}
        ${createDestinationTemplate(pointDestination)}
      </section>
    </form>
  </li>`;
}

export default class EditPointView {

  constructor(point, destinations, offers, isNew) {
    this.point = point;
    this.destinations = destinations;
    this.offers = offers;
    this.isNew = isNew;
  }

  getTemplate() {
    return createNewPointTemplate(this.point, this.destinations, this.offers, this.isNew);
  }


  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
