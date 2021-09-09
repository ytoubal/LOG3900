// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { FormsModule } from '@angular/forms';
// import { MatSnackBarModule } from '@angular/material';
// import { MatDialogModule } from '@angular/material/dialog';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { CanvasComponent } from '../canvas/canvas.component';
// import { PaintbrushTool } from '../tool-interface/paintbrush-tool';
// import { PencilTool } from '../tool-interface/pencil-tool';
// import { ShapeTool } from '../tool-interface/shape-tool';
// import { ToolsComponent } from '../tools/tools.component';
// import { AttributsPanelComponent } from './attributs-panel.component';

// const FIVE = 5;
// const SEVENTEEN = 17;
// const EIGHTY = 80;
// const NINETY_NINE = 99;
// const ONE_HUNDRED = 100;

// describe('AttributsPanelComponent', () => {
//   let component: AttributsPanelComponent;
//   let fixture: ComponentFixture<AttributsPanelComponent>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       imports: [FormsModule, MatDialogModule, MatSnackBarModule, BrowserAnimationsModule],
//       declarations: [AttributsPanelComponent, ToolsComponent, CanvasComponent]
//     }).compileComponents();
//   }));

//   beforeEach( () => {
//     fixture = TestBed.createComponent(AttributsPanelComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('#openColourModal should call component.toolColour.openColourModal', () => {
//     spyOn(component.toolColour, 'openColourModal').withArgs(true);
//     component.openColourModal(true);
//     expect(component.toolColour.openColourModal).toHaveBeenCalled();
//   });

//   it('#getImage should return the correct path for the picture', () => {
//     const result = '../../../../assets/img/textures/result.png';
//     expect(component.getImage('result')).toBe(result);
//   });

//   it('should not be able to trigger keyboard events', () => {
//     const mockKeyboardEvent = new KeyboardEvent('keydown', {code: 'KeyA'});
//     spyOn(KeyboardEvent.prototype, 'stopPropagation');
//     component.disableShortcuts(mockKeyboardEvent);
//     expect(KeyboardEvent.prototype.stopPropagation).toHaveBeenCalled();
//   });

//   it('#disableShortcuts should call evt.preventDefault if keyCode is KeyE', () => {
//     const mockKeyboardEvent = new KeyboardEvent('keydown', {code: 'KeyE'});
//     spyOn(mockKeyboardEvent, 'preventDefault');
//     component.disableShortcuts(mockKeyboardEvent);
//     expect(mockKeyboardEvent.preventDefault).toHaveBeenCalled();
//   });

//   it('#disableShortcuts should call evt.preventDefault if keyCode is Equal', () => {
//     const mockKeyboardEvent = new KeyboardEvent('keydown', {code: 'Equal'});
//     spyOn(mockKeyboardEvent, 'preventDefault');
//     component.disableShortcuts(mockKeyboardEvent);
//     expect(mockKeyboardEvent.preventDefault).toHaveBeenCalled();
//   });

//   it('#disableShortcuts should call evt.preventDefault if keyCode is Minus', () => {
//     const mockKeyboardEvent = new KeyboardEvent('keydown', {code: 'Minus'});
//     spyOn(mockKeyboardEvent, 'preventDefault');
//     component.disableShortcuts(mockKeyboardEvent);
//     expect(mockKeyboardEvent.preventDefault).toHaveBeenCalled();
//   });

//   it('#disableShortcuts should call evt.preventDefault if keyCode is Period', () => {
//     const mockKeyboardEvent = new KeyboardEvent('keydown', {code: 'Period'});
//     spyOn(mockKeyboardEvent, 'preventDefault');
//     component.disableShortcuts(mockKeyboardEvent);
//     expect(mockKeyboardEvent.preventDefault).toHaveBeenCalled();
//   });

//   it('#getImage should return the correct path for the picture', () => {
//     const result = '../../../../assets/img/textures/result.png';
//     expect(component.getImage('result')).toBe(result);
//   });

