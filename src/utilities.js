'use strict';

import { createCSSTransformBuilder } from "easy-css-transform-builder";
import { TRANSITIONEND } from './detection';
import {
  assert,
  isFunction,
  isUndefined
} from "kwak";

export const buildTransform = createCSSTransformBuilder({
  length: "px",
  angle: "deg"
});

export const forceReflow = element => void element.offsetHeight;

export const transformElement = (element, transform, done) => {

  if (isFunction(done)) {

    const _whenTransformEnd = event => {

      if (event.target !== element || event.propertyName !== 'transform')
        return;
      console.log('transformElement._whenTransformEnd()', event);

      element.removeEventListener(TRANSITIONEND, _whenTransformEnd);

      done(event);
    };

    element.addEventListener(TRANSITIONEND, _whenTransformEnd);
  }

  element.style.transform
    = element.style.webkitTransform
    = element.style.MozTransform
    = element.style.msTransform
    = element.style.OTransform
    = element.style.transform
    = transform;
};