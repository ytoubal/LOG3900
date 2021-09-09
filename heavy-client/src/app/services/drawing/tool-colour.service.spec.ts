import { inject, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef, MatSnackBarModule } from '@angular/material';
import { of } from 'rxjs';
import { ColourModalComponent } from 'src/app/components/app/colour-modal/colour-modal.component';
import { PaletteService } from './palette.service';
import { ToolColourService } from './tool-colour.service';

describe('Service: ToolColour', () => {

  let paletteService: PaletteService;
  let matDialog: MatDialog;
  let toolColourService: ToolColourService;
  let dialogSpy: jasmine.Spy;
  const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({}), close: null });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule, MatSnackBarModule],
      providers: [ToolColourService, ColourModalComponent, MatDialog,
        {provide: MatDialogRef, useValue: {}}, {provide: MAT_DIALOG_DATA, useValue: {}}]
    });
  });

  beforeEach(inject([MatDialog], (service: MatDialog) => {
    paletteService = new PaletteService();
    matDialog = service;
    toolColourService = new ToolColourService(matDialog, paletteService);
    dialogSpy = spyOn(TestBed.get(MatDialog), 'open').and.returnValue(dialogRefSpyObj);
  }));

  it('should create', inject([ToolColourService], (service: ToolColourService) => {
    expect(toolColourService).toBeTruthy();
  }));

  it('#openColourModal with argument true while isActive should not change isPrimary', () => {
    toolColourService.isActive = true;
    toolColourService.paletteService.isPrimary = false;
    toolColourService.openColourModal(true);
    expect(toolColourService.paletteService.isPrimary).toBe(false);
  });

  it('#openColourModal update newColour to secondaryColour if active', () => {
    toolColourService.isActive = false;
    toolColourService.paletteService.isPrimary = false;
    spyOn(toolColourService.paletteService.newColour, 'next').withArgs(toolColourService.paletteService.secondaryColour.getValue());
    toolColourService.openColourModal(false);
    expect(toolColourService.paletteService.newColour.next).toHaveBeenCalled();
  });

  it('#openColourModal with !isActive should make isActive equals true', inject([ColourModalComponent], (colour: ColourModalComponent) => {
    toolColourService.isActive = false;
    toolColourService.openColourModal(true);
    expect(dialogSpy).toHaveBeenCalledWith(ColourModalComponent, {width: '500px', autoFocus: false});
    expect(dialogRefSpyObj.afterClosed).toHaveBeenCalled();
    expect(toolColourService.isActive).toBe(false);
  }));
});
