import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalExportDrawingComponent } from 'src/app/components/drawing/modal/modal-export-drawing/modal-export-drawing.component';
import { ModalNewDrawingComponent } from 'src/app/components/drawing/modal/modal-new-drawing/modal-new-drawing.component';
import { ModalOpenDrawingComponent } from 'src/app/components/drawing/modal/modal-open-drawing/modal-open-drawing.component';
import { ModalSaveDrawingComponent } from 'src/app/components/drawing/modal/modal-save-drawing/modal-save-drawing.component';
import { modalComponents } from 'src/app/components/drawing/modal/modal.component';


export interface DialogData {
  title: string;
}

@Injectable({
  providedIn: 'root'
})

// Code inspired by https://material.angular.io/components/dialog/examples
export class ModalService {

  title: string;
  isActive: boolean;
  wasClicked: boolean;

  constructor(public dialog: MatDialog) {
    this.wasClicked = false;
  }

  openModal(component: ComponentType <   ModalExportDrawingComponent |
     ModalNewDrawingComponent |  ModalOpenDrawingComponent |  ModalSaveDrawingComponent>): void {
    if (!this.isActive) {
      this.isActive = true;
      const dialogRef = this.dialog.open(component, {
        maxWidth: '500px',
        maxHeight: '500px',
        autoFocus: false,
      });
      dialogRef.afterClosed().subscribe(() => {
        this.isActive =  false;
      });
    }
  }

  changeBackground(): void {
    this.openModal(modalComponents[0]);
  }

  exportDrawing(): void {
    this.openModal(modalComponents[1]);
  }

  createNewDrawing(): void {
    this.openModal(modalComponents[2]);
  }

  openDrawing(): void {
    const openDrawingIndex = 3;
    this.openModal(modalComponents[openDrawingIndex]);
  }

  saveDrawing(): void {
    const saveDrawing = 4;
    this.openModal(modalComponents[saveDrawing]);
  }
}
