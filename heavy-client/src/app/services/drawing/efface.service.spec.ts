/* tslint:disable:no-unused-variable */
// tslint:disable: no-magic-numbers
// tslint:disable: max-line-length
// tslint:disable: max-file-line-count
import { Renderer2, RendererFactory2 } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';
import { CommandManager } from 'src/app/components/app/command-manager';
import { AttributsService } from './attributs.service';
import { CanvasService } from './canvas.service';
import { EffaceService } from './efface.service';

describe('Service: Efface', () => {
  let renderer: Renderer2;
  let attributsService: AttributsService;
  let effaceService: EffaceService;
  let canvasService: CanvasService;
  let mockDrawingBoard: HTMLElement;
  let mockScrollableWindow: HTMLElement;
  let manager: CommandManager;

  const mockMouseEvent = new MouseEvent('mousedown');
  const mockUp = new MouseEvent('mouseup');
  const mockMove = new MouseEvent('mousemove');
  const mockLeave = new MouseEvent('mouseleave');
  const mockOut = new MouseEvent('mouseout');
  const mockKeyDown = new KeyboardEvent('keydown');

  let dummyRect: SVGGraphicsElement;
  let dummyPath: SVGGraphicsElement;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: EffaceService }]
    });
  });

  beforeEach(inject([RendererFactory2], (rendererFactory: RendererFactory2) => {
    renderer = rendererFactory.createRenderer(null, null);
    manager = new CommandManager();
    canvasService = new CanvasService(manager);
    attributsService = new AttributsService();
    effaceService = new EffaceService(renderer, attributsService, canvasService);
    mockDrawingBoard = document.createElement('div');
    mockScrollableWindow = document.createElement('div');
    effaceService.square = renderer.createElement('rect', 'svg');
    effaceService.drawingBoard = mockDrawingBoard;
    effaceService.scrollableWindow = mockScrollableWindow;
    effaceService.size = 3;
    dummyRect = renderer.createElement('rect', 'svg');
    dummyPath = renderer.createElement('path', 'svg');
  }));

  it('should create', inject([EffaceService], (service: EffaceService) => {
    expect(effaceService).toBeTruthy();
  }));

  it('Pushing the mouse button down should call mouseDown in the service', () => {
    spyOn(effaceService, 'mouseDown').withArgs(mockMouseEvent);
    effaceService.callTool(mockMouseEvent);
    expect(effaceService.mouseDown).toHaveBeenCalled();
  });

  it('Releasing the mouse button should call mouseUp in the service', () => {
    spyOn(effaceService, 'mouseUp').withArgs();
    effaceService.callTool(mockUp);
    expect(effaceService.mouseUp).toHaveBeenCalled();
  });

  it('Moving the mouse should call mouseMove in the service', () => {
    spyOn(effaceService, 'mouseMove').withArgs(mockMove);
    effaceService.callTool(mockMove);
    expect(effaceService.mouseMove).toHaveBeenCalled();
  });

  it('Make the mouse leave the target zone should call mouseLeave in the service', () => {
    spyOn(effaceService, 'mouseLeave').withArgs();
    effaceService.callTool(mockLeave);
    expect(effaceService.mouseLeave).toHaveBeenCalled();
  });

  it('Mouse out of the target zone should not call anything', () => {
    spyOn(effaceService, 'mouseLeave').withArgs();
    spyOn(effaceService, 'mouseDown').withArgs(mockMouseEvent);
    spyOn(effaceService, 'mouseUp').withArgs();
    spyOn(effaceService, 'mouseMove').withArgs(mockMove);
    effaceService.callTool(mockOut);
    expect(effaceService.mouseLeave).not.toHaveBeenCalled();
    expect(effaceService.mouseDown).not.toHaveBeenCalled();
    expect(effaceService.mouseUp).not.toHaveBeenCalled();
    expect(effaceService.mouseMove).not.toHaveBeenCalled();
  });

  it('A keyboard press should call keyDown in the service', () => {
    spyOn(effaceService, 'keydown').withArgs(mockKeyDown);
    effaceService.callTool(mockKeyDown);
    expect(effaceService.keydown).toHaveBeenCalledWith(mockKeyDown);
  });

  it('#clearTool should call mouseLeave', () => {
    spyOn(effaceService, 'mouseLeave');
    effaceService.clearTool();
    expect(effaceService.mouseLeave).toHaveBeenCalled();
  });

  it('#clearTool should call erase', () => {
    renderer.appendChild(effaceService.drawingBoard, effaceService.square);
    spyOn(effaceService, 'erase');
    effaceService.clearTool();
    expect(effaceService.erase).toHaveBeenCalled();
  });

  it('#clearTool should pop undoBoards and undoHistory if newClick is false', () => {
    effaceService.newClick = false;
    effaceService.mousedown = true;
    spyOn(effaceService.manager.undoBoards, 'pop');
    spyOn(effaceService.manager.undoHistory, 'pop');
    spyOn(effaceService, 'mouseLeave');
    spyOn(effaceService, 'erase');
    effaceService.clearTool();
    expect(effaceService.manager.undoBoards.pop).toHaveBeenCalled();
    expect(effaceService.manager.undoHistory.pop).toHaveBeenCalled();
    expect(effaceService.mouseLeave).toHaveBeenCalled();
    expect(effaceService.erase).toHaveBeenCalled();
    expect(effaceService.newClick).toBe(true);
  });

  it('#setAttributes should update size', () => {
    effaceService.size = 5;
    effaceService.myTool.attributs.size = 10;
    effaceService.setAttributes();
    expect(effaceService.size).toBe(10);
  });

  it('#mouseDown should make mousedown equals true', () => {
    effaceService.mousedown = false;
    effaceService.mouseDown(mockMouseEvent);
    expect(effaceService.mousedown).toBe(true);
  });

  it('#mouseDown should call detectCollisions', () => {
    spyOn(effaceService, 'detectCollisions').withArgs(mockMouseEvent, true);
    effaceService.mouseDown(mockMouseEvent);
    expect(effaceService.detectCollisions).toHaveBeenCalled();
  });

  it('#mouseDown should call highlighSelection', () => {
    effaceService.eraseList = [];
    spyOn(effaceService, 'highlightSelection').withArgs(effaceService.eraseList);
    effaceService.mouseDown(mockMouseEvent);
    expect(effaceService.highlightSelection).toHaveBeenCalledWith(effaceService.eraseList);
  });

  it('#mouseDown should call removeChild of this.square on drawingBoard if the board contains the square', () => {
    effaceService.newClick = true;
    effaceService.square = renderer.createElement('svg');
    renderer.appendChild(effaceService.drawingBoard, effaceService.square);
    effaceService.eraseList = [];
    spyOn(effaceService.drawingBoard, 'removeChild').withArgs(effaceService.square);
    effaceService.mouseDown(mockMouseEvent);
    expect(effaceService.drawingBoard.removeChild).toHaveBeenCalledWith(effaceService.square);
  });

  it('#mouseDown should not call removeChild of this.square on drawingBoard if newClick is false', () => {
    effaceService.newClick = false;
    effaceService.square = renderer.createElement('svg');
    renderer.appendChild(effaceService.drawingBoard, effaceService.square);
    effaceService.eraseList = [];
    spyOn(effaceService.drawingBoard, 'removeChild').withArgs(effaceService.square);
    effaceService.mouseDown(mockMouseEvent);
    expect(effaceService.drawingBoard.removeChild).not.toHaveBeenCalledWith(effaceService.square);
  });

  it('#keydown should call removeHighlight', () => {
    effaceService.hoverElementsList.push(renderer.createElement('svg'));
    spyOn(effaceService, 'removeHighlight');
    Object.defineProperty(mockKeyDown, 'ctrlKey', { value: true });
    Object.defineProperty(mockKeyDown, 'code', { value: 'KeyZ' });
    effaceService.keydown(mockKeyDown);
    expect(effaceService.removeHighlight).toHaveBeenCalled();
  });

  it('#keydown should not call removeHighlight is there is no element in  hoverElementsList', () => {
    effaceService.hoverElementsList.length = 0;
    spyOn(effaceService, 'removeHighlight');
    Object.defineProperty(mockKeyDown, 'ctrlKey', { value: true });
    Object.defineProperty(mockKeyDown, 'code', { value: 'KeyZ' });
    effaceService.keydown(mockKeyDown);
    expect(effaceService.removeHighlight).not.toHaveBeenCalled();
  });

  it('#keydown should not call removeHighlight is the keys pressed are not CTRL-Z', () => {
    effaceService.hoverElementsList.length = 1;
    spyOn(effaceService, 'removeHighlight');
    Object.defineProperty(mockKeyDown, 'ctrlKey', { value: false });
    Object.defineProperty(mockKeyDown, 'code', { value: 'KeyA' });
    effaceService.keydown(mockKeyDown);
    expect(effaceService.removeHighlight).not.toHaveBeenCalled();
  });

  it('#mouseUp should call erase if this.newClick is false', () => {
    effaceService.newClick = false;
    spyOn(effaceService, 'erase');
    effaceService.mouseUp();
    expect(effaceService.erase).toHaveBeenCalled();
  });

  it('#mouseUp should not call erase if this.newClick is true', () => {
    effaceService.newClick = true;
    spyOn(effaceService, 'erase');
    effaceService.mouseUp();
    expect(effaceService.erase).not.toHaveBeenCalled();
  });

  it('#mouseUp should pop undoBoards and undoHistory if the hoverElementsList lenght is > 0', () => {
    effaceService.eraseList.length = 1;
    effaceService.newClick = false;
    effaceService.mousedown = true;
    spyOn(effaceService.manager.undoBoards, 'pop');
    spyOn(effaceService.manager.undoHistory, 'pop');
    effaceService.mouseUp();
    expect(effaceService.manager.undoBoards.pop).not.toHaveBeenCalled();
    expect(effaceService.manager.undoHistory.pop).not.toHaveBeenCalled();
    expect(effaceService.newClick).toBe(true);
    expect(effaceService.mousedown).toBe(false);
  });

  it('#mouseLeave should call removeHighlight', () => {
    renderer.appendChild(effaceService.drawingBoard, effaceService.square);
    spyOn(effaceService, 'removeHighlight');
    effaceService.mouseLeave();
    expect(effaceService.removeHighlight).toHaveBeenCalled();
  });

  it('#mouseLeave should remove square from drawingBoard', () => {
    renderer.appendChild(effaceService.drawingBoard, effaceService.square);
    const totalElements = effaceService.drawingBoard.childElementCount;
    effaceService.mouseLeave();
    expect(effaceService.drawingBoard.childElementCount).toEqual(totalElements - 1);
  });

  it('#mouseMove should call setAttributes', () => {
    spyOn(effaceService, 'setAttributes');
    effaceService.mouseMove(mockMove);
    expect(effaceService.setAttributes).toHaveBeenCalled();
  });

  it('#mouseMove should call hoverSquare', () => {
    spyOn(effaceService, 'hoverSquare').withArgs(mockMove);
    spyOn(effaceService, 'getEraserBorders').and.returnValue([dummyRect]);  // for elem from Point fix
    effaceService.mouseMove(mockMove);
    expect(effaceService.hoverSquare).toHaveBeenCalled();
  });

  it('#mouseMove with mousedown should call detectCollisions', () => {
    effaceService.mousedown = true;
    spyOn(effaceService, 'detectCollisions').withArgs(mockMove, true);
    effaceService.mouseMove(mockMove);
    expect(effaceService.detectCollisions).toHaveBeenCalled();
  });

  it('#mouseMove without mousedown should call detectCollisions', () => {
    effaceService.mousedown = false;
    spyOn(effaceService, 'detectCollisions').withArgs(mockMove, false);
    effaceService.mouseMove(mockMove);
    expect(effaceService.detectCollisions).toHaveBeenCalled();
  });

  it('#mouseMove with mousedown should call highlightSelection', () => {
    effaceService.mousedown = true;
    effaceService.eraseList = [];
    spyOn(effaceService, 'getEraserBorders').and.returnValue([dummyRect]);  // for elem from Point fix
    spyOn(effaceService, 'highlightSelection').withArgs(effaceService.eraseList);
    effaceService.mouseMove(mockMove);
    expect(effaceService.highlightSelection).toHaveBeenCalled();
  });

  it('#mouseMove without mousedown should call highlightSelection', () => {
    effaceService.mousedown = false;
    effaceService.hoverElementsList = [];
    spyOn(effaceService, 'getEraserBorders').and.returnValue([dummyRect]);  // for elem from Point fix
    spyOn(effaceService, 'highlightSelection').withArgs(effaceService.hoverElementsList);
    effaceService.mouseMove(mockMove);
    expect(effaceService.highlightSelection).toHaveBeenCalled();
  });

  it('#mouseMove without mousedown  and without onHover should call removeHighlight', () => {
    effaceService.mousedown = false;
    effaceService.onHover = false;
    spyOn(effaceService, 'getEraserBorders').and.returnValue([dummyRect]);  // for elem from Point fix
    spyOn(effaceService, 'removeHighlight');
    effaceService.mouseMove(mockMove);
    expect(effaceService.removeHighlight).toHaveBeenCalled();
  });

  it('#mouseMove without mousedown  and with onHover should not call removeHighlight', () => {
    effaceService.mousedown = false;
    effaceService.onHover = true;
    spyOn(effaceService, 'getEraserBorders').and.returnValue([dummyRect]);  // for elem from Point fix
    spyOn(effaceService, 'removeHighlight');
    effaceService.mouseMove(mockMove);
    expect(effaceService.removeHighlight).not.toHaveBeenCalled();
  });

  it('#erase should remove all child in eraseList from drawingboard', () => {
    [dummyRect, dummyPath].forEach((elem: SVGGraphicsElement) => {
      renderer.appendChild(effaceService.drawingBoard, elem);
      effaceService.eraseList.push(elem);
    });
    const totalElements = effaceService.drawingBoard.childElementCount;
    effaceService.erase();
    expect(effaceService.drawingBoard.childElementCount).toEqual(totalElements - 2);
  });

  it('#erase should empty eraseList', () => {
    [dummyRect, dummyPath].forEach((elem: SVGGraphicsElement) => {
      renderer.appendChild(effaceService.drawingBoard, elem);
      effaceService.eraseList.push(elem);
    });
    effaceService.erase();
    expect(effaceService.eraseList.length).toEqual(0);
  });

  it('#erase should do nothing if eraseList is empty', () => {
    [dummyRect, dummyPath].forEach((elem: SVGGraphicsElement) => {
      renderer.appendChild(effaceService.drawingBoard, elem);
    });
    const totalElements = effaceService.drawingBoard.childElementCount;
    effaceService.erase();
    expect(effaceService.drawingBoard.childElementCount).toEqual(totalElements);
  });

  it('#allDrawingBoardElements should return correct SVGGraphicsElement', () => {
    const dummyCircle = renderer.createElement('circle', 'svg');
    const dummyFilter = renderer.createElement('filter', 'svg');

    [effaceService.square, dummyPath, dummyFilter, dummyCircle].forEach((elem: SVGGraphicsElement) => {
      renderer.appendChild(effaceService.drawingBoard, elem);
    });
    const returnedList = effaceService.allDrawingBoardElements();
    expect(returnedList).toEqual([dummyPath, dummyCircle]);
  });

  it('#allDrawingBoardElements should return correctly empty list', () => {
    const dummyFilter = renderer.createElement('filter', 'svg');
    [effaceService.square, dummyFilter].forEach((elem: SVGGraphicsElement) => {
      renderer.appendChild(effaceService.drawingBoard, elem);
    });
    const returnedList = effaceService.allDrawingBoardElements();
    expect(returnedList).toEqual([]);
  });

  it('#addRedAttribute should add isRed attribute if first time and color is red', () => {
    effaceService.addRedAttribute('rgba(255,0,0,1)', dummyRect);
    expect(dummyRect.getAttribute('isRed')).toBe('true');
  });
  it('#addRedAttribute should add isRed attribute if first time and color is not red', () => {
    effaceService.addRedAttribute('rgba(0,0,0,1)', dummyRect); // black
    expect(dummyRect.getAttribute('isRed')).toBe('false');
  });
  it('#addRedAttribute should not modify isRed attribute if attribute already exists', () => {
    dummyRect.setAttribute('isRed', 'true');
    effaceService.addRedAttribute('rgba(0,0,0,1)', dummyRect);
    expect(dummyRect.getAttribute('isRed')).toBe('true');
  });
  it('#addRedAttribute should not modify isRed attribute if attribute already exists', () => {
    dummyRect.setAttribute('isRed', 'false');
    effaceService.addRedAttribute('rgba(255,0,0,1)', dummyRect);
    expect(dummyRect.getAttribute('isRed')).toBe('false');
  });
  it('#addRedAttribute should not modify isRed attribute if attribute already exists', () => {
    dummyRect.setAttribute('isRed', 'true');
    effaceService.addRedAttribute('rgba(0,0,0,1)', dummyRect);
    expect(dummyRect.getAttribute('isRed')).toBe('true');
  });

  it('#setRedHighlight should set stroke color to darkred if isRed is true and isLinegroup is true', () => {
    effaceService.setRedHighlight('rgba(255,0,0,1)', dummyRect, true);
    expect(dummyRect.getAttribute('stroke')).toBe('darkred');
  });
  it('#setRedHighlight should set stroke color to darkred if isRed is true and isLinegroup is true', () => {
    effaceService.setRedHighlight('rgba(255,0,0,1)', dummyRect, true);
    expect(dummyRect.getAttribute('fill')).toBe('darkred');
  });
  it('#setRedHighlight should not set fill color to darkred if isRed is true and isLinegroup is false', () => {
    effaceService.setRedHighlight('rgba(255,0,0,1)', dummyRect, false);
    expect(dummyRect.getAttribute('fill')).not.toBe('darkred');
  });
  it('#setRedHighlight should set stroke color to red if isRed is false and isLinegroup is true', () => {
    effaceService.setRedHighlight('rgba(0,0,0,1)', dummyRect, true);
    expect(dummyRect.getAttribute('stroke')).toBe('red');
  });
  it('#setRedHighlight should set fill color to red if isRed is false and isLinegroup is true', () => {
    effaceService.setRedHighlight('rgba(0,0,0,1)', dummyRect, true);
    expect(dummyRect.getAttribute('fill')).toBe('red');
  });
  it('#setRedHighlight should not set fill color to red if isRed is false and isLinegroup is false', () => {
    effaceService.setRedHighlight('rgba(0,0,0,1)', dummyRect, false);
    expect(dummyRect.getAttribute('fill')).not.toBe('red');
  });

  it('#inRedRange should return true if rgba in range', () => {
    expect(effaceService.inRedRange('rgba(255,0,0,1)')).toBe(true);
  });
  it('#inRedRange should return true if in red Range', () => {
    expect(effaceService.inRedRange('rgba(255,80,80,1)')).toBe(true);
  });
  it('#inRedRange should return true if in red Range limit', () => {
    expect(effaceService.inRedRange('rgba(175,80,80,1)')).toBe(true);
  });
  it('#inRedRange should return false if g out of range', () => {
    expect(effaceService.inRedRange('rgba(255,100,0,1)')).toBe(false);
  });
  it('#inRedRange should return false if r out of range', () => {
    expect(effaceService.inRedRange('rgba(150,80,80,1)')).toBe(false);
  });
  it('#inRedRange should return false if rgb out of range', () => {
    expect(effaceService.inRedRange('rgba(150,255,255,1)')).toBe(false);
  });

  it('#hoverSquare should set correct square width', () => {
    effaceService.size = 5;
    effaceService.hoverSquare(mockMove);
    expect(effaceService.square.getAttribute('width')).toBe('5');
  });
  it('#hoverSquare should set correct square height', () => {
    effaceService.size = 5;
    effaceService.hoverSquare(mockMove);
    expect(effaceService.square.getAttribute('height')).toBe('5');
  });
  it('#hoverSquare should set correct square fill', () => {
    effaceService.square.setAttribute('fill', 'black');
    effaceService.hoverSquare(mockMove);
    expect(effaceService.square.getAttribute('fill')).toBe('white');
  });
  it('#hoverSquare should set correct square stroke', () => {
    effaceService.square.setAttribute('stroke', 'red');
    effaceService.hoverSquare(mockMove);
    expect(effaceService.square.getAttribute('stroke')).toBe('black');
  });
  it('#hoverSquare should set correct square pointer-events', () => {
    effaceService.square.setAttribute('pointer-events', 'visiblePoint');
    effaceService.hoverSquare(mockMove);
    expect(effaceService.square.getAttribute('pointer-events')).toBe('none');
  });
  it('#hoverSquare should correctly appendChild to drawingBoard', () => {
    effaceService.hoverSquare(mockMove);
    expect(effaceService.drawingBoard.lastChild).toBe(effaceService.square);
  });
  it('#hoverSquare should set correct pointX', () => {
    const clientRect = effaceService.scrollableWindow.getBoundingClientRect();
    const pointX = mockMove.clientX + effaceService.scrollableWindow.scrollLeft - clientRect.left - effaceService.size / 2;
    effaceService.hoverSquare(mockMove);
    expect(effaceService.square.getAttribute('x')).toBe(`${pointX}`);
  });
  it('#hoverSquare should set correct pointY', () => {
    const clientRect = effaceService.scrollableWindow.getBoundingClientRect();
    const pointY = mockMove.clientY + effaceService.scrollableWindow.scrollTop - clientRect.top - effaceService.size / 2;
    effaceService.hoverSquare(mockMove);
    expect(effaceService.square.getAttribute('x')).toBe(`${pointY}`);
  });

  it('#getTarget should return a rectangle', () => {
    const target = dummyRect;
    effaceService.drawingBoard.appendChild(dummyRect);
    expect(effaceService.getTarget(target)).toBe(target);
  });
  it('#getTarget should return a circle', () => {
    const parentTarget = renderer.createElement('circle', 'svg');
    const target = dummyRect;
    parentTarget.appendChild(target);
    effaceService.drawingBoard.appendChild(parentTarget);
    expect(effaceService.getTarget(target)).toBe(parentTarget);
    expect(effaceService.getTarget(target)).not.toBe(target);
  });

  it('#getEraserBorders should return correct list', () => {
    const centerOffset = effaceService.size / 2;
    const center = document.elementFromPoint(mockMove.clientX, mockMove.clientY) as Element;
    const bottomRight = document.elementFromPoint(mockMove.clientX + centerOffset, mockMove.clientY + centerOffset) as Element;
    const topRight = document.elementFromPoint(mockMove.clientX + centerOffset, mockMove.clientY - centerOffset) as Element;
    const topLeft = document.elementFromPoint(mockMove.clientX - centerOffset, mockMove.clientY + centerOffset) as Element;
    const bottomLeft = document.elementFromPoint(mockMove.clientX - centerOffset, mockMove.clientY - centerOffset) as Element;
    const right = document.elementFromPoint(mockMove.clientX + centerOffset, mockMove.clientY) as Element;
    const left = document.elementFromPoint(mockMove.clientX - centerOffset, mockMove.clientY) as Element;
    const top = document.elementFromPoint(mockMove.clientX, mockMove.clientY - centerOffset) as Element;
    const bottom = document.elementFromPoint(mockMove.clientX, mockMove.clientY + centerOffset) as Element;
    expect(effaceService.getEraserBorders(mockMove)).toEqual([center, bottomRight, topRight, topLeft, bottomLeft, right, left, top, bottom]);
  });

  it('#highlightSelection should return when groupElement is null', () => {
    const selectedElements = [dummyRect as SVGGraphicsElement];
    spyOn(effaceService, 'setRedHighlight').withArgs();
    effaceService.highlightSelection(selectedElements);
    expect(effaceService.setRedHighlight).not.toHaveBeenCalled();
  });
  it('#highlightSelection should call setRedHighlight when groupElement is not null and childcount <= 1 ', () => {
    dummyRect.setAttribute('stroke', 'rgba(0,0,0,1)');
    effaceService.drawingBoard.appendChild(dummyRect);
    spyOn(effaceService, 'setRedHighlight').withArgs('rgba(0,0,0,1)', dummyRect, false);
    effaceService.highlightSelection([dummyRect]);
    expect(effaceService.setRedHighlight).toHaveBeenCalled();
  });
  it('#highlightSelection should set correct stroke width when groupElement is not null and childcount <= 1 ', () => {
    dummyRect.setAttribute('stroke-width', '0');
    dummyRect.setAttribute('stroke', 'rgba(0,0,0,1)');
    effaceService.drawingBoard.appendChild(dummyRect);
    effaceService.highlightSelection([dummyRect]);
    expect(dummyRect.getAttribute('stroke-width')).toBe('5');
  });
  it('#highlightSelection should push color in elementColor when groupElement is not null and childcount <= 1 ', () => {
    dummyRect.setAttribute('stroke', 'rgba(0,0,0,1)');
    effaceService.drawingBoard.appendChild(dummyRect);
    effaceService.elementColor = [];
    effaceService.highlightSelection([dummyRect]);
    expect(effaceService.elementColor).toEqual(['rgba(0,0,0,1)']);
  });
  it('#highlightSelection should push correct color when groupElement is not null, childcount > 1, groupElement class is line, with child line and child circle', () => {
    effaceService.elementColor = [];
    const childLineColor = 'rgba(0,0,0,1)';
    const childCircleColor = 'rgba(255,0,0,1)';
    const childLine = renderer.createElement('line', 'svg');
    const childCircle = renderer.createElement('circle', 'svg');
    const lineGroup = renderer.createElement('line', 'svg');

    [childLine, childCircle].forEach((child: SVGGraphicsElement) => {
      child.setAttribute('stroke', childLineColor);
      child.setAttribute('fill', childCircleColor);
      lineGroup.appendChild(child);
    });
    lineGroup.setAttribute('class', 'line');
    effaceService.drawingBoard.appendChild(lineGroup);
    effaceService.highlightSelection([lineGroup]);
    expect(effaceService.elementColor).toEqual([childLineColor, childCircleColor]);
  });
  it('#highlightSelection should push correct color when groupElement is not null, childcount > 1, groupElement class is not line', () => {
    effaceService.elementColor = [];
    const childLineColor = 'rgba(0,0,0,1)';
    const childCircleColor = 'rgba(255,0,0,1)';
    const childLine = renderer.createElement('line', 'svg');
    const childCircle = renderer.createElement('circle', 'svg');
    const rectGroup = renderer.createElement('rect', 'svg');

    [childLine, childCircle].forEach((child: SVGGraphicsElement) => {
      child.setAttribute('stroke', childLineColor);
      child.setAttribute('fill', childCircleColor);
      rectGroup.appendChild(child);
    });
    rectGroup.setAttribute('class', 'rect');
    effaceService.drawingBoard.appendChild(rectGroup);
    effaceService.highlightSelection([rectGroup]);
    expect(effaceService.elementColor).toEqual([childLineColor]);
  });

  it('#removeHighlight should not remove redAttribute when groupElement is null', () => {
    dummyRect.setAttribute('isRed', 'true');
    effaceService.hoverElementsList = [dummyRect as SVGGraphicsElement];
    effaceService.removeHighlight();
    expect(dummyRect.getAttribute('isRed')).toBe('true');
  });
  it('#removeHighlight should empty hoverlists', () => {
    effaceService.hoverElementsList = [dummyRect];
    effaceService.drawingBoard.appendChild(dummyRect);
    effaceService.removeHighlight();
    expect(effaceService.hoverElementsList.length).toBe(0);
  });
  it('#removeHighlight should not remove redAttribute when groupElement is null', () => {
    effaceService.elementColor = ['rgba(0,0,0,1)'];
    effaceService.removeHighlight();
    expect(effaceService.elementColor.length).toBe(0);
  });
  it('#removeHighlight should put correct attribute when groupElement is not null, childcount <= 1', () => {
    effaceService.elementColor = ['rgba(0,0,0,1)'];
    const childCircleColor = 'rgba(255,0,0,1)';
    const childCircle = renderer.createElement('circle', 'svg');

    [childCircle].forEach((child: SVGGraphicsElement) => {
      child.setAttribute('stroke', childCircle);
      child.setAttribute('fill', childCircleColor);
      effaceService.drawingBoard.appendChild(child);
      effaceService.hoverElementsList.push(child);
    });
    effaceService.removeHighlight();
    expect(childCircle.getAttribute('stroke')).toBe('rgba(0,0,0,1)');
    expect(childCircle.getAttribute('border')).toBe('rgba(0,0,0,1)');
  });

  it('#removeHighlight should put correct attribute when groupElement is not null, childcount > 1, groupElement class is not line', () => {
    effaceService.elementColor = ['rgba(0,0,0,1)'];
    const hoverColor = 'rgba(255,0,0,1)';
    const childLine = renderer.createElement('line', 'svg');
    const childCircle = renderer.createElement('circle', 'svg');
    const rectGroup = renderer.createElement('rect', 'svg');

    [childLine, childCircle].forEach((child: SVGGraphicsElement) => {
      child.setAttribute('stroke', hoverColor);
      child.setAttribute('fill', hoverColor);
      rectGroup.appendChild(child);
    });
    rectGroup.setAttribute('class', 'rect');
    effaceService.drawingBoard.appendChild(rectGroup);
    effaceService.hoverElementsList.push(rectGroup);
    effaceService.removeHighlight();
    expect(childLine.getAttribute('stroke')).toBe('rgba(0,0,0,1)');
    expect(childLine.getAttribute('border')).toBe('rgba(0,0,0,1)');
  });

  it('#removeHighlight not should set stroke-width to 0 when the class is not line, the tagName is path and the fill is not none', () => {
    effaceService.elementColor = ['rgba(0,0,0,1)'];
    const hoverColor = 'rgba(255,0,0,1)';
    const childLine = renderer.createElement('line', 'svg');
    const childCircle = renderer.createElement('circle', 'svg');
    const rectGroup = renderer.createElement('rect', 'svg');

    [childLine, childCircle].forEach((child: SVGGraphicsElement) => {
      child.setAttribute('stroke', hoverColor);
      child.setAttribute('stroke-width', '1');
      child.setAttribute('fill', 'none');
      Object.defineProperty(child, 'tagname', { value: 'path' });
      rectGroup.appendChild(child);
    });
    rectGroup.setAttribute('class', 'rect');
    effaceService.drawingBoard.appendChild(rectGroup);
    effaceService.hoverElementsList.push(rectGroup);
    effaceService.removeHighlight();
    expect(childLine.getAttribute('stroke-width')).not.toBe('0');
    expect(childLine.getAttribute('stroke')).toBe('rgba(0,0,0,1)');
    expect(childLine.getAttribute('border')).toBe('rgba(0,0,0,1)');
  });

  it('#removeHighlight should put correct attribute when groupElement is not null, childcount > 1, groupElement class is line', () => {
    effaceService.elementColor = ['rgba(0,0,0,1)'];
    const hoverColor = 'rgba(255,0,0,1)';
    const childLine = renderer.createElement('line', 'svg');
    const childCircle = renderer.createElement('circle', 'svg');
    const lineGroup = renderer.createElement('rect', 'svg');

    [childLine, childCircle].forEach((child: SVGGraphicsElement) => {
      child.setAttribute('stroke', hoverColor);
      child.setAttribute('fill', hoverColor);
      lineGroup.appendChild(child);
    });
    lineGroup.setAttribute('class', 'line');
    effaceService.drawingBoard.appendChild(lineGroup);
    effaceService.hoverElementsList.push(lineGroup);
    effaceService.removeHighlight();
    expect(childLine.getAttribute('fill')).toBe('rgba(0,0,0,1)');
    expect(childLine.getAttribute('stroke')).toBe('rgba(0,0,0,1)');
    expect(childCircle.getAttribute('fill')).toBe('rgba(0,0,0,1)');
    expect(childCircle.getAttribute('stroke')).toBe('rgba(0,0,0,1)');
  });

  it('#detectCollisions should call getEraserBorders', () => {
    const eraserBorders = [dummyRect, dummyPath];
    spyOn(effaceService, 'getEraserBorders').and.returnValue(eraserBorders);
    effaceService.detectCollisions(mockMouseEvent, true);
    expect(effaceService.getEraserBorders).toHaveBeenCalled();
  });

  it('#detectCollisions should call allDrawingBoardElements', () => {
    renderer.appendChild(effaceService.drawingBoard, dummyPath);
    spyOn(effaceService, 'allDrawingBoardElements').and.returnValue([dummyPath]);
    effaceService.detectCollisions(mockMouseEvent, true);
    expect(effaceService.allDrawingBoardElements).toHaveBeenCalled();
  });

  it('#detectCollisions should push correct elements if currentTarget is null', () => {
    const eraserBorders = [dummyRect, dummyPath];
    effaceService.hoverElementsList = [];
    spyOn(effaceService, 'getEraserBorders').and.returnValue(eraserBorders);
    effaceService.detectCollisions(mockMouseEvent, true);
    expect(effaceService.hoverElementsList.length).toBe(0);
  });

  it('#detectCollisions should push correct elements if currentTarget is not null and erase is true', () => {
    effaceService.drawingBoard.appendChild(dummyPath);
    const eraserBorders = [dummyRect, dummyPath];
    effaceService.eraseList = [];
    spyOn(effaceService, 'getEraserBorders').and.returnValue(eraserBorders);
    effaceService.detectCollisions(mockMouseEvent, true);
    expect(effaceService.eraseList.length).toBe(1);
  });

  it('#detectCollisions should push correct elements if currentTarget is not null and erase is false', () => {
    effaceService.drawingBoard.appendChild(dummyPath);
    effaceService.drawingBoard.appendChild(dummyRect);
    const eraserBorders = [dummyRect, dummyPath];
    effaceService.hoverElementsList = [];
    spyOn(effaceService, 'getEraserBorders').and.returnValue(eraserBorders);
    effaceService.detectCollisions(mockMouseEvent, false);
    expect(effaceService.hoverElementsList.length).toBe(1);
  });

  it('#detectCollisions should put onHover if currentTarget is not null', () => {
    effaceService.drawingBoard.appendChild(dummyPath);
    const eraserBorders = [dummyPath];
    spyOn(effaceService, 'getEraserBorders').and.returnValue(eraserBorders);
    effaceService.detectCollisions(mockMouseEvent, true);
    expect(effaceService.onHover).toBe(true);
  });

  it('#detectCollisions should push correct elements if currentTarget is not null, currentHover is included in allDrawingBoard', () => {
    const dummyCircle = renderer.createElement('circle', 'svg');
    effaceService.drawingBoard.appendChild(dummyPath);
    effaceService.drawingBoard.appendChild(dummyCircle);
    spyOn(effaceService, 'getEraserBorders').and.returnValue([dummyCircle, dummyPath]);
    spyOn(effaceService, 'allDrawingBoardElements').and.returnValue([dummyCircle]);
    effaceService.detectCollisions(mockMouseEvent, false);
    expect(effaceService.hoverElementsList).toEqual([dummyCircle]);
  });

  it('#detectCollisions should push correct elements for currentHover is included in allDrawingBoard hoverElementlist exists already', () => {
    const dummyCircle = renderer.createElement('circle', 'svg');
    effaceService.hoverElementsList = [dummyRect];
    effaceService.drawingBoard.appendChild(dummyPath);
    effaceService.drawingBoard.appendChild(dummyCircle);
    spyOn(effaceService, 'getEraserBorders').and.returnValue([dummyCircle, dummyPath]);
    spyOn(effaceService, 'allDrawingBoardElements').and.returnValue([dummyCircle]);
    effaceService.detectCollisions(mockMouseEvent, false);
    expect(effaceService.hoverElementsList.length).toBe(1);
  });
});