//   it('#sendTool should call AttributsService\'s receiveTool function', () => {
//     component.tools = [];
//     component.tools.push(new PencilTool());
//     spyOn(component.attributsService, 'receiveTool');
//     component.sendTool(component.tools[0]);
//     expect(component.attributsService.receiveTool).toHaveBeenCalledWith(component.tools[0]);
//   });

//   it('#sendTool should bind myTool to Pencil', () => {
//     component.tools = [];
//     component.tools.push(new PencilTool());
//     component.sendTool(component.tools[0]);
//     expect(component.myTool.name).toBe('Pencil');
//   });

//   it('#updateTool should modify the tool\'s attribut and call sendTool', () => {
//     spyOn(component, 'sendTool').and.callThrough();
//     component.tools = [];
//     component.tools.push(new PencilTool());
//     component.updateAttribut(component.tools[0], '10', 'size');
//     expect(component.sendTool).toHaveBeenCalledWith(component.tools[0]);
//     expect(component.myTool.attributs.size).toBe('10');
//   });

//   it('#validateInput should call updateAttribut and updates the attribut value to 10', () => {
//     const shapeTool = new ShapeTool();
//     const nbSides = 10;
//     spyOn(component, 'updateAttribut').withArgs(shapeTool, '10', 'nbSides').and.callThrough();
//     component.validateInput(shapeTool, nbSides, 'nbSides');
//     expect(component.updateAttribut).toHaveBeenCalledWith(shapeTool, '10', 'nbSides');
//     expect(component.myTool.attributs.nbSides).toBe('10');
//   });

//   it('#validateInput should not call openSnackBar', () => {
//     spyOn(component, 'openSnackBar');
//     const shapeTool = new ShapeTool();
//     const value = 10;
//     component.validateInput(shapeTool, value, 'size');
//     expect(component.openSnackBar).not.toHaveBeenCalled();
//   });

//   it('#validateInput should call openSnackBar', () => {
//     spyOn(component, 'openSnackBar').and.callThrough();
//     const shapeTool = new ShapeTool();
//     const nbSides = 14;
//     component.validateInput(shapeTool, nbSides, 'nbSides');
//     expect(component.openSnackBar).toHaveBeenCalled();
//     expect(component.myTool.attributs.nbSides).toBe('3');
//   });

//   it('#validateInput should change nbSides to 3', () => {
//     spyOn(component, 'updateAttribut').and.callThrough();
//     const shapeTool = new ShapeTool();
//     const nbSides = 14;
//     component.validateInput(shapeTool, nbSides, 'nbSides');
//     expect(component.updateAttribut).toHaveBeenCalledWith(shapeTool, '3', 'nbSides');
//     expect(component.myTool.attributs.nbSides).toBe('3');
//   });

//   it('#sendShape should call updateAttribut and modify the shape', () => {
//     spyOn(component, 'updateAttribut').and.callThrough();
//     const tool = new ShapeTool();
//     tool.attributs.shape = 'Rectangle';
//     component.sendShape(tool, 'Ellipse');
//     expect(component.updateAttribut).toHaveBeenCalled();
//     expect(component.myTool.attributs.shape).toBe('Ellipse');
//   });

//   it('#sendTexture should call updateAttribut and modify the texture', () => {
//     spyOn(component, 'updateAttribut').and.callThrough();
//     const tool = new PaintbrushTool();
//     component.sendTexture(tool, 'Fleur');
//     expect(component.updateAttribut).toHaveBeenCalled();
//     expect(component.myTool.attributs.texture).toBe('Fleur');
//   });

//   it('#onRightClick should call event.preventDefault', () => {
//     const e = jasmine.createSpyObj('e', [ 'preventDefault' ]);
//     component.onRightClick(e);
//     expect(e.preventDefault).toHaveBeenCalled();
//   });

//   it('#getHistoryColour should change primaryColour', () => {
//     const answer = component.paletteService.stringToColour('AAAAAA1');
//     spyOn(component.paletteService.primaryColour, 'next').withArgs(answer);
//     component.getHistoryColour('AAAAAA', true);
//     expect(component.paletteService.primaryColour.next).toHaveBeenCalled();
//   });

