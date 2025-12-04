import SortView from './view/sort-view.js';
import {render} from './render.js';

const siteMainElement = document.querySelector('.trip-controls__filters');

render(new SortView, siteMainElement);
