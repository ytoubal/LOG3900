/*tslint:disable: no-magic-numbers for testing values*/

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OpacitySliderComponent } from './opacity-slider.component';

describe('OpacitySliderComponent', () => {
  let component: OpacitySliderComponent;
  let fixture: ComponentFixture<OpacitySliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpacitySliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpacitySliderComponent);
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
    expect(component.ctx.strokeStyle).toBe('#000000');
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
});
