import BoardPresenter from './presenter/board-presenter';


const filtersContainer = document.querySelector('.trip-controls__filters');
const eventsContainer = document.querySelector('.trip-events');


const boardPresenter = new BoardPresenter({ tripControls: filtersContainer, tripEvents: eventsContainer });
boardPresenter.init();

