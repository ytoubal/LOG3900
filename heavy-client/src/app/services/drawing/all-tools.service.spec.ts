import { Renderer2, RendererFactory2 } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';
import { CommandManager } from 'src/app/components/app/command-manager';
import { AllToolsService } from './all-tools.service';
import { AttributsService } from './attributs.service';
import { CanvasService } from './canvas.service';
import { DrawRectangleService } from './draw-rectangle.service';
import { PaletteService } from './palette.service';

describe('Service: AllTools', () => {
  let htmlElement: HTMLElement;
  let renderer: Renderer2;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AllToolsService, Renderer2],
    });
  });

  beforeEach(inject([RendererFactory2], (rendererFactory: RendererFactory2) => {
    renderer = rendererFactory.createRenderer(null, null);
    htmlElement = document.createElement('svg');
  }));

  it('should create', inject([AllToolsService], (service: AllToolsService) => {
    expect(service).toBeTruthy();
  }));

  it('#initDrawingBoard should modify the drawingboard value correctly', inject([AllToolsService], (service: AllToolsService) => {
    service.canvasService.htmlElement = htmlElement;
    service.initDrawingBoard();
    expect(service.drawingBoard).toEqual(service.canvasService.htmlElement);
  }));

  it('#clearTool should sets temporary to null', inject([AllToolsService], (service: AllToolsService) => {
    const node = document.createElement('div');
    service.temporary = node;
    service.clearTool();
    expect(service.temporary).not.toEqual(node);
  }));

  it('#gridToTop should call removeChild and appendChild', inject([AllToolsService], (service: AllToolsService) => {
    const mockAttribut = new AttributsService();
    const mockPalette = new PaletteService();
    const mockManager = new CommandManager();
    const mockCanvas = new CanvasService(mockManager);
    const mockTool = new DrawRectangleService(renderer, mockAttribut, mockPalette, mockCanvas);
    mockTool.drawingBoard = mockTool.renderer.createElement('canvas', 'svg');
    mockTool.canvasService.grid = mockTool.renderer.createElement('grid', 'rect');
    spyOn(mockTool.renderer, 'removeChild');
    spyOn(mockTool.renderer, 'appendChild');
    mockTool.canvasService.gridActive = true;
    mockTool.gridToTop();
    expect(mockTool.renderer.appendChild).toHaveBeenCalled();
    expect(mockTool.renderer.removeChild).toHaveBeenCalled();
  }));

  // tslint:disable-next-line: max-line-length
  it('#cancel should call boardCopy, removeChild, appendChild, addGridUndoRedo and gridToTop', inject([AllToolsService], (service: AllToolsService) => {
    const mockAttribut = new AttributsService();
    const mockPalette = new PaletteService();
    const mockManager = new CommandManager();
    const mockCanvas = new CanvasService(mockManager);
    const mockTool = new DrawRectangleService(renderer, mockAttribut, mockPalette, mockCanvas);
    spyOn(mockTool, 'boardCopy');
    spyOn(mockTool.renderer, 'removeChild');
    spyOn(mockTool.renderer, 'appendChild');
    spyOn(mockTool, 'addGridUndoRedo');
    spyOn(mockTool, 'gridToTop');
    const mockArray: Node[] = [];
    const mockNode = renderer.createElement('svg');
    mockArray.push(mockNode);
    const mockBoard: HTMLElement = renderer.createElement('svg');
    mockBoard.appendChild(mockNode);
    mockTool.drawingBoard = mockBoard;
    mockTool.cancel(mockArray);
    expect(mockTool.boardCopy).toHaveBeenCalled();
    expect(mockTool.renderer.removeChild).toHaveBeenCalled();
    expect(mockTool.renderer.appendChild).toHaveBeenCalled();
    expect(mockTool.addGridUndoRedo).toHaveBeenCalled();
    expect(mockTool.gridToTop).toHaveBeenCalled();
  }));

  // tslint:disable-next-line: max-line-length
  it('#execute should call boardCopy, removeChild, appendChild, addGridUndoRedo and gridToTop', inject([AllToolsService], (service: AllToolsService) => {
    const mockAttribut = new AttributsService();
    const mockPalette = new PaletteService();
    const mockManager = new CommandManager();
    const mockCanvas = new CanvasService(mockManager);
    const mockTool = new DrawRectangleService(renderer, mockAttribut, mockPalette, mockCanvas);
    spyOn(mockTool, 'boardCopy');
    spyOn(mockTool.renderer, 'removeChild');
    spyOn(mockTool.renderer, 'appendChild');
    spyOn(mockTool, 'addGridUndoRedo');
    spyOn(mockTool, 'gridToTop');
    const mockArray: Node[] = [];
    const mockNode = renderer.createElement('svg');
    mockArray.push(mockNode);
    const mockBoard: HTMLElement = renderer.createElement('svg');
    mockBoard.appendChild(mockNode);
    mockTool.drawingBoard = mockBoard;
    mockTool.execute(mockArray);
    expect(mockTool.boardCopy).toHaveBeenCalled();
    expect(mockTool.renderer.removeChild).toHaveBeenCalled();
    expect(mockTool.renderer.appendChild).toHaveBeenCalled();
    expect(mockTool.addGridUndoRedo).toHaveBeenCalled();
    expect(mockTool.gridToTop).toHaveBeenCalled();
  }));

  it('#addGridUndoRedo should call appendChild with grid as a parameter', inject([AllToolsService], (service: AllToolsService) => {
    const mockAttribut = new AttributsService();
    const mockPalette = new PaletteService();
    const mockManager = new CommandManager();
    const mockCanvas = new CanvasService(mockManager);
    mockCanvas.grid = renderer.createElement('svg');
    mockCanvas.gridActive = true;
    const mockTool = new DrawRectangleService(renderer, mockAttribut, mockPalette, mockCanvas);
    mockTool.drawingBoard = renderer.createElement('svg');
    spyOn(mockTool.drawingBoard, 'appendChild').withArgs(mockTool.canvasService.grid);
    mockTool.addGridUndoRedo();
    expect(mockTool.drawingBoard.appendChild).toHaveBeenCalledWith(mockTool.canvasService.grid);
  }));

  it('#removeGridUndoRedo should call removeChild with grid as a parameter', inject([AllToolsService], (service: AllToolsService) => {
    const mockAttribut = new AttributsService();
    const mockPalette = new PaletteService();
    const mockManager = new CommandManager();
    const mockCanvas = new CanvasService(mockManager);
    mockCanvas.grid = renderer.createElement('svg');
    mockCanvas.gridActive = true;
    const mockTool = new DrawRectangleService(renderer, mockAttribut, mockPalette, mockCanvas);
    mockTool.drawingBoard = renderer.createElement('svg');
    spyOn(mockTool.drawingBoard, 'removeChild').withArgs(mockTool.canvasService.grid);
    mockTool.removeGridUndoRedo();
    expect(mockTool.drawingBoard.removeChild).toHaveBeenCalledWith(mockTool.canvasService.grid);
  }));

  // tslint:disable-next-line: max-line-length
  it('#boardCopy should push a child on drawingCopy if the child has id !== eraserTip and class !== border', inject([AllToolsService], (service: AllToolsService) => {
    const mockAttribut = new AttributsService();
    const mockPalette = new PaletteService();
    const mockManager = new CommandManager();
    const mockCanvas = new CanvasService(mockManager);
    mockCanvas.grid = renderer.createElement('svg');
    mockCanvas.gridActive = true;
    const mockTool = new DrawRectangleService(renderer, mockAttribut, mockPalette, mockCanvas);
    mockTool.drawingBoard = renderer.createElement('svg');
    renderer.appendChild(mockTool.drawingBoard, mockTool.canvasService.grid);
    const mockNode = renderer.createElement('svg');
    renderer.setAttribute(mockNode, 'id', 'a');
    renderer.setAttribute(mockNode, 'class', '2');
    renderer.appendChild(mockTool.drawingBoard, mockNode);
    const result = mockTool.boardCopy();
    expect(result.length).toBe(1);
  }));

  // tslint:disable-next-line: max-line-length
  it('#boardCopy should not push a child on drawingCopy if the child has id !== eraserTip and class === border', inject([AllToolsService], (service: AllToolsService) => {
    const mockAttribut = new AttributsService();
    const mockPalette = new PaletteService();
    const mockManager = new CommandManager();
    const mockCanvas = new CanvasService(mockManager);
    mockCanvas.grid = renderer.createElement('svg');
    mockCanvas.gridActive = true;
    const mockTool = new DrawRectangleService(renderer, mockAttribut, mockPalette, mockCanvas);
    mockTool.drawingBoard = renderer.createElement('svg');
    renderer.appendChild(mockTool.drawingBoard, mockTool.canvasService.grid);
    const mockNode = renderer.createElement('svg');
    renderer.setAttribute(mockNode, 'id', 'a');
    renderer.setAttribute(mockNode, 'class', 'border');
    renderer.appendChild(mockTool.drawingBoard, mockNode);
    const result = mockTool.boardCopy();
    expect(result.length).toBe(0);
  }));

  // tslint:disable-next-line: max-line-length
  it('#boardCopy should not push a child on drawingCopy if the child has id === eraserTip and class === border', inject([AllToolsService], (service: AllToolsService) => {
    const mockAttribut = new AttributsService();
    const mockPalette = new PaletteService();
    const mockManager = new CommandManager();
    const mockCanvas = new CanvasService(mockManager);
    mockCanvas.grid = renderer.createElement('svg');
    mockCanvas.gridActive = true;
    const mockTool = new DrawRectangleService(renderer, mockAttribut, mockPalette, mockCanvas);
    mockTool.drawingBoard = renderer.createElement('svg');
    renderer.appendChild(mockTool.drawingBoard, mockTool.canvasService.grid);
    const mockNode = renderer.createElement('svg');
    renderer.setAttribute(mockNode, 'id', 'eraserTip');
    renderer.setAttribute(mockNode, 'class', 'border');
    renderer.appendChild(mockTool.drawingBoard, mockNode);
    const result = mockTool.boardCopy();
    expect(result.length).toBe(0);
  }));

  it('#addGrid should not call appendChild if gridActive it true', inject([AllToolsService], (service: AllToolsService) => {
    const mockAttribut = new AttributsService();
    const mockPalette = new PaletteService();
    const mockManager = new CommandManager();
    const mockCanvas = new CanvasService(mockManager);
    mockCanvas.grid = renderer.createElement('svg');
    mockCanvas.gridActive = true;
    const mockTool = new DrawRectangleService(renderer, mockAttribut, mockPalette, mockCanvas);
    mockTool.drawingBoard = renderer.createElement('svg');
    spyOn(mockTool.renderer, 'appendChild').withArgs(mockTool.drawingBoard, mockTool.canvasService.grid);
    mockTool.addGrid();
    expect(mockTool.renderer.appendChild).not.toHaveBeenCalledWith(mockTool.drawingBoard, mockTool.canvasService.grid);
  }));

  it('#removeGrid should not call removeChild if gridActive it false', inject([AllToolsService], (service: AllToolsService) => {
    const mockAttribut = new AttributsService();
    const mockPalette = new PaletteService();
    const mockManager = new CommandManager();
    const mockCanvas = new CanvasService(mockManager);
    mockCanvas.grid = renderer.createElement('svg');
    mockCanvas.gridActive = false;
    const mockTool = new DrawRectangleService(renderer, mockAttribut, mockPalette, mockCanvas);
    mockTool.drawingBoard = renderer.createElement('svg');
    spyOn(mockTool.renderer, 'removeChild').withArgs(mockTool.drawingBoard, mockTool.canvasService.grid);
    mockTool.removeGrid();
    expect(mockTool.renderer.removeChild).not.toHaveBeenCalledWith(mockTool.drawingBoard, mockTool.canvasService.grid);
  }));
});
