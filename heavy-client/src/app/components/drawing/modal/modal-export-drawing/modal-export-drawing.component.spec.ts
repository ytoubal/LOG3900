// tslint:disable
import { RendererFactory2 } from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material';
import { MatDialogModule, MatDialogRef, } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppGlobals } from 'src/app/app.global';
import { CanvasService } from 'src/app/services/index/canvas.service';
import { ExportService } from 'src/app/services/index/export.service';
import { GridService } from 'src/app/services/index/grid.service';
import { PaletteService } from 'src/app/services/index/palette.service';
import { ColourPaletteComponent } from '../../colour/colour-palette/colour-palette.component';
import { ColourSliderComponent } from '../../colour/colour-slider/colour-slider.component';
import { ColourComponent } from '../../colour/colour.component';
import { OpacitySliderComponent } from '../../colour/opacity-slider/opacity-slider/opacity-slider.component';
import { CommandManager } from '../../command-manager';
import { ModalExportDrawingComponent } from './modal-export-drawing.component';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('ModalExportDrawingComponent', () => {
  let component: ModalExportDrawingComponent;
  let fixture: ComponentFixture<ModalExportDrawingComponent>;
  let canvasService: CanvasService;
  const manager: CommandManager = new CommandManager();
  let paletteService: PaletteService;
  let gridService: GridService;
  let exportService: ExportService;

  const dialogMock = {
    // tslint:disable-next-line: no-empty
    close: () => {}
   };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule, BrowserAnimationsModule, MatSnackBarModule, FormsModule, HttpClientTestingModule],
      declarations: [ ModalExportDrawingComponent,
                      ColourComponent,
                      ColourPaletteComponent,
                      ColourSliderComponent,
                      OpacitySliderComponent],
      providers: [AppGlobals, CanvasService, PaletteService,
        {provide: MatDialogRef, useValue: dialogMock}],
    })
    .compileComponents();
  })); //

  beforeEach(inject([RendererFactory2, HttpClient], (rendererFactory: RendererFactory2, http: HttpClient) => {
    canvasService = new CanvasService(manager);
    canvasService.htmlElement =  document.createElement('svg');
    paletteService = new PaletteService();
    gridService = new GridService(rendererFactory, canvasService);
    exportService = new ExportService(canvasService, gridService, paletteService, rendererFactory, http);
    exportService.canvasService.gridActive = false;
    fixture = TestBed.createComponent(ModalExportDrawingComponent);
    component = fixture.componentInstance;
    component.exportService = exportService;
    fixture.detectChanges();
  }));

  it('#cancel should call close', () => {
    const spy = spyOn(component.dialogRef, 'close').and.callThrough();
    component.cancel();
    expect(spy).toHaveBeenCalled();
  });

  it('#export should do nothing if confirm denied', () => {
    spyOn(window, 'confirm').and.callFake(function() { return false; });
    spyOn(document, 'createElement').withArgs('a');
    component.export();
    expect(document.createElement).not.toHaveBeenCalledWith('a');
  });

  it('#export should trigger download only if confirmed with SVG', () => {
    component.selectedType = 'SVG';
    spyOn(window, 'confirm').and.callFake(function() { return true; });
    component.exportService.svgURL = 'hello';
    component.export();
    expect(component.dataURL).toBe('hello');
  });

  it('#export should trigger download only if confirmed with PNG', () => {
    component.selectedType = 'PNG';
    spyOn(window, 'confirm').and.callFake(function() { return true; });
    spyOn(component.canvas, 'toDataURL').withArgs('image/png');
    component.export();
    expect(component.canvas.toDataURL).toHaveBeenCalledWith('image/png');
  });

  it('#export should trigger download only if confirmed with JPG', () => {
    component.selectedType = 'JPG';
    spyOn(window, 'confirm').and.callFake(function() { return true; });
    spyOn(component.canvas, 'toDataURL').withArgs('image/jpeg');
    component.export();
    expect(component.canvas.toDataURL).toHaveBeenCalledWith('image/jpeg');
  });

  it('#applyFilter calls applyFilter in exportService', () => {
    spyOn(component.exportService, 'applyFilter').withArgs('effect');
    component.applyFilter('effect');
    expect(component.exportService.applyFilter).toHaveBeenCalledWith('effect');
  });

  it('#resetFilters calls SVGToCanvas', () => {
    spyOn(component.exportService, 'SVGToCanvas').withArgs(false);
    component.resetFilters();
    expect(component.exportService.SVGToCanvas).toHaveBeenCalledWith(false);
  });

  it('#openSnackBar snackbar.open is called', () => {
    spyOn(component.snackBar, 'open').withArgs('hello', 'ok', {duration: 5000});
    component.openSnackBar('hello', 'ok');
    expect(component.snackBar.open).toHaveBeenCalled();
  });

  it('#disableShortcuts should call openSnackBar if key is in keys', () => {
    spyOn(component, 'openSnackBar').and.callThrough();
    const mockKeyboardEvent = new KeyboardEvent('keydown', {key: '/'});
    component.disableShortcuts(mockKeyboardEvent);
    expect(component.openSnackBar).toHaveBeenCalled();
  });

  it('#disableShortcuts should not call openSnackBar if key is not in keys', () => {
    spyOn(component, 'openSnackBar').and.callThrough();
    const mockKeyboardEvent = new KeyboardEvent('keydown', {key: 'a'});
    component.disableShortcuts(mockKeyboardEvent);
    expect(component.openSnackBar).not.toHaveBeenCalled();
  });

  it('#mail should open a snackbar with the message courriel envoyé! if sendMail doesnt return non valid address', () => {
    component.selectedType = 'JPG';
    component.email = 'mock@mock.com';
    component.dataURL = ',mock';
    const obs = of('string');
    spyOn(window, 'confirm').and.callFake(function() { return true; });
    spyOn(component, 'openSnackBar').withArgs('Courriel envoyé!', 'OK');
    const spy = spyOn(component.exportService, 'sendEmail').and.returnValue(obs);
    component.mail();
    expect(spy).toHaveBeenCalled();
    expect(component.openSnackBar).toHaveBeenCalledWith('Courriel envoyé!', 'OK');
  });

  it('#mail should open a snackbar with the message L\'adresse est non-valide! if sendMail returns non valid address, JPEG files', () => {
    component.selectedType = 'JPG';
    component.email = 'mock@mock.com';
    component.dataURL = ',mock';
    const obs = of('Adresse non-valide');
    spyOn(window, 'confirm').and.callFake(function() { return true; });
    const spy = spyOn(component.exportService, 'sendEmail').and.returnValue(obs);
    component.mail();
    expect(spy).toHaveBeenCalled();
  });

  it('#mail should open a snackbar with the message L\'adresse est non-valide! if sendMail returns non valid address, PNG files', () => {
    component.selectedType = 'PNG';
    component.email = 'mock@mock.com';
    component.dataURL = ',mock';
    const obs = of('Adresse non-valide');
    spyOn(window, 'confirm').and.callFake(function() { return true; });
    const spy = spyOn(component.exportService, 'sendEmail').and.returnValue(obs);
    component.mail();
    expect(spy).toHaveBeenCalled();
  });

  it('#mail should open a snackbar with the message L\'adresse est non-valide! if sendMail returns non valid address, SVG files', () => {
    component.selectedType = 'SVG';
    component.email = 'mock@mock.com';
    component.dataURL = ',mock';
    const obs = of('Adresse non-valide');
    spyOn(window, 'confirm').and.callFake(function() { return true; });
    const spy = spyOn(component.exportService, 'sendEmail').and.returnValue(obs);
    component.mail();
    expect(spy).toHaveBeenCalled();
  });

  it('#mail should not open a snackbar if the confirm is canceled', () => {
    component.selectedType = 'SVG';
    component.email = 'mock@mock.com';
    component.dataURL = ',mock';
    const obs = of('Adresse non-valide');
    spyOn(window, 'confirm').and.callFake(function() { return false; });
    const spy = spyOn(component.exportService, 'sendEmail').and.returnValue(obs);
    component.mail();
    expect(spy).not.toHaveBeenCalled();
  });
});
