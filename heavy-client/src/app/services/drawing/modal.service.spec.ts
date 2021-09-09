/*tslint:disable: no-magic-numbers for testing values*/

import { inject, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material';
import { of } from 'rxjs';
import { ModalBackgroundColourComponent } from 'src/app/components/app/modal/modal-background-colour/modal-background-colour.component';
import { modalComponents } from 'src/app/components/app/modal/modal.component';
import { ModalService } from './modal.service';

export class TestComponent extends ModalBackgroundColourComponent { }

describe('Service: Modal', () => {
  let modalService: ModalService;
  let dialogSpy: jasmine.Spy;
  const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({}), close: null });
  dialogRefSpyObj.componentInstance = {
    body: ''
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule],
      providers: [ModalService]
    });
    modalService = TestBed.get(ModalService);
  });

  beforeEach(() => {
    dialogSpy = spyOn(TestBed.get(MatDialog), 'open').and.returnValue(dialogRefSpyObj);
  });

  it('should be created', inject([ModalService], (service: ModalService) => {
    expect(service).toBeTruthy();
  }));

  it('openModal if isActive is false', () => {
    modalService.isActive = false;
    modalService.openModal(TestComponent);
    expect(dialogSpy).toHaveBeenCalledWith(TestComponent, {maxWidth: '500px', maxHeight: '500px', autoFocus: false});
    expect(dialogRefSpyObj.afterClosed).toHaveBeenCalled();
    expect(modalService.isActive).toBe(false);
});

  it('openModal if isActive is true', () => {
    modalService.isActive = true;
    modalService.openModal(TestComponent);
    expect(modalService.isActive).toBe(true);
    expect(dialogSpy).not.toHaveBeenCalledWith(TestComponent, {maxWidth: '500px', maxHeight: '500px', autoFocus: false});
    expect(dialogRefSpyObj.afterClosed).toHaveBeenCalled();
  });

  it('#changeBackground', () => {
    modalService.changeBackground();
    modalService.isActive = false;
    expect(dialogSpy).toHaveBeenCalledWith(modalComponents[0], {maxWidth: '500px', maxHeight: '500px', autoFocus: false});
    expect(dialogRefSpyObj.afterClosed).toHaveBeenCalled();
  });

  it('#exportDrawing', () => {
    modalService.exportDrawing();
    modalService.isActive = false;
    expect(dialogSpy).toHaveBeenCalledWith(modalComponents[1], {maxWidth: '500px', maxHeight: '500px', autoFocus: false});
    expect(dialogRefSpyObj.afterClosed).toHaveBeenCalled();
  });

  it('#createNewDrawing', () => {
    modalService.createNewDrawing();
    modalService.isActive = false;
    expect(dialogSpy).toHaveBeenCalledWith(modalComponents[2], {maxWidth: '500px', maxHeight: '500px', autoFocus: false});
    expect(dialogRefSpyObj.afterClosed).toHaveBeenCalled();
  });

  it('#openDrawing', () => {
    modalService.openDrawing();
    modalService.isActive = false;
    expect(dialogSpy).toHaveBeenCalledWith(modalComponents[3], {maxWidth: '500px', maxHeight: '500px', autoFocus: false});
    expect(dialogRefSpyObj.afterClosed).toHaveBeenCalled();
  });

  it('#saveDrawing', () => {
    modalService.saveDrawing();
    modalService.isActive = false;
    expect(dialogSpy).toHaveBeenCalledWith(modalComponents[4], {maxWidth: '500px', maxHeight: '500px', autoFocus: false});
    expect(dialogRefSpyObj.afterClosed).toHaveBeenCalled();
  });
});
