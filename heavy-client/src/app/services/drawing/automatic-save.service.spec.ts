// tslint:disable: max-line-length
// tslint:disable: no-magic-numbers
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Renderer2, RendererFactory2 } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';
import { CommandManager } from 'src/app/components/app/command-manager';
import { AutomaticSaveService } from './automatic-save.service';
import { CanvasService } from './canvas.service';
import { PaletteService } from './palette.service';

describe('Service: AutomaticSave', () => {

  let automaticService: AutomaticSaveService;
  const manager: CommandManager = new CommandManager();
  let canvasService: CanvasService;
  let paletteService: PaletteService;
  let renderer: Renderer2;
  let saveServiceSpy = jasmine.createSpyObj('SaveDrawingService', ['updateWorkspace']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AutomaticSaveService, Renderer2],
      imports: [HttpClientTestingModule]
    });
  });

  beforeEach((inject([RendererFactory2], (rendererFactory: RendererFactory2) => {
    let store: { [key: string]: string } = {};

    renderer = rendererFactory.createRenderer(null, null);
    canvasService = new CanvasService(manager);
    paletteService = new PaletteService();
    saveServiceSpy.updateWorkspace.calls.reset();

    saveServiceSpy = jasmine.createSpyObj('SaveDrawingService', ['updateWorkspace']);
    automaticService = new AutomaticSaveService(canvasService, rendererFactory, saveServiceSpy, paletteService);
    saveServiceSpy.updateWorkspace.calls.reset();

    const mockLocalStorage = {
      getItem: (key: string): string | null => {
        return key in store ? store[key] : null;
      },
      setItem: (key: string, value: string) => {
        store[key] = `${value}`;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
      length: Object.keys(store).length
    };

    spyOn(localStorage, 'getItem')
      .and.callFake(mockLocalStorage.getItem);
    spyOn(localStorage, 'setItem')
      .and.callFake(mockLocalStorage.setItem);
    spyOn(localStorage, 'removeItem')
      .and.callFake(mockLocalStorage.removeItem);
    spyOn(localStorage, 'clear')
      .and.callFake(mockLocalStorage.clear);

  })));

  it('should create', inject([AutomaticSaveService], (service: AutomaticSaveService) => {
    expect(service).toBeTruthy();
  }));

  it('#hasDrawing should return false if localStorage is empty', () => {
    spyOnProperty(localStorage, 'length', 'get').and.returnValue(0);
    const result = automaticService.hasDrawing();
    expect(result).toBe(false);
  });

  it('#hasDrawing should return true if localStorage is not empty', () => {
    spyOnProperty(localStorage, 'length', 'get').and.returnValue(1);
    const result = automaticService.hasDrawing();
    expect(result).toBe(true);
  });

  it('#automaticSave should call set an item in the localStorage when htmlElement is exist', () => {
    automaticService.canvasService.htmlElement = document.createElement('svg');
    renderer.setAttribute(automaticService.canvasService.htmlElement, 'style', 'color: blue');
    const child = document.createElement('div');
    automaticService.canvasService.htmlElement.appendChild(child);

    const style = automaticService.canvasService.htmlElement.getAttribute('style');
    const xml = new XMLSerializer();
    const stringSvg = (xml.serializeToString(child) + ',,');
    const myObj = { style, stringSvg };
    automaticService.automaticSave();
    expect(localStorage.setItem).toHaveBeenCalledWith('drawing', JSON.stringify(myObj));
  });

  it('#automaticSave should set correct item in localStorage when html element is null', () => {
    automaticService.canvasService.htmlElement = document.createElement('svg');
    automaticService.automaticSave();
    expect(localStorage.setItem).toHaveBeenCalledWith('drawing', JSON.stringify({ style: null, stringSvg: '' }));
  });

  it('#automaticSave should call set an item in the localStorage when htmlElement exist with tagName filter', () => {
    automaticService.canvasService.htmlElement = document.createElement('svg');
    renderer.setAttribute(automaticService.canvasService.htmlElement, 'style', 'color: blue');
    const childGridId = document.createElement('div');
    childGridId.setAttribute('id', 'gridContainer');
    automaticService.canvasService.htmlElement.appendChild(childGridId);
    const myObj = { style: 'color: blue', stringSvg: '' };
    automaticService.automaticSave();
    expect(localStorage.setItem).toHaveBeenCalledWith('drawing', JSON.stringify(myObj));
  });

  it('#loadAutomaticDrawing should not call updateWorkspace if drawing is null', () => {
    localStorage.removeItem('drawing');
    automaticService.loadAutomaticDrawing();
    expect(saveServiceSpy.updateWorkspace).not.toHaveBeenCalled();
  });

  it('#loadAutomaticDrawing should call correctly updateWorkspace if drawing is not null', () => {
    const mockDrawing = JSON.stringify({ style: 'background-color: rgba(255,255,255,1); width: 1150px;\n      height: 881px;', stringSvg: '<path xmlns="http://www.w3.org/2000/svg" colour-type="stroke" d="M 312.43 244 L 312.43 244" stroke="rgba(0,0,0,1)" stroke-width="39" stroke-linecap="round"/>,,' });
    localStorage.setItem('drawing', mockDrawing);
    const object = JSON.parse(mockDrawing);
    const parser = new DOMParser();
    const arrayDoc: HTMLElement[] = [];
    const array = object.stringSvg.split(',,');
    for (const element of array) {
      const doc = parser.parseFromString(element, 'image/svg+xml');
      arrayDoc.push(doc.documentElement);
    }
    automaticService.loadAutomaticDrawing();
    expect(saveServiceSpy.updateWorkspace).toHaveBeenCalledWith((object.style), arrayDoc);
  });
});
