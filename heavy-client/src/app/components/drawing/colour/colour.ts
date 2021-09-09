export const RGB_LENGTH = 6;
export const R_LENGTH = 2;
export const R_POS = 0;
export const G_POS = 2;
export const B_POS = 4;
export const A_POS = 6;
export const HEX_CONST = 16;
export const DECIMAL_CONST = 10;
export const OPACITY_MAX = 150;
export const OPACITY_ROUND = 10;
export const HISTORY_LENGTH = 10;

export class Colour {
    r: string;
    g: string;
    b: string;
    a: string;

    constructor() {
        this.r = 'FF';
        this.g = 'FF';
        this.b = 'FF';
        this.a =  '1';
    }
}
