import { Injectable, Renderer2 } from '@angular/core';
import { AllToolsService } from './all-tools.service';
import { AttributsService } from './attributs.service';
import { CanvasService } from './canvas.service';
const DEFAULT_ERASER_SIZE = 3;
@Injectable({
  providedIn: 'root'
})

export class EffaceService extends AllToolsService {
  mousedown: boolean;
  size: number;
  square: SVGElement;
  hoverElementsList: SVGGraphicsElement[];
  elementColor: string[];
  onHover: boolean;
  eraseList: SVGGraphicsElement[];
  newClick: boolean;

  constructor(public renderer: Renderer2, attributService: AttributsService, canvas: CanvasService) {
    super(canvas, attributService, renderer);
    this.mousedown = false;
    this.size = DEFAULT_ERASER_SIZE;
    this.hoverElementsList = [];
    this.manager = canvas.commandManager;
    this.square = this.renderer.createElement('rect', 'svg');
    this.elementColor = [];
    this.onHover = false;
    this.eraseList = [];
    this.newClick = true;
  }

  callTool(evt: MouseEvent | KeyboardEvent, size: number): void {
    switch (evt.type) {
      case 'mousedown':
        this.mouseDown(evt as MouseEvent);
        break;
      case 'mousemove':
        this.mouseMove(evt as MouseEvent, size);
        break;
      case 'mouseup':
        this.mouseUp();
        break;
      case 'mouseleave':
        this.mouseLeave();
      case 'keydown':
        this.keydown(evt as KeyboardEvent);
    }
  }

  hoverSquare(evt: MouseEvent): void {
    const clientRect = this.scrollableWindow.getBoundingClientRect();
    const centerOffset = this.size / 2;
    const pointX = evt.clientX + this.scrollableWindow.scrollLeft - clientRect.left - centerOffset;
    const pointY = evt.clientY + this.scrollableWindow.scrollTop - clientRect.top - centerOffset;
    this.square.setAttribute('id', 'eraserTip');
    this.square.setAttribute('width', `${(this.size)}`);
    this.square.setAttribute('height', `${(this.size)}`);
    this.square.setAttribute('fill', 'white');
    this.square.setAttribute('stroke', 'black');
    this.square.setAttribute('x', `${pointX}`);
    this.square.setAttribute('y', `${pointY}`);
    this.square.setAttribute('pointer-events', 'none'); // bloquer que le square se fasse detecter
    this.renderer.appendChild(this.drawingBoard, this.square);
  }

  getTarget(target: SVGGraphicsElement): SVGGraphicsElement {
    while (target !== null && target.parentNode !== this.drawingBoard && target.parentNode !== this.square) {
      target = target.parentNode as SVGGraphicsElement;
    }
    return target;
  }

  getEraserBorders(evt: MouseEvent): Element[] {
    const centerOffset = this.size / 2;
    const center = document.elementFromPoint(evt.clientX, evt.clientY) as Element;
    const bottomRight = document.elementFromPoint(evt.clientX + centerOffset, evt.clientY + centerOffset) as Element;
    const topRight = document.elementFromPoint(evt.clientX + centerOffset, evt.clientY - centerOffset) as Element;
    const topLeft = document.elementFromPoint(evt.clientX - centerOffset, evt.clientY + centerOffset) as Element;
    const bottomLeft = document.elementFromPoint(evt.clientX - centerOffset, evt.clientY - centerOffset) as Element;
    const right = document.elementFromPoint(evt.clientX + centerOffset, evt.clientY) as Element;
    const left = document.elementFromPoint(evt.clientX - centerOffset, evt.clientY) as Element;
    const top = document.elementFromPoint(evt.clientX, evt.clientY - centerOffset) as Element;
    const bottom = document.elementFromPoint(evt.clientX, evt.clientY + centerOffset) as Element;
    return [center, bottomRight, topRight, topLeft, bottomLeft, right, left, top, bottom];
  }

