import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AutomaticSaveService } from 'src/app/services/drawing/automatic-save.service';
import { CanvasService } from 'src/app/services/drawing/canvas.service';
import { PaletteService } from 'src/app/services/drawing/palette.service';
import { Dimensions } from '../../canvas/dimensions';
import { Information } from '../../canvas/info';
import { Colour } from '../../colour/colour';
import { ColourPaletteComponent } from '../../colour/colour-palette/colour-palette.component';
import { hexText } from '../../colour/hex-text';
import { AppGlobals } from './../../../../app.global';
import { CanvasComponent } from './../../canvas/canvas.component';

const widthCorrection = 39;
@Component({
  selector: 'app-modal-new-drawing',
  templateUrl: './modal-new-drawing.component.html',
  styleUrls: ['./modal-new-drawing.component.css'],
})
export class ModalNewDrawingComponent implements OnInit {

  canvas: CanvasComponent;
  newColour: ColourPaletteComponent;
  info: Information;
  currentColour: string;
  isInitialColour: boolean; // every time it is opened, the colour is white by default
  isInput: boolean;

  title: string;
  isActive: boolean;
  wasClicked: boolean;

  constructor(
    public router: Router,
    private global: AppGlobals,
    public dialogRef: MatDialogRef<ModalNewDrawingComponent>,
    public canvasService: CanvasService,
    public paletteService: PaletteService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    public automaticSaveService: AutomaticSaveService
  ) {
    this.setInitialValues();
    this.wasClicked = false;
  }

  setInitialValues(): void {
    this.info = new Information();
    this.info.colour = new Colour();
    this.info.colour = { r: 'FF', g: 'FF', b: 'FF', a: '1' };
    this.info.dim = new Dimensions();
    this.paletteService.newColour.next(this.paletteService.stringToColour('FFFFFF1'));
    this.info.dim.w -= widthCorrection;
  }

  ngOnInit(): void {
    this.info.update = false;
    this.isInitialColour = true;
    this.setInitialValues();
    this.paletteService.newColour.subscribe((newColour) => this.updateColours(newColour));
  }

  cancel(): void {
    this.dialogRef.close();
  }

  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

  goToWorkspace(router: Router): boolean {
    if (router.url === '/entry') {
      router.navigate(['/workspace']);
      return true;
    }
    return false;
  }

  create(): boolean {
    if (this.info.dim.h <= 0 || this.info.dim.w <= 0) {
      this.openSnackBar('Veuillez choisir des dimensions valides', 'OK');
      return false;
    } else if (this.info.colour.r.length !== 2 || this.info.colour.g.length !== 2 ||
      this.info.colour.b.length !== 2) {
      this.openSnackBar('Veuillez choisir une couleur valide', 'OK');
      return false;
    } else {
      this.goToWorkspace(this.router);
      let colorBackground = new Colour();
      colorBackground = { r: this.info.colour.r, g: this.info.colour.g, b: this.info.colour.b, a: this.info.colour.a };
      this.canvasService.backgroundCanvas = colorBackground;
      if (!this.canvasService.canvasHasChanges) {
        this.updateInfo();
      } else {
        if (confirm('Voulez-vous abandonner vos changements?')) {
          this.updateInfo();
        }
      }
      this.dialogRef.close();
      this.info.update = true;
      this.global.drawingExists = true;
      return true;
    }
  }

  updateInfo(): void {
    this.canvasService.updateInfo(this.info, true);
    this.canvasService.commandManager.undoHistory = [];
    this.canvasService.commandManager.redoHistory = [];
    this.canvasService.commandManager.undoBoards = [];
    this.canvasService.commandManager.redoBoards = [];
  }

  updateColours(newColour: Colour): void {
    if (!this.isInitialColour && !this.isInput) {
      this.currentColour = this.info.colour.r + this.info.colour.g + this.info.colour.b;
      this.info.colour.r = newColour.r;
      this.info.colour.g = newColour.g;
      this.info.colour.b = newColour.b;
    } else {
      this.isInitialColour = false;
    }
  }

  disableShortcuts(evt: KeyboardEvent): void {
    evt.stopPropagation();
    let isInside = false;
    for (const hex of hexText) {
      if (evt.code === hex) {
        isInside = true;
      }
    }
    if (!isInside) {
      evt.preventDefault();
    }
  }

  setInput(isInput: boolean): void {
    this.isInput = isInput;
  }
}
