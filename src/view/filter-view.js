
import AbstractView from '../framework/view/abstract-view.js';

function createFilterItemTemplate(filter, isChecked) {

  return `
    <div class="trip-filters__filter">
      <input id="filter-${filter.type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter.type}"
      ${isChecked ? 'checked' : ''}
      ${!filter.count ? 'disabled' : ''}
      >
      <label class="trip-filters__filter-label" for="filter-${filter.type}">${filter.type}</label>
    </div>`;
}

function createFilterTemplate(filterItems) {
  const filterItemsTemplate = filterItems
    .map((filter, index) => createFilterItemTemplate(filter, index === 0))
    .join('');
  return `
    <form class="trip-filters" action="#" method="get">
      ${filterItemsTemplate}

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`;
}


export default class FilterView extends AbstractView {
  #filters = null;

  constructor(filters) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createFilterTemplate(this.#filters);
  }
}
