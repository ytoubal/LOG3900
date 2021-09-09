import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { CanvasService } from './canvas.service';

const ONE_HUNDRED = 100;

@Injectable({
  providedIn: 'root'
})
export class GridService {
  showGrid: string;
  gridSize: number;
  gridOpacity: number;
  drawingBoard: HTMLElement;
  renderer: Renderer2;
  gridClicked: boolean;

  constructor(public rendererFactory: RendererFactory2, public canvasService: CanvasService) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.gridSize = ONE_HUNDRED;
    this.gridOpacity = ONE_HUNDRED;
    this.showGrid = "Show";
    this.gridClicked = false;
   }

  updateGrid(value: number, isSize: boolean): void {
    if (isSize) {
      this.gridSize = value;
    } else {
      this.gridOpacity = value / ONE_HUNDRED;
    }
    if (this.canvasService.gridActive) {
      this.removeGrid();
      this.setGrid();
    }
  }

  setGrid(): void {
    if (this.canvasService.gridActive) {
      this.showGrid = "Show"
      this.removeGrid();
    } else {
      this.showGrid = "Hide"
      const group = this.renderer.createElement('svg', 'svg');
      const opacity = this.gridOpacity;
      const size = this.gridSize;
      const pathString = 'M ' + size.toString() + ' 0 L 0 0 0 ' + size.toString();
      const colorString = 'rgba(0,0,0,' + opacity.toString() + ')';
      const pattern = this.renderer.createElement('pattern', 'svg');
      const path = this.renderer.createElement('path', 'svg');
      const rect = this.renderer.createElement('rect', 'svg');

      this.renderer.setAttribute(group, 'id', 'gridContainer');
      this.renderer.setAttribute(group, 'pointer-events', 'none');
      this.renderer.setAttribute(group, 'width', '100%');
      this.renderer.setAttribute(group, 'height', '100%');

      this.renderer.setAttribute(pattern, 'id', 'grid');
      this.renderer.setAttribute(pattern, 'width', size.toString());
      this.renderer.setAttribute(pattern, 'height', size.toString());
      this.renderer.setAttribute(pattern, 'patternUnits', 'userSpaceOnUse');

      this.renderer.setAttribute(path, 'd', pathString);
      this.renderer.setAttribute(path, 'fill', 'none');
      this.renderer.setAttribute(path, 'stroke', colorString);
      this.renderer.setAttribute(path, 'stroke-witdh', '1');

      this.renderer.setAttribute(rect, 'width', '100%');
      this.renderer.setAttribute(rect, 'height', '100%');
      this.renderer.setAttribute(rect, 'fill', 'url(#grid)');

      this.renderer.appendChild(pattern, path);
      this.renderer.appendChild(group, pattern);
      this.renderer.appendChild(group, rect);

      this.canvasService.grid = group;

      this.drawingBoard = this.canvasService.getHtmlElement();
      this.renderer.appendChild(this.drawingBoard, group);
      this.canvasService.gridActive = true;
    }
  }

  removeGrid(): void {
    this.renderer.removeChild(this.drawingBoard, this.canvasService.grid);
    this.canvasService.gridActive = false;
  }

}
