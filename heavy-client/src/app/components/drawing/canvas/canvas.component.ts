import {
  AfterContentChecked,
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import { AttributsService } from "src/app/services/drawing/attributs.service";
import { AutomaticSaveService } from "src/app/services/drawing/automatic-save.service";
import { CanvasService } from "src/app/services/drawing/canvas.service";
import { MouseEventsService } from "src/app/services/drawing/mouse-events.service";
import { GameService } from "src/app/services/game/game-service.service";
import { LobbyService } from "src/app/services/lobby/lobby.service";
import { SocketService } from "src/app/services/socket/socket.service";
import { TutorialService } from "src/app/services/tutorial/tutorial.service";
import { heightGame, heightLight, widthGame, widthLight } from "../../create-pair/CanvasSize";
import { Colour } from "../colour/colour";
import { Dimensions } from "./dimensions";
import { Information } from "./info";

@Component({
  selector: "app-canvas",
  templateUrl: "./canvas.component.html",
  styleUrls: ["./canvas.component.css"],
})
export class CanvasComponent
  implements OnInit, AfterViewInit, AfterContentChecked, AfterViewChecked {
  @ViewChild("drawingboard", { static: false }) container: ElementRef | null;
  @ViewChild("scrollableWindow", { static: false })
  scrollableWindow: ElementRef | null;

  // canvas size
  widthInit: number = widthGame; //TODO ADJUST
  heightInit: number = heightGame; //TODO ADJUST
  // heightInit: number = 520;
  // widthInit: number = 657.3;

  colourInit: string;

  @Input() workspace: HTMLElement | null;
  @Input() panel: HTMLElement | null;
  @Input() toolbar: HTMLElement | null;
  @Input() height: number = this.heightInit;
  @Input() width: number = this.widthInit;
  @Input() backgroundColor: string = "FFFFFF";
  @Input() heightView: number;
  @Input() widthView: number;

  info: Information;
  colour: Colour;
  dim: Dimensions;
  browserRefresh: boolean;
  sendStroke: boolean;

  constructor(
    public canvasService: CanvasService,
    public mouseEventsService: MouseEventsService,
    public renderer: Renderer2,
    public attributes: AttributsService,
    public automaticSaveService: AutomaticSaveService,
    public gameService: GameService,
    public router: Router,
    public tutorialService: TutorialService,
    private lobbyService: LobbyService,
    private socketService: SocketService
  ) {
    this.colourInit = "FFFFFF";
    this.browserRefresh = false;
    this.sendStroke = false;
  }

  setUpSocketConnection(): void {
    if (this.router.url != "/tutorial") {
      this.socketService.socket.emit("join-game", this.lobbyService.name);
    }

    this.socketService.socket.on("draw", (IDraw: any) => {
      const DRAW = JSON.parse(JSON.stringify(IDraw));
      let color = DRAW.color;
      if (DRAW.isLight) {
        color = this.mouseEventsService.getColorRGB_LEGER(
          DRAW.color.substring(2, 8) + DRAW.color.substring(0, 2)
        ); 
      }

      // always resize with ratio since referentiel is light client canvas
      DRAW["clientX"] *= widthGame / widthLight;
      DRAW["clientY"] *= heightGame / heightLight;

      const clientScroll = this.canvasService.getScrollableWindow();
      DRAW["clientX"] +=
        clientScroll.getBoundingClientRect().left + clientScroll.scrollLeft;
      DRAW["clientY"] +=
        clientScroll.getBoundingClientRect().top + clientScroll.scrollTop;

      let depth = DRAW.depth == null ? -1 : DRAW.depth;
      this.mouseEventsService.callToolService(
        DRAW,
        DRAW.strokeWidth,
        color,
        DRAW.isEraser,
        depth,
        true,
        true
      );
    });

    this.socketService.socket.on("round-end", () => {
      this.canvasService.clearUndoRedoHistory();
      setTimeout(() => {
        this.clearSVG();
      }, 500);
    });

    this.socketService.socket.on("stop-game", () => {
      this.clearSVG();
    });
  }

  clearSVG(): boolean {
    const evt: any = {
      type: "mouseup",
      clientX: 0,
      clientY: 0,
      strokeWidth: 1,
      color: "rgba(0,0,0,1)",
      isLight: false,
      isEraser: false,
      undo: 0,
      depth: -1,
    };
    this.sendStroke = false;
    this.mouseEventsService.callToolService(
      evt,
      evt.strokeWidth,
      evt.color,
      evt.isEraser,
      evt.depth,
      true,
      true
    );
    this.mouseEventsService.resetTracingId();
    const children: HTMLElement[] = [];
    if (this.container) {
      this.canvasService.canvasHasChanges = false;
      this.container.nativeElement.childNodes.forEach((child: HTMLElement) => {
        if (child.tagName !== "filter") {
          children.push(child);
        }
      });
      while (children.length > 0) {
        this.container.nativeElement.removeChild(children.pop());
      }
      return true;
    }
    return false;
  }

  addScrollbar(leftWidth: number): void {
    if (this.workspace && this.scrollableWindow) {
      if (this.height > this.workspace.clientHeight) {
        this.heightView = this.heightInit;
        this.scrollableWindow.nativeElement.classList.add("scrollY");
      } else {
        this.heightView = this.height;
        this.scrollableWindow.nativeElement.classList.remove("scrollY");
      }
      if (this.width > this.workspace.clientWidth - leftWidth) {
        this.widthView = this.widthInit;
        this.scrollableWindow.nativeElement.classList.add("scrollX");
      } else {
        this.widthView = this.width;
        this.scrollableWindow.nativeElement.classList.remove("scrollX");
      }
    }
  }

  getNativeElement(): void {
    this.canvasService.htmlElement = (this
      .container as ElementRef).nativeElement;
    this.canvasService.scrollableWindow = (this
      .scrollableWindow as ElementRef).nativeElement;
  }

  ngOnInit(): void {
    this.canvasService.clearSVGListener().subscribe(() => {
      this.clearSVG();
    });
    this.setUpSocketConnection();
  }

  newBackgroundColour(): void {
    this.backgroundColor =
      this.canvasService.backgroundCanvas.r +
      this.canvasService.backgroundCanvas.g +
      this.canvasService.backgroundCanvas.b;
  }

  ngAfterViewInit(): void {
    this.getNativeElement();
  }

  ngAfterViewChecked(): void {}

  // Adding HostListener fixes a small bug that did not remove properly an element from the svg
  @HostListener("window:keydown")
  @HostListener("window:mouseup")
  ngAfterContentChecked(): void {
    let leftWidth = 0;
    if (this.panel) {
      leftWidth += this.panel.clientWidth;
    }
    if (this.toolbar) {
      leftWidth += this.toolbar.clientWidth;
    }
    // this.heightInit = window.innerHeight;
    // this.widthInit = window.innerWidth - leftWidth;
    this.addScrollbar(leftWidth);
  }

  @HostListener("mousewheel", ["$event"])
  @HostListener("click", ["$event"])
  @HostListener("mousemove", ["$event"])
  @HostListener("mouseout", ["$event"])
  @HostListener("mouseenter", ["$event"])
  @HostListener("mouseleave", ["$event"])
  @HostListener("mousedown", ["$event"])
  @HostListener("mousewheel", ["$event"])
  @HostListener("dblclick", ["$event"])
  @HostListener("document:mouseup", ["$event"])
  @HostListener("document:keydown", ["$event"])
  @HostListener("document:keyup", ["$event"])
  sendMouseEvent(evt: MouseEvent | WheelEvent): void {
    const activeInGame =
      this.gameService.activeTeam && this.gameService.isDrawing;
    const isTutorial: boolean =
      this.router.url === "/tutorial" && this.tutorialService.step == 3;

    if (activeInGame || this.canvasService.isDrawingWordImage || isTutorial) {
      // if (activeInGame || this.canvasService.isDrawingWordImage || this.router.url == "/tutorial" || true) {
      let toolSize = 0;
      let toolColor = "rgba(0,0,0,1)";

      let isEraser = false;
      isEraser =
        this.mouseEventsService.getToolName() == "Eraser" ? true : false;

      if (evt.type == "mousedown") {
        this.sendStroke = true;
        this.tutorialService.goNextStep = true;
      }

      if (this.sendStroke) {
        toolSize = this.mouseEventsService.getToolSize();
        toolColor = this.mouseEventsService.getColor();
        const clientScroll = this.canvasService.getScrollableWindow();

        // set light client as referentiel for canvas sizing
        if (activeInGame) {
          const event = {
            type: evt.type,
            clientX:
              (evt.clientX -
              clientScroll.getBoundingClientRect().left -
              clientScroll.scrollLeft) * widthLight/widthGame,
            clientY:
              (evt.clientY -
              clientScroll.getBoundingClientRect().top -
              clientScroll.scrollTop) * heightLight/heightGame,
            strokeWidth: toolSize,
            color: toolColor,
            isLight: false,
            isEraser: isEraser,
            undo: 0,
            name: this.lobbyService.name,
            depth: -1,
          };
          this.socketService.socket.emit("draw", JSON.stringify(event));
        }
      }
      if (evt.type == "mouseup" || evt.type == 'mouseleave') {
        this.sendStroke = false;
      }
      this.mouseEventsService.callToolService(
        evt,
        toolSize,
        toolColor,
        isEraser,
        -1,
        activeInGame,
        false
      ); //TODO check if in game, so eraser is bootleg one
    }
  }

  onClick(): void {
    if (this.mouseEventsService.toolSelected) {
      this.canvasService.canvasHasChanges = true;
    }
  }
}
