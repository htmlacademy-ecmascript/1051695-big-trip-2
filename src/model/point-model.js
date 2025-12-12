import { points } from '../mocks/points';
import { destinations } from '../mocks/destinations';
import { offers } from '../mocks/offers';

export default class PointModel {

  constructor() {
    this.points = [];
    this.destinations = [];
    this.offers = [];
  }

  init() {
    this.points = points;
    this.destinations = destinations;
    this.offers = offers;
  }

  getPoints() {
    return this.points;
  }

  getOffers() {
    return this.offers;
  }

  getDestinations() {
    return this.destinations;
  }
}
