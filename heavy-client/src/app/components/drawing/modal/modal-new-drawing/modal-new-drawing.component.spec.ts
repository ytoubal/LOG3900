import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AppGlobals } from 'src/app/app.global';
import { CanvasService } from 'src/app/services/index/canvas.service';
import { PaletteService } from 'src/app/services/index/palette.service';
import { Colour } from '../../colour/colour';
import { ColourPaletteComponent } from '../../colour/colour-palette/colour-palette.component';
import { ColourSliderComponent } from '../../colour/colour-slider/colour-slider.component';
import { ColourComponent } from '../../colour/colour.component';
import { OpacitySliderComponent } from '../../colour/opacity-slider/opacity-slider/opacity-slider.component';
import { ModalNewDrawingComponent } from './modal-new-drawing.component';

const INVALID_DIMENSIONS = -1;
const VALID_DIMENSIONS = 5;
describe('ModalNewDrawingComponent', () => {
  let component: ModalNewDrawingComponent;
  let fixture: ComponentFixture<ModalNewDrawingComponent>;
  const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({}), close: null });
  dialogRefSpyObj.componentInstance = {
    body: ''
  };

  const dialogMock = {
    // tslint:disable-next-line: no-empty
    close: () => {}
   };

  const mockEntry = {
    navigate: jasmine.createSpy('navigate'),
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule, BrowserAnimationsModule, MatSnackBarModule, FormsModule, HttpClientTestingModule],
      declarations: [ ModalNewDrawingComponent,
                      ColourComponent,
                      ColourPaletteComponent,
                      ColourSliderComponent,
                      OpacitySliderComponent],
      providers: [{ provide: Router, useValue: mockEntry}, AppGlobals, CanvasService, PaletteService,
        {provide: MatDialogRef, useValue: dialogMock}],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalNewDrawingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#cancel should call close', () => {
    const spy = spyOn(component.dialogRef, 'close').and.callThrough();
    component.cancel();
    expect(spy).toHaveBeenCalled();
  });

  it('#create with negatives values should return false', () => {
    component.info.dim.h = INVALID_DIMENSIONS;
    component.info.dim.w = INVALID_DIMENSIONS;
    component.create();
    expect(component.create()).toBe(false);
  });

  it('#create with invalid colours should return false', () => {
    component.info.dim.h = VALID_DIMENSIONS;
    component.info.dim.w = VALID_DIMENSIONS;
    component.info.colour.r = 'A';
    component.create();
    expect(component.create()).toBe(false);
  });

  it('#create with positives values without /entry router.url ', () => {
    component.info.dim.h = VALID_DIMENSIONS;
    component.info.dim.w = VALID_DIMENSIONS;
    const spyDialog = spyOn(component.dialogRef, 'close').and.callThrough();
    component.create();
    expect(spyDialog).toHaveBeenCalled();
    expect(component.info.update).toBe(true);
    expect(component.create()).toBe(true);
  });

  it('#create calls updateInfo if it does not have changes', () => {
    component.info.colour = new Colour();
    component.info.dim.h = VALID_DIMENSIONS;
    component.info.dim.w = VALID_DIMENSIONS;
    component.canvasService.canvasHasChanges = false;
    spyOn(component, 'updateInfo');
    const test = component.create();
    expect(component.updateInfo).toHaveBeenCalled();
    expect(test).toBe(true);
  });

  it('#create calls checks confirm if it does not have changes, confirm', () => {
    component.info.colour = new Colour();
    component.info.dim.h = VALID_DIMENSIONS;
    component.info.dim.w = VALID_DIMENSIONS;
    // tslint:disable
    spyOn(window, 'confirm').and.callFake(function() {return true; });
    component.canvasService.canvasHasChanges = true;
    spyOn(component, 'updateInfo');
    const test = component.create();
    expect(component.updateInfo).toHaveBeenCalled();

    expect(test).toBe(true);
  });

  it('#create calls checks confirm if it does not have changes, cancel', () => {
    component.info.colour = new Colour();
    component.info.dim.h = VALID_DIMENSIONS;
    component.info.dim.w = VALID_DIMENSIONS;
    // tslint:disable
    spyOn(window, 'confirm').and.callFake(function() {return false; });
    component.canvasService.canvasHasChanges = true;
    spyOn(component, 'updateInfo');
    const test = component.create();
    expect(component.updateInfo).not.toHaveBeenCalled();
    expect(test).toBe(true);
  });

  it('#goToWorkspace routes to workspace if on entry', () => {
    Object.defineProperty(component.router, 'url', { value: '/entry' });
    expect(component.goToWorkspace(component.router)).toBe(true);
  });

  it('#goToWorkspace routes doest not', () => {
    Object.defineProperty(component.router, 'url', { value: '/workspace' });
    expect(component.goToWorkspace(component.router)).toBe(false);
  });

  it('#updateColours should update colours', () => {
    component.info.colour.r = 'FF';
    component.info.colour.g = 'FF';
    component.info.colour.b = 'FF';
    const newColor = component.paletteService.stringToColour('AAAAAAA');
    component.updateColours(newColor);
    expect(component.info.colour.r).toBe(newColor.r);
    expect(component.info.colour.r).toBe(newColor.g);
    expect(component.info.colour.r).toBe(newColor.b);
  });

  it('#disableShortcuts valls evt.preventDefault', () => {
    const mockKeyboardEvent = new KeyboardEvent('keydown', {code: 'KeyQ'});
    spyOn(KeyboardEvent.prototype, 'preventDefault');
    component.disableShortcuts(mockKeyboardEvent);
    expect(KeyboardEvent.prototype.preventDefault).toHaveBeenCalled();
  });

  it('should not be able to trigger keyboard events and return true', () => {
    const mockKeyboardEvent = new KeyboardEvent('keydown', {code: 'KeyA'});
    spyOn(KeyboardEvent.prototype, 'stopPropagation');
    component.disableShortcuts(mockKeyboardEvent);
    expect(KeyboardEvent.prototype.stopPropagation).toHaveBeenCalled();
  });

  it('#setInput should chagnge isInput value', () => {
    component.isInput = false;
    component.setInput(true);
    expect(component.isInput).toBe(true);
  });
});
