import { Injectable, Renderer2 } from '@angular/core';
import { ITool } from 'src/app/components/drawing/tool-interface/tool';
import { ICommand } from 'src/app/drawing-helper/command';
import { CommandManager } from 'src/app/drawing-helper/command-manager';
import { IPoint } from 'src/app/drawing-helper/point';
import { AttributsService } from './attributs.service';
import { CanvasService } from './canvas.service';
@Injectable({
  providedIn: 'root',
})
export abstract class AllToolsService implements ICommand {
  manager: CommandManager;
  drawingBoard: HTMLElement;
  scrollableWindow: HTMLElement;
  temporary: Node | null;
  myTool: ITool;
  constructor(public canvasService: CanvasService, public attributsService: AttributsService, public renderer: Renderer2) {
    attributsService.myTool.subscribe((myTool) => this.myTool = myTool);
    this.temporary = null;
  }

  gridToTop(): void {
    if (this.canvasService.gridActive) {
      this.removeGrid();
      this.addGrid();
    }
  }

  removeGrid(): void {
    if (this.canvasService.gridActive) {
      this.renderer.removeChild(this.drawingBoard, this.canvasService.grid);
      this.canvasService.gridActive = false;
    }
  }

  addGrid(): void {
    if (!this.canvasService.gridActive) {
      this.renderer.appendChild(this.drawingBoard, this.canvasService.grid);
      this.canvasService.gridActive = true;
    }
  }

  removeGridUndoRedo(): void {
    if (this.canvasService.gridActive) {
      this.drawingBoard.removeChild(this.canvasService.grid);
    }
  }

  addGridUndoRedo(): void {
    if (this.canvasService.gridActive) {
      this.drawingBoard.appendChild(this.canvasService.grid);
    }
  }

  boardToUndo(): void {
    const boardCopy = this.boardCopy();
    this.manager.undoBoards.push(boardCopy);
    const serviceCopy: AllToolsService = this;
    this.manager.undoHistory.push(serviceCopy);
    this.manager.redoHistory = [];
    this.manager.redoBoards = [];
  }

  initDrawingBoard(): void {
    this.drawingBoard = this.canvasService.getHtmlElement();
  }

  initScrollableWindow(): void {
    this.scrollableWindow = this.canvasService.getScrollableWindow();
  }

  initElements(): void {
    this.initDrawingBoard();
    this.initScrollableWindow();
  }

  // Returns the position in the scrollable svg
  getPosition(position: IPoint): IPoint | null {
    const container = this.scrollableWindow;
    if (container) {
      const clientRect = container.getBoundingClientRect();
      return {
        x: position.x + container.scrollLeft - clientRect.left,
        y: position.y + container.scrollTop - clientRect.top
      } as IPoint;
    }
    return null;
  }

  clearTool(): void {
    this.temporary = null;
  }
  boardCopy(): Node[] {
    this.removeGridUndoRedo();
    const drawingCopy: Node[] = [];
    this.drawingBoard.childNodes.forEach((child: SVGGraphicsElement) => {
      if (child.getAttribute('id') !== 'eraserTip') {
        if (child.getAttribute('class') !== 'border') {
          drawingCopy.push(child.cloneNode(true));
        }
      }
    });
    this.addGridUndoRedo();
    return drawingCopy;
  }

  execute(board: Node[]): void {
    const boardCopy = this.boardCopy();
    this.manager.undoBoards.push(boardCopy);
    const serviceCopy: AllToolsService = this;
    Object.assign(serviceCopy, this);
    this.manager.undoHistory.push(serviceCopy);
    this.drawingBoard.childNodes.forEach((child) => {
      this.renderer.removeChild(this.drawingBoard, child);
    });
    this.addGridUndoRedo();
    board.forEach((child) => {
      this.renderer.appendChild(this.drawingBoard, child);
    });
    this.gridToTop();
  }

  cancel(board: Node[]): void {
    const boardCopy = this.boardCopy();
    this.manager.redoBoards.push(boardCopy);
    const serviceCopy: AllToolsService = this;
    Object.assign(serviceCopy, this);
    this.manager.redoHistory.push(serviceCopy);
    this.drawingBoard.childNodes.forEach((child) => {
      this.renderer.removeChild(this.drawingBoard, child);
    });
    this.addGridUndoRedo();
    board.forEach((child) => {
      this.renderer.appendChild(this.drawingBoard, child);
    });
    this.gridToTop();
  }
  abstract callTool(evt: MouseEvent | KeyboardEvent | WheelEvent, size?: number, color? : string, isEraser?: boolean, depth? : number): void;

  abstract resetTracingId(): void;
}