//   it('#getHistoryColour should change secondaryColour', () => {
//     const answer = component.paletteService.stringToColour('AAAAAA1');
//     spyOn(component.paletteService.secondaryColour, 'next').withArgs(answer);
//     component.getHistoryColour('AAAAAA', false);
//     expect(component.paletteService.secondaryColour.next).toHaveBeenCalled();
//   });

//   it('#updateColours should modify primaryColour if true', () => {
//     const newColour = component.paletteService.stringToColour('AFEEEE');
//     component.updateColours(newColour, true);
//     expect(component.primaryColour).toBe('AFEEEE');
//   });

//   it('#updateColours should not modify secondaryColour if true', () => {
//     const newColour = component.paletteService.stringToColour('AFEEEE');
//     component.updateColours(newColour, true);
//     expect(component.secondaryColour).not.toBe('AFEEEE');
//   });

//   it('#updateColours should modify secondaryColour if false', () => {
//     const newColour = component.paletteService.stringToColour('AFEEEE');
//     component.updateColours(newColour, false);
//     expect(component.secondaryColour).toBe('AFEEEE');
//   });

//   it('#updateColours should not modify primaryColour if false', () => {
//     const newColour = component.paletteService.stringToColour('AFEEEE');
//     component.updateColours(newColour, false);
//     expect(component.primaryColour).not.toBe('AFEEEE');
//   });

//   it('#openSnackBar snackbar.open is called', () => {
//     spyOn(component.snackBar, 'open').withArgs('hello', 'ok', {duration: 5000});
//     component.openSnackBar('hello', 'ok');
//     expect(component.snackBar.open).toHaveBeenCalled();
//   });

//   it('#keyEvent sets newSize if gridSize < 10 and calls udpateGrid', () => {
//     const mockKeyboardEvent = new KeyboardEvent('keydown', {key: 'g'});
//     spyOn(component.gridService, 'setGrid');
//     component.keyEvent(mockKeyboardEvent);
//     expect(component.gridService.setGrid).toHaveBeenCalled();
//   });

//   it('#keyEvent + sets newSize if gridSize < 10 and doesnt call udpateGrid', () => {
//     component.canvasService.gridActive = false;
//     component.gridService.canvasService.htmlElement = document.createElement('svg');
//     component.gridService.setGrid(); // append the grid before so theres something to remove
//     component.gridService.gridSize = 2;
//     component.canvasService.gridActive = false;
//     const mockKeyboardEvent = new KeyboardEvent('keydown', {key: '+'});
//     spyOn(component.gridService, 'updateGrid');
//     component.keyEvent(mockKeyboardEvent);
//     expect(component.gridService.gridSize).toBe(2);
//     expect(component.gridService.updateGrid).not.toHaveBeenCalled();
//   });

//   it('#keyEvent + sets newSize if gridSize < 95 and calls udpateGrid', () => {
//     component.canvasService.gridActive = false;
//     component.gridService.canvasService.htmlElement = document.createElement('svg');
//     component.gridService.setGrid(); // append the grid before so theres something to remove
//     component.canvasService.gridActive = true;
//     component.gridService.gridSize = EIGHTY;
//     const mockKeyboardEvent = new KeyboardEvent('keydown', {key: '+'});
//     spyOn(component.gridService, 'updateGrid');
//     component.keyEvent(mockKeyboardEvent);
//     expect(component.gridService.gridSize).toBe(EIGHTY);
//     expect(component.gridService.updateGrid).toHaveBeenCalled();
//   });

//   it('#keyEvent + sets newSize if gridSize > 95 and calls udpateGrid', () => {
//     component.canvasService.gridActive = false;
//     component.gridService.canvasService.htmlElement = document.createElement('svg');
//     component.gridService.setGrid(); // append the grid before so theres something to remove
//     component.canvasService.gridActive = true;
//     component.gridService.gridSize = NINETY_NINE;
//     const mockKeyboardEvent = new KeyboardEvent('keydown', {key: '+'});
//     spyOn(component.gridService, 'updateGrid');
//     component.keyEvent(mockKeyboardEvent);
//     expect(component.gridService.gridSize).toBe(NINETY_NINE);
//     expect(component.gridService.updateGrid).toHaveBeenCalled();
//   });

//   it('#keyEvent + sets newSize if gridSize === 100 and calls udpateGrid', () => {
//     component.canvasService.gridActive = false;
//     component.gridService.canvasService.htmlElement = document.createElement('svg');
//     component.gridService.setGrid(); // append the grid before so theres something to remove
//     component.canvasService.gridActive = true;
//     component.gridService.gridSize = ONE_HUNDRED;
//     const mockKeyboardEvent = new KeyboardEvent('keydown', {key: '+'});
//     spyOn(component.gridService, 'updateGrid');
//     component.keyEvent(mockKeyboardEvent);
//     expect(component.gridService.gridSize).toBe(ONE_HUNDRED);
//     expect(component.gridService.updateGrid).toHaveBeenCalled();
//   });

//   it('#keyEvent - sets newSize if gridSize < 10 and doesnt call udpateGrid', () => {
//     component.canvasService.gridActive = false;
//     component.gridService.canvasService.htmlElement = document.createElement('svg');
//     component.gridService.setGrid(); // append the grid before so theres something to remove
//     component.gridService.gridSize = 2;
//     component.canvasService.gridActive = false;
//     const mockKeyboardEvent = new KeyboardEvent('keydown', {key: '-'});
//     spyOn(component.gridService, 'updateGrid');
//     component.keyEvent(mockKeyboardEvent);
//     expect(component.gridService.gridSize).toBe(2);
//     expect(component.gridService.updateGrid).not.toHaveBeenCalled();
//   });

//   it('#keyEvent - sets newSize if gridSize < 10 and calls udpateGrid', () => {
//     component.canvasService.gridActive = false;
//     component.gridService.canvasService.htmlElement = document.createElement('svg');
//     component.gridService.setGrid(); // append the grid before so theres something to remove
//     component.canvasService.gridActive = true;
//     component.gridService.gridSize = 2;
//     const mockKeyboardEvent = new KeyboardEvent('keydown', {key: '-'});
//     spyOn(component.gridService, 'updateGrid');
//     component.keyEvent(mockKeyboardEvent);
//     expect(component.gridService.gridSize).toBe(2);
//     expect(component.gridService.updateGrid).toHaveBeenCalled();
//   });

//   it('#keyEvent - sets newSize if gridSize > 10 and calls udpateGrid', () => {
//     component.canvasService.gridActive = false;
//     component.gridService.canvasService.htmlElement = document.createElement('svg');
//     component.gridService.setGrid(); // append the grid before so theres something to remove
//     component.canvasService.gridActive = true;
//     component.gridService.gridSize = SEVENTEEN;
//     const mockKeyboardEvent = new KeyboardEvent('keydown', {key: '-'});
//     spyOn(component.gridService, 'updateGrid');
//     component.keyEvent(mockKeyboardEvent);
//     expect(component.gridService.gridSize).toBe(SEVENTEEN);
//     expect(component.gridService.updateGrid).toHaveBeenCalled();
//   });

//   it('#keyEvent - sets newSize if gridSize === 5 and calls udpateGrid', () => {
//     component.canvasService.gridActive = false;
//     component.gridService.canvasService.htmlElement = document.createElement('svg');
//     component.gridService.setGrid(); // append the grid before so theres something to remove
//     component.canvasService.gridActive = true;
//     component.gridService.gridSize = FIVE;
//     const mockKeyboardEvent = new KeyboardEvent('keydown', {key: '-'});
//     spyOn(component.gridService, 'updateGrid');
//     component.keyEvent(mockKeyboardEvent);
//     expect(component.gridService.gridSize).toBe(FIVE);
//     expect(component.gridService.updateGrid).toHaveBeenCalled();
//   });
// });
