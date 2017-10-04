'use strict';

import { Component } from 'pwet';
import {
  assert,
  isArray,
  isElement,
  isUndefined,
  isNull,
  isObject
} from "kwak";

import { TRANSITIONEND } from '../../detection';
import Definition from 'pwet/src/definition';
import { buildTransform, forceReflow } from '../../utilities';
import { patch, text, renderElement, currentPointer, renderDiv, renderStyle, skipNode, skip, currentElement } from 'idom-util';


const Slides = (component) => {

  component = Component(component);

  const { element, hooks, updaters: { setCurrentSlide } } = component;

  let _style;
  let _currentSlide;

  const _renderStyle = () => {

    if (!_style)
      return _style = renderStyle(component.style);

    skipNode();
    return _style;
  };

  const _renderSlide = ({ content, translate, isMoving }) => {

    const attributes = [];

    let classes = 'slide';

    if (isMoving)
      classes += ' moving';

    attributes.push('class', classes);

    if (!isUndefined(translate))
      attributes.push('style', `transform:${buildTransform({ translate })};`);

    return renderDiv(null, null, ...attributes, () => {

      const parent = currentElement();
      const pointer = currentPointer();

      isNull(pointer)
        ? parent.appendChild(content)
        : parent.replaceChild(content, pointer);

      skipNode()
    });
  }

  const _whenTransitionEnd = ({ propertyName, target }) => {

    if (propertyName !== 'transform' || !target.classList.contains('moving'))
      return;

    const nextIndex = component.state.nextSlide.index;

    setCurrentSlide(nextIndex);

    const currentValue = parseInt(element.getAttribute('current'), 10);

    if (isNaN(currentValue) || currentValue !== nextIndex)
      element.setAttribute('current', nextIndex);
  };

  hooks.initialize = ({ isRendered }, properties, oldProperties, initialize) => {

    initialize(!isRendered);
  };

  hooks.attach = (component, attach) => {

    attach(false);

    element.slides = Array.from(element.children)

    _currentSlide.addEventListener(TRANSITIONEND, _whenTransitionEnd)
  };

  hooks.detach = (component, attach) => {

    _currentSlide.removeEventListener(TRANSITIONEND, _whenTransitionEnd)
  };

  hooks.render = (component) => {

    const { properties } = component;
    const { currentSlide, nextSlide, isMoving } = component.state;

    if (isMoving)
      forceReflow(element);

    patch(_shadowRoot, () => {
      _renderStyle();

      renderDiv('slides', ['class', 'slides'], () => {

        currentSlide.content = properties.slides[currentSlide.index];
        currentSlide.isMoving = isMoving;

        _currentSlide = _renderSlide(currentSlide);


        if (!isUndefined(nextSlide)) {

          nextSlide.content = properties.slides[nextSlide.index];
          nextSlide.isMoving = isMoving;

          _renderSlide(nextSlide);
        }
      });
    });
  };

  const _shadowRoot = element.attachShadow({ mode: 'closed' });

  return component;
};

Slides.tagName = 'slides';

Slides.attributes = {
  current: ({ element }, value, oldValue) => {

    if (oldValue === value)
      return;


    //element.setAttribute('current', )
    //value = newValue;

    element.current = parseInt(value);
  }
};

Slides.properties = {
  current: (component, value = 0) => ({
    get: () => value,
    set(newValue) {

      newValue = parseInt(newValue, 10);

      if (isNaN(newValue) || value === newValue)
        return;

      const { element, state, updaters: { setNextSlide, goToNextSlide } } = component;

      if (state.isMoving || newValue >= element.slides.length || newValue < 0)
        return;

      setTimeout(() => {
        setNextSlide(newValue);
        goToNextSlide();
      }, 0);

      value = newValue;
    }
  }),
  slides: ({ element, log }, value = []) => ({
    get: () => value,
    set(newValue) {

      if (isArray(newValue) && newValue.every(isElement))
        value = newValue;
    }
  })
};

Slides.initialState = {
  isMoving: false,
  currentSlide: {
    index: 0,
    translate: [0, 0]
  }
};

Slides.updaters = {
  setCurrentSlide: (component, currentIndex) => {

    component.state = {
      ...component.state,
      isMoving: false,
      currentSlide: {
        index: currentIndex,
        translate: [0, 0]
      },
      nextSlide: void 0
    };
  },
  setNextSlide: (component, nextIndex) => {

    const { state } = component;

    const reverse = state.currentSlide.index > nextIndex;

    component.state = {
      ...state,
      nextSlide: {
        index: nextIndex,
        translate: [reverse ? '-100%' : '100%', 0]
      }
    };
  },
  goToNextSlide: (component) => {

    const { state } = component;

    const reverse = state.currentSlide.index > state.nextSlide.index;

    component.state = {
      ...state,
      isMoving: true,
      currentSlide: {
        ...state.currentSlide,
        translate: [reverse ? '100%' : '-100%', 0]
      },
      nextSlide: {
        ...state.nextSlide,
        translate: [0, 0]
      }
    };
  }
};

export default Slides;