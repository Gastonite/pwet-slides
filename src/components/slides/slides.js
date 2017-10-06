'use strict';

import { Component } from 'pwet';
import { assert, isArray, isElement, isUndefined, isNull, isObject, isInteger, isEmpty } from "kwak";

import Definition from 'pwet/src/definition';
import { buildTransform, forceReflow } from '../../utilities';
import { patch, text, renderElement, currentPointer, renderDiv, renderStyle, skipNode, skip, currentElement } from 'idom-util';
import { TRANSITIONEND } from '../../detection';
import style from './slides.styl';


const Slides = component => {

  const { element, hooks } = component;

  let _currentSlide;

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
      console.log('parent', parent)
      console.log('pointer', pointer)

        //? parent.appendChild(content)
        //: parent.replaceChild(content, pointer);

      if (isNull(pointer))
        parent.appendChild(content)
      else {
        if (pointer !== content)
          parent.replaceChild(content, pointer)
      }

      skipNode()
    });
  }

  const _handleTransitionEnd = ({ propertyName, target }) => {

    if (propertyName !== 'transform' || !target.classList.contains('moving'))
      return;

    const { updaters: { setCurrentSlide } } = component;
    const nextIndex = element.nextSlide.index;

    setCurrentSlide(nextIndex);

    const currentValue = parseInt(element.getAttribute('current'), 10);

    if (isNaN(currentValue) || currentValue !== nextIndex)
      element.setAttribute('current', nextIndex);
  };

  //hooks.update = (component, properties, oldProperties) => {
  //
  //  return !component.isRendered || !isDeeplyEqual(properties, oldProperties);
  //};

  hooks.attach = component => {

    element.slides = Array.from(element.children)

    _currentSlide.addEventListener(TRANSITIONEND, _handleTransitionEnd)
  };

  hooks.detach = component => {

    _currentSlide.removeEventListener(TRANSITIONEND, _handleTransitionEnd)
  };

  hooks.render = component => {

    const { slides, currentSlide, nextSlide, isMoving } = component.element;

    console.error('RENDER', { slides, currentSlide, nextSlide, isMoving });

    if (isMoving)
      forceReflow(element);

    //patch(component.root, () => {
      renderStyle(component.definition.style);

      renderDiv('slides', ['class', 'slides'], () => {

        if (isEmpty(slides))
          return;

        currentSlide.content = slides[currentSlide.index];
        currentSlide.isMoving = isMoving;

        _currentSlide = _renderSlide(currentSlide);

        if (!isUndefined(nextSlide)) {

          nextSlide.content = slides[nextSlide.index];
          nextSlide.isMoving = isMoving;

          _renderSlide(nextSlide);
        }
      });
    //});


  };

  return component;
};

Slides.tagName = 'x-slides';

Slides.style = style;

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
  current: (component, value = 0) => {

    console.log('Slides.properties.current()');

    return {
      get: () => value,
      set(newValue) {

        //console.log('set current()', newValue);

        newValue = parseInt(newValue, 10);

        if (isNaN(newValue) || value === newValue)
          return;

        const { element, updaters: { setNextSlide, goToNextSlide } } = component;

        if (element.isMoving || newValue >= element.slides.length || newValue < 0)
          return;

        setTimeout(() => {
          setNextSlide(newValue);
          goToNextSlide();
        }, 0);

        value = newValue;
      }
    };
  },
  slides: ({ element, log }, value = []) => ({
    get: () => value,
    set(newValue) {

      if (isArray(newValue) && newValue.every(isElement))
        value = newValue;
    }
  }),
  isMoving: ({ element, log }, value = false) => ({
    get: () => value,
    set(newValue) {

      value = !!newValue;
    }
  }),
  currentSlide: ({ element, log }, value = {}) => ({
    get: () => value,
    set(newValue) {

      //console.log('set currentSlide()', newValue);

      if (!isObject(newValue))
        return;

      const { index = 0, translate = [0, 0] } = newValue;

      if (!isInteger(index))
        return;

      if (!isArray(translate) || translate.length !== 2)
        return;

      value = {
        index,
        translate
      };
    }
  }),
  nextSlide: ({ element, log }, value) => ({
    get: () => value,
    set(newValue) {

      //console.log('set nextSlide()', newValue);

      if (!isObject(newValue))
        return;

      const { index, translate } = newValue;

      if (!isInteger(index))
        return;

      if (!isArray(translate) || translate.length !== 2)
        return;

      value = {
        index,
        translate
      };
    }
  })
};

Slides.verbose = true;

Slides.updaters = {
  setCurrentSlide: (component, currentIndex) => {

    console.log('Slides.updaters.setCurrentSlide()');

    component.update({
      isMoving: false,
      currentSlide: {
        index: currentIndex,
        translate: [0, 0]
      },
      nextSlide: void 0
    }, { partial: true });
  },
  setNextSlide: (component, nextIndex) => {

    console.log('Slides.updaters.setNextSlide()');

    const { element } = component;

    const reverse = element.currentSlide.index > nextIndex;

    component.update({
      nextSlide: {
        index: nextIndex,
        translate: [reverse ? '-100%' : '100%', 0]
      }
    }, { partial: true });
  },
  goToNextSlide: (component) => {

    console.log('Slides.updaters.goToNextSlide()');

    const { currentSlide, nextSlide } = component.element;

    const reverse = currentSlide.index > nextSlide.index;

    component.update({
      isMoving: true,
      currentSlide: {
        ...currentSlide,
        translate: [reverse ? '100%' : '-100%', 0]
      },
      nextSlide: {
        ...nextSlide,
        translate: [0, 0]
      }
    }, { partial: true });
  }
};

export default Slides;