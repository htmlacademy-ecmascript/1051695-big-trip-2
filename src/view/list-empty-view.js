
import AbstractView from '../framework/view/abstract-view.js';
import { EmptyMessage } from '../consts.js';

function createListEmptyTemplate(message) {
  return `<p class="trip-events__msg">${message}</p>`;
}


export default class ListEmptyView extends AbstractView {
  #message = null;
  constructor(filterType) {
    super();
    this.#message = EmptyMessage[filterType];
  }

  get template() {
    return createListEmptyTemplate(this.#message);
  }
}
