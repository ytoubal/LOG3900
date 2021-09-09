import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBarModule } from '@angular/material';
import { Colour } from '../colour/colour';
import { ColourPaletteComponent } from '../colour/colour-palette/colour-palette.component';
import { ColourSliderComponent } from '../colour/colour-slider/colour-slider.component';
import { ColourComponent } from '../colour/colour.component';
import { OpacitySliderComponent } from '../colour/opacity-slider/opacity-slider/opacity-slider.component';
import { ColourModalComponent } from './colour-modal.component';

describe('ColourModalComponent', () => {
  let component: ColourModalComponent;
  let fixture: ComponentFixture<ColourModalComponent>;
  const dialogMock = {
    // tslint:disable-next-line: no-empty
    close: () => {}
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, MatSnackBarModule],
      declarations: [ ColourModalComponent, ColourSliderComponent,
                  OpacitySliderComponent, ColourComponent, ColourPaletteComponent ],
      providers: [{provide: MAT_DIALOG_DATA, useValue: {}}, {provide: MatDialogRef, useValue: dialogMock}],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColourModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#disableShortcuts should not be able to trigger keyboard events', () => {
    const mockKeyboardEvent = new KeyboardEvent('keydown', {code: 'KeyA'});
    spyOn(KeyboardEvent.prototype, 'stopPropagation');
    component.disableShortcuts(mockKeyboardEvent);
    expect(KeyboardEvent.prototype.stopPropagation).toHaveBeenCalled();
  });

  it('#disableShortcuts valls evt.preventDefault', () => {
    const mockKeyboardEvent = new KeyboardEvent('keydown', {code: 'KeyQ'});
    spyOn(KeyboardEvent.prototype, 'preventDefault');
    component.disableShortcuts(mockKeyboardEvent);
    expect(KeyboardEvent.prototype.preventDefault).toHaveBeenCalled();
  });

  it('#openSnackBar snackBar.open is called', () => {
    spyOn(component.snackBar, 'open').withArgs('hello', 'ok', {duration: 5000});
    component.openSnackBar('hello', 'ok');
    expect(component.snackBar.open).toHaveBeenCalledWith('hello', 'ok', {duration: 5000});
  });

  it('#cancel should call close', () => {
    const spy = spyOn(component.dialogRef, 'close').and.callThrough();
    component.cancel();
    expect(spy).toHaveBeenCalled();
  });

  it('#apply should call close and update when input is used', () => {
    const spy = spyOn(component.dialogRef, 'close').and.callThrough();
    spyOn(component.paletteService, 'updatePrimarySecondary');
    spyOn(component.paletteService.newColour, 'next')(new Colour());
    component.isInput = true;
    component.colour = new Colour();
    component.accept();
    expect(component.paletteService.newColour.next).toHaveBeenCalled();
    expect(component.paletteService.updatePrimarySecondary).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
    expect(component.update).toBe(true);
  });

  it('#apply should call close and update when palette is used', () => {
    const spy = spyOn(component.dialogRef, 'close').and.callThrough();
    spyOn(component.paletteService, 'updatePrimarySecondary');
    component.accept();
    expect(component.paletteService.updatePrimarySecondary).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
    expect(component.update).toBe(true);
  });

  it('#apply should open snackBar if invalid', () => {
    spyOn(component, 'openSnackBar').withArgs('Veuillez choisir une couleur valide', 'OK');
    component.isInput = true;
    component.colour = new Colour();
    component.colour.r = 'A';
    component.accept();
    expect(component.openSnackBar).toHaveBeenCalled();
  });

  it('#updateColours just updates currentColour this.colour if not input', () => {
    component.isInput = true;
    component.colour = component.paletteService.stringToColour('AAAAAA1');
    component.updateColours(component.paletteService.stringToColour('FFFFFF1'));
    expect(component.currentColour).toBe('rgba(170,170,170,1)');
  });

  it('#setInput should chagnge isInput value', () => {
    component.isInput = false;
    component.setInput(true);
    expect(component.isInput).toBe(true);
  });
});
