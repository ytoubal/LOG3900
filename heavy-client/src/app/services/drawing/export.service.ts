import { HttpClient } from '@angular/common/http';
import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Observable } from 'rxjs';
import { EmailDrawing } from 'src/app/drawing-helper/email-drawing';
import { CanvasService } from './canvas.service';
import { GridService } from './grid.service';
import { PaletteService } from './palette.service';

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  renderer: Renderer2;
  drawingboard: HTMLElement;
  svgWithFilter: HTMLElement;
  svgURL: string;
  image: HTMLImageElement;

  constructor(
    public canvasService: CanvasService,
    public gridService: GridService,
    public paletteService: PaletteService,
    public rendererFactory: RendererFactory2,
    public http: HttpClient,
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.drawingboard = this.canvasService.htmlElement;
  }

  SVGToCanvas(isFilter: boolean): HTMLCanvasElement {
    this.drawingboard = this.canvasService.htmlElement;

    let svg = this.drawingboard.cloneNode(true) as HTMLElement;
    svg.childNodes.forEach((child: HTMLElement) => {
      if (child.getAttribute('class') === 'border' || child.getAttribute('id') === 'eraserTip') {
        svg.removeChild(child);
      }
    });

    this.insertBackground(svg);

    if (isFilter) {
      svg = this.svgWithFilter;
    }

    this.renderer.setStyle(svg, 'background-color', ''); // On enlève le background du SVG
    const canvas = this.renderer.createElement('canvas');
    const image = this.renderer.createElement('img');

    image.width = this.drawingboard.clientWidth;
    image.height = this.drawingboard.clientHeight;

    const xml = new XMLSerializer().serializeToString(svg);
    const svg64 = btoa(xml);
    const b64Start = 'data:image/svg+xml;base64,';
    const image64 = b64Start + svg64;
    image.src = image64;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    canvas.width = this.drawingboard.clientWidth;
    canvas.height = this.drawingboard.clientHeight;

    this.imageLoaded(ctx, image);
    this.svgURL = image.src;
    
    return canvas;
  }

  imageLoaded(ctx: CanvasRenderingContext2D, image: HTMLImageElement): boolean {
    image.onload = () => {
      ctx.drawImage(image, 0, 0);
    };
    return true;
  }

  applyFilter(effect: string): HTMLCanvasElement {
    this.svgWithFilter = this.drawingboard.cloneNode(true) as HTMLElement;
    this.insertBackground(this.svgWithFilter);
    this.renderer.setAttribute(this.svgWithFilter, 'filter', effect);
    return this.SVGToCanvas(true);
  }

  // On crée un élément rectangle de la même taille que le dessin
  // pour l'utiliser comme background auquel le filtre pourra être appliqué
  insertBackground(svg: HTMLElement): void {
    const style = this.canvasService.htmlElement.getAttribute('style');
    if (style) {
      const colour = style.split(':')[1].split(';')[0];
      const rectangle = this.renderer.createElement('rect', 'svg');
      this.renderer.setAttribute(rectangle, 'x', '0');
      this.renderer.setAttribute(rectangle, 'y', '0');
      this.renderer.setAttribute(rectangle, 'width', this.drawingboard.clientWidth.toString());
      this.renderer.setAttribute(rectangle, 'height', this.drawingboard.clientHeight.toString());
      this.renderer.setAttribute(rectangle, 'fill', colour);
      this.renderer.insertBefore(svg, rectangle, svg.firstChild);
    }
  }

  removeGrid(): void {
    if (this.canvasService.gridActive) {
      this.gridService.setGrid();
    }
  }

  sendEmail(image: EmailDrawing): Observable<string> {
    return this.http.post('http://localhost:3000/mail/sendmail', image, { responseType: 'text' });
  }
}
