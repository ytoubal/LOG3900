import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
// tslint:disable-next-line: max-line-length
import { A_POS, B_POS, Colour, DECIMAL_CONST, G_POS, HEX_CONST, HISTORY_LENGTH, OPACITY_MAX, OPACITY_ROUND, R_LENGTH, R_POS, RGB_LENGTH } from  'src/app/components/drawing/colour/colour';

@Injectable({
  providedIn: 'root',
})
export class PaletteService {
  newColour: BehaviorSubject<Colour> = new BehaviorSubject(new Colour());
  primaryColour: BehaviorSubject<Colour> = new BehaviorSubject(new Colour());
  secondaryColour: BehaviorSubject<Colour> = new BehaviorSubject(new Colour());

  showOpacity: boolean;

  isPrimary: boolean;
  colourHistory: string[] = [];

  constructor() {
    const initialColour = this.stringToColour('0000001');
    this.primaryColour.next(initialColour);
    this.secondaryColour.next(initialColour);
    this.newColour.next(initialColour);
  }

  colourToString(colour: Colour): string {
    return colour.r + colour.g + colour.b + colour.a;
  }

  stringToColour(str: string): Colour {
    const colour = new Colour();
    colour.r = str.substr(R_POS, R_LENGTH);
    colour.g = str.substr(G_POS, R_LENGTH);
    colour.b = str.substr(B_POS, R_LENGTH);
    colour.a = str.substr(A_POS);
    return colour;
  }

  updateColour(r: number, g: number, b: number): void {
    const newColour = new Colour();
    newColour.r = r.toString(HEX_CONST);
    if (r < HEX_CONST) { newColour.r = '0' + newColour.r; }
    newColour.g = g.toString(HEX_CONST);
    if (g < HEX_CONST) { newColour.g = '0' + newColour.g; }
    newColour.b = b.toString(HEX_CONST);
    if (b < HEX_CONST) { newColour.b = '0' + newColour.b; }
    newColour.r = newColour.r.toUpperCase();
    newColour.g = newColour.g.toUpperCase();
    newColour.b = newColour.b.toUpperCase();
    newColour.a = this.newColour.getValue().a;
    this.newColour.next(newColour);
    }

  updateOpacity(newOpacity: number = 0): void {
    // maximum is 150, sets value between 1 and 0, 1 being the maximum opacity, rounded to the tenth
    const opacity = Math.max(Math.round(((OPACITY_MAX - newOpacity) / OPACITY_MAX) * OPACITY_ROUND) / OPACITY_ROUND).toString();
    const newColour = this.newColour.getValue();
    if (newOpacity !== 0) { // defines first opacity if null, afterwards the opacity for each colour will stay the same unless changed
      newColour.a = opacity;
    }
    this.newColour.next(newColour);
  }

  updatePrimarySecondary(): void {
    if (this.isPrimary) {
      this.primaryColour.next(this.newColour.getValue());
    } else {
      this.secondaryColour.next(this.newColour.getValue());
    }
    this.updateHistory(this.colourToString(this.newColour.getValue()).substr(0, RGB_LENGTH));
  }

  swapColours(): void {
    const tempC = this.secondaryColour.getValue();
    this.secondaryColour.next(this.primaryColour.getValue());
    this.primaryColour.next(tempC);
  }

  // inspired by https://stackoverflow.com/questions/21667377/javascript-hexadecimal-string-to-decimal-string
  hexToDecString(s: string): string {
    let i;
    let j;
    const digits = [0];
    let carry;
    for (i = 0; i < s.length; i += 1) {
        carry = parseInt(s.charAt(i), HEX_CONST);
        for (j = 0; j < digits.length; j += 1) {
            digits[j] = digits[j] * HEX_CONST + carry;
            // tslint:disable-next-line: no-bitwise
            carry = digits[j] / DECIMAL_CONST | 0;
            digits[j] %= DECIMAL_CONST;
        }
        while (carry > 0) {
            digits.push(carry % DECIMAL_CONST);
            // tslint:disable-next-line: no-bitwise
            carry = carry / DECIMAL_CONST | 0;
        }
    }
    return digits.reverse().join('');
  }

  getRGBA_LEGER(colour: string): string {
    let currentColour = this.stringToColour(colour);
    if (colour === 'primary') {
      currentColour =  this.primaryColour.getValue();
    }
    if (colour === 'secondary') {
      currentColour = (this.secondaryColour.getValue());
    }
    return 'rgba(' + this.hexToDecString(currentColour.r) + ',' + this.hexToDecString(currentColour.g) + ','
                   + this.hexToDecString(currentColour.b) + ',' + (parseFloat(this.hexToDecString(currentColour.a))/255).toString() + ')';
  }

  getRGBA(colour: string): string {
    let currentColour = this.stringToColour(colour);
    if (colour === 'primary') {
      currentColour =  this.primaryColour.getValue();
    }
    if (colour === 'secondary') {
      currentColour = (this.secondaryColour.getValue());
    }
    return 'rgba(' + this.hexToDecString(currentColour.r) + ',' + this.hexToDecString(currentColour.g) + ','
                   + this.hexToDecString(currentColour.b) + ',' + currentColour.a + ')';
  }

  updateHistory(newColour: string): void {
    if (!this.colourHistory.includes(newColour)) {
      if (this.colourHistory.length >= HISTORY_LENGTH) {
        this.colourHistory.pop();
      }
      this.colourHistory.unshift(newColour);
    // When a colour in the history is selected, the colour is moved to the front of the history
    } else {
      this.colourHistory.unshift(this.colourHistory.splice(this.colourHistory.indexOf(newColour), 1)[0]);
    }
  }

  showOpacityFunction(show: boolean): void {
    this.showOpacity = show;
  }
}