  detectCollisions(evt: MouseEvent, isErase: boolean): void {
    const currentHoverElements: SVGGraphicsElement[] = [];
    this.getEraserBorders(evt).forEach((elem) => {  // get every elements detected by erasers corners
      const currentTarget = this.getTarget(elem as SVGGraphicsElement);
      if (currentTarget != null) {
        this.onHover = true;
        currentHoverElements.push(currentTarget);
      } else {
        this.onHover = false;
      }
    });

    const dummySvg = this.renderer.createElement('rect', 'svg');
    let topTarget = dummySvg;
    this.allDrawingBoardElements().forEach((elem) => {
      if (currentHoverElements.includes(elem)) {  // get first element that is contained as top element
        return topTarget = elem;
      }
      return;
    });
    if (isErase) {
      if (!this.eraseList.includes(topTarget) && topTarget !== dummySvg) {
        this.eraseList.push(topTarget);
      }
    } else {
      if (!this.hoverElementsList.includes(topTarget) && topTarget !== dummySvg) {
        if (this.hoverElementsList.length) {
          this.removeHighlight();
          this.hoverElementsList = [];
        }
        this.hoverElementsList.push(topTarget);
      }
    }
  }

  highlightSelection(selectedElements: SVGGraphicsElement[]): void {
    selectedElements.forEach((element) => {
      const groupElements = this.getTarget(element);   // pour plusieurs elements (rectangle, ellipse)
      let lineGroup = false;
      if (groupElements == null) {
        return;
      }
      if (groupElements.childElementCount > 1 || groupElements.getAttribute('class') === 'line') {       // si elements de groupe
        if (groupElements.getAttribute('class') === 'line') {
          lineGroup = true;
          groupElements.childNodes.forEach((childLine: SVGGraphicsElement) => {
            let childColor: string;
            if (childLine.tagName === 'line') { // lignes sans jointures
              childColor = childLine.getAttribute('stroke') as string;
              this.setRedHighlight(childColor, childLine, !lineGroup);
            } else {  // lignes avec jointures (cercles)
              childColor = childLine.getAttribute('fill') as string;
              this.setRedHighlight(childColor, childLine, lineGroup);
            }
          });
        } else {
          element = groupElements.firstChild as SVGGraphicsElement; // get outer element pour rect, ellipse, polygon
        }
      }
      if (!lineGroup) {  // !lineGroup sert a empecher qu'on push des couleurs des elements vides
        if (element.getAttribute('stroke-width') === '0') {
          element.setAttribute('stroke-width', '5');
        }
        const currentColor = element.getAttribute('stroke') as string;
        this.setRedHighlight(currentColor, element, lineGroup);
      }
    });
  }

  addRedAttribute(color: string, element: SVGElement | SVGGraphicsElement): void { // adding red attribute when first detection of element
    if (!element.getAttribute('isRed')) {
      this.elementColor.push(color);
      if (this.inRedRange(color)) {
        element.setAttribute('isRed', 'true');
      } else {
        element.setAttribute('isRed', 'false');
      }
    }
  }

  setRedHighlight(color: string, element: SVGElement | SVGGraphicsElement, isLineGroup: boolean): void {
    this.addRedAttribute(color, element);
    if (element.getAttribute('isRed') === 'true') {
      element.setAttribute('stroke', 'darkred');
      if (isLineGroup) {
        element.setAttribute('fill', 'darkred');
      }
    } else {
      element.setAttribute('stroke', 'red');
      if (isLineGroup) {
        element.setAttribute('fill', 'red');
      }
    }
  }

  inRedRange(stringColor: string): boolean {
    const skipChar = 5;
    const rgbaValues = (stringColor.substr(skipChar)).split(',');
    const r = +rgbaValues[0]; // transformer string en number avec + unary operator
    const g = +rgbaValues[1];
    const b = +rgbaValues[2];
    const rLow = 175;
    const rHigh = 255;
    const gbMax = 80;
    if (r >= rLow && r <= rHigh && g <= gbMax && b <= gbMax) {
      return true;
    }
    return false;
  }

