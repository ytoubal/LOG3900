import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Renderer2, RendererFactory2 } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';
import { CommandManager } from '../../components/app/command-manager';
import { CanvasService } from './canvas.service';
import { ExportService } from './export.service';
import { GridService } from './grid.service';
import { PaletteService } from './palette.service';

const base = 'http://localhost:3000/mail';

describe('Service: Export', () => {
  let canvasService: CanvasService;
  let renderer: Renderer2;
  let manager: CommandManager;
  let paletteService: PaletteService;
  let gridService: GridService;
  let exportService: ExportService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ExportService]
    });
    httpMock = TestBed.get(HttpTestingController);
  });

  beforeEach(inject([RendererFactory2, HttpClient], (rendererFactory: RendererFactory2, http: HttpClient) => {
    manager = new CommandManager();
    renderer = rendererFactory.createRenderer(null, null);
    canvasService = new CanvasService(manager);
    canvasService.htmlElement = document.createElement('svg');
    renderer.setAttribute(canvasService.htmlElement, 'style', 'color: blue;');
    const child1 = document.createElement('div');
    const child2 = document.createElement('div');
    const child3 = document.createElement('div');
    renderer.setAttribute(child1, 'id', 'eraserTip');
    renderer.setAttribute(child2, 'class', 'border');
    canvasService.htmlElement.appendChild(child1).appendChild(child2).appendChild(child3);
    paletteService = new PaletteService();
    gridService = new GridService(rendererFactory, canvasService);
    exportService = new ExportService(canvasService, gridService, paletteService, rendererFactory, http);
    exportService.drawingboard = canvasService.htmlElement;
  }));

  it('should create', () => {
    expect(exportService).toBeTruthy();
  });

  it('SVGToCanvas should remove nothing if there is no border selection or eraser tip', () => {
    spyOn(exportService, 'imageLoaded');
    exportService.canvasService.htmlElement = renderer.createElement('svg', 'svg');
    const child3 = document.createElement('div');
    exportService.canvasService.htmlElement.appendChild(child3);
    exportService.SVGToCanvas(false);
    expect(exportService.imageLoaded).toHaveBeenCalled();
  });

  it('SVGToCanvas calls imageLoaded and isFilter is true', () => {
    spyOn(exportService, 'imageLoaded');
    exportService.drawingboard = renderer.createElement('svg', 'svg');
    exportService.svgWithFilter = document.createElement('html');
    Object.defineProperty(exportService.drawingboard, 'clientWidth', { value: 100 });
    Object.defineProperty(exportService.drawingboard, 'clientHeight', { value: 100 });
    Object.defineProperty(exportService.drawingboard, 'style', { value: 'stylish' });
    exportService.SVGToCanvas(true);
    expect(exportService.imageLoaded).toHaveBeenCalled();
  });

  it('#SVGToCanvas calls imageLoaded and isFilter is false', () => {
    spyOn(exportService, 'imageLoaded');
    exportService.drawingboard = renderer.createElement('svg', 'svg');
    Object.defineProperty(exportService.drawingboard, 'clientWidth', { value: 100 });
    Object.defineProperty(exportService.drawingboard, 'clientHeight', { value: 100 });
    Object.defineProperty(exportService.drawingboard, 'style', { value: 'stylish' });
    exportService.SVGToCanvas(false);
    expect(exportService.imageLoaded).toHaveBeenCalled();
  });

  it('#imageLoaded calls drawImage and return true', () => {
    const canvas = document.createElement('canvas');
    exportService.drawingboard = renderer.createElement('svg', 'svg');
    Object.defineProperty(exportService.drawingboard, 'clientWidth', { value: 100 });
    Object.defineProperty(exportService.drawingboard, 'clientHeight', { value: 100 });
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    exportService.image = document.createElement('img');
    exportService.image.src = '../../../assets/img/tools/applicator.png';
    const result = exportService.imageLoaded(ctx, exportService.image);
    expect(result).toBe(true);
  });

  it('#sendEmail should send the drawing with the email address mock@mock.com', () => {
    const myImage = { address: 'mock@mock.com', file: 'mockFile', type: 'mockType', name: 'mockName' };
    exportService.sendEmail(myImage).subscribe((res: string) => {
      expect(res).toEqual(JSON.stringify(myImage));
    });
    const req = httpMock.expectOne(`${base}/sendmail`); // HTTP request URL
    expect(req.request.method).toEqual('POST'); // HTTP request type
    expect(req.request.body.address).toEqual('mock@mock.com'); // Other parameters
    expect(req.request.responseType).toEqual('text');
    expect(req.cancelled).toBeFalsy();
    req.flush(myImage); // Flush the mockdata and causes the observable to resolve (evaluate inside the subscribe)
  });

  it('#applyFilter calls setAttribute', () => {
    spyOn(exportService.renderer, 'setAttribute');
    exportService.drawingboard = document.createElement('svg');
    exportService.applyFilter('effect');
    expect(exportService.renderer.setAttribute).toHaveBeenCalled();
  });

  it('#insertBackground calls insertBefore()', () => {
    spyOn(exportService.renderer, 'insertBefore');
    exportService.canvasService.htmlElement.setAttribute('style', 'mock:mock');
    exportService.drawingboard = document.createElement('svg');
    Object.defineProperty(exportService.drawingboard, 'clientWidth', { value: 10 });
    Object.defineProperty(exportService.drawingboard, 'clientHeight', { value: 10 });
    exportService.canvasService.gridActive = true;
    const svg = document.createElement('svg');
    exportService.insertBackground(svg);
    expect(exportService.renderer.insertBefore).toHaveBeenCalled();
  });

  it('insertBackground doesn\'t do anything if style is undefined', () => {
    spyOn(exportService.renderer, 'insertBefore');
    exportService.canvasService.htmlElement = document.createElement('svg');
    const svg = document.createElement('svg');
    exportService.insertBackground(svg);
    expect(exportService.renderer.insertBefore).not.toHaveBeenCalled();
  });

  it('removeGrid calls setGrid()', () => {
    spyOn(exportService.gridService, 'setGrid');
    exportService.canvasService.gridActive = true;
    exportService.removeGrid();
    expect(exportService.gridService.setGrid).toHaveBeenCalled();
  });

  it('#removeGrid calls setGrid()', () => {
    spyOn(exportService.gridService, 'setGrid');
    exportService.canvasService.gridActive = false;
    exportService.removeGrid();
    expect(exportService.gridService.setGrid).not.toHaveBeenCalled();
  });
});
