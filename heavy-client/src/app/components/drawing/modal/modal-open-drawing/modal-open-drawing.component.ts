import { Component, OnInit} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AutomaticSaveService } from 'src/app/services/drawing/automatic-save.service';
import { CanvasService } from 'src/app/services/drawing/canvas.service';
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
  selector: 'app-modal-open-drawing',
  templateUrl: './modal-open-drawing.component.html',
  styleUrls: ['./modal-open-drawing.component.css']
})

export class ModalOpenDrawingComponent implements OnInit {

  id: string;
  currentTag: string;
  allCurrentTags: string[];
  drawingTags: string[][];
  drawingTagsExtra: string[][];
  arrayId: string[];
  arraySVG: string[];
  arrayName: string[];
  arrayIndex: number[];

  constructor(public dialogRef: MatDialogRef<ModalOpenDrawingComponent>, public saveDrawingService: SaveDrawingService,
              private snackBar: MatSnackBar, public sanitizer: DomSanitizer, public canvasService: CanvasService,
              public dialog: MatDialog, public router: Router, public automaticSaveService: AutomaticSaveService ) { }

  ngOnInit(): void {
    this.currentTag = '';
    this.id = '';
    this.allCurrentTags = [];
    this.drawingTags = [];
    this.drawingTagsExtra = [];
    this.saveDrawingService.tag = [];
    this.saveDrawingService.name = '';
    this.arrayId = [];
    this.arraySVG = [];
    this.arrayName = [];
    this.arrayIndex = [];
    this.getGallery();
  }

  getGallery(): void {
    this.emptyArrays();
    this.saveDrawingService.getGallery().subscribe(async (data: []) => {
      if (data.length === 0) {
        this.snackBar.open('Aucun dessin dans la galerie', 'OK');
        return;
      }
      let i = 0;
      let galleryHasADrawing = false;
      for (const element of data) {
        const object = JSON.parse(JSON.stringify(element));
        const asyncData = await this.saveDrawingService.getSVGFromServer(object._id).toPromise();
        if (asyncData.toString() !== 'NOTFOUND') {
          galleryHasADrawing = true;
          this.getDrawingsInformation(element, i);
          i++;
          this.getDrawingsSVG(asyncData.toString());
        }
      }
      if (!galleryHasADrawing) {
        this.snackBar.open('Aucun dessin dans la galerie', 'OK');
        return;
      }
    });
    this.saveDrawingService.tag = [];
  }

  getDrawingsInformation(element: object, i: number): void {
    const object = JSON.parse(JSON.stringify(element));
    this.arrayId.push(object._id);
    this.arrayName.push(object.name);
    this.drawingTags[i] = [];
    this.drawingTagsExtra[i] = [];
    let numberTag = 0;
    const maxTags = 3;
    for (const tag of object.tag) {
      if (numberTag++ < maxTags) {
        this.drawingTags[i].push(tag);
      }
      this.drawingTagsExtra[i].push(tag);
    }
    this.arrayIndex.push(i);
  }

  getDrawingsSVG(asyncData: string): void {
    const svg = JSON.parse(asyncData.toString()).svg;
    const style = JSON.parse(asyncData.toString()).style;
    const backgroundColor = style.split(';');
    const width = backgroundColor[1].split(':')[1];
    const height = backgroundColor[2].split(':')[1];
    let svgString = `data:image/svg+xml;utf8,<svg style = "${backgroundColor[0]}" viewbox = "0 0 ${width} ${height}"
        xmlns="http://www.w3.org/2000/svg" height = "${height}" width = "${width}">${filtersString}`;
    const arraySplit = svg.split(',,');
    for (const split of arraySplit) {
      svgString += split;
    }
    svgString = svgString.split('#').join('%23');
    svgString += '</svg>';
    this.arraySVG.push(svgString);
  }

  cancel(): void {
    this.dialogRef.close();
  }

  open(): void {
    if (this.id === '') {
      this.snackBar.open("Aucun dessin n'est sélectionné", 'OK');
      return;
    }
    if (this.canvasService.canvasHasChanges) {
      if (confirm('Voulez-vous abandonner vos changements en chargeant un dessin?')) {
        this.goToWorkspace(this.router);
        this.getSVGFromServer();
      }
    } else {
      this.goToWorkspace(this.router);
      this.getSVGFromServer();
    }
    this.dialogRef.close();
  }

  getSVGFromServer(): void {
    this.saveDrawingService.getSVGFromServer(this.id).subscribe((data) => {
      const parser = new DOMParser();
      const svg = JSON.parse(data.toString()).svg;
      const style = JSON.parse(data.toString()).style;
      const array = svg.split(',,');
      const arrayDoc: HTMLElement[] = [];
      for (const element of array) {
        const doc = parser.parseFromString(element, 'image/svg+xml');
        arrayDoc.push(doc.documentElement);
      }
      this.saveDrawingService.updateWorkspace(style, arrayDoc);
    });
    this.automaticSaveService.automaticSave();
  }

  searchTag(): void {
    this.id = '';
    if (this.saveDrawingService.tag.length === 0) {
      this.getGallery();
      return;
    }
    this.emptyArrays();
    this.saveDrawingService.getTags().subscribe(async (data: []) => {
      if (data.length === 0) {
        this.snackBar.open('Aucun dessin ne correspond à cette étiquette', 'OK');
        return;
      }
      let i = 0;
      let galleryHasADrawing = false;
      for (const element of data) {
        const object = JSON.parse(JSON.stringify(element));
        const asyncData = await this.saveDrawingService.getSVGFromServer(object._id).toPromise();
        if (asyncData.toString() !== 'NOTFOUND') {
          galleryHasADrawing = true;
          this.getDrawingsInformation(element, i);
          i++;
          this.getDrawingsSVG(asyncData.toString());
        }
      }
      if (!galleryHasADrawing) {
        this.snackBar.open('Aucun dessin ne correspond à cette étiquette', 'OK');
        return;
      }
    });
    this.saveDrawingService.tag = [];
  }

  deleteDrawing(id: string): void {
    this.saveDrawingService.deleteDrawing(id).subscribe((data) => {
      this.getGallery();
    });
  }

  emptyArrays(): void {
    this.arrayIndex = [];
    this.arrayName = [];
    this.arraySVG = [];
    this.arrayId = [];
    this.allCurrentTags = [];
    this.drawingTags = [];
  }

  selectionDrawing(id: string): void {
    this.id = id;
  }

  getImgContent(svgString: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(svgString);
  }

  disableShortcuts(evt: KeyboardEvent): void {
    evt.stopPropagation();
    if (evt.code === 'Space') {
      evt.preventDefault();
    }
  }

  validTag(): boolean {
    return (this.currentTag !== '');
  }

  createTag(): void {
    const index = -1;
    if (this.allCurrentTags.indexOf(this.currentTag) > index) {
      this.currentTag = '';
      return;
    }
    this.allCurrentTags.push(this.currentTag);
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

  goToWorkspace(router: Router): boolean {
    if (router.url === '/entry') {
      router.navigate(['/workspace']);
      return true;
    }
    return false;
  }
}
