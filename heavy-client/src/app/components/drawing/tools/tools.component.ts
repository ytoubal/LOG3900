// tslint:disable-next-line: max-line-length
import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  QueryList,
  Renderer2,
  ViewChildren,
} from "@angular/core";
import { AllToolsService } from "src/app/services/drawing/all-tools.service";
import { AttributsService } from "src/app/services/drawing/attributs.service";
import { CanvasService } from "src/app/services/drawing/canvas.service";
import { ModalService } from "src/app/services/drawing/modal.service";
import { PaletteService } from "src/app/services/drawing/palette.service";
import { ITool } from "../tool-interface/tool";
import { ToolCreator } from "../tool-interface/tool-creator";
import { TranslateService } from "@ngx-translate/core";
import { ThemeService } from "src/app/services/theme/theme.service";
import { TutorialService } from "src/app/services/tutorial/tutorial.service";
import { GameService } from "src/app/services/game/game-service.service";
import { Router } from "@angular/router";
import { LobbyService } from "src/app/services/lobby/lobby.service";
import { SocketService } from "src/app/services/socket/socket.service";
import { PencilTool } from "../tool-interface/pencil-tool";
import { GridService } from "src/app/services/drawing/grid.service";

const INDEX_UNDO = 13;
const INDEX_REDO = 14;

@Component({
  selector: "app-tools",
  templateUrl: "./tools.component.html",
  styleUrls: ["./tools.component.scss"],
  providers: [],
})
export class ToolsComponent implements OnInit, AfterViewInit, AfterViewChecked {
  @Input() panel: HTMLElement | null;
  @ViewChildren("toolBtn") toolBtn: QueryList<ElementRef<HTMLDivElement>>;

  toolMap: Map<string, AllToolsService>;
  keyBindings: Map<string, string>;
  tools: ITool[];
  myTool: ITool;
  currentTool: ITool | null;
  shape: string;
  texture: string;

  constructor(
    private renderer: Renderer2,
    public attributsService: AttributsService,
    public paletteService: PaletteService,
    public canvasService: CanvasService,
    public modal: ModalService,
    public themeService: ThemeService,
    public tutorialService: TutorialService,
    public translate: TranslateService,
    public gameService: GameService,
    public router: Router,
    public lobbyService: LobbyService,
    public socketService: SocketService,
    private gridService: GridService
  ) {}

  setUpSocketConnection(): void {
    this.socketService.socket.on("draw", (draw: any) => {
      const DRAW = JSON.parse(JSON.stringify(draw));
      if (DRAW.undo == 1) {
        this.canvasService.commandManager.undo();
      } else if (DRAW.undo == 2) {
        this.canvasService.commandManager.redo();
      }
    });
  }

  ngOnInit(): void {
    const toolCreator = new ToolCreator();
    toolCreator.initArrayTools();
    this.tools = toolCreator.arrayTools;
    this.attributsService.myTool.subscribe((myTool) => (this.myTool = myTool));
    this.showAttributsPanel(new PencilTool());
    this.currentTool = this.myTool;
    this.keyBindings = new Map<string, string>()
      .set("c", "Pencil")
      .set("e", "Eraser");

    if (!this.canvasService.isDrawingWordImage) {
      this.setUpSocketConnection();
    }
  }

  ngAfterViewInit(): void {}

  ngAfterViewChecked(): void {}

  setActiveTool(tool: ITool): void {
    this.myTool.isActive = false;
    tool.isActive = true;
  }

