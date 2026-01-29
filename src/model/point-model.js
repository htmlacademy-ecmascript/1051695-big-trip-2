// import { points } from '../mocks/points';
// import { destinations } from '../mocks/destinations';
// import { offers } from '../mocks/offers';
import Observable from '../framework/observable';
import { UpdateType } from '../consts';
export default class PointModel extends Observable {
  #pointsApiService = null;
  #points = [];
  #destinations = [];
  #offers = [];
  constructor(pointsApiService) {
    super();
    this.#pointsApiService = pointsApiService;
    this.#pointsApiService.points.then((points) => console.log(points));
    // this.#points = points;
    // this.#destinations = destinations;
    // this.#offers = offers;
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

  async init() {
    try {
      const [points, destinations, offers] = await Promise.all([
        this.#pointsApiService.points,
        this.#pointsApiService.destinations,
        this.#pointsApiService.offers
      ]);

      this.#points = points.map(this.#adaptToClient);
      this.#destinations = destinations;
      this.#offers = offers;

    } catch (err) {
      this.#points = [];
      this.#destinations = [];
      this.#offers = [];

      this._notify(UpdateType.ERROR);
    }
    this._notify(UpdateType.INIT);
  }

  async updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);
    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    try {
      const response = await this.#pointsApiService.updatePoint(update);
      const updatedPoint = this.#adaptToClient(response);

      this.#points = [
        ...this.#points.slice(0, index),
        updatedPoint,
        ...this.#points.slice(index + 1),
      ];

      this._notify(updateType, updatedPoint);
    } catch (err) {
      throw new Error('Can\'t update point');
    }
  }

  async addPoint(updateType, update) {
    try {
      const response = await this.#pointsApiService.updatePoint(update);
      const newPoint = this.#adaptToClient(response);
      this.#points = [
        newPoint,
        ...this.#points,
      ];
      this._notify(updateType, update);
    } catch (err) {
      throw new Error('Can\'t add new point');
    }
  }

  deletePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType);
  }

  #adaptToClient(point) {
    const adaptedPoint = {
      ...point,
      dateFrom: point['date_from'],
      dateTo: point['date_to'],
      basePrice: point['base_price'],
      isFavorite: point['is_favorite'],
    };

    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['base_price'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  }
}
