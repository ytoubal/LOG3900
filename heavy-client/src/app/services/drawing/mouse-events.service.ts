import { Injectable, Renderer2, RendererFactory2 } from "@angular/core";
import { Router } from "@angular/router";
import { ITool } from "src/app/components/drawing/tool-interface/tool";
import { AllToolsService } from "./all-tools.service";
import { AttributsService } from "./attributs.service";
import { CanvasService } from "./canvas.service";
import { DrawPencilService } from "./draw-pencil.service";
import { EffaceService } from "./efface.service";
import { GridService } from "./grid.service";
import { PaletteService } from "./palette.service";

@Injectable({
  providedIn: "root",
})
export class MouseEventsService {
  toolMap: Map<string, AllToolsService>;
  myTool: ITool;
  renderer: Renderer2;
  toolSelected: boolean;
  previousTool: string;

  constructor(
    rendererFactory: RendererFactory2,
    public attributsService: AttributsService,
    public paletteService: PaletteService,
    public canvasService: CanvasService,
    private gridService: GridService,
    private router: Router
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.attributsService.myTool.subscribe((myTool) => (this.myTool = myTool));
    const drawPencilService = new DrawPencilService(
      this.renderer,
      attributsService,
      paletteService,
      canvasService
    );
    const effaceService = new EffaceService(
      this.renderer,
      attributsService,
      canvasService
    );

    // this.previousTool = 'Select';
    this.toolSelected = false;
    this.toolMap = new Map<string, AllToolsService>()
      .set("Pencil", drawPencilService)
      .set("Eraser", effaceService);
  }

  resetTracingId() {
    this.toolMap.get("Pencil").resetTracingId();
  }

  getToolSize(): number {
    return this.myTool.attributs.size as number;
  }

  getColor(): string {
    return this.paletteService.getRGBA("primary");
  }

  getColorRGB_LEGER(c: string) {
    return this.paletteService.getRGBA_LEGER(c);
  }

  getToolName(): string {
    return this.myTool.name;
  }

  callToolService(
    evt: MouseEvent | KeyboardEvent | WheelEvent,
    toolSize: number,
    toolColor: string,
    isEraser: boolean,
    depth: number,
    activeInGame: boolean,
    receiving: boolean
  ): boolean {
    const isTutorial: boolean = this.router.url === "/tutorial";
    if (isEraser && !activeInGame && !isTutorial) {
      // only call instant eraser doing create pair-image
      let serviceTool = this.toolMap.get("Eraser");
      if (serviceTool) {
        this.toolSelected = true;
        serviceTool.initElements();
        serviceTool.callTool(evt, toolSize, toolColor, isEraser, depth);

        return true;
      }
    } else if (
      (activeInGame && !this.gridService.gridClicked) ||
      (isTutorial && !this.gridService.gridClicked) ||
      receiving ||
      (this.canvasService.isDrawingWordImage && !this.gridService.gridClicked)
    ) {
      let serviceTool = this.toolMap.get("Pencil");
      if (serviceTool) {
        this.toolSelected = true;
        serviceTool.initElements();
        serviceTool.callTool(evt, toolSize, toolColor, isEraser, depth);

        return true;
      }
    }
    return false;
  }
}
