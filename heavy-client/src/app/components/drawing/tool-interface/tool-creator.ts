import { EraserTool } from './eraser-tool';
import { PencilTool } from './pencil-tool';
import { RedoTool } from './redo-tool';
import { SettingsTool } from './settings-tool';
import { ITool } from './tool';
import { UndoTool } from './undo-tool';

export class ToolCreator {

    arrayTools: ITool[];

    constructor() {
        this.arrayTools = [];
    }

    tool(name: string): ITool | null {
        switch (name) {
            case 'Pencil':
                return new PencilTool();
            case 'Eraser':
                return new EraserTool();
            case 'Grid':
                return new SettingsTool();
        }
        return this.userAction(name);
    }

    userAction(name: string): ITool | null {
        switch (name) {
            case 'Undo':
                return new UndoTool();
            case 'Redo':
                return new RedoTool();
            case 'Grid':
                return new SettingsTool();
        }
        return null;
    }

    initArrayTools(): void {
        this.arrayTools.push(this.tool('Pencil') as ITool);
        this.arrayTools.push(this.tool('Eraser') as ITool);
        this.arrayTools.push(this.tool('Undo') as ITool);
        this.arrayTools.push(this.tool('Redo') as ITool);
        this.arrayTools.push(this.tool('Grid') as ITool);
    }
}
