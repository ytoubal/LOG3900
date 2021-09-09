/*tslint:disable: no-magic-numbers for testing values*/
import { Renderer2, RendererFactory2 } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';
import { CommandManager } from 'src/app/components/app/command-manager';
import { IPoint } from 'src/app/components/app/point';
import { Tracing } from 'src/app/components/app/tracing';
import { AttributsService } from './attributs.service';
import { CanvasService } from './canvas.service';
import { DrawPencilService } from './draw-pencil.service';
import { PaletteService } from './palette.service';

describe('Service: DrawPencil', () => {
    let renderer: Renderer2;
    let attributsService: AttributsService;
    let paletteService: PaletteService;
    let pencilService: DrawPencilService;
    let canvasService: CanvasService;
    let manager: CommandManager;
    let mockDrawingBoard: HTMLElement;

    const mockMouseEvent = new MouseEvent('mousedown');
    const mockUp = new MouseEvent('mouseup');
    const mockMove = new MouseEvent('mousemove');
    const mockLeave = new MouseEvent('mouseleave');
    const mockOut = new MouseEvent('mouseout');

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [{ provide: DrawPencilService }]
        });
    });

    beforeEach(inject([RendererFactory2], (rendererFactory: RendererFactory2) => {
        renderer = rendererFactory.createRenderer(null, null);
        paletteService = new PaletteService();
        manager = new CommandManager();
        canvasService = new CanvasService(manager);
        attributsService = new AttributsService();
        pencilService = new DrawPencilService(renderer, attributsService, paletteService, canvasService);
        mockDrawingBoard = document.createElement('svg');
        pencilService.drawingBoard = mockDrawingBoard;
    }));

    it('should create', inject([DrawPencilService], (service: DrawPencilService) => {
        expect(pencilService).toBeTruthy();
    }));

    it('#execute should add a command to the undoHistory array', () => {
        const testTracing = new Tracing(renderer);
        testTracing.tracePath();
        pencilService.tracing = testTracing;
        pencilService.manager = manager;
        const nodeArray: Node[] = [];
        pencilService.execute(nodeArray);
        expect(pencilService.manager.undoHistory.length).toBe(1);
    });

    it('#cancel should add a command to the redoHistory array', () => {
        const testTracing = new Tracing(renderer);
        testTracing.tracePath();
        pencilService.tracing = testTracing;
        pencilService.manager = manager;
        const nodeArray: Node[] = [];
        pencilService.execute(nodeArray);
        pencilService.cancel(nodeArray);
        expect(pencilService.manager.redoHistory.length).toBe(1);
    });

    it('Pushing the mouse button down should call mouseDown in the service', () => {
        spyOn(pencilService, 'mouseDown').withArgs(mockMouseEvent);
        pencilService.callTool(mockMouseEvent);
        expect(pencilService.mouseDown).toHaveBeenCalled();
    });

    it('Moving the mouse should call mouseMove in the service', () => {
        spyOn(pencilService, 'mouseMove').withArgs(mockMove);
        pencilService.callTool(mockMove);
        expect(pencilService.mouseMove).toHaveBeenCalled();
    });

    it('Moving the mouse with mouseDown should call addLine in the service', () => {
        spyOn(pencilService, 'addLine');
        pencilService.mousedown = true;
        pencilService.callTool(mockMove);
        expect(pencilService.addLine).toHaveBeenCalled();
    });

    it('Releasing the mouse button should call mouseUp in the service', () => {
        spyOn(pencilService, 'mouseUp').withArgs();
        pencilService.callTool(mockUp);
        expect(pencilService.mouseUp).toHaveBeenCalled();
    });

    it('Make the mouse leave the target zone should call mouseLeave in the service', () => {
        spyOn(pencilService, 'mouseLeave').withArgs();
        pencilService.callTool(mockLeave);
        expect(pencilService.mouseLeave).toHaveBeenCalled();
    });

    it('Mouse out of the target zone should not call anything', () => {
        spyOn(pencilService, 'mouseLeave').withArgs();
        spyOn(pencilService, 'mouseDown').withArgs(mockMouseEvent);
        spyOn(pencilService, 'mouseUp').withArgs();
        spyOn(pencilService, 'mouseMove').withArgs(mockMove);
        pencilService.callTool(mockOut);
        expect(pencilService.mouseLeave).not.toHaveBeenCalled();
        expect(pencilService.mouseDown).not.toHaveBeenCalled();
        expect(pencilService.mouseUp).not.toHaveBeenCalled();
        expect(pencilService.mouseMove).not.toHaveBeenCalled();
    });

    it('#mouseDown should make mousedown equals true', () => {
        pencilService.newClick = false;
        pencilService.mousedown = false;
        pencilService.mouseDown(mockMouseEvent);
        expect(pencilService.mousedown).toBe(true);
    });

    it('#mouseDown should call boardCopy when newClick is true', () => {
        pencilService.newClick = true;
        pencilService.mousedown = false;
        spyOn(pencilService, 'boardCopy');
        pencilService.mouseDown(mockMouseEvent);
        expect(pencilService.boardCopy).toHaveBeenCalled();
    });

    it('#mouseUp should call stopDrawing even when there is no pathElem', () => {
        spyOn(pencilService, 'stopDrawing');
        pencilService.mouseUp();
        expect(pencilService.stopDrawing).toHaveBeenCalled();
    });

    it('#mouseUp should call stopDrawing even when these is a pathElem', () => {
        pencilService.tracing.pathElem = pencilService.renderer.createElement('path', 'svg');
        spyOn(pencilService, 'stopDrawing');
        pencilService.mouseUp();
        expect(pencilService.stopDrawing).toHaveBeenCalled();
    });

    it('#mouseMove should call updatePositions', () => {
        pencilService.mousedown = true;
        spyOn(pencilService.tracing, 'updatePositions').withArgs(mockMove, pencilService.scrollableWindow);
        pencilService.mouseMove(mockMove);
        expect(pencilService.tracing.updatePositions).toHaveBeenCalled();
    });

    it('#mouseMove should not call updatePositions if !mousedown', () => {
        pencilService.mousedown = false;

        spyOn(pencilService.tracing, 'updatePositions').withArgs(mockMouseEvent,
            pencilService.drawingBoard).and.callThrough();
        pencilService.mouseMove(mockMouseEvent);
        expect(pencilService.tracing.updatePositions).not.toHaveBeenCalled();
    });

    it('#mouseLeave should call stopDrawing', () => {
        spyOn(pencilService, 'stopDrawing');
        pencilService.mouseLeave();
        expect(pencilService.stopDrawing).toHaveBeenCalled();
    });

    it('#stopDrawing should make mousedown equals false', () => {
        pencilService.mousedown = true;
        pencilService.stopDrawing();
        expect(pencilService.mousedown).toBe(false);
    });

    it('#stopDrawing should empty the tracing.pathString', () => {
        pencilService.tracing.pathString = 'NOT EMPTY';
        pencilService.stopDrawing();
        expect(pencilService.tracing.pathString).toBe('');
    });

    it('#stopDrawing should call emptyArraySaved()', () => {
        spyOn(pencilService.tracing, 'emptyArraySaved');
        pencilService.stopDrawing();
        expect(pencilService.tracing.emptyArraySaved).toHaveBeenCalled();
    });

    it('#stopDrawing should call emptyArrayElements', () => {
        spyOn(pencilService, 'emptyArrayElements');
        pencilService.stopDrawing();
        expect(pencilService.emptyArrayElements).toHaveBeenCalled();
    });

    it('#updatePositions should update the positions in the array arraySaved', () => {
        const initialLength = pencilService.tracing.arraySaved.length;
        pencilService.scrollableWindow = pencilService.renderer.createElement('window', 'svg');
        pencilService.tracing.updatePositions(mockMove, pencilService.scrollableWindow);
        expect(pencilService.tracing.arraySaved.length).toBe(initialLength + 1);
    });

    it('#updatePositions should not update the positions if container does not exist', () => {
        const initialLength = pencilService.tracing.arraySaved.length;
        pencilService.tracing.updatePositions(mockMouseEvent, null);
        expect(pencilService.tracing.arraySaved.length).toBe(initialLength);
    });

    it('#updatePathString should update the pathString with the new coordonates', () => {
        const initialPath: string = pencilService.tracing.pathString;
        const point: IPoint = { x: 0, y: 0 };
        pencilService.tracing.arraySaved.push(point);
        pencilService.tracing.updatePathString();
        expect(pencilService.tracing.pathString).not.toBe(initialPath);
    });

    it('#updatePathString should not update the pathString if arraySaved is empty', () => {
        pencilService.tracing.arraySaved = [];
        pencilService.tracing.pathString = 'INITIAL PATHSTRING';
        pencilService.tracing.updatePathString();
        expect(pencilService.tracing.pathString).toBe('INITIAL PATHSTRING');
    });

    it('#updatePathString should give a path with only one coordonate', () => {
        const point: IPoint = { x: 0, y: 0 };
        pencilService.tracing.arraySaved.push(point);
        pencilService.tracing.updatePathString();
        expect(pencilService.tracing.pathString).toBe('M 0 0 L 0 0');
    });

    it('#updatePathString should give a path with two different coordonates', () => {
        const point1: IPoint = { x: 0, y: 0 };
        const point2: IPoint = { x: 0, y: 1 };
        pencilService.tracing.arraySaved.push(point1);
        pencilService.tracing.arraySaved.push(point2);
        pencilService.tracing.updatePathString();
        expect(pencilService.tracing.pathString).toBe('M 0 1 L 0 0');
    });

    it('#addLine should call updatePathString', () => {
        spyOn(pencilService.tracing, 'updatePathString');
        pencilService.addLine();
        expect(pencilService.tracing.updatePathString).toHaveBeenCalled();
    });

    it('#addLine should add one element to array arrayElements', () => {
        const initialLength = pencilService.arrayElements.length;
        pencilService.addLine();
        expect(pencilService.arrayElements.length).toBe(initialLength + 1);
    });

    it('#addLine should call removeLine()', () => {
        spyOn(pencilService, 'removeLine');
        const element: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        pencilService.arrayElements.push(element);
        pencilService.addLine();
        expect(pencilService.removeLine).toHaveBeenCalled();
    });

    it('#addLine should not call removeLine()', () => {
        spyOn(pencilService, 'removeLine');
        pencilService.arrayElements = [];
        pencilService.addLine();
        expect(pencilService.removeLine).not.toHaveBeenCalled();
    });

    it('#removeLine should call emptyArrayElements if arrayElements is not empty', () => {
        spyOn(pencilService, 'emptyArrayElements');
        const element: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        pencilService.arrayElements.push(element);
        pencilService.renderer.appendChild(pencilService.drawingBoard, element);
        pencilService.removeLine();
        expect(pencilService.emptyArrayElements).toHaveBeenCalled();
    });

    it('#removeLine should do nothing if arrayElements is empty', () => {
        spyOn(pencilService, 'emptyArrayElements');
        pencilService.arrayElements = [];
        pencilService.removeLine();
        expect(pencilService.emptyArrayElements).not.toHaveBeenCalled();
    });

    it('#setAttributes should update color', () => {
        pencilService.tracing.attributs.color = '0000001';
        pencilService.paletteService = new PaletteService();
        const nextColour = pencilService.paletteService.stringToColour('FFFFFF1');
        pencilService.paletteService.primaryColour.next(nextColour);
        pencilService.setAttributes();
        expect(pencilService.tracing.attributs.color).toBe('rgba(255,255,255,1)');
    });

    it('#setAttributes should update size', () => {
        pencilService.paletteService = new PaletteService();
        pencilService.tracing.attributs.size = 3;
        pencilService.myTool.attributs.size = 5;
        pencilService.setAttributes();
        expect(pencilService.tracing.attributs.size).toBe(5);
    });

    it('#emptyArrayElement should empty array arrayElements', () => {
        const element: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        pencilService.arrayElements.push(element);
        pencilService.stopDrawing();
        expect(pencilService.arrayElements.length).toBe(0);
    });

    it('#emptyArraySaved should empty array arraySaved', () => {
        const point: IPoint = { x: 0, y: 0 };
        pencilService.tracing.arraySaved.push(point);
        pencilService.stopDrawing();
        expect(pencilService.tracing.arraySaved.length).toBe(0);
    });

    it('#clearTool should reset all attributes', () => {
        pencilService.newClick = true;
        pencilService.mousedown = true;
        pencilService.tracing = new Tracing(pencilService.renderer);
        pencilService.clearTool();
        expect(pencilService.mousedown).toBe(false);
        expect(pencilService.tracing.pathElem).toBeNull();
    });

    it('#clearTool should pop undoBoards and undoHistory if newClick is false', () => {
        pencilService.newClick = false;
        pencilService.mousedown = true;
        pencilService.tracing = new Tracing(pencilService.renderer);
        spyOn(pencilService.manager.undoBoards, 'pop');
        spyOn(pencilService.manager.undoHistory, 'pop');
        pencilService.clearTool();
        expect(pencilService.manager.undoBoards.pop).toHaveBeenCalled();
        expect(pencilService.manager.undoHistory.pop).toHaveBeenCalled();
        expect(pencilService.mousedown).toBe(false);
        expect(pencilService.tracing.pathElem).toBeNull();
    });
});
