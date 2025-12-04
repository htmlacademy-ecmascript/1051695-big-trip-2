import SortView from './view/sort-view.js';
import FilterView from './view/filter-view.js';
import {render} from './render.js';

const tripControls = document.querySelector('.trip-controls__filters');
const tripEvents = document.querySelector('.trip-events');
render(new SortView, tripEvents);
render(new FilterView, tripControls);
