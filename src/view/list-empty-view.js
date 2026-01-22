
import AbstractView from '../framework/view/abstract-view.js';
import { EmptyMessage } from '../consts.js';

function createListEmptyTemplate(message = EmptyMessage.EVERYTHING) {
  return `<p class="trip-events__msg">${message}</p>`;
}


export default class ListEmptyView extends AbstractView {
  #message = null;
  constructor(message) {
    super();
    this.#message = message;
  }

  get template() {
    return createListEmptyTemplate(this.#message);
  }
}
