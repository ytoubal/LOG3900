import { inject, TestBed } from '@angular/core/testing';
import { Information } from 'src/app/components/app/canvas/info';
import { CommandManager } from 'src/app/components/app/command-manager';
import { CanvasService } from './canvas.service';

describe('Service: CanvasService', () => {

  let canvasService: CanvasService;

  beforeEach(() => {
    const manager: CommandManager = new CommandManager();
    canvasService = new CanvasService(manager);
    TestBed.configureTestingModule({
      providers: [CanvasService]
    });
  });

  it('should create', inject([CanvasService], (service: CanvasService) => {
    expect(service).toBeTruthy();
  }));

  it('#updateColour should call newInfo.next if newInfo exists', () => {
    const newInfo = new Information();
    spyOn(canvasService.newInfo, 'next').withArgs(newInfo);
    canvasService.updateInfo(newInfo, true);
    expect(canvasService.newInfo.next).toHaveBeenCalled();
  });

  it('#updateColour should not call newInfo.next', () => {
    spyOn(canvasService.newInfo, 'next').withArgs(null);
    canvasService.updateInfo(null, true);
    expect(canvasService.newInfo.next).not.toHaveBeenCalled();
  });

  it('#getHtmlElement should return htmlElement', () => {
    const element = document.createElement('div');
    canvasService.htmlElement = element;
    expect(canvasService.getHtmlElement()).toBe(element);
  });

  it('#getScrollableWindow should return scrollableWindow', () => {
    const element = document.createElement('div');
    canvasService.scrollableWindow = element;
    expect(canvasService.getScrollableWindow()).toBe(element);
  });
});
