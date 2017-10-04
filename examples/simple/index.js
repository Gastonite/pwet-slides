'use strict';

import '@webcomponents/webcomponentsjs/webcomponents-sd-ce';

import '../../src/components/slides';

const createButton = (text) => {
  const button = document.createElement('button');
  button.innerText = text;
  return button;
};

document.addEventListener('DOMContentLoaded', () => {

  const slides = document.querySelector('x-slides');
  const leftButton = document.body.appendChild(createButton('left'));
  const rightButton = document.body.appendChild(createButton('right'));

  rightButton.onclick = () => {
    slides.current++;
  };

  leftButton.onclick = () => {
    slides.current--;
  };
});