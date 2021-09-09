import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { SaveDrawingService } from 'src/app/services/drawing/save-drawing.service';

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

@Component({
  selector: 'app-modal-save-drawing',
  templateUrl: './modal-save-drawing.component.html',
  styleUrls: ['./modal-save-drawing.component.css']
})
export class ModalSaveDrawingComponent implements OnInit {

  exampleTags: string[] = ['#quarantaine', '#isolation', '#solitude'];
  currentTag: string;
  svgString: string;

  constructor(public dialogRef: MatDialogRef<ModalSaveDrawingComponent>, public saveDrawingService: SaveDrawingService,
              public snackBar: MatSnackBar, public sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.saveDrawingService.name = '';
    this.saveDrawingService.tag = [];
    this.currentTag = '';
    this.svgString = '';
  }

  cancel(): void {
    this.dialogRef.close();
  }

  save(): void {
    if (this.saveDrawingService.name === '') {
      this.snackBar.open('Veuillez entrer un nom', 'OK');
      return;
    }
    this.saveDrawingService.saveSvg().subscribe(() => {
        this.snackBar.open('Sauvegarde effectuée avec succès!', 'OK');
    }, () => {
      this.snackBar.open('Une erreur s\'est produite lors de la sauvegarde', 'OK');
    });
    this.dialogRef.close();
  }

  disableShortcuts(evt: KeyboardEvent): void {
    evt.stopPropagation();
    if (evt.code === 'Space') {
      evt.preventDefault();
    }
  }

  validTag(): boolean {
    return (this.currentTag.startsWith('#'));
  }

  createTag(): void {
    this.exampleTags.push(this.currentTag);
    this.currentTag = '';
  }

  selectTag(tag: string): void {
    if (this.isSelected(tag)) {
      this.saveDrawingService.tag.splice(this.saveDrawingService.tag.indexOf(tag), 1);
    } else {
      this.saveDrawingService.tag.push(tag);
    }
  }

  isSelected(tag: string): boolean {
    const index = -1;
    return (this.saveDrawingService.tag.indexOf(tag) > index);
  }

  getImgContent(): SafeUrl {
    const xml = new XMLSerializer();
    this.saveDrawingService.getChildren();
    let svgChildren = '';
    this.saveDrawingService.children.forEach((child: HTMLElement) => {
      svgChildren += xml.serializeToString(child);
    });
    this.saveDrawingService.children = [];
    const style = (this.saveDrawingService.canvas.htmlElement) ? this.saveDrawingService.canvas.htmlElement.getAttribute('style') : null;
    if (style) {
      const backgroundColor = style.split(';');
      const width = backgroundColor[1].split(':')[1];
      const height = backgroundColor[2].split(':')[1];
      // tslint:disable-next-line: max-line-length //il faut que ce soit sur une ligne pour que le test en lien fonctionne
      this.svgString = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" style = "${backgroundColor[0]}" viewbox = "0 0 ${width} ${height}" height = "${height}" width = "${width}">${filtersString}`;
      svgChildren = svgChildren.split('#').join('%23');
      this.svgString += svgChildren + '</svg>';
    }
    return this.sanitizer.bypassSecurityTrustUrl(this.svgString);
  }
}
