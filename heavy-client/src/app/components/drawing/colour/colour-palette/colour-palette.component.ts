import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, Output,
         SimpleChanges, ViewChild } from '@angular/core';
import { PaletteService } from 'src/app/services/drawing/palette.service';

const SELECT_CIRCLE_DIM_1 = 10;
const SELECT_CIRCLE_DIM_2 = 0;
const SELECT_CIRCLE_DIM_3 = 2 * Math.PI;
const SELECT_LINE_WIDTH = 5;

@Component({
  selector: 'app-colour-palette',
  templateUrl: './colour-palette.component.html',
  styleUrls: ['./colour-palette.component.css']
})
export class ColourPaletteComponent implements AfterViewInit, OnChanges {
  @Input() hue: string;

  @Output() color: EventEmitter<string> = new EventEmitter(true);

  @ViewChild('canvas', {static: false}) canvas: ElementRef<HTMLCanvasElement>;

  ctx: CanvasRenderingContext2D;
  mousedown: boolean;
  checkError: boolean;

  selectedPosition: { x: number; y: number };
  constructor(public paletteService: PaletteService) {
    this.mousedown = false;
    this.checkError = false;  // error on first open, not instantiated properly
  }

  ngAfterViewInit(): void {
    this.draw();
  }

  draw(): void {
    if (this.checkError) {
      if (!this.ctx) {
        this.ctx = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;  // canvas juste pour la palette
      }
      const width = this.canvas.nativeElement.width;
      const height = this.canvas.nativeElement.height;

      this.ctx.fillStyle = this.hue || 'rgba(255,255,255,1)';
      this.ctx.fillRect(0, 0, width, height);

      const whiteGrad = this.ctx.createLinearGradient(0, 0, width, 0);
      whiteGrad.addColorStop(0, 'rgba(255,255,255,1)');
      whiteGrad.addColorStop(1, 'rgba(255,255,255,0)');

      this.ctx.fillStyle = whiteGrad;
      this.ctx.fillRect(0, 0, width, height);

      const blackGrad = this.ctx.createLinearGradient(0, 0, 0, height);
      blackGrad.addColorStop(0, 'rgba(0,0,0,0)');
      blackGrad.addColorStop(1, 'rgba(0,0,0,1)');

      this.ctx.fillStyle = blackGrad;
      this.ctx.fillRect(0, 0, width, height);

      if (this.selectedPosition) {
        this.ctx.strokeStyle = 'white';
        this.ctx.fillStyle = 'white';
        this.ctx.beginPath();
        this.ctx.arc(this.selectedPosition.x, this.selectedPosition.y, SELECT_CIRCLE_DIM_1, SELECT_CIRCLE_DIM_2, SELECT_CIRCLE_DIM_3);
        this.ctx.lineWidth = SELECT_LINE_WIDTH;
        this.ctx.stroke();
      }
    } else {
      this.checkError = true;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hue) {
      this.draw();
      const pos = this.selectedPosition;
      if (pos) {
        this.color.emit(this.getColorAtPosition(pos.x, pos.y));
      }
    }
  }

  @HostListener('window:mouseup', ['$event'])
  onMouseUp(evt: MouseEvent): void {
    this.mousedown = false;
  }

  onMouseDown(evt: MouseEvent): void {
    this.mousedown = true;
    this.selectedPosition = { x: evt.offsetX, y: evt.offsetY };
    this.draw();
    this.color.emit(this.getColorAtPosition(evt.offsetX, evt.offsetY));
    this.emitColor(evt.offsetX, evt.offsetY);
  }

  onMouseMove(evt: MouseEvent): void {
    if (this.mousedown) {
      this.selectedPosition = { x: evt.offsetX, y: evt.offsetY };
      this.draw();
      this.color.emit(this.getColorAtPosition(evt.offsetX, evt.offsetY));
      this.emitColor(evt.offsetX, evt.offsetY);
    }
  }

  emitColor(x: number, y: number): void {
    const rgbaColor = this.getColorAtPosition(x, y);
    this.color.emit(rgbaColor);
    this.sendColour();
  }

  sendColour(): void {
    if (this.selectedPosition) {
      const newColour: Uint8ClampedArray = this.getColour(this.selectedPosition.x, this.selectedPosition.y);
      this.paletteService.updateColour(newColour[0], newColour[1], newColour[2]);
    }
  }

  getColorAtPosition(x: number, y: number): string {
    if (this.ctx !== undefined) {
      const imageData = this.ctx.getImageData(x, y, 1, 1).data;
      return 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';
    }
    return '';
  }

  getColour(x: number, y: number): Uint8ClampedArray {
    const imageData = this.ctx.getImageData(x, y, 1, 1).data;
    return imageData;
  }
}
