import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MatSnackBarModule } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { ModalSaveDrawingComponent } from './modal-save-drawing.component';

describe('ModalSaveDrawingComponent', () => {
  let component: ModalSaveDrawingComponent;
  let fixture: ComponentFixture<ModalSaveDrawingComponent>;

  const dialogMock = {
    // tslint:disable-next-line: no-empty close femre le modal
    close: () => { }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule, MatSnackBarModule, FormsModule, HttpClientModule, BrowserAnimationsModule],
      declarations: [ModalSaveDrawingComponent],
      providers: [{ provide: MatDialogRef, useValue: dialogMock }, {
        // from stackoverflow : https://stackoverflow.com/questions/51874109/angular-6-unit-testing-component-with-domsanitizer-dependency
        provide: DomSanitizer,
        useValue: {
          sanitize: () => 'safeString',
          bypassSecurityTrustUrl: () => 'safeString'
        }
      }],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSaveDrawingComponent);
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

  it('#validTag should return true with valid tag', () => {
    component.currentTag = '#tag1';
    expect(component.validTag()).toBe(true);
  });
  it('#validTag should return false with invalid tag', () => {
    component.currentTag = 'tagInvalid';
    expect(component.validTag()).toBe(false);
  });

  it('#createTag should push tag', () => {
    component.exampleTags = [];
    component.currentTag = '#tag';
    component.createTag();
    expect(component.exampleTags).toEqual(['#tag']);
  });
  it('#createTag should clear currentag', () => {
    component.currentTag = '#tag';
    component.createTag();
    expect(component.currentTag).toBe('');
  });

  it('#disableShortcuts should calls evt.preventDefault with Space', () => {
    const mockKeyboardEvent = new KeyboardEvent('keydown', { code: 'Space' });
    spyOn(KeyboardEvent.prototype, 'preventDefault');
    component.disableShortcuts(mockKeyboardEvent);
    expect(KeyboardEvent.prototype.preventDefault).toHaveBeenCalled();
  });

  it('#disableShortcuts should not be called evt.preventDefault', () => {
    const mockKeyboardEvent = new KeyboardEvent('keydown', { code: 'KeyQ' });
    spyOn(KeyboardEvent.prototype, 'preventDefault');
    component.disableShortcuts(mockKeyboardEvent);
    expect(KeyboardEvent.prototype.preventDefault).not.toHaveBeenCalled();
  });

  it('#disableShortcuts should not be able to trigger keyboard events and call stopPropagation', () => {
    const mockKeyboardEvent = new KeyboardEvent('keydown', { code: 'KeyA' });
    spyOn(KeyboardEvent.prototype, 'stopPropagation');
    component.disableShortcuts(mockKeyboardEvent);
    expect(KeyboardEvent.prototype.stopPropagation).toHaveBeenCalled();
  });

  it('#isSelected should return true', () => {
    component.saveDrawingService.tag = ['#tag1'];
    expect(component.isSelected('#tag1')).toBe(true);
  });
  it('#isSelected should return false', () => {
    component.saveDrawingService.tag = ['#tag10'];
    expect(component.isSelected('#tag1')).toBe(false);
  });

  it('#selectTag should push tag if not selected', () => {
    component.saveDrawingService.tag = ['#tag2'];
    component.selectTag('#tag1');
    expect(component.saveDrawingService.tag).toEqual(['#tag2', '#tag1']);
  });
  it('#selectTag should remove the tag from the list if tag selected', () => {
    component.saveDrawingService.tag = ['#tag1', '#tag2', '#tag3'];
    component.selectTag('#tag2');
    expect(component.saveDrawingService.tag).toEqual(['#tag1', '#tag3']);
  });

  it('#save should call dialogRef.close', () => {
    const obs = of('string');
    component.saveDrawingService.name = 'testName';
    component.saveDrawingService.children.push(document.createElement('div'));
    component.saveDrawingService.canvas.htmlElement = document.createElement('div');
    spyOn(component.saveDrawingService, 'saveSvg').and.returnValue(obs);
    const spy = spyOn(component.dialogRef, 'close').and.callThrough();
    component.save();
    expect(spy).toHaveBeenCalled();
  });
  it('#save should return if saveDrawingService name is "" ', () => {
    const obs = of('string');
    component.saveDrawingService.name = '';
    const spy = spyOn(component.dialogRef, 'close').and.callThrough();
    spyOn(component.saveDrawingService, 'saveSvg').and.returnValue(obs);
    component.save();
    expect(spy).not.toHaveBeenCalled();
  });

  it('#save should call saveDrawingService saveSVG() and snackBar.open and return an success message', () => {
    const obs = of('string');
    component.saveDrawingService.name = 'testName';
    component.saveDrawingService.children.push(document.createElement('div'));
    component.saveDrawingService.canvas.htmlElement = document.createElement('div');
    const spy = spyOn(component.saveDrawingService, 'saveSvg').and.returnValue(obs);
    spyOn(component.snackBar, 'open').withArgs('Sauvegarde effectuée avec succès!', 'OK');
    component.save();
    expect(spy).toHaveBeenCalled();
    expect(component.snackBar.open).toHaveBeenCalledWith('Sauvegarde effectuée avec succès!', 'OK');
  });

  it('#save should call saveDrawingService saveSVG() and snackBar.open and return an error message', () => {
    component.saveDrawingService.name = 'testName';
    component.saveDrawingService.children.push(document.createElement('div'));
    component.saveDrawingService.canvas.htmlElement = document.createElement('div');
    spyOn(component.saveDrawingService, 'saveSvg').and.returnValue(throwError('error'));
    spyOn(component.snackBar, 'open').withArgs('Une erreur s\'est produite lors de la sauvegarde', 'OK');
    component.save();
    expect(component.snackBar.open).toHaveBeenCalledWith('Une erreur s\'est produite lors de la sauvegarde', 'OK');
  });

  it('#getImgContent should not update the svgString if the style attribute is null', () => {
    component.getImgContent();
    expect(component.svgString).toEqual('');
  });

  it('#getImgContent should update properly the svgString', () => {
    component.saveDrawingService.children.push(document.createElement('div'));
    component.saveDrawingService.canvas.htmlElement = document.createElement('div');
    const oldStyle = 'background-color: rgb(255, 255, 255); width: 100px; height: 100px;';
    component.saveDrawingService.canvas.htmlElement.setAttribute('style', oldStyle);
    component.getImgContent();
    const xml = new XMLSerializer();
    component.saveDrawingService.getChildren();
    let svgChildren = '';
    component.saveDrawingService.children.forEach((child: HTMLElement) => {
      svgChildren += xml.serializeToString(child);
    });
    component.saveDrawingService.children = [];
    // tslint:disable-next-line: max-line-length
    const style = (component.saveDrawingService.canvas.htmlElement) ? component.saveDrawingService.canvas.htmlElement.getAttribute('style') : null;
    let expectString = '';
    const filtersString = `<filter id="Floue" filterUnits="userSpaceOnUse">
    <feGaussianBlur stdDeviation="3"
    in="SourceGraphic"></feGaussianBlur>
    </filter>
    <filter id = "Ombrage" filterUnits="userSpaceOnUse">
    <feDropShadow dx="3" dy="3" stdDeviation="3"/>
    </filter>
    <filter id="Distorsion" filterUnits="userSpaceOnUse">
    <feTurbulence type="turbulence" baseFrequency="0.10"
        numOctaves="2" result="turbulence"></feTurbulence>
    <feDisplacementMap in2="turbulence" in="SourceGraphic"
        scale="50" xChannelSelector="R" yChannelSelector="G"></feDisplacementMap>
    </filter>
    <filter id="Pointillage" filterUnits="userSpaceOnUse">
    <feTurbulence type="turbulence" baseFrequency="0.8"
        numOctaves="2" result="turbulence"></feTurbulence>
    <feDisplacementMap in2="turbulence" in="SourceGraphic"
        scale="50" xChannelSelector="R" yChannelSelector="G"></feDisplacementMap>
    </filter>
    <filter id="Fleur" filterUnits="userSpaceOnUse">
    <feTurbulence type="turbulence" baseFrequency="0.20 0.08"
        numOctaves="3" result="turbulence"></feTurbulence>
    <feDisplacementMap in2="turbulence" in="SourceGraphic"
        scale="20"
        ></feDisplacementMap>
    </filter>`;
    if (style) {
      const backgroundColor = style.split(';');
      const width = backgroundColor[1].split(':')[1];
      const height = backgroundColor[2].split(':')[1];

      // tslint:disable-next-line: max-line-length //il faut que ce soit sur une ligne pour que le test en lien fonctionne
      expectString = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" style = "${backgroundColor[0]}" viewbox = "0 0 ${width} ${height}" height = "${height}" width = "${width}">${filtersString}`;
      svgChildren = svgChildren.split('#').join('%23');
      expectString += svgChildren + '</svg>';
    }
    const correctUrl = component.sanitizer.bypassSecurityTrustUrl(expectString);
    expect(component.getImgContent()).toEqual(correctUrl);
  });
});
