import { Injectable } from '@angular/core';
import { ICommand } from './command';

@Injectable({
    providedIn: 'root'
})
export class CommandManager {
    redoHistory: ICommand[];
    undoHistory: ICommand[];
    manipulationCopy: Node[];
    redoBoards: Node[][];
    undoBoards: Node[][];

    constructor() {
        this.undoHistory = [];
        this.redoHistory = [];
        this.undoBoards = [];
        this.redoBoards = [];
        this.manipulationCopy = [];
    }

    undo(): void {
        const oldBoard = this.undoBoards.pop() as Node[];
        const oldCommand = this.undoHistory.pop();
        if (oldCommand) {
            oldCommand.cancel(oldBoard);
        }
    }

    redo(): void {
        const oldBoard = this.redoBoards.pop() as Node[];
        const oldUndo = this.redoHistory.pop();
        if (oldUndo) {
            oldUndo.execute(oldBoard);
        }
    }

    isUndoHistoryEmpty(): boolean {
        return this.undoHistory.length <= 0;
    }

    isRedoHistoryEmpty(): boolean {
        return this.redoHistory.length <= 0;
    }
}
