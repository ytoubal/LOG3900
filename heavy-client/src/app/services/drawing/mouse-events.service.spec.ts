import { RendererFactory2 } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';
import { CommandManager } from 'src/app/components/app/command-manager';
import { AttributsService } from './attributs.service';
import { CanvasService } from './canvas.service';
import { DrawPencilService } from './draw-pencil.service';
import { MouseEventsService } from './mouse-events.service';
import { PaletteService } from './palette.service';

describe('Service: MouseEvents', () => {
  let service: MouseEventsService;
  let attributsService: AttributsService;
  let paletteService: PaletteService;
  let manager: CommandManager;
  let canvasService: CanvasService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MouseEventsService]
    });
  });
  beforeEach(inject([RendererFactory2], (rendererFactory: RendererFactory2) => {
    attributsService = new AttributsService();
    paletteService = new PaletteService();
    manager = new CommandManager();
    canvasService = new CanvasService(manager);
    service = new MouseEventsService(rendererFactory, attributsService, paletteService, canvasService);
  }));

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('#callToolService should return false if a tool name is not found in the map', () => {
    const mockClick = new MouseEvent('click');
    service.myTool.name = 'Hammer';
    expect(service.callToolService(mockClick)).toBe(false);
  });

  it('#callToolService should return true if a tool name is found in the map', () => {
    const mockClick = new MouseEvent('click');
    service.myTool.name = 'Pencil';
    expect(service.callToolService(mockClick)).toBe(true);
  });

  it('#callToolService should call the tool service methods', () => {
    const mockClick = new MouseEvent('click');
    spyOn(DrawPencilService.prototype, 'initElements');
    spyOn(DrawPencilService.prototype, 'callTool');
    service.myTool.name = 'Pencil';
    service.callToolService(mockClick);
    expect(DrawPencilService.prototype.initElements).toHaveBeenCalled();
    expect(DrawPencilService.prototype.callTool).toHaveBeenCalled();
  });

  it('#callToolService should search for the shape name in the toolMap', () => {
    const mockClick = new MouseEvent('click');
    service.myTool.name = 'Shape';
    service.myTool.attributs.shape = 'Rectangle';
    service.previousTool = 'Rectangle';
    spyOn(service.toolMap, 'get');
    service.callToolService(mockClick);
    expect(service.toolMap.get).toHaveBeenCalledTimes(2);
  });

  it('#callToolService should call clearTool of the previous tool', () => {
    const mockClick = new MouseEvent('click');
    service.myTool.attributs.shape = 'Rectangle';
    service.previousTool = 'Ellipse';
    service.myTool.name = 'Shape';
    spyOn(service.toolMap, 'get');
    service.callToolService(mockClick);
    // tslint:disable-next-line: no-magic-numbers
    expect(service.toolMap.get).toHaveBeenCalledTimes(3);
  });

  it('#callToolService should clear Tool if export drawing or refresh is called', () => {
    const mockKeyPress = new KeyboardEvent('keydown', {
      ctrlKey: true,
      code: 'KeyE'
    });
    service.previousTool = 'Pencil';
    spyOn(DrawPencilService.prototype, 'clearTool');
    service.callToolService(mockKeyPress);
    // tslint:disable-next-line: no-magic-numbers
    expect(DrawPencilService.prototype.clearTool).toHaveBeenCalled();
  });

  it('#callToolService should not clear Tool if export drawing or refresh is called and previousToll is undefined', () => {
    const mockKeyPress = new KeyboardEvent('keydown', {
      ctrlKey: true,
      code: 'KeyR'
    });
    service.previousTool = 'Pencil';
    spyOn(service.toolMap, 'get');
    service.callToolService(mockKeyPress);
    // tslint:disable-next-line: no-magic-numbers
    expect(service.toolMap.get).toHaveBeenCalledTimes(3);
  });
});
