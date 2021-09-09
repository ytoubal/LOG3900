// tslint:disable: max-line-length
// tslint:disable: max-file-line-count
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of } from 'rxjs';
import { ModalOpenDrawingComponent } from './modal-open-drawing.component';

describe('ModalOpenDrawingComponent', () => {
  let component: ModalOpenDrawingComponent;
  let fixture: ComponentFixture<ModalOpenDrawingComponent>;
  let mockSvgObject: Observable<object>;

  const dialogMock = {
    // tslint:disable-next-line: no-empty fonction
    close: () => { }
  };

  const mockEntry = {
    navigate: jasmine.createSpy('navigate'),
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule, MatSnackBarModule, FormsModule, HttpClientModule,
        BrowserAnimationsModule, RouterTestingModule, HttpClientTestingModule],
      declarations: [ModalOpenDrawingComponent],
      providers: [{ provide: Router, useValue: mockEntry }, { provide: MatDialogRef, useValue: dialogMock },
      { // from stackoverflow : https://stackoverflow.com/questions/51874109/angular-6-unit-testing-component-with-domsanitizer-dependency
        provide: DomSanitizer,
        useValue: {
          sanitize: () => 'safeString',
          bypassSecurityTrustUrl: () => 'safeString'
        }
      }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    mockSvgObject = of({ style: 'backround-color: rgb(255, 255, 255); width: 1536px; height: 560px;', svg: '<path xmlns="http://www.w3.org/2000/svg" colour-type="stroke" d="M 625.92 172 L 625.92 172" stroke="rgba(0,0,0,1)" stroke-width="36" stroke-linecap="round" id="0"/>,,', name: 'testSave', tag: ['#solitude'] });

    fixture = TestBed.createComponent(ModalOpenDrawingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();

    console.log(mockSvgObject);
  });

  it('#cancel should call close', () => {
    const spy = spyOn(component.dialogRef, 'close').and.callThrough();
    component.cancel();
    expect(spy).toHaveBeenCalled();
  });

  it('#validTag should return true with valid tag', () => {
    component.currentTag = '#existing tag';
    expect(component.validTag()).toBe(true);
  });
  it('#validTag should return false with invalid tag', () => {
    component.currentTag = '';
    expect(component.validTag()).toBe(false);
  });

  it('#createTag with tags not in list should push tag', () => {
    component.allCurrentTags = [];
    component.currentTag = '#tag';
    component.createTag();
    expect(component.allCurrentTags).toEqual(['#tag']);
    expect(component.currentTag).toBe('');
  });
  it('#createTag with tags in list should not push tag', () => {
    component.allCurrentTags = ['#tag'];
    const oldLength = component.allCurrentTags.length;
    component.currentTag = '#tag';
    component.createTag();
    expect(component.allCurrentTags.length).toBe(oldLength);
  });

  it('#disableShortcuts should calls evt.preventDefault', () => {
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

  it('#getImgContent should return correct SafeUrl', () => {
    const svgString = 'svgString';
    const correctUrl = component.sanitizer.bypassSecurityTrustUrl(svgString);
    expect(component.getImgContent(svgString)).toEqual(correctUrl);
  });

  it('#selectionDrawing should return correct id', () => {
    component.id = '';
    component.selectionDrawing('myId');
    expect(component.id).toBe('myId');
  });

  it('#emptyArrays should empty arrays', () => {
    component.arrayIndex = [0, 1, 2];
    component.arrayName = ['not empty'];
    component.arraySVG = ['not empty'];
    component.arrayId = ['not empty'];
    component.allCurrentTags = ['not empty'];
    component.drawingTags = [['not empty'], ['not empty2']];
    component.emptyArrays();
    expect(component.arrayIndex.length).toBe(0);
    expect(component.arrayName.length).toBe(0);
    expect(component.arraySVG.length).toBe(0);
    expect(component.arrayId.length).toBe(0);
    expect(component.allCurrentTags.length).toBe(0);
    expect(component.drawingTags.length).toBe(0);
  });

  it('#goToWorkspace routes to workspace if on entry', () => {
    Object.defineProperty(component.router, 'url', { value: '/entry' });
    expect(component.goToWorkspace(component.router)).toBe(true);
  });

  it('#goToWorkspace routes doest not exist', () => {
    Object.defineProperty(component.router, 'url', { value: '/workspace' });
    expect(component.goToWorkspace(component.router)).toBe(false);
  });

  // // console log error cauz of getGallery -> getDrawingsInformation
  // it('#deleteDrawing should call deleteDrawing from saveDrawingService and getGallery', () => {

  //   // saveDrawingSErvice.deleteDrawing retourne un Observable<string> --> utiliser of('string')
  //   const myDrawing = { style: 'style', svg: 'svg', name: 'name', tag: 'tag' };
  //   const objReturn = of(JSON.stringify(myDrawing));
  //   const spy = spyOn(component.saveDrawingService, 'deleteDrawing').and.returnValue(objReturn);
  //   const galleryResp = component.saveDrawingService.getGallery();
  //   spyOn(component.saveDrawingService, 'getGallery').and.returnValue(galleryResp);

  //   component.deleteDrawing('id');
  //   expect(spy).toHaveBeenCalled();
  //   expect(component.saveDrawingService.getGallery).toHaveBeenCalled();
  // });

  // it('#searchTag should call getGallery if saveDrawingService.tag.length is 0', () => {
  //   component.saveDrawingService.tag = [];
  //   spyOn(component.saveDrawingService, 'getGallery').and.returnValue(mockSvgObject);
  //   component.searchTag();
  //   expect(component.saveDrawingService.getGallery).toHaveBeenCalled();
  // });
  // it('#searchTag should call emptyArray and empty saveDrawingService.tag', () => {
  //   component.saveDrawingService.tag = ['#tag1'];
  //   const obs = of(new Object());
  //   spyOn(component.saveDrawingService, 'getTags').and.returnValue(obs);
  //   const spy = spyOn(component, 'emptyArrays');
  //   component.searchTag();
  //   expect(spy).toHaveBeenCalled();
  //   expect(component.saveDrawingService.tag.length).toBe(0);
  //   expect(component.saveDrawingService.getTags).toHaveBeenCalled();
  // });
  // it('#searchTag should call emptyArray and empty saveDrawingService.tag', () => {
  //   component.saveDrawingService.tag = ['#tag1'];
  //   const spy = spyOn(component, 'emptyArrays');
  //   component.searchTag();
  //   expect(spy).toHaveBeenCalled();
  //   expect(component.saveDrawingService.tag.length).toBe(0);
  // });

  // // works but with console.log error
  // it('#getGallery should call emptyArray, getGallery and empty savedrawingService.tag ', () => {
  //   component.saveDrawingService.tag = ['#tag1'];
  //   spyOn(component, 'emptyArrays');
  //   spyOn(component.saveDrawingService, 'getGallery').and.returnValue(mockSvgObject);
  //   spyOn(component, 'getDrawingsSVG').withArgs();
  //   component.getGallery();
  //   expect(component.saveDrawingService.getGallery).toHaveBeenCalled();
  //   expect(component.emptyArrays).toHaveBeenCalled();
  //   expect(component.saveDrawingService.tag.length).toBe(0);
  // });

  // // console.log error for getalldrawing
  // it('#open should return if id is empty ', () => {
  //   component.id = '';
  //   const spy = spyOn(component.dialogRef, 'close').and.callThrough();
  //   component.open();
  //   expect(spy).not.toHaveBeenCalled();
  // });
  // it('#open should call getSVGFromServer, updateWorkspace and close dialogRef ', () => {
  //   component.id = 'not empty';
  //   spyOn(component.automaticSaveService, 'automaticSave');
  //   spyOn(component.saveDrawingService, 'getSVGFromServer').and.returnValue(mockSvgObject);
  //   spyOn(component.saveDrawingService, 'updateWorkspace').withArgs('style', [document.createElement('div')]);
  //   const spyClose = spyOn(component.dialogRef, 'close').and.callThrough();
  //   component.open();
  //   expect(spyClose).toHaveBeenCalled();
  //   expect(component.saveDrawingService.getSVGFromServer).toHaveBeenCalled();
  //   expect(component.automaticSaveService.automaticSave).toHaveBeenCalled();
  // });
});
