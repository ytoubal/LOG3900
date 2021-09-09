import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ITool } from 'src/app/components/drawing/tool-interface/tool';
import { ToolCreator } from 'src/app/components/drawing/tool-interface/tool-creator';

@Injectable({
  providedIn: 'root'
})
export class AttributsService {
  attributs: BehaviorSubject<string>[];
  myTool: BehaviorSubject<ITool>;
  tools: ITool[];

  constructor() {
    const toolCreator = new ToolCreator();
    toolCreator.initArrayTools();
    this.tools = toolCreator.arrayTools;
    this.myTool = new BehaviorSubject(this.tools[0]);
  }

  receiveTool(tool: ITool): void {
    this.myTool.next(tool);
  }
}
