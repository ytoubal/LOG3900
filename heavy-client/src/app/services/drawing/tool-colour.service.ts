import { Injectable, } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ColourModalComponent } from 'src/app/components/drawing/colour-modal/colour-modal.component';
import { PaletteService } from './palette.service';

@Injectable({
  providedIn: 'root'
})
export class ToolColourService {

  isActive: boolean;

  openColourModal(currentColour: boolean): void {
    if (!this.isActive) {
      this.paletteService.isPrimary = currentColour;
      if (this.paletteService.isPrimary) {
        this.paletteService.newColour.next(this.paletteService.primaryColour.getValue());
      } else {
        this.paletteService.newColour.next(this.paletteService.secondaryColour.getValue());
      }
      this.isActive = true;
      const dialogRef = this.dialog.open(ColourModalComponent, {
        width: '500px',
        autoFocus: false
      });
      dialogRef.afterClosed().subscribe(() => {
        this.isActive = false;
      });
    }
  }

  constructor(public dialog: MatDialog, public paletteService: PaletteService) {}
}
