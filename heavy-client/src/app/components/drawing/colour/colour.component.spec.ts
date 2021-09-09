import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ColourPaletteComponent } from './colour-palette/colour-palette.component';
import { ColourSliderComponent } from './colour-slider/colour-slider.component';
import { ColourComponent } from './colour.component';
import { OpacitySliderComponent } from './opacity-slider/opacity-slider/opacity-slider.component';

describe('ColourComponent', () => {
  let component: ColourComponent;
  let fixture: ComponentFixture<ColourComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColourComponent, ColourComponent,
        ColourPaletteComponent,
        ColourSliderComponent,
        OpacitySliderComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