  removeHighlight(): void {
    let lineGroup = false;
    for (let i = 0; i < this.hoverElementsList.length; i++) {
      let currentSVG = this.hoverElementsList[i];
      const groupElements = this.getTarget(currentSVG);
      if (groupElements == null) { // si element ayant plusieurs bordure
        return;
      }
      if (groupElements.childElementCount > 1 || groupElements.getAttribute('class') === 'line') {       // si element de groupe
        if (groupElements.getAttribute('class') !== 'line') {
          currentSVG = groupElements.firstChild as SVGGraphicsElement;
        } else {
          lineGroup = true;
          groupElements.childNodes.forEach((childLine: SVGGraphicsElement) => {
            childLine.setAttribute('fill', this.elementColor[i]);
            childLine.setAttribute('stroke', this.elementColor[i]);
            childLine.removeAttribute('isRed');
          });
        }
      }
      if (!lineGroup) {
        if (currentSVG.tagName !== 'path' && currentSVG.getAttribute('fill') !== 'none') {
          currentSVG.setAttribute('stroke-width', '0');
        }
        currentSVG.setAttribute('stroke', this.elementColor[i]);
        currentSVG.setAttribute('border', this.elementColor[i]);
        currentSVG.removeAttribute('isRed');
      }
    }
    this.hoverElementsList = [];
    this.elementColor = [];
  }

  allDrawingBoardElements(): SVGGraphicsElement[] {
    const mylist: SVGGraphicsElement[] = [];
    this.drawingBoard.childNodes.forEach((elem: SVGGraphicsElement) => {
      if (elem.tagName !== 'filter' && elem !== this.square && elem.getAttribute('id') !== 'drawingBoard') {
        // get all svg elements except hover square
        mylist.push(elem as SVGGraphicsElement);
      }
    });
    return mylist;
  }

  erase(): void {
    this.eraseList.forEach((svg) => {
      this.renderer.removeChild(this.drawingBoard, svg);
    });
    this.eraseList = [];
  }

  setAttributes(size : number): void {
    this.size = size;
  }

  mouseDown(evt: MouseEvent): void {
    if (this.newClick) {
      this.removeHighlight();
      if (this.drawingBoard.contains(this.square)) {
        this.drawingBoard.removeChild(this.square);
      }
      this.boardToUndo();
    }
    this.newClick = false;
    this.mousedown = true;
    this.detectCollisions(evt, true);
    this.highlightSelection(this.eraseList);
  }

  mouseUp(): void {
    if (!this.newClick) {
      if (this.eraseList.length === 0) {
        this.manager.undoBoards.pop();
        this.manager.undoHistory.pop();
        this.hoverElementsList = this.eraseList;
      }
      this.removeHighlight();
      this.erase();
    }
    this.newClick = true;
    this.mousedown = false;
  }

  mouseMove(evt: MouseEvent, size :number): void {
    this.setAttributes(size);
    this.hoverSquare(evt);
    if (this.mousedown) { // erase mode
      this.detectCollisions(evt, true);
      this.highlightSelection(this.eraseList);
    } else {
      if (!this.onHover) {
        this.removeHighlight();
      }
      this.detectCollisions(evt, false);
      this.highlightSelection(this.hoverElementsList);
    }
  }

  mouseLeave(): void {
    this.renderer.removeChild(this.drawingBoard, this.square);
    this.removeHighlight();
  }

  keydown(evt: KeyboardEvent): void {
    if (evt.ctrlKey && evt.code === 'KeyZ') {
      if (this.hoverElementsList.length > 0) {
        this.removeHighlight();
      }
    }
  }

  clearTool(): void {
    if (!this.newClick) {
      this.manager.undoBoards.pop();
      this.manager.undoHistory.pop();
    }
    this.newClick = true;
    this.mouseLeave();
    this.erase();
  }

  resetTracingId(): void {}
}
