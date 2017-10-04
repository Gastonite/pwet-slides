let el = document.createElement('div')//what the hack is bootstrap
let TRANSITIONEND; // event name

const _eventsTypes = {
  transition: {
    transition: 'transitionend',
    OTransition: 'oTransitionEnd otransitionend',
    MozTransition: 'transitionend',
    WebkitTransition: 'webkitTransitionEnd'
  }
};

for (let key in _eventsTypes.transition) {

  if (el.style[key] !== undefined){
    TRANSITIONEND = _eventsTypes.transition[key];
    break;
  }
}

export {
  TRANSITIONEND
};