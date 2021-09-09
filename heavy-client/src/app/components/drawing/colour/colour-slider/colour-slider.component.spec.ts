/*tslint:disable: no-magic-numbers for testing values*/

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ColourSliderComponent } from './colour-slider.component';

describe('ColourSliderComponent', () => {
  let component: ColourSliderComponent;
  let fixture: ComponentFixture<ColourSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColourSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColourSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#draw if canvas doesnt exist, set as 2d canvas', () => {
    // component is never created so it is null
    component.draw();
    expect(component.ctx).toBe(component.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D);
  });

  it('#draw values are properly set', () => {
    const width = component.canvas.nativeElement.width;
    const height = component.canvas.nativeElement.height;
    component.draw();
    spyOn(component.ctx, 'rect').withArgs(0, 0, width, height);
    component.draw();
    expect(component.ctx.rect).toHaveBeenCalled();
  });

  it('#draw height is selected', () => {
    component.selectedHeight = 1;

    component.draw();
    expect(component.ctx.strokeStyle).toBe('#ffffff');
    expect(component.ctx.lineWidth).toBe(5);
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

  it('#onMouseMove should call draw and emit a colour', () => {
    component.mousedown = false;
    component.draw();
    const mockMouseEvent = new MouseEvent('mousemove');
    spyOn(component, 'draw');
    component.onMouseMove(mockMouseEvent);
    expect(component.draw).not.toHaveBeenCalled();
  });

  it('#emitColor emits and calls sendColour', () => {
    component.draw();
    const rgbaColour = component.getColorAtPosition(0, 0);
    spyOn(component.color, 'emit').withArgs(rgbaColour);
    component.emitColor(0, 0);
    expect(component.color.emit).toHaveBeenCalled();
  });

  it('#getColourAtPosition returns imageData', () => {
    component.draw();
    expect(component.getColorAtPosition(0, 0)).toBe('rgba(255,5,0,1)');
  });

  it('#getColour returns imageData', () => {
    component.draw();
    const test = new Uint8ClampedArray([255, 5, 0, 255]);
    expect(component.getColour(0, 0)).toEqual(test);
  });

});
