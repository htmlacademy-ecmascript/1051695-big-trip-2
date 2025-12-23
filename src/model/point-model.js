import { points } from '../mocks/points';
import { destinations } from '../mocks/destinations';
import { offers } from '../mocks/offers';

export default class PointModel {

  #points = [];
  #destinations = [];
  #offers = [];
  constructor() {
    this.#points = points;
    this.#destinations = destinations;
    this.#offers = offers;
  }


  get points() {
    return this.#points;
  }

  get offers() {
    return this.#offers;
  }

  get destinations() {
    return this.#destinations;
  }
}
