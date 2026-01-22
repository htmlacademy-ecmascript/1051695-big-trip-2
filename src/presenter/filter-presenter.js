import { filter } from '../utils/filter-utils.js';
import { render, replace, remove } from '../framework/render.js';
import { FilterType, UpdateType } from '../consts.js';
import FilterView from '../view/filter-view.js';


export default class FilterPresenter {
  #filtersContainer = null;
  #pointsModel = null;
  #filterModel = null;
  #filterComponent = null;
  constructor(filtersContainer, pointsModel, filterModel) {
    this.#filtersContainer = filtersContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#pointsModel.addObserver(this.#modelEventHandler);
    this.#filterModel.addObserver(this.#modelEventHandler);
  }

  get filters() {
    const points = this.#pointsModel.points;
    return Object.values(FilterType).map((type) => ({
      type : type,
      count: filter[type](points).length
    }));
  }

  init() {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView({
      filters,
      currentFilterType: this.#filterModel.filter,
      onFilterTypeChange: this.#handleFilterTypeChange
    });

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filtersContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MINOR, filterType);
  };

  #modelEventHandler = () => {
    this.init();
  };
}
