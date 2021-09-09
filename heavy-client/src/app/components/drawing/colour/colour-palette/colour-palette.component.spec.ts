/*tslint:disable: no-magic-numbers for testing values*/

import { SimpleChange } from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { PaletteService } from 'src/app/services/index/palette.service';
import { ColourPaletteComponent } from './colour-palette.component';

describe('ColourPaletteComponent', () => {
  let component: ColourPaletteComponent;
  let fixture: ComponentFixture<ColourPaletteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColourPaletteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColourPaletteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#draw if checkError is true, set checkError as false', () => {
    component.checkError = false;
    component.draw();
    expect(component.checkError).toBe(true);
  });

  it('#draw if canvas doesnt exist, set as 2d canvas', () => {
    // component is never created so its null
    component.draw();
    expect(component.ctx).toBe(component.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D);
  });

  it('#draw values are properly set', () => {
    const width = component.canvas.nativeElement.width;
    const height = component.canvas.nativeElement.height;
    component.checkError = true;
    component.draw();
    spyOn(component.ctx, 'fillRect').withArgs(0, 0, width, height);
    component.draw();
    expect(component.ctx.fillRect).toHaveBeenCalled();
  });

  it('#draw position is selected', () => {
    component.checkError = true;

    const object = {
      x: 10,
      y: 25
    };
    component.selectedPosition = object;

    component.draw();
    expect(component.ctx.strokeStyle).toBe('#ffffff');
    expect(component.ctx.fillStyle).toBe('#ffffff');
  });

  it('#nbOnChanges if change.hue calls draw and changes position', () => {
    component.draw();
    const object = {
      x: 0,
      y: 0
    };
    component.selectedPosition = object;
    spyOn(component, 'draw');
    spyOn(component.color, 'emit').withArgs(component.getColorAtPosition(component.selectedPosition.x, component.selectedPosition.y));
    component.ngOnChanges({
      hue: new SimpleChange(0, 1, false)
    });
    fixture.detectChanges();
    expect(component.draw).toHaveBeenCalled();
    expect(component.color.emit).toHaveBeenCalled();
  });

  it('#nbOnChanges no change, so this.draw() isnt called', () => {
    component.draw();
    spyOn(component, 'draw');
    component.ngOnChanges({
    });
    fixture.detectChanges();
    expect(component.draw).not.toHaveBeenCalled();
  });

  it('#nbOnChanges change but no position', () => {
    component.draw();
    spyOn(component, 'draw');
    spyOn(component.color, 'emit');
    component.ngOnChanges({
      hue: new SimpleChange(0, 1, false)
    });
    fixture.detectChanges();
    expect(component.draw).toHaveBeenCalled();
    expect(component.color.emit).not.toHaveBeenCalled();
  });

  it('#onMouseUp should change value of this.mousedown to false', () => {
    component.mousedown = true;
    const mockMouseEvent = new MouseEvent('mouseup');
    component.onMouseUp(mockMouseEvent);
    expect(component.mousedown).toBe(false);
  });

  it('#onMouseDown should change value of this.mousedown to true and emit a colour', () => {
    component.mousedown = false;
    component.draw();
    const mockMouseEvent = new MouseEvent('mousedown');
    spyOn(component, 'draw');
    component.onMouseDown(mockMouseEvent);
    expect(component.mousedown).toBe(true);
    expect(component.draw).toHaveBeenCalled();
  });

  it('#onMouseMove should call draw and emit a colour', () => {
    component.mousedown = true;
    component.draw();
    const mockMouseEvent = new MouseEvent('mousemove');
    spyOn(component, 'draw');
    component.onMouseMove(mockMouseEvent);
    expect(component.draw).toHaveBeenCalled();
  });

  it('#onMouseMove should not call draw', () => {
    component.mousedown = false;
    component.draw();
    const mockMouseEvent = new MouseEvent('mousemove');
    spyOn(component, 'draw');
    component.onMouseMove(mockMouseEvent);
    expect(component.draw).not.toHaveBeenCalled();
  });

  it('#emitColor emits and calls sendColour', inject([PaletteService], (service: PaletteService) => {
    component.draw();
    const rgbaColour = component.getColorAtPosition(0, 0);
    spyOn(component.color, 'emit').withArgs(rgbaColour);
    spyOn(component, 'sendColour');
    component.emitColor(0, 0);
    expect(component.color.emit).toHaveBeenCalled();
    expect(component.sendColour).toHaveBeenCalled();
  }));

  it('#sendColour calls updateColour in paletteService', inject([PaletteService], (service: PaletteService) => {
    const object = {
      x: 0,
      y: 0
    };
    component.selectedPosition = object;
    component.draw();
    const newColour: Uint8ClampedArray = component.getColour(component.selectedPosition.x, component.selectedPosition.y);
    spyOn(service, 'updateColour').withArgs(newColour[0], newColour[1], newColour[2]);
    component.sendColour();
    expect(service.updateColour).toHaveBeenCalled();
  }));

  it('#sendColour calls updateColour in paletteService', inject([PaletteService], (service: PaletteService) => {
    component.draw();
    spyOn(service, 'updateColour');
    component.sendColour();
    expect(service.updateColour).not.toHaveBeenCalled();
  }));

  it('#getColourAtPosition returns imageData', () => {
    component.draw();
    expect(component.getColorAtPosition(0, 0)).toBe('rgba(255,255,255,1)');
  });

  it('#getColourAtPosition returns empty string if ctx is undefined', () => {
    expect(component.getColorAtPosition(0, 0)).toBe('');
  });

  it('#getColour returns imageData', () => {
    component.draw();
    const test = new Uint8ClampedArray([255, 255, 255, 255]);
    expect(component.getColour(0, 0)).toEqual(test);
  });
});
