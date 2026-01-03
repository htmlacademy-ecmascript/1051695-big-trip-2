

import { getTimePeriod, humanizeTaskDueDate} from '../utils/utils.js';
import { DateFormat } from '../consts.js';
import dayjs from 'dayjs';
import AbstractView from '../framework/view/abstract-view.js';

function createPointTemplate(point, destinations, offers) {
  const { basePrice, isFavorite, dateFrom, dateTo, type } = point;
  const typeOffers = offers.find((offer) => offer.type === point.type).offers;
  const pointOffers = typeOffers.filter((typeOffer) => point.offers.includes(typeOffer.id));
  const pointDestination = destinations.find((dest) => point.destination === dest.id);
  const favoriteActiveClass = isFavorite ? ' event__favorite-btn--active' : '';

  return `<li class="trip-events__item">
              <div class="event">
                <time class="event__date" datetime="${dayjs(dateFrom).format(DateFormat.yearMonthDay)}">${humanizeTaskDueDate(dateFrom, DateFormat.monthDay)}</time>
                <div class="event__type">
                  <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
                </div>
                <h3 class="event__title">${type} ${pointDestination?.name}</h3>
                <div class="event__schedule">
                  <p class="event__time">
                    <time class="event__start-time" datetime="${dayjs(dateFrom).format(DateFormat.dateTimeT)}">${humanizeTaskDueDate(dateFrom, DateFormat.hourMinute)}</time>
                    &mdash;
                    <time class="event__end-time" datetime="${dayjs(dateTo).format(DateFormat.dateTimeT)}">${humanizeTaskDueDate(dateTo, DateFormat.hourMinute)}</time>
                  </p>
                  <p class="event__duration">${getTimePeriod(dateFrom, dateTo)}</p>
                </div>
                <p class="event__price">
                  &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
                </p>
                <h4 class="visually-hidden">Offers:</h4>
                <ul class="event__selected-offers">
                ${pointOffers.map((offer) => (`<li class="event__offer">
                    <span class="event__offer-title">${offer.title}</span>
                    &plus;&euro;&nbsp;
                    <span class="event__offer-price">${offer.price}</span>
                  </li>`)).join('')}
                </ul>
                <button class="event__favorite-btn${favoriteActiveClass}" type="button">
                  <span class="visually-hidden">Add to favorite</span>
                  <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                    <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
                  </svg>
                </button>
                <button class="event__rollup-btn" type="button">
                  <span class="visually-hidden">Open event</span>
                </button>
              </div>
            </li>`;
}


export default class PointView extends AbstractView {
  #point = null;
  #destinations = null;
  #offers = null;
  #handleRollupBtnClick = null;

  constructor(point, destinations, offers, onRollupBtnClick) {
    super();
    this.#point = point;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#handleRollupBtnClick = onRollupBtnClick;
    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#RollupBtnHandler);
  }

  get template() {
    return createPointTemplate(this.#point, this.#destinations, this.#offers);
  }


  #RollupBtnHandler = (evt) => {
    evt.preventDefault();
    this.#handleRollupBtnClick();
  };
}
