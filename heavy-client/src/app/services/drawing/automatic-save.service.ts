import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { CanvasService } from './canvas.service';
import { PaletteService } from './palette.service';
import { SaveDrawingService } from './save-drawing.service';
@Injectable({
  providedIn: 'root'
})
export class AutomaticSaveService {
  children: HTMLElement[] = [];
  renderer: Renderer2;
  hasToUpdate: boolean;
  constructor(public canvasService: CanvasService, public rendererFactory: RendererFactory2, public saveDrawingService: SaveDrawingService,
              public paletteService: PaletteService) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.hasToUpdate = false;
  }

  hasDrawing(): boolean {
    return localStorage.length > 0;
  }

  automaticSave(): void {
    const style = this.canvasService.htmlElement.getAttribute('style');
    const xml = new XMLSerializer();
    let stringSvg = '';
    this.canvasService.htmlElement.childNodes.forEach((child: HTMLElement) => {
      if (child.tagName !== 'filter' && child.getAttribute('id') !== 'gridContainer' && child.getAttribute('class') !== 'border'
          && child.getAttribute('id') !== 'eraserTip') {
        this.children.push(child);
      }
    });
    this.children.forEach((child: HTMLElement) => {
      stringSvg += (xml.serializeToString(child) + ',,');
    });
    this.children = [];
    const myObj = { style, stringSvg };
    localStorage.setItem('drawing', JSON.stringify(myObj));
  }

  loadAutomaticDrawing(): void {
    const drawing = localStorage.getItem('drawing');
    if (drawing) {
      const object = JSON.parse(drawing);
      const parser = new DOMParser();
      const arrayDoc: HTMLElement[] = [];
      const array = object.stringSvg.split(',,');
      for (const element of array) {
        const doc = parser.parseFromString(element, 'image/svg+xml');
        arrayDoc.push(doc.documentElement);
      }
      this.saveDrawingService.updateWorkspace((object.style), arrayDoc);
    }
  }
}
