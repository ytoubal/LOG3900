import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Output, ViewChild } from '@angular/core';
import { PaletteService } from 'src/app/services/drawing/palette.service';

const SLIDER_GRADIENT_1 = 0;
const SLIDER_GRADIENT_2 = 0.17;
const SLIDER_GRADIENT_3 = 0.34;
const SLIDER_GRADIENT_4 = 0.51;
const SLIDER_GRADIENT_5 = 0.68;
const SLIDER_GRADIENT_6 = 0.85;
const SLIDER_GRADIENT_7 = 1;
const LINE_WIDTH = 5;
const LINE_HEIGHT = 10;

@Component({
  selector: 'app-colour-slider',
  templateUrl: './colour-slider.component.html',
  styleUrls: ['./colour-slider.component.css']
})
export class ColourSliderComponent implements AfterViewInit {
  @ViewChild('canvas', {static: false})
  canvas: ElementRef<HTMLCanvasElement>;

  @Output() color: EventEmitter<string> = new EventEmitter();
  @Output() sendColour: EventEmitter<string> = new EventEmitter();

  ctx: CanvasRenderingContext2D;
  mousedown: boolean;
  selectedHeight: number;

  constructor(public paletteService: PaletteService) {
    this.mousedown = false;
  }

  ngAfterViewInit(): void {
    this.draw();
  }

  draw(): void {
    if (!this.ctx) {
      this.ctx = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    }
    const width = this.canvas.nativeElement.width;
    const height = this.canvas.nativeElement.height;

    this.ctx.clearRect(0, 0, width, height);

    const gradient = this.ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(SLIDER_GRADIENT_1, 'rgba(255, 0, 0, 1)');
    gradient.addColorStop(SLIDER_GRADIENT_2, 'rgba(255, 255, 0, 1)');
    gradient.addColorStop(SLIDER_GRADIENT_3, 'rgba(0, 255, 0, 1)');
    gradient.addColorStop(SLIDER_GRADIENT_4, 'rgba(0, 255, 255, 1)');
    gradient.addColorStop(SLIDER_GRADIENT_5, 'rgba(0, 0, 255, 1)');
    gradient.addColorStop(SLIDER_GRADIENT_6, 'rgba(255, 0, 255, 1)');
    gradient.addColorStop(SLIDER_GRADIENT_7, 'rgba(255, 0, 0, 1)');

    this.ctx.beginPath();
    this.ctx.rect(0, 0, width, height);

    this.ctx.fillStyle = gradient;
    this.ctx.fill();
    this.ctx.closePath();

    if (this.selectedHeight) {
      this.ctx.beginPath();
      this.ctx.strokeStyle = 'white';
      this.ctx.lineWidth = LINE_WIDTH;
      this.ctx.rect(0, this.selectedHeight - LINE_WIDTH, width, LINE_HEIGHT);
      this.ctx.stroke();
      this.ctx.closePath();
    }
  }

  @HostListener('window:mouseup', ['$event'])
  onMouseUp(evt: MouseEvent): void {
    this.mousedown = false;
    this.sendColour.emit();
  }

  onMouseDown(evt: MouseEvent): void {
    this.mousedown = true;
    this.selectedHeight = evt.offsetY;
    this.draw();
    this.emitColor(evt.offsetX, evt.offsetY);
  }

  onMouseMove(evt: MouseEvent): void {
    if (this.mousedown) {
      this.selectedHeight = evt.offsetY;
      this.draw();
      this.emitColor(evt.offsetX, evt.offsetY);
    }
  }

  emitColor(x: number, y: number): void {
    const rgbaColor = this.getColorAtPosition(x, y);
    this.color.emit(rgbaColor);
    this.sendColour.emit();
  }

  getColorAtPosition(x: number, y: number): string {
    const imageData = this.ctx.getImageData(x, y, 1, 1).data;
    return 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';
  }

  getColour(x: number, y: number): Uint8ClampedArray {
    const imageData = this.ctx.getImageData(x, y, 1, 1).data;
    return imageData;
  }
}
