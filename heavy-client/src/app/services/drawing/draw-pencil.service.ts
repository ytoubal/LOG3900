import { Injectable, Renderer2 } from '@angular/core';
import { Tracing } from 'src/app/drawing-helper/tracing';
import { AllToolsService } from './all-tools.service';
import { AttributsService } from './attributs.service';
import { CanvasService } from './canvas.service';
import { PaletteService } from './palette.service';

@Injectable({
  providedIn: 'root'
})
export class DrawPencilService extends AllToolsService {
  mousedown: boolean;
  tracing: Tracing;
  arrayElements: SVGElement[];
  path: SVGElement;
  newClick: boolean;
  arrayPath: any[] = [];

  constructor(public renderer: Renderer2, attributService: AttributsService,
              public paletteService: PaletteService, canvas: CanvasService) {
    super(canvas, attributService, renderer);
    this.tracing = new Tracing(renderer);
    this.mousedown = false;
    this.arrayElements = [];
    this.newClick = true;
    this.manager = canvas.commandManager;
  }

  callTool(evt: MouseEvent | KeyboardEvent, size: number, color: string, isEraser : boolean, depth: number): void {
    
    switch (evt.type) {
      case 'mousedown':
        this.mouseDown(evt as MouseEvent, size, color, isEraser, depth);
        break;
      case 'mousemove':
        this.mouseMove(evt as MouseEvent, depth);
        break;
      case 'mouseup':
        this.mouseUp(depth);
        break;
      case 'mouseleave':
        this.mouseLeave(depth);
    }
  }

  mouseDown(evt: MouseEvent, size: number, color : string, isEraser: boolean, depth: number): void {
    if (this.newClick) {
      this.boardToUndo();
    }
    this.newClick = false;
    this.mousedown = true;
    let strokeColor = color;
    if (isEraser) {
      strokeColor = "rgba(255,255,255,1)";
    }
    this.setAttributes(size, strokeColor);
    this.tracing.updatePositions(evt, this.scrollableWindow);
    this.addLine(depth);
  }

  mouseUp(depth: number): void {
    this.newClick = true;
    this.stopDrawing(depth);
  }

  mouseMove(evt: MouseEvent, depth: number): void {
    if (this.mousedown) {
      this.arrayPath.push(evt);
      this.tracing.updatePositions(evt, this.scrollableWindow);
      this.addLine(depth);
    }
  }

  mouseLeave(depth: number): void {
    this.mouseUp(depth);
  }

  stopDrawing(depth: number): void {
    this.tracing.addClass = true;
    this.addLine(depth);
    this.tracing.addClass = false;
    
    this.tracing.emptyArraySaved();
    this.mousedown = false;
    this.emptyArrayElements();
    this.tracing.pathString = '';
    this.tracing.pathElem = null;
  }


  addLine(depth: number): void {
    const line: SVGElement = this.tracing.tracePath(depth);
    if (this.arrayElements.length) {
      this.removeLine();
    }
    this.arrayElements.push(line);


    if (depth != -1) {
      let before : SVGElement = null;
      let drawboardChildArr = this.canvasService.htmlElement.childNodes;
    
      for (let j = 0; j < drawboardChildArr.length; j++) {
        const id = (drawboardChildArr[j] as SVGElement).getAttribute('depth');
        if (depth < parseInt(id)) {
          before = drawboardChildArr[j] as SVGElement;
          break;
        }
      }

      if (before == null) {
        this.renderer.appendChild(this.drawingBoard, line);
      }
      else {
        this.renderer.insertBefore(this.canvasService.htmlElement, line, before);
      }
      // this.renderer.appendChild(this.drawingBoard, line);

      
    }
    else {
      this.renderer.appendChild(this.drawingBoard, line);
    }
    this.gridToTop();
  }

  removeLine(): void {
    if (this.arrayElements.length) {
      for (const element of this.arrayElements) {
        this.renderer.removeChild(this.drawingBoard, element);
      }
      this.emptyArrayElements();
    }
  }

  setAttributes(size: number, color: string): void {
    this.tracing.attributs.color = color;
    this.tracing.attributs.size = size;
  }

  emptyArrayElements(): void {
    this.arrayElements.splice(0, this.arrayElements.length);
  }

  clearTool(): void {
    if (!this.newClick) {
      this.manager.undoBoards.pop();
      this.manager.undoHistory.pop();
    }
    this.newClick = true;
    this.mousedown = false;
    this.removeLine();
    this.tracing.pathElem = null;
    this.stopDrawing(-1);
  }

  resetTracingId(): void {
    this.tracing.id = 0;
  }
}
