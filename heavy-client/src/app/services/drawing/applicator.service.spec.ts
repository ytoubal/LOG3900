/* tslint:disable:no-unused-variable */
import { Renderer2, RendererFactory2 } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';
import { CommandManager } from 'src/app/components/app/command-manager';
import { ApplicatorService } from './applicator.service';
import { AttributsService } from './attributs.service';
import { CanvasService } from './canvas.service';
import { PaletteService } from './palette.service';

const DRAWING_BOARD_OBJECT_TEST = 10;

describe('Service: Applicator', () => {
  let renderer: Renderer2;
  let canvasService: CanvasService;
  let attributsService: AttributsService;
  const manager: CommandManager = new CommandManager();
  let paletteService: PaletteService;
  let applicatorService: ApplicatorService;

  let mockDrawingBoard: HTMLElement;
  const mockMove = new MouseEvent('mousemove');
  const mockDown = new MouseEvent('mousedown');
  const mockUp = new MouseEvent('mouseup');
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: ApplicatorService}]
    });
  });

  beforeEach(inject([RendererFactory2], (rendererFactory: RendererFactory2) => {
    renderer = rendererFactory.createRenderer(null, null);
    canvasService = new CanvasService(manager);
    attributsService = new AttributsService();
    paletteService = new PaletteService();
    applicatorService = new ApplicatorService(renderer, attributsService, paletteService, canvasService);
    mockDrawingBoard = document.createElement('svg');
    applicatorService.drawingBoard = mockDrawingBoard;
  }));

  it('should create', () => {
    expect(applicatorService).toBeTruthy();
  });

  it('#execute should call redoHistory and clone', () => {
    applicatorService.square = applicatorService.renderer.createElement('square', 'svg');
    applicatorService.renderer.appendChild(applicatorService.drawingBoard, applicatorService.square);
    const elem = document.createElement('svg') as unknown as SVGGraphicsElement;
    elem.id = '1';
    const nodeArray: Node[] = [];
    applicatorService.drawingBoard.appendChild(elem);
    applicatorService.selectedElements.push(elem);
    spyOn(applicatorService.manager.undoHistory, 'push');
    applicatorService.execute(nodeArray);
    expect(applicatorService.selectedElements[0]).toBe(elem);
    expect(applicatorService.manager.undoHistory.push).toHaveBeenCalled();
  });

  it('#execute should set selectedElements', () => {
    applicatorService.square = applicatorService.renderer.createElement('square', 'svg');
    applicatorService.renderer.appendChild(applicatorService.drawingBoard, applicatorService.square);
    for (let i = 0; i < DRAWING_BOARD_OBJECT_TEST; i++) {
      applicatorService.drawingBoard.appendChild(document.createElement('svg') as unknown as SVGGraphicsElement);
    }
    const element = document.createElement('svg') as unknown as SVGGraphicsElement;
    element.appendChild(document.createElement('svg') as unknown as SVGGraphicsElement);
    element.appendChild(document.createElement('svg') as unknown as SVGGraphicsElement);
    element.setAttribute('colour-type', 'stroke-fill');
    const element2 = document.createElement('svg') as unknown as SVGGraphicsElement;
    element2.appendChild(document.createElement('svg') as unknown as SVGGraphicsElement);
    element2.appendChild(document.createElement('svg') as unknown as SVGGraphicsElement);
    element2.setAttribute('colour-type', 'stroke-fill');
    element.id = '1';
    element2.id = '1';
    applicatorService.drawingBoard.appendChild(element);
    applicatorService.selectedElements.push(element2);
    const nodeArray: Node[] = [];
    applicatorService.execute(nodeArray);
    expect(applicatorService.selectedElements[0].id).toEqual(element.id);
  });

  it('callTool mouseDown', () => {
    spyOn(applicatorService, 'mouseDown').withArgs(mockDown);
    applicatorService.callTool(mockDown);
    expect(applicatorService.mouseDown).toHaveBeenCalled();
  });

  it('callTool mouseMove', () => {
    spyOn(applicatorService, 'mouseMove').withArgs(mockMove);
    applicatorService.callTool(mockMove);
    expect(applicatorService.mouseMove).toHaveBeenCalled();
  });

  it('callTool mouseUp', () => {
    spyOn(applicatorService, 'mouseUp').withArgs(mockUp);
    applicatorService.callTool(mockUp);
    expect(applicatorService.mouseUp).toHaveBeenCalled();
  });

  it('#getTarget should return the target', () => {
    const elem = document.createElement('svg') as unknown as SVGGraphicsElement;
    applicatorService.drawingBoard.appendChild(elem);
    const target = applicatorService.getTarget(elem);
    expect(target).toBe(elem);
  });

  it('#getTarget should return parent if parent is not the drawing board', () => {
    const elem = document.createElement('svg') as unknown as SVGGraphicsElement;
    const target = applicatorService.getTarget(elem);
    expect(target === null).toBeTruthy();
  });

  it('#hoverSquare should create and append a square', () => {
    applicatorService.scrollableWindow = document.createElement('html');
    spyOn(applicatorService.renderer, 'appendChild').withArgs(applicatorService.drawingBoard, applicatorService.square);
    applicatorService.hoverSquare(mockDown);
    expect(applicatorService.renderer.appendChild).toHaveBeenCalled();
  });

  it('#detectCollisions should create and append a square', () => {
    const target = applicatorService.renderer.createElement('svg');
    target.target = applicatorService.renderer.createElement('rect');
    applicatorService.drawingBoard.appendChild(target);
    applicatorService.hoverElementsList = [];
    applicatorService.detectCollisions(target);
    expect(applicatorService.hoverElementsList.length).toBe(1);
  });

  it('#detectCollisions should create and append a square', () => {
    applicatorService.detectCollisions(null);
    expect(applicatorService.hoverElementsList.length).toBe(0);
  });

  it('#applyColour selectedElements is empty', () => {
    const selectedElements: SVGGraphicsElement[] = [];
    applicatorService.applyColour(selectedElements, 'rgba(200,200,200,1)', 'rgba(205,205,205,1)', false);
    expect(selectedElements.length).toBe(0);
  });

  it('#applyColour selectedElements with element not in case', () => {
    const selectedElements: SVGGraphicsElement[] = [];
    const element = document.createElement('svg') as unknown as SVGGraphicsElement;
    element.setAttribute('colour-type', 's');
    selectedElements.push(element);
    applicatorService.applyColour(selectedElements, 'rgba(200,200,200,1)', 'rgba(205,205,205,1)', false);
    expect(selectedElements.length).toBe(1);
  });

  it('#applyColour applies colour to stroke-fill type with no children', () => {
    const element = document.createElement('svg') as unknown as SVGGraphicsElement;
    element.setAttribute('colour-type', 'stroke-fill');
    const selectedElements = [];
    selectedElements.push(element);
    applicatorService.applyColour(selectedElements, 'rgba(200,200,200,1)', 'rgba(205,205,205,1)', false);
    expect(element.firstElementChild === null).toBeTruthy();
    expect(element.lastElementChild === null).toBeTruthy();
  });

  it('#applyColour applies colour to stroke-fill type', () => {
    const element = document.createElement('svg') as unknown as SVGGraphicsElement;
    element.appendChild(document.createElement('svg') as unknown as SVGGraphicsElement);
    element.appendChild(document.createElement('svg') as unknown as SVGGraphicsElement);
    element.setAttribute('colour-type', 'stroke-fill');
    if (element.firstElementChild) {
      element.firstElementChild.setAttribute('stroke', 'rgba(100,100,100,1)');
    }
    if (element.lastElementChild) {
      element.lastElementChild.setAttribute('fill', 'rgba(100,100,100,1)');
    }
    const selectedElements = [];
    selectedElements.push(element);
    applicatorService.applyColour(selectedElements, 'rgba(200,200,200,1)', 'rgba(205,205,205,1)', false);
    if (element.firstElementChild) {
      expect(element.firstElementChild.getAttribute('stroke')).toBe('rgba(205,205,205,1)');
    }
    if (element.lastElementChild) {
      expect(element.lastElementChild.getAttribute('fill')).toBe('rgba(200,200,200,1)');
    }
  });

  it('#applyColour applies colour to fill type', () => {
    const element = document.createElement('svg') as unknown as SVGGraphicsElement;
    element.setAttribute('colour-type', 'fill');
    element.setAttribute('fill', 'rgba(100,100,100,1)');
    const selectedElements = [];
    selectedElements.push(element);
    applicatorService.applyColour(selectedElements, 'rgba(200,200,200,1)', '', false);
    expect(element.getAttribute('fill')).toBe('rgba(200,200,200,1)');
  });

  it('#applyColour applies colour to stroke type', () => {
    const element = document.createElement('svg') as unknown as SVGGraphicsElement;
    element.setAttribute('colour-type', 'stroke');
    element.setAttribute('fill', 'rgba(100,100,100,1)');
    const selectedElements = [];
    selectedElements.push(element);
    applicatorService.applyColour(selectedElements, 'rgba(200,200,200,1)', '', false);
    expect(element.getAttribute('stroke')).toBe('rgba(200,200,200,1)');
  });

  it('#applyColour applies colour to line', () => {
    const element = document.createElement('svg') as unknown as SVGGraphicsElement;
    element.appendChild(document.createElement('svg') as unknown as SVGGraphicsElement);
    element.appendChild(document.createElement('svg') as unknown as SVGGraphicsElement);
    element.setAttribute('colour-type', 'line');
    if (element.firstElementChild) {
      element.firstElementChild.setAttribute('fill', 'rgba(100,100,100,1)');
    }
    if (element.lastElementChild) {
      element.lastElementChild.setAttribute('stroke', 'rgba(100,100,100,1)');
    }
    const selectedElements = [];
    selectedElements.push(element);
    applicatorService.applyColour(selectedElements, 'rgba(200,200,200,1)', '', false);
    if (element.firstElementChild) {
      expect(element.firstElementChild.getAttribute('fill')).toBe('rgba(200,200,200,1)');
    }
    if (element.lastElementChild) {
      expect(element.lastElementChild.getAttribute('stroke')).toBe('rgba(200,200,200,1)');
    }
  });

  it('#savePrimaryColour should set primary', () => {
    const element = document.createElement('svg') as unknown as SVGElement;
    element.setAttribute('stroke', 'rgba(100,100,100,1)');
    applicatorService.colour.primary = 'rgba(0,0,0,1)';
    applicatorService.savePrimaryColour(element, true, 'stroke');
    expect(applicatorService.colour.primary).toBe('rgba(100,100,100,1)');
  });

  it('#savePrimaryColour should set oldPrimary', () => {
    const element = document.createElement('svg') as unknown as SVGElement;
    element.setAttribute('stroke', 'rgba(100,100,100,1)');
    applicatorService.colour.oldPrimary = 'rgba(0,0,0,1)';
    applicatorService.savePrimaryColour(element, false, 'stroke');
    expect(applicatorService.colour.oldPrimary).toBe('rgba(100,100,100,1)');
  });

  it('#saveSecondaryColour should set secondary', () => {
    const element = document.createElement('svg') as unknown as SVGElement;
    element.setAttribute('stroke', 'rgba(100,100,100,1)');
    applicatorService.colour.secondary = 'rgba(0,0,0,1)';
    applicatorService.saveSecondaryColour(element, true, 'stroke');
    expect(applicatorService.colour.secondary).toBe('rgba(100,100,100,1)');
  });

  it('#saveSecondaryColour should set oldSecondary', () => {
    const element = document.createElement('svg') as unknown as SVGElement;
    element.setAttribute('stroke', 'rgba(100,100,100,1)');
    applicatorService.colour.oldSecondary = 'rgba(0,0,0,1)';
    applicatorService.saveSecondaryColour(element, false, 'stroke');
    expect(applicatorService.colour.oldSecondary).toBe('rgba(100,100,100,1)');
  });

  it('#clone should call hoverSquare and detectCollisions', () => {
    applicatorService.colour.primary = 'rgba(100,100,100,1)';
    const test = applicatorService.clone();
    expect(test.colour.primary).toBe(applicatorService.colour.primary);
  });

  it('#mouseMove should call hoverSquare and detectCollisions', () => {
    applicatorService.square = applicatorService.renderer.createElement('square', 'svg');
    applicatorService.renderer.appendChild(applicatorService.drawingBoard, applicatorService.square);
    spyOn(applicatorService, 'hoverSquare').withArgs(mockMove);
    spyOn(applicatorService, 'detectCollisions').withArgs(mockMove.target);
    applicatorService.mouseMove(mockMove);
    expect(applicatorService.hoverSquare).toHaveBeenCalled();
    expect(applicatorService.detectCollisions).toHaveBeenCalled();
  });

  it('#mouseDown should update colour and not call boardCopy if newClick is false', () => {
    applicatorService.newClick = false;
    applicatorService.hoverElementsList.length = 1;
    applicatorService.paletteService.primaryColour.next(applicatorService.paletteService.stringToColour('AAAAAA1'));
    applicatorService.paletteService.secondaryColour.next(applicatorService.paletteService.stringToColour('BBBBBB1'));
    applicatorService.mouseDown(mockDown);
    expect(applicatorService.colour.primary).toBe('rgba(170,170,170,1)');
    expect(applicatorService.colour.secondary).toBe('rgba(187,187,187,1)');
  });

  it('#mouseDown should update colour and call boardCopy if newClick is true', () => {
    applicatorService.newClick = true;
    applicatorService.hoverElementsList.length = 1;
    applicatorService.paletteService.primaryColour.next(applicatorService.paletteService.stringToColour('AAAAAA1'));
    applicatorService.paletteService.secondaryColour.next(applicatorService.paletteService.stringToColour('BBBBBB1'));
    spyOn(applicatorService, 'boardCopy');
    applicatorService.mouseDown(mockDown);
    expect(applicatorService.boardCopy).toHaveBeenCalled();
    expect(applicatorService.colour.primary).toBe('rgba(170,170,170,1)');
    expect(applicatorService.colour.secondary).toBe('rgba(187,187,187,1)');
  });

  it('#mouseDown should not update colour if hoverElementsList has no length', () => {
    applicatorService.newClick = true;
    applicatorService.paletteService.primaryColour.next(applicatorService.paletteService.stringToColour('AAAAAA1'));
    applicatorService.paletteService.secondaryColour.next(applicatorService.paletteService.stringToColour('BBBBBB1'));
    spyOn(applicatorService, 'boardCopy');
    applicatorService.mouseDown(mockDown);
    expect(applicatorService.boardCopy).not.toHaveBeenCalled();
    expect(applicatorService.colour.primary).not.toBe('rgba(170,170,170,1)');
    expect(applicatorService.colour.secondary).not.toBe('rgba(187,187,187,1)');
  });

  it('#clearTool should set newClick to true, pop undoBoards and undoHistory if newClick is false', () => {
    applicatorService.manager.undoBoards = [];
    applicatorService.manager.undoHistory = [];
    applicatorService.newClick = false;
    const mockSVG = renderer.createElement('svg');
    applicatorService.manager.undoBoards.push(mockSVG);
    applicatorService.manager.undoHistory.push(applicatorService);
    applicatorService.clearTool();
    expect(applicatorService.manager.undoBoards.length).toBe(0);
    expect(applicatorService.manager.undoHistory.length).toBe(0);
    expect(applicatorService.newClick).toBe(true);
  });

  it('#clearTool should keep newClick to true, not pop undoBoards and undoHistory if newClick is true', () => {
    applicatorService.manager.undoBoards = [];
    applicatorService.manager.undoHistory = [];
    applicatorService.newClick = true;
    const mockSVG = renderer.createElement('svg');
    applicatorService.manager.undoBoards.push(mockSVG);
    applicatorService.manager.undoHistory.push(applicatorService);
    applicatorService.clearTool();
    expect(applicatorService.manager.undoBoards.length).toBe(1);
    expect(applicatorService.manager.undoHistory.length).toBe(1);
    expect(applicatorService.newClick).toBe(true);
  });

  it('#mouseUp should set newClick', () => {
    applicatorService.newClick = false;
    applicatorService.mouseUp(mockUp);
    expect(applicatorService.newClick).toBe(true);
  });
});
