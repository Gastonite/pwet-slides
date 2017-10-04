'use strict';

import StatefulDefinition from 'pwet/src/decorators/stateful';
import Slides from './slides';
import { defineComponent } from 'pwet';
import style from './slides.styl';
import { isInteger } from "kwak";
import { decorate } from 'pwet/src/utilities';

export default defineComponent(
  Object.assign(
    StatefulDefinition(Slides),
    {
      style,
      verbose: true
    }
  )
);