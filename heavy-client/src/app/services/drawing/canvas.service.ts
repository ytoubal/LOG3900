import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Information } from 'src/app/components/drawing/canvas/info';
import { Colour } from 'src/app/components/drawing/colour/colour';
import { CommandManager } from 'src/app/drawing-helper/command-manager';

@Injectable({
  providedIn: 'root'
})
export class CanvasService {
  htmlElement: HTMLElement;
  scrollableWindow: HTMLElement;
  commandManager: CommandManager;
  grid: HTMLElement;
  gridActive: boolean;
  isDrawingWordImage: boolean;
  clearSVG: Subject<void> = new Subject<void>();

  constructor(manager: CommandManager, private http: HttpClient) {
    this.commandManager = manager;
    this.gridActive = false;
  }

  newInfo: BehaviorSubject<Information> = new BehaviorSubject(new Information());
  replaceSVG: boolean;

  updateConfirmed: boolean;
  canvasHasChanges: boolean;

  backgroundCanvas: Colour = { r: 'FF', g: 'FF', b: 'FF', a: '1' };

  updateInfo(newInfo: Information | null, replaceSVG: boolean): void {
    if (newInfo) {
      this.replaceSVG = replaceSVG;
      this.newInfo.next(newInfo);
    }
  }

  getHtmlElement(): HTMLElement {
    return this.htmlElement;
  }

  getScrollableWindow(): HTMLElement {
    return this.scrollableWindow;
  }

  emitClearSVG(): void {
    this.clearSVG.next();
  }

  clearSVGListener(): Observable<void> {
    return this.clearSVG.asObservable();
  }
  
  clearUndoRedoHistory() : void {
    this.commandManager.undoHistory = [];
    this.commandManager.redoHistory = [];
  }
}