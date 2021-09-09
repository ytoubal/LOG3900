/*tslint:disable: no-magic-numbers for testing values*/

import { inject, TestBed } from '@angular/core/testing';
import { Colour } from 'src/app/components/app/colour/colour';
import { PaletteService } from './palette.service';

const UPDATE_COLOUR_TEST = 15;
const WHITE_DECIMAL = 255;
const HISTORY_INDEX_0 = 0;
const HISTORY_INDEX_1 = 1;
const HISTORY_INDEX_2 = 2;
const HISTORY_INDEX_3 = 3;
const HISTORY_INDEX_4 = 4;
const HISTORY_INDEX_5 = 5;
const HISTORY_INDEX_6 = 6;
const HISTORY_INDEX_7 = 7;
const HISTORY_INDEX_8 = 8;
const HISTORY_INDEX_9 = 9;
const HISTORY_INDEX_NOT_FOUND = -1;
describe('Service: Palette', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PaletteService]
    });
  });

  it('should create', inject([PaletteService], (service: PaletteService) => {
    expect(service).toBeTruthy();
  }));

  it('#updateColour should update newColour', inject([PaletteService], (service: PaletteService) => {
    service.newColour.next(new Colour());
    service.updateColour(WHITE_DECIMAL, WHITE_DECIMAL, WHITE_DECIMAL);
    expect(service.newColour.getValue().r).toBe('FF');
    expect(service.newColour.getValue().g).toBe('FF');
    expect(service.newColour.getValue().b).toBe('FF');
  }));

  it('#updateColour should insert zeroes in newColour', inject([PaletteService], (service: PaletteService) => {
    service.newColour.next(new Colour());
    service.updateColour(UPDATE_COLOUR_TEST, UPDATE_COLOUR_TEST, UPDATE_COLOUR_TEST);
    expect(service.newColour.getValue().r).toBe('0F');
    expect(service.newColour.getValue().g).toBe('0F');
    expect(service.newColour.getValue().b).toBe('0F');
  }));

  it('#updateColour should insert zeroes in newColour', inject([PaletteService], (service: PaletteService) => {
    service.newColour.next(new Colour());
    service.updateColour(UPDATE_COLOUR_TEST, UPDATE_COLOUR_TEST, UPDATE_COLOUR_TEST);
    expect(service.newColour.getValue().r).toBe('0F');
    expect(service.newColour.getValue().g).toBe('0F');
    expect(service.newColour.getValue().b).toBe('0F');
  }));

  it('#updateOpacity opacity is updated and setNewColour is called', inject([PaletteService], (service: PaletteService) => {
    const newOpacity = 75;
    const newColour = service.newColour.getValue();
    service.updateOpacity(newOpacity);
    spyOn(service.newColour, 'next').withArgs(newColour);
    expect(service.newColour.getValue().a).toBe('0.5');
  }));

  it('#updateOpacity opacity stays the same if null', inject([PaletteService], (service: PaletteService) => {
    service.newColour.next(service.stringToColour('AAAAAA0.5'));
    const newColour = service.newColour.getValue();
    service.updateOpacity();
    spyOn(service.newColour, 'next').withArgs(newColour);
    expect(service.newColour.getValue().a).toBe('0.5');
  }));

  it('#updatePrimarySecondary should update primary colour and history', inject([PaletteService], (service: PaletteService) => {
    service.isPrimary = true;
    service.newColour.next(service.stringToColour('AAAAAA1'));
    spyOn(service.primaryColour, 'next').withArgs(service.stringToColour('AAAAAA1'));
    spyOn(service, 'updateHistory').withArgs('AAAAAA');
    service.updatePrimarySecondary();
    expect(service.primaryColour.next).toHaveBeenCalled();
    expect(service.updateHistory).toHaveBeenCalled();
  }));

  it('#updatePrimarySecondary should update secondary colour and history', inject([PaletteService], (service: PaletteService) => {
    service.isPrimary = false;
    service.newColour.next(service.stringToColour('AAAAAA1'));
    spyOn(service.secondaryColour, 'next').withArgs(service.stringToColour('AAAAAA1'));
    spyOn(service, 'updateHistory').withArgs('AAAAAA');
    service.updatePrimarySecondary();
    expect(service.secondaryColour.next).toHaveBeenCalled();
    expect(service.updateHistory).toHaveBeenCalled();
  }));

  it('#swapColours should swap the primary and secondary values', inject([PaletteService], (service: PaletteService) => {
    const nextPrimaryColour = service.stringToColour('0000001');
    const nextSecondaryColour = service.stringToColour('1111111');
    service.primaryColour.next(nextPrimaryColour);
    service.secondaryColour.next(nextSecondaryColour);
    service.swapColours();
    expect(service.primaryColour.getValue()).toEqual(service.stringToColour('1111111'));
    expect(service.secondaryColour.getValue()).toEqual(service.stringToColour('0000001'));
  }));

  it('#getRGBA returns the proper string for primary and secondary', inject([PaletteService], (service: PaletteService) => {
    const nextPrimaryColour = service.stringToColour('0000000.5');
    const nextSecondaryColour = service.stringToColour('FFFFFF1');
    service.primaryColour.next(nextPrimaryColour);
    expect(service.getRGBA('primary')).toBe('rgba(0,0,0,0.5)');
    service.secondaryColour.next(nextSecondaryColour);
    expect(service.getRGBA('secondary')).toBe('rgba(255,255,255,1)');
  }));

  it('#updateHistory adds new colour to the list', inject([PaletteService], (service: PaletteService) => {
    service.colourHistory[0] = '111111';
    service.updateHistory('AAAAAA');
    expect(service.colourHistory[0]).toBe('AAAAAA');
  }));

  it('#updateHistory removes last and adds new value if full', inject([PaletteService], (service: PaletteService) => {
    service.colourHistory[HISTORY_INDEX_0] = '000000';
    service.colourHistory[HISTORY_INDEX_1] = '111111';
    service.colourHistory[HISTORY_INDEX_2] = '222222';
    service.colourHistory[HISTORY_INDEX_3] = '333333';
    service.colourHistory[HISTORY_INDEX_4] = '444444';
    service.colourHistory[HISTORY_INDEX_5] = '555555';
    service.colourHistory[HISTORY_INDEX_6] = '666666';
    service.colourHistory[HISTORY_INDEX_7] = '777777';
    service.colourHistory[HISTORY_INDEX_8] = '888888';
    service.colourHistory[HISTORY_INDEX_9] = '999999';
    service.updateHistory('AAAAAA');
    expect(service.colourHistory[0]).toBe('AAAAAA');
    expect(service.colourHistory.indexOf('999999')).toBe(HISTORY_INDEX_NOT_FOUND);
  }));

  it('#updateHistory already contains the colour, moves it to the front', inject([PaletteService], (service: PaletteService) => {
    service.colourHistory[0] = '000000';
    service.colourHistory[1] = '111111';
    service.colourHistory[2] = '222222';
    service.updateHistory('222222');
    expect(service.colourHistory[0]).toBe('222222');
    expect(service.colourHistory[2]).toBe('111111');
  }));

  it('#showOpacityFunction updates showOpacity', inject([PaletteService], (service: PaletteService) => {
    service.showOpacity = false;
    service.showOpacityFunction(true);
    expect(service.showOpacity).toBe(true);
  }));
});
