import { Component, OnInit, ViewEncapsulation, } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { EmailDrawing } from 'src/app/drawing-helper/email-drawing';
import { ExportService } from 'src/app/services/drawing/export.service';
import { SaveDrawingService } from 'src/app/services/drawing/save-drawing.service';
// import { EmailCommunicationService } from 'src/app/services/index/email-communication.service';

@Component({
  selector: 'app-modal-export-drawing',
  templateUrl: './modal-export-drawing.component.html',
  styleUrls: ['./modal-export-drawing.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [],
})
export class ModalExportDrawingComponent implements OnInit {

  canvas: HTMLCanvasElement;
  dataURL: string;
  filename: string;
  email: string;
  filetypes: string[];
  selectedType: string;

  constructor(
    public snackBar: MatSnackBar,
    public exportService: ExportService,
    public dialogRef: MatDialogRef<ModalExportDrawingComponent>,
    public emailService: SaveDrawingService,
    public sanitizer: DomSanitizer
    ) {
      this.canvas = document.createElement('canvas');
      this.filename = 'image';
      this.filetypes = ['SVG', 'PNG', 'JPG'];
      this.selectedType = 'SVG';
      this.exportService.removeGrid();
      this.email = '';
    }

  ngOnInit(): void {
    this.canvas = this.exportService.SVGToCanvas(false);
  }

  cancel(): void {
    this.dialogRef.close();
  }

  updateCanvasURL(): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(this.canvas.toDataURL());
  }

  // Code inspiré de https://spin.atomicobject.com/2014/01/21/convert-svg-to-png/ et
  // https://stackoverflow.com/questions/35945001/binding-select-element-to-object-in-angular
  export(): void {
    if (confirm('Attention! Ce dessin sera exporté et téléchargé sur votre appareil sous format ' + this.selectedType + '.')) {
      let newFilename = this.filename;
      switch (this.selectedType) {
        case 'SVG':
          this.dataURL = this.exportService.svgURL;
          newFilename += '.svg';
          break;
        case 'PNG':
          this.dataURL = this.canvas.toDataURL('image/png');
          newFilename += '.png';
          break;
        case 'JPG':
          this.dataURL = this.canvas.toDataURL('image/jpeg');
          newFilename += '.jpg';
          break;
      }
      const a = document.createElement('a');
      a.href = this.dataURL;
      a.download = newFilename;
      document.body.appendChild(a);
      console.log(a);
      // a.click();
    }
  }

  mail(): void {
    if (confirm('Attention! Ce dessin sera envoyé au courriel ' + this.email + '.')) {
      let newFilename = this.filename;
      let type = '';
      switch (this.selectedType) {
        case 'SVG':
          this.dataURL = this.exportService.svgURL;
          newFilename += '.svg';
          type = 'image/svg+xml';
          break;
        case 'PNG':
          this.dataURL = this.canvas.toDataURL('image/png');
          newFilename += '.png';
          type = 'image/png';
          break;
        case 'JPG':
          this.dataURL = this.canvas.toDataURL('image/jpeg');
          newFilename += '.jpg';
          type = 'image/jpeg';
          break;
      }
      const mail = new EmailDrawing();
      mail.address = this.email;
      mail.file = this.dataURL;
      mail.type = type;
      mail.name = newFilename;
      this.exportService.sendEmail(mail).subscribe((data) => {
        if (data !== 'Adresse non-valide') {
          this.openSnackBar('Courriel envoyé!', 'OK');
          this.dialogRef.close();
        } else {
          this.openSnackBar('L\'adresse est non-valide!', 'OK');
          this.dialogRef.close();
        }
      });
    }
  }

  applyFilter(effect: string): void {
    this.canvas = this.exportService.applyFilter(effect);
  }

  resetFilters(): void {
    this.canvas = this.exportService.SVGToCanvas(false);
  }

  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

  disableShortcuts(evt: KeyboardEvent): void {
    evt.stopPropagation();
    const keys: string[] = ['\\', '/', ':', '*', '?', '"', '<', '>', '|'];
    if (keys.includes(evt.key)) {
      evt.preventDefault();
      this.openSnackBar('Un nom de fichier ne peut pas contenir les charactères suivants: \n \\ / : * ? " < > |', 'OK');
    }
  }
}
