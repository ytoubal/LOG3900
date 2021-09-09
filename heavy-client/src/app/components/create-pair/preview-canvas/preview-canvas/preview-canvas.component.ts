import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  Input,
  Renderer2,
  HostListener,
} from "@angular/core";
import { Router } from "@angular/router";
import { Dimensions } from "src/app/components/drawing/canvas/dimensions";
import { Information } from "src/app/components/drawing/canvas/info";
import { Colour } from "src/app/components/drawing/colour/colour";
import { CreatePairService } from "src/app/services/create-pair/create-pair.service";
import { AttributsService } from "src/app/services/drawing/attributs.service";
import { AutomaticSaveService } from "src/app/services/drawing/automatic-save.service";
import { CanvasService } from "src/app/services/drawing/canvas.service";
import { MouseEventsService } from "src/app/services/drawing/mouse-events.service";
import { GameService } from "src/app/services/game/game-service.service";
import { LobbyService } from "src/app/services/lobby/lobby.service";
import { SocketService } from "src/app/services/socket/socket.service";
import { TutorialService } from "src/app/services/tutorial/tutorial.service";
import { widthCreate, heightCreate } from "../../CanvasSize";

@Component({
  selector: "app-preview-canvas",
  templateUrl: "./preview-canvas.component.html",
  styleUrls: ["./preview-canvas.component.scss"],
})
export class PreviewCanvasComponent implements OnInit {
  @ViewChild("drawingboard", { static: false }) container: ElementRef | null;
  @ViewChild("scrollableWindow", { static: false })
  scrollableWindow: ElementRef | null;

  // canvas size
  widthInit: number = widthCreate;
  heightInit: number = heightCreate;

  // widthLight: number = 900;
  // heightLight: number = 712;

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
    private socketService: SocketService,
    private createPairService: CreatePairService,
  ) {
    this.colourInit = "FFFFFF";
    this.browserRefresh = false;
    this.sendStroke = false;
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
    
    this.createPairService.htmlElement = (this
      .container as ElementRef).nativeElement;
  }

  ngOnInit(): void {
    this.canvasService.clearSVGListener().subscribe(() => {
      this.clearSVG();
    });
    // this.setUpSocketConnection();
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

        if (activeInGame) {
          const event = {
            type: evt.type,
            clientX:
              evt.clientX -
              clientScroll.getBoundingClientRect().left -
              clientScroll.scrollLeft,
            clientY:
              evt.clientY -
              clientScroll.getBoundingClientRect().top -
              clientScroll.scrollTop,
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
      if (evt.type == "mouseup") {
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