  showAttributsPanel(tool: ITool): void {
    if (this.tutorialService.step === 2) this.tutorialService.goNextStep = true;
    const isUndoRedoTool = tool.name === "Undo" || tool.name === "Redo";
    this.callUndoRedo(tool);
    if (!isUndoRedoTool) {
      this.setActiveTool(tool);
      if (tool.name === "Grid") {
        this.gridService.gridClicked = true;
      } else {
        this.gridService.gridClicked = false;
      }
      this.attributsService.receiveTool(tool);
      if (this.panel != null) {
        if (
          this.panel.style.display === "none" ||
          this.panel.style.display === ""
        ) {
          this.renderer.setStyle(this.panel, "display", "block");
        } else if (
          this.panel.style.display === "block" &&
          this.currentTool != null
        ) {
          if (tool.name !== this.currentTool.name) {
            // Refrain the panel from closing when selecting a different tool
            this.renderer.setStyle(this.panel, "display", "block");
          }
        }
      }
    }
    this.currentTool = this.myTool;
  }

  getImage(tool: ITool): string {
    switch (tool.name) {
      case "Pencil":
        return "create";
      case "Eraser":
        return "kitchen";
      case "Undo":
        return "undo";
      case "Redo":
        return "redo";
      case "Grid":
        return "grid_on";
    }
  }

  createNewDrawing(evt: KeyboardEvent | null = null): void {
    if (evt) {
      evt.preventDefault();
    }
    this.modal.createNewDrawing();
  }

  openDrawing(evt: KeyboardEvent | null = null): void {
    if (evt) {
      evt.preventDefault();
    }
    this.modal.openDrawing();
  }

  saveDrawing(evt: KeyboardEvent | null = null): void {
    if (evt) {
      evt.preventDefault();
    }
    this.modal.saveDrawing();
  }

  callUndoRedo(tool: ITool): void {
    if (tool.name === "Undo") {
      this.callCommandManager(true);
    } else if (tool.name === "Redo") {
      this.callCommandManager(false);
    }
  }

  // call undo redo if in game with correct turn
  callCommandManager(undo: boolean): void {
    const activeInGame =
      this.gameService.activeTeam && this.gameService.isDrawing;
    if (
      activeInGame ||
      this.canvasService.isDrawingWordImage ||
      this.router.url == "/tutorial"
    ) {
      let command = 0;
      if (undo) {
        this.canvasService.commandManager.undo();
        command = 1;
      } else {
        this.canvasService.commandManager.redo();
        command = 2;
      }
      const IDRAW = {
        type: "",
        clientX: 0,
        clientY: 0,
        strokeWidth: 0,
        color: "",
        isLight: false,
        isEraser: false,
        undo: command,
        name: this.lobbyService.name,
      };
      if (!this.canvasService.isDrawingWordImage && this.router.url != "/tutorial") {
        this.socketService.socket.emit("draw", JSON.stringify(IDRAW));
      }
    }
  }

  // checkCommandSize(): void {
  //   const commandHistoryEmpty = this.canvasService.commandManager.isUndoHistoryEmpty();
  //   const undoHistoryEmpty = this.canvasService.commandManager.isRedoHistoryEmpty();
  //   // if (commandHistoryEmpty) {
  //   //   this.toggleVisibility(false, INDEX_UNDO);
  //   // } else {
  //   //   this.toggleVisibility(true, INDEX_UNDO);
  //   // }
  //   // if (undoHistoryEmpty) {
  //   //   this.toggleVisibility(false, INDEX_REDO);
  //   // } else {
  //   //   this.toggleVisibility(true, INDEX_REDO);
  //   // }
  // }

  // toggleVisibility(isVisible: boolean, index: number): void {
  //   // const toolArray = this.toolBtn.toArray();
  //   // if (isVisible) {
  //   //   this.renderer.setStyle(toolArray[index].nativeElement, 'pointer-events', 'auto');
  //   //   this.renderer.setStyle(toolArray[index].nativeElement, 'opacity', '1');
  //   // } else {
  //   //   this.renderer.setStyle(toolArray[index].nativeElement, 'pointer-events', 'none');
  //   //   this.renderer.setStyle(toolArray[index].nativeElement, 'opacity', '0.3');
  //   // }
  // }

  showAttributsWithString(tool: string): void {
    this.tools.forEach((element) => {
      if (element.name === tool) {
        this.showAttributsPanel(element);
      }
    });
  }
}
