import SortView from './view/sort-vew.js';
import {render} from './render.js';

const siteMainElement = document.querySelector('.trip-controls__filters');

render(new SortView, siteMainElement);
