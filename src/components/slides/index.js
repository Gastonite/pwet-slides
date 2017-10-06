'use strict';

//import StatefulDefinition from 'pwet/src/decorators/stateful';
import Slides from './slides';
import IDOMComponent from 'pwet-idom';
import { defineComponent } from 'pwet';
import { isInteger } from "kwak";
import ShadowComponent from 'pwet/src/definitions/shadow';
import { decorate } from 'pwet/src/utilities';

export default defineComponent([
  Slides,
  IDOMComponent,
  ShadowComponent
]);

//export default defineComponent(
//  Object.assign(
//    StatefulDefinition(Slides),
//    {
//      style,
//      verbose: true
//    }
//  )
//);