import { ElementRef, QueryList } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { CanvasService } from 'src/app/services/index/canvas.service';
import { ICommand } from '../command';
import { CommandManager } from '../command-manager';
import { RedoTool } from '../tool-interface/redo-tool';
import { SelectTool } from '../tool-interface/select-tool';
import { SettingsTool } from '../tool-interface/settings-tool';
import { ShapeTool } from '../tool-interface/shape-tool';
import { ITool } from '../tool-interface/tool';
import { ToolCreator } from '../tool-interface/tool-creator';
import { UndoTool } from '../tool-interface/undo-tool';
import { ToolsComponent } from './tools.component';

describe('ToolsComponent', () => {
  let component: ToolsComponent;
  let fixture: ComponentFixture<ToolsComponent>;
  let mockPanel: HTMLElement;
  let manager: CommandManager;
  let mockCommand: ICommand;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule],
      declarations: [ToolsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    mockPanel = document.createElement('div');
    component.panel = mockPanel;
    manager = new CommandManager();
    component.canvasService = new CanvasService(manager);
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#setActiveTool should set the property of isActive to true', () => {
    const tool = component.tools[0];
    tool.isActive = false;
    component.setActiveTool(tool);
    expect(tool.isActive).toBe(true);
  });

  it('#getImage should return the correct path for the picture in lower case', () => {
    const result = '../../../../assets/img/tools/shape.png';
    component.tools = [
      { name: 'Shape', nameFR: 'Forme', attributs: {}, shortcut: '', isActive: false }
    ];
    expect(component.getImage(component.tools[0])).toBe(result);
  });

  it('#hideAttributsPanel should not change panel display to none and return false if it does not exists', () => {
    component.panel = null;
    expect(component.hideAttributsPanel()).toBe(false);
  });

  it('#hideAttributsPanel should change panel display to none and return true if it does exists', () => {
    const panel = component.panel as HTMLElement;
    panel.style.display = 'block';
    expect(component.hideAttributsPanel()).toBe(true);
    expect(panel.style.display).toBe('none');
  });

  it('#showAttributsPanel should not call setActiveTool and attributsService.receiveTool() if tool is undo', () => {
    const tool = new UndoTool();
    component.panel = null;
    spyOn(component, 'setActiveTool');
    spyOn(component.attributsService, 'receiveTool');
    component.showAttributsPanel(tool);
    expect(component.setActiveTool).not.toHaveBeenCalled();
    expect(component.attributsService.receiveTool).not.toHaveBeenCalled();
  });

  it('#showAttributsPanel should not modify the panel css if the panel does not exist', () => {
    component.panel = null;
    spyOn(component, 'hideAttributsPanel');
    component.showAttributsPanel(component.tools[0]);
    expect(component.panel).toBe(null);
  });

  it('#showAttributsPanel should call setActiveTool if the panel is null or not', () => {
    spyOn(component, 'setActiveTool').withArgs(component.tools[0]);
    component.showAttributsPanel(component.tools[0]);
    expect(component.setActiveTool).toHaveBeenCalledWith(component.tools[0]);
    component.panel = null;
    component.showAttributsPanel(component.tools[0]);
    expect(component.setActiveTool).toHaveBeenCalledWith(component.tools[0]);
  });

  it('#showAttributsPanel should call AttributsService receiveTool if the panel is null or not', () => {
    spyOn(component.attributsService, 'receiveTool').withArgs(component.tools[0]);
    component.showAttributsPanel(component.tools[0]);
    expect(component.attributsService.receiveTool).toHaveBeenCalledWith(component.tools[0]);
    component.panel = null;
    component.showAttributsPanel(component.tools[0]);
    expect(component.attributsService.receiveTool).toHaveBeenCalledWith(component.tools[0]);
  });

  it('#showAttributsPanel should replace currentTool with myTool if the panel is null or not', () => {
    component.currentTool = component.tools[2];
    component.showAttributsPanel(component.tools[0]);
    expect(component.currentTool).toBe(component.myTool);
    expect(component.currentTool).toBe(component.tools[0]);
    component.panel = null;
    component.showAttributsPanel(component.tools[0]);
    expect(component.currentTool).toBe(component.myTool);
  });

  it('#showAttributsPanel should change panel display to block if the panel exists and it was set to none', () => {
    const panel = component.panel as HTMLElement;
    panel.style.display = 'none';
    component.showAttributsPanel(component.tools[0]);
    expect(panel.style.display).toBe('block');
  });

  it('#showAttributsPanel should change panel display to block if the panel exists and it was set to empty', () => {
    const panel = component.panel as HTMLElement;
    panel.style.display = '';
    component.showAttributsPanel(component.tools[0]);
    expect(panel.style.display).toBe('block');
  });

  it('#showAttributsPanel should not change panel display or call hideAttributs if panel display is block but currentTool is null', () => {
    const panel = component.panel as HTMLElement;
    panel.style.display = 'block';
    const previousStyle = panel.style.display;
    component.currentTool = null;
    spyOn(component, 'hideAttributsPanel');
    component.showAttributsPanel(component.tools[0]);
    expect(component.hideAttributsPanel).not.toHaveBeenCalled();
    expect(panel.style.display).toBe(previousStyle);
  });

  it('#showAttributsPanel should change panel display to block if tool names differs', () => {
    const panel = component.panel as HTMLElement;
    panel.style.display = 'block';
    component.currentTool = component.tools[1];
    component.currentTool.name = 'Shape';
    spyOn(component, 'hideAttributsPanel');
    component.showAttributsPanel(component.tools[0]);
    expect(component.hideAttributsPanel).not.toHaveBeenCalled();
    expect(panel.style.display).toBe('block');
  });

  it('#showAttributsPanel should call hideAttributsPanel if tool names does not differ', () => {
    const panel = component.panel as HTMLElement;
    panel.style.display = 'block';
    const tool = component.tools[0];
    component.currentTool = tool;
    spyOn(component, 'hideAttributsPanel');
    component.showAttributsPanel(tool);
    expect(component.hideAttributsPanel).toHaveBeenCalled();
  });

  it('#exportDrawing should call Modal\'s exportDrawing', () => {
    spyOn(component.modal, 'exportDrawing');
    const mockKeyboardEvent = new KeyboardEvent('keypress', { key: 'o' });
    spyOn(mockKeyboardEvent, 'preventDefault');
    component.exportDrawing();
    expect(mockKeyboardEvent.preventDefault).not.toHaveBeenCalled();
    expect(component.modal.exportDrawing).toHaveBeenCalled();
  });

  it('#createNewDrawing should call Modal\'s createNewDrawing', () => {
    spyOn(component.modal, 'createNewDrawing');
    const mockKeyboardEvent = new KeyboardEvent('keypress', { key: 'o' });
    spyOn(mockKeyboardEvent, 'preventDefault');
    component.createNewDrawing();
    expect(mockKeyboardEvent.preventDefault).not.toHaveBeenCalled();
    expect(component.modal.createNewDrawing).toHaveBeenCalled();
  });

  it('#openDrawing should call Modal\'s openDrawing', () => {
    spyOn(component.modal, 'openDrawing');
    const mockKeyboardEvent = new KeyboardEvent('keypress', { key: 'g' });
    spyOn(mockKeyboardEvent, 'preventDefault');
    component.openDrawing();
    expect(mockKeyboardEvent.preventDefault).not.toHaveBeenCalled();
    expect(component.modal.openDrawing).toHaveBeenCalled();
  });

  it('#saveDrawing should call Modal\'s saveDrawing', () => {
    spyOn(component.modal, 'saveDrawing');
    const mockKeyboardEvent = new KeyboardEvent('keypress', { key: 's' });
    spyOn(mockKeyboardEvent, 'preventDefault');
    component.saveDrawing();
    expect(mockKeyboardEvent.preventDefault).not.toHaveBeenCalled();
    expect(component.modal.saveDrawing).toHaveBeenCalled();
  });

  it('#exportDrawing should call Modal\'s exportDrawing with shortcut', () => {
    spyOn(component.modal, 'exportDrawing');
    const mockKeyboardEvent = new KeyboardEvent('keypress', { key: 'e' });
    spyOn(mockKeyboardEvent, 'preventDefault');
    component.exportDrawing(mockKeyboardEvent);
    expect(mockKeyboardEvent.preventDefault).toHaveBeenCalled();
    expect(component.modal.exportDrawing).toHaveBeenCalled();
  });

  it('#createNewDrawing should call Modal\'s createNewDrawing with shortcut', () => {
    spyOn(component.modal, 'createNewDrawing');
    const mockKeyboardEvent = new KeyboardEvent('keypress', { key: 'o' });
    spyOn(mockKeyboardEvent, 'preventDefault');
    component.createNewDrawing(mockKeyboardEvent);
    expect(mockKeyboardEvent.preventDefault).toHaveBeenCalled();
    expect(component.modal.createNewDrawing).toHaveBeenCalled();
  });

  it('#openDrawing should call Modal\'s openDrawing', () => {
    spyOn(component.modal, 'openDrawing');
    const mockKeyboardEvent = new KeyboardEvent('keypress', { key: 'g' });
    spyOn(mockKeyboardEvent, 'preventDefault');
    component.openDrawing(mockKeyboardEvent);
    expect(mockKeyboardEvent.preventDefault).toHaveBeenCalled();
    expect(component.modal.openDrawing).toHaveBeenCalled();
  });

  it('#saveDrawing should call Modal\'s saveDrawing', () => {
    spyOn(component.modal, 'saveDrawing');
    const mockKeyboardEvent = new KeyboardEvent('keypress', { key: 's' });
    spyOn(mockKeyboardEvent, 'preventDefault');
    component.saveDrawing(mockKeyboardEvent);
    expect(mockKeyboardEvent.preventDefault).toHaveBeenCalled();
    expect(component.modal.saveDrawing).toHaveBeenCalled();
  });

  it('#callUndoRedo should not call callCommandManager if tool is not undo or redo', () => {
    const tool = new SelectTool();
    spyOn(component, 'callCommandManager');
    component.callUndoRedo(tool);
    expect(component.callCommandManager).not.toHaveBeenCalled();
  });

  it('#callUndoRedo should call callCommandManager with args true if tool is undo', () => {
    const tool = new UndoTool();
    spyOn(component, 'callCommandManager').withArgs(true);
    component.callUndoRedo(tool);
    expect(component.callCommandManager).toHaveBeenCalledWith(true);
  });

  it('#callUndoRedo should call callCommandManager with args false if tool is redo', () => {
    const tool = new RedoTool();
    spyOn(component, 'callCommandManager').withArgs(false);
    component.callUndoRedo(tool);
    expect(component.callCommandManager).toHaveBeenCalledWith(false);
  });

  it('#keyEvent should not call showAttributsWithString if key code is not bind in the map', () => {
    const mockKeyboardEvent = new KeyboardEvent('keypress', { key: '10' });
    spyOn(component, 'showAttributsWithString');
    component.keyEvent(mockKeyboardEvent);
    expect(component.showAttributsWithString).not.toHaveBeenCalled();
  });

  it('#keyEvent should call showAttributsWithString if key code is bind in the map', () => {
    const mockKeyboardEvent = new KeyboardEvent('keypress', { key: 'c' });
    spyOn(component, 'showAttributsWithString');
    component.keyEvent(mockKeyboardEvent);
    expect(component.showAttributsWithString).toHaveBeenCalled();
  });

  it('#keyEvent should call showAttributsWithString and selectShape if key code is bind to the shape tool in the map', () => {
    const mockKeyboardEvent = new KeyboardEvent('keypress', { key: '1' });
    spyOn(component, 'showAttributsWithString');
    spyOn(component, 'selectShape');
    component.keyEvent(mockKeyboardEvent);
    expect(component.showAttributsWithString).toHaveBeenCalled();
    expect(component.selectShape).toHaveBeenCalled();
  });

  it('#keyEvent should call callCommandManager with args true', () => {
    const mockKeyboardEvent = new KeyboardEvent('keypress', { code: 'KeyZ', ctrlKey: true, shiftKey: false });
    spyOn(component, 'callCommandManager').withArgs(true);
    component.keyEvent(mockKeyboardEvent);
    expect(component.callCommandManager).toHaveBeenCalledWith(true);
  });

  it('#keyEvent should call callCommandManager with args false', () => {
    const mockKeyboardEvent = new KeyboardEvent('keypress', { code: 'KeyZ', ctrlKey: true, shiftKey: true });
    spyOn(component, 'callCommandManager').withArgs(false);
    component.keyEvent(mockKeyboardEvent);
    expect(component.callCommandManager).toHaveBeenCalledWith(false);
  });

  it('#toggleVisibility should set style attributs such as pointer-events at auto and opacity at 1', () => {
    const mockToolBtn: QueryList<ElementRef<HTMLDivElement>> = new QueryList();
    const div = document.createElement('div');
    const elementRef = new ElementRef<HTMLDivElement>(div);
    const style = 'pointer-events: auto; opacity: 1;';
    mockToolBtn.reset([elementRef]);
    component.toolBtn = mockToolBtn;
    component.toggleVisibility(true, 0);
    const result = mockToolBtn.toArray()[0].nativeElement.getAttribute('style');
    expect(result).toBe(style);
  });

  it('#toggleVisibility should set style attributs such as pointer-events at none and opacity at 0.3', () => {
    const mockToolBtn: QueryList<ElementRef<HTMLDivElement>> = new QueryList();
    const div = document.createElement('div');
    const elementRef = new ElementRef<HTMLDivElement>(div);
    const style = 'pointer-events: none; opacity: 0.3;';
    mockToolBtn.reset([elementRef]);
    component.toolBtn = mockToolBtn;
    component.toggleVisibility(false, 0);
    const result = mockToolBtn.toArray()[0].nativeElement.getAttribute('style');
    expect(result).toBe(style);
  });

  beforeEach(() => {
    mockCommand = {
      execute(): void {
        console.log('execute');
      },
      cancel(): void {
        console.log('cancel');
      }
    };
  });

  it('#callCommandManager should call checkCommandSize()', () => {
    component.canvasService.commandManager.undoHistory = [];
    component.canvasService.commandManager.undoBoards = [];
    component.canvasService.commandManager.redoHistory = [];
    component.canvasService.commandManager.redoBoards = [];
    spyOn(component, 'checkCommandSize');
    component.callCommandManager(false);
    expect(component.checkCommandSize).toHaveBeenCalled();
  });

  it('#callCommandManager should call commandManager.undo() but not commandManager.redo()', () => {
    component.canvasService.commandManager.undoHistory = [];
    component.canvasService.commandManager.redoHistory = [];
    component.canvasService.commandManager.undoHistory.push(mockCommand);
    spyOn(component.canvasService.commandManager, 'undo').and.callThrough();
    spyOn(component.canvasService.commandManager, 'redo').and.callThrough();
    spyOn(component, 'checkCommandSize');
    component.callCommandManager(true);
    expect(component.canvasService.commandManager.undo).toHaveBeenCalled();
    expect(component.canvasService.commandManager.redo).not.toHaveBeenCalled();
  });

  it('#callCommandManager should call commandManager.undo() but not commandManager.redo()', () => {
    component.canvasService.commandManager.undoHistory = [];
    component.canvasService.commandManager.redoHistory = [];
    component.canvasService.commandManager.redoHistory.push(mockCommand);
    spyOn(component.canvasService.commandManager, 'undo').and.callThrough();
    spyOn(component.canvasService.commandManager, 'redo').and.callThrough();
    spyOn(component, 'checkCommandSize');
    component.callCommandManager(false);
    expect(component.canvasService.commandManager.undo).not.toHaveBeenCalled();
    expect(component.canvasService.commandManager.redo).toHaveBeenCalled();
  });

  it('#checkCommandSize should call commandManager.isUndoHistoryEmpty() and commandManager.isRedoHistoryEmpty()', () => {
    component.canvasService.commandManager.undoHistory = [];
    component.canvasService.commandManager.redoHistory = [];
    spyOn(component.canvasService.commandManager, 'isUndoHistoryEmpty').and.callThrough();
    spyOn(component.canvasService.commandManager, 'isRedoHistoryEmpty').and.callThrough();
    component.checkCommandSize();
    expect(component.canvasService.commandManager.isUndoHistoryEmpty).toHaveBeenCalled();
    expect(component.canvasService.commandManager.isRedoHistoryEmpty).toHaveBeenCalled();
  });

  it('#checkCommandSize should call toggleVisibility() if undoHistory is not empty', () => {
    const INDEX_UNDO = 13;
    const INDEX_REDO = 14;
    component.canvasService.commandManager.undoHistory = [];
    component.canvasService.commandManager.redoHistory = [];
    component.canvasService.commandManager.undoHistory.push(mockCommand);
    spyOn(component, 'toggleVisibility').withArgs(false, INDEX_REDO).and.returnValue()
                                        .withArgs(true, INDEX_UNDO);
    component.checkCommandSize();
    expect(component.canvasService.commandManager.isUndoHistoryEmpty()).toBe(false);
    expect(component.canvasService.commandManager.isRedoHistoryEmpty()).toBe(true);
    expect(component.toggleVisibility).toHaveBeenCalledWith(true, INDEX_UNDO);
  });

  it('#checkCommandSize should call toggleVisibility() if redoHistory is not empty', () => {
    const INDEX_UNDO = 13;
    const INDEX_REDO = 14;
    component.canvasService.commandManager.undoHistory = [];
    component.canvasService.commandManager.redoHistory = [];
    component.canvasService.commandManager.redoHistory.push(mockCommand);
    spyOn(component, 'toggleVisibility').withArgs(false, INDEX_UNDO).and.returnValue()
                                        .withArgs(true, INDEX_REDO);
    component.checkCommandSize();
    expect(component.canvasService.commandManager.isUndoHistoryEmpty()).toBe(true);
    expect(component.canvasService.commandManager.isRedoHistoryEmpty()).toBe(false);
    expect(component.toggleVisibility).toHaveBeenCalledWith(true, INDEX_REDO);
  });

  it('#checkCommandSize should call toggleVisibility() if redoHistory is empty', () => {
    const INDEX_UNDO = 13;
    const INDEX_REDO = 14;
    component.canvasService.commandManager.undoHistory = [];
    component.canvasService.commandManager.redoHistory = [];
    spyOn(component, 'toggleVisibility').withArgs(false, INDEX_UNDO).and.returnValue()
                                        .withArgs(false, INDEX_REDO);
    component.checkCommandSize();
    expect(component.canvasService.commandManager.isUndoHistoryEmpty()).toBe(true);
    expect(component.canvasService.commandManager.isRedoHistoryEmpty()).toBe(true);
    expect(component.toggleVisibility).toHaveBeenCalledWith(false, INDEX_REDO);
  });

  beforeEach(() => {
    component.tools.push(new ShapeTool() as ITool);
  });

  it('#selectShape should not change panel\'s display style to block if panel is null', () => {
    component.panel = null;
    component.currentTool = component.tools[0];
    component.selectShape('1');
    expect(component.panel).toBe(null);
  });

  it('#selectShape should change panel\'s display style to block if panel is not null', () => {
    const panel = component.panel as HTMLElement;
    component.currentTool = component.tools[0];
    component.selectShape('1');
    expect(panel.style.display).toBe('block');
  });

  it('#selectShape should share Rectangle shape data with AttributsService', () => {
    component.currentTool = component.tools[0];
    component.selectShape('1');
    expect(component.currentTool.attributs.shape).toEqual(component.attributsService.myTool.value.attributs.shape);
  });

  it('#selectShape should share Ellipse shape data with AttributsService', () => {
    component.currentTool = component.tools[0];
    component.selectShape('2');
    expect(component.currentTool.attributs.shape).toEqual(component.attributsService.myTool.value.attributs.shape);
  });

  it('#selectShape should share Polygone shape data with AttributsService', () => {
    component.currentTool = component.tools[0];
    component.selectShape('3');
    expect(component.currentTool.attributs.shape).toEqual(component.attributsService.myTool.value.attributs.shape);
  });

  it('#selectShape should not modify currentTool shape attributs to an empty string', () => {
    component.currentTool = component.tools[0];
    component.selectShape('8');
    expect(component.currentTool.attributs.shape).not.toEqual('');
  });

  it('#selectShape should not call AttributsService receiveTool if shape is an empty string', () => {
    component.currentTool = component.tools[0];
    spyOn(component.attributsService, 'receiveTool');
    component.selectShape('8');
    expect(component.attributsService.receiveTool).not.toHaveBeenCalled();
  });

  beforeEach(() => {
    const toolCreator = new ToolCreator();
    toolCreator.initArrayTools();
    const tools = toolCreator.arrayTools;
    component.tools = tools;
  });

  it('#showAttributsWithString should call showAttributsPanel if tool exists', () => {
    spyOn(component, 'showAttributsPanel');
    const name = 'Pencil';
    component.showAttributsWithString(name);
    expect(component.showAttributsPanel).toHaveBeenCalled();
  });

  it('#showAttributsWithString should not call showAttributsPanel if tool does not exist', () => {
    spyOn(component, 'showAttributsPanel');
    const name = 'Hammer';
    component.showAttributsWithString(name);
    expect(component.showAttributsPanel).not.toHaveBeenCalled();
  });

  // tool-creator.ts
  it('#tool should return null if tool name does not exist', () => {
    const toolCreator = new ToolCreator();
    expect(toolCreator.tool('Hammer')).toBe(null);
  });

  it('#tool should return SettingsTool if tool name is Settings', () => {
    const toolCreator = new ToolCreator();
    expect(toolCreator.userAction('Settings')).toEqual(jasmine.any(SettingsTool));
  });

// tslint:disable-next-line: max-file-line-count
});
