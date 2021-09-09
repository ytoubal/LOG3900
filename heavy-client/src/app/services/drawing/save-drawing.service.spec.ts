import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Renderer2, RendererFactory2 } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';
import { CommandManager } from 'src/app/components/app/command-manager';
import { CanvasService } from './canvas.service';
import { SaveDrawingService } from './save-drawing.service';

const base = 'http://localhost:3000/api/gallery';

describe('Service: SaveDrawing', () => {
  let canvasService: CanvasService;
  let httpMock: HttpTestingController;
  let renderer: Renderer2;
  let manager: CommandManager;
  let saveDrawingService: SaveDrawingService;

  let dummyRect: SVGGraphicsElement;
  let dummyPath: SVGGraphicsElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    httpMock = TestBed.get(HttpTestingController);
  });

  beforeEach(inject([RendererFactory2, HttpClient], (rendererFactory: RendererFactory2, http: HttpClient) => {
    manager = new CommandManager();
    renderer = rendererFactory.createRenderer(null, null);
    canvasService = new CanvasService(manager);
    saveDrawingService = new SaveDrawingService(canvasService, http, rendererFactory);
    saveDrawingService.children = [];
    saveDrawingService.tag = [];
    saveDrawingService.name = '';
    saveDrawingService.style = '';

    dummyRect = renderer.createElement('rect', 'svg');
    dummyPath = renderer.createElement('path', 'svg');
  }));

  afterEach(() => {
    httpMock.verify(); // Verify no pending HTTP request left
  });

  it('should create', () => {
    expect(saveDrawingService).toBeTruthy();
  });

  it('#saveSvg should call getChildren()', () => {
    saveDrawingService.canvas.htmlElement = renderer.createElement('svg', 'svg');
    renderer.setAttribute(saveDrawingService.canvas.htmlElement, 'style', 'color: blue');
    spyOn(saveDrawingService, 'getChildren');
    saveDrawingService.saveSvg();
    expect(saveDrawingService.getChildren).toHaveBeenCalled();
  });

  it('#saveSvg should save the svg with the right informations', () => {
    const xml = new XMLSerializer();
    saveDrawingService.name = 'myName';
    saveDrawingService.tag = ['myTag'];
    saveDrawingService.canvas.htmlElement = renderer.createElement('svg', 'svg');
    renderer.setAttribute(saveDrawingService.canvas.htmlElement, 'style', 'color: blue');
    saveDrawingService.canvas.htmlElement.appendChild(dummyPath);
    const stringSvg = xml.serializeToString(dummyPath) + ',,';
    const myDrawing = { style: 'color: blue', svg: stringSvg, name: 'myName', tag: ['myTag'] };
    saveDrawingService.saveSvg().subscribe((res: string) => {
      expect(res).toEqual(JSON.stringify(myDrawing));
    });
    const req = httpMock.expectOne(`${base}/insert`);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(myDrawing);
    expect(req.request.responseType).toEqual('text');
    expect(req.cancelled).toBeFalsy();
    req.flush(myDrawing);
  });

  it('#deleteDrawing should delete the drawing with the id equals to 1', () => {
    const id = '1';
    const myDrawing = { style: 'style', svg: 'svg', name: 'name', tag: 'tag' };
    saveDrawingService.deleteDrawing(`${id}`).subscribe((res: string) => {
      expect(res).toEqual(JSON.stringify(myDrawing));
    });
    const req = httpMock.expectOne(`${base}/delete`); // HTTP request URL
    expect(req.request.method).toEqual('POST'); // HTTP request type
    expect(req.request.body.id).toEqual(id); // Other parameters
    expect(req.request.responseType).toEqual('text');
    expect(req.cancelled).toBeFalsy();
    req.flush(myDrawing); // Flush the mockdata and causes the observable to resolve (evaluate inside the subscribe)
  });

  it('#getSVGFromServer get the svg with the id equals to 1', () => {
    const id = '1';
    const httpParams = { param: 'idDrawing', value: id };
    const mySVG = { style: 'style', svg: 'svg', name: 'name', tag: 'tag' };
    saveDrawingService.getSVGFromServer(`${id}`).subscribe((res: object) => {
      expect(res).toEqual(mySVG);
    });
    const req = httpMock.expectOne(`${base}/svg?${httpParams.param}=${httpParams.value}`);
    expect(req.request.method).toEqual('GET');
    expect(req.request.params.get('idDrawing')).toEqual(id);
    expect(req.cancelled).toBeFalsy();
    req.flush(mySVG);
  });

  it('#getGallery get all the drawings from the gallery', () => {
    const myDrawing = { style: 'style', svg: 'svg', name: 'name', tag: 'tag' };
    saveDrawingService.getGallery().subscribe((res: object) => {
      expect(res).toEqual(myDrawing);
    });
    const req = httpMock.expectOne(`${base}/all`);
    expect(req.request.method).toEqual('GET');
    expect(req.cancelled).toBeFalsy();
    req.flush(myDrawing);
  });

  it('#getTags should return matched drawings with the right tags', () => {
    const tags = ['quarantine', 'solitude'];
    saveDrawingService.tag = tags;
    saveDrawingService.getTags().subscribe((res: object) => {
      expect(res).toEqual(tags);
    });
    const req = httpMock.expectOne(`${base}/tag?tag%5B%5D=${tags[0]}&tag%5B%5D=${tags[1]}`);
    expect(req.request.method).toEqual('GET');
    expect(req.cancelled).toBeFalsy();
    req.flush(tags);
  });

  it('#getTags should return matched drawings with the right tags', () => {
    const tags = ['quarantine', 'solitude'];
    saveDrawingService.tag = tags;
    saveDrawingService.getTags().subscribe((res: object) => {
      expect(res).toEqual(tags);
    });
    const req = httpMock.expectOne(`${base}/tag?tag%5B%5D=${tags[0]}&tag%5B%5D=${tags[1]}`);
    expect(req.request.method).toEqual('GET');
    expect(req.cancelled).toBeFalsy();
    req.flush(tags);
  });

  it('#updateWorkspace call getChildren()', () => {
    const svg: HTMLElement[] = [];
    svg.push(renderer.createElement('rect', 'svg'));
    svg.push(renderer.createElement('path', 'svg'));
    svg.push(renderer.createElement('circle', 'svg'));
    saveDrawingService.canvas.htmlElement = renderer.createElement('svg', 'svg');
    saveDrawingService.canvas.htmlElement.appendChild(dummyPath);
    saveDrawingService.canvas.htmlElement.appendChild(dummyRect);
    spyOn(saveDrawingService, 'getChildren');
    saveDrawingService.updateWorkspace('color: blue', svg);
    expect(saveDrawingService.getChildren).toHaveBeenCalled();
  });

  it('#updateWorkspace should return a style attribut for the svg', () => {
    const svg: HTMLElement[] = [];
    svg.push(renderer.createElement('rect', 'svg'));
    svg.push(renderer.createElement('path', 'svg'));
    svg.push(renderer.createElement('circle', 'svg'));
    saveDrawingService.canvas.htmlElement = renderer.createElement('svg', 'svg');
    saveDrawingService.canvas.htmlElement.appendChild(dummyPath);
    saveDrawingService.canvas.htmlElement.appendChild(dummyRect);
    saveDrawingService.updateWorkspace('color: blue', svg);
    expect(saveDrawingService.canvas.htmlElement.getAttribute('style')).toBe('color: blue');
  });

  it('#updateWorkspace should return an empty array for children', () => {
    const svg: HTMLElement[] = [];
    svg.push(renderer.createElement('rect', 'svg'));
    svg.push(renderer.createElement('path', 'svg'));
    svg.push(renderer.createElement('circle', 'svg'));
    saveDrawingService.canvas.htmlElement = renderer.createElement('svg', 'svg');
    saveDrawingService.canvas.htmlElement.appendChild(dummyPath);
    saveDrawingService.canvas.htmlElement.appendChild(dummyRect);
    saveDrawingService.updateWorkspace('color: blue', svg);
    expect(saveDrawingService.children.length).toBe(0);
  });

  it('#getChildren should get all children', () => {
    saveDrawingService.canvas.htmlElement = renderer.createElement('svg', 'svg');
    saveDrawingService.canvas.htmlElement.appendChild(dummyPath);
    saveDrawingService.canvas.htmlElement.appendChild(dummyRect);
    saveDrawingService.getChildren();
    expect(saveDrawingService.children.length).toBe(2);
  });

  it('#getChildren should get all children except for filter', () => {
    saveDrawingService.canvas.htmlElement = renderer.createElement('svg', 'svg');
    saveDrawingService.canvas.htmlElement.appendChild(dummyPath);
    saveDrawingService.canvas.htmlElement.appendChild(dummyRect);
    saveDrawingService.canvas.htmlElement.appendChild(renderer.createElement('filter', 'svg'));
    saveDrawingService.getChildren();
    expect(saveDrawingService.children.length).toBe(2);
  });
  it('#getChildren should not push if canvas htmlElement does not exists', () => {
    saveDrawingService.children = [];
    saveDrawingService.getChildren();
    expect(saveDrawingService.children.length).toBe(0);
  });
});
