import { Colour } from '../colour/colour';
import { Dimensions } from './dimensions';

export class Information {
    colour: Colour;
    dim: Dimensions;
    update: boolean; // only update when create() is called, or else it updates whenver the modal is opened
  }
