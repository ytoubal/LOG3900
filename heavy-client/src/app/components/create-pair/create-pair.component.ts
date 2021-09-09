import * as potrace from "potrace";
import * as vivus from "vivus";
import "@firebase/storage";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { difficulties } from "src/app/const/difficulties";
import { CanvasService } from "src/app/services/drawing/canvas.service";
import { wordImageModes } from "src/app/const/word-image-modes";
import { PathPoint, IPathExtremes, IPathDetails } from "./PathPoint";
import { SnackbarService } from "src/app/services/snackbar/snackbar.service";
import { imageProcessor, resize, sharpen } from "ts-image-processor";
import { PaletteService } from "src/app/services/drawing/palette.service";
import { TranslateService } from "@ngx-translate/core";
import { Renderer2 } from "@angular/core";
import { Colour, RGB_LENGTH } from "../drawing/colour/colour";
import { ThemeService } from "src/app/services/theme/theme.service";
import { ToolColourService } from "src/app/services/drawing/tool-colour.service";
import {
  heightCreate,
  heightLight,
  widthCreate,
  widthLight,
} from "./CanvasSize";
import { ModalService } from "src/app/services/modal/modal.service";
import { WARNING_TYPE } from "src/app/enum/warningType";
import { MatDialog } from "@angular/material/dialog";
import { CreatePairService } from "src/app/services/create-pair/create-pair.service";

export enum DRAW_MODE {
  ORIGINAL = "Conventional",
  RANDOM = "Random",
  PAN_LR = "Panoramic Left to Right",
  PAN_RL = "Panoramic Right to Left",
  PAN_BT = "Panoramic Bottom to Top",
  PAN_TB = "Panoramic Top to Bottom",
  CENT_IN_OUT = "Centered Inwards to Outwards",
  CENT_OUT_IN = "Centered Outwards to Inwards",
}

@Component({
  selector: "app-create-pair",
  templateUrl: "./create-pair.component.html",
  styleUrls: ["./create-pair.component.scss"],
})
export class CreatePairComponent implements OnInit {
  @ViewChild("panel", { static: false }) panel: HTMLElement;
  @ViewChild("toolbar", { static: false }) toolbar: HTMLElement;
  @ViewChild("workspace", { static: false }) workspace: HTMLElement;
  @ViewChild("drawingboard", { static: false }) container: ElementRef | null;

  @ViewChild("input", { static: false }) fileInput: ElementRef;
  @ViewChild("upload", { static: false }) uploadBox: ElementRef;

  difficulties: string[] = difficulties.slice(1);
  modes: string[] = wordImageModes;

  primaryColour: string;
  currentTolerance: number = 30;

  currentDiff: string;
  currentMode: string;
  currentHint: string = "";
  chosenWord: string = "";
  allHints: string[] = [];

  isDraw: boolean = false;
  isUpload: boolean = false;
  isSourceChosen: boolean = false;
  showConfigs: boolean = false;
  showPotConfigs: boolean = false;
  validImage: boolean = false;
  selectedFile: File = null;
  imageBuffer: any;

  drawSpeed = 0.5;
  drawPaths: string[] = [];
  pathExtremes: IPathExtremes[] = [];
  centerPt: PathPoint;
  pathDetails: IPathDetails[] = [];

  url: any;
  canvas: HTMLCanvasElement;
  isPotrace: boolean = false;
  drawingHTML: string = "";

  constructor(
    private canvasService: CanvasService,
    private snackbarService: SnackbarService,
    public paletteService: PaletteService,
    public translate: TranslateService,
    public renderer: Renderer2,
    public themeService: ThemeService,
    public toolColorService: ToolColourService,
    public modalService: ModalService,
    private dialog: MatDialog,
    public createPairService: CreatePairService
  ) {
    this.primaryColour = "000000";

    if (translate.currentLang.toString() === "en") {
      this.currentDiff = this.difficulties[0];
      if (!this.createPairService.showPotConfigs)
        this.currentMode = this.modes[0];
      else this.currentMode = this.modes[1];
    } else if (translate.currentLang.toString() === "fr") {
      this.currentDiff = "Facile";
      if (!this.createPairService.showPotConfigs)
        this.currentMode = "Conventionnel";
      else this.currentMode = "Aléatoire";
    } else if (translate.currentLang.toString() === "de") {
      this.currentDiff = "Einfach";
      if (!this.createPairService.showPotConfigs)
        this.currentMode = "Konventioneller";
      else this.currentMode = "Zufallsmodus";
    }
    this.canvas = document.createElement("canvas");

    this.createPairService.isDraw = false;
    this.createPairService.isUpload = false;
    this.createPairService.isSourceChosen = false;
    this.createPairService.showConfigs = false;
    this.createPairService.showPotConfigs = false;
  }

  ngOnInit() {
    this.canvasService.isDrawingWordImage = true;
    this.url = this.canvas.toDataURL("image/png");

    this.paletteService.primaryColour.subscribe((primaryColour) =>
      this.updateColours(primaryColour, true)
    );
    this.themeService.toggle();
    this.canvasService.clearUndoRedoHistory();
    if (this.createPairService.addSuccess) {
      this.clearField();
    }
  }

  updateColours(newStringColour: Colour, changePrimary: boolean): void {
    const newString = this.paletteService
      .colourToString(newStringColour)
      .substr(0, RGB_LENGTH);
    this.primaryColour = newString;
  }

  // UPLOAD VS DRAWING -----------------------------------------------------------------------------------------
  // to define the behavior of when the user decides to upload an image
  dragCallback(event): void {
    event.preventDefault();
    this.uploadBox.nativeElement.classList.add("active");
  }

  dragLeaveCallback(): void {
    this.uploadBox.nativeElement.classList.remove("active");
  }

  dropCallback(event): void {
    event.preventDefault();
    this.selectedFile = event.dataTransfer.files[0];
    this.validateImage().then((fileBuffer) => {
      this.imageBuffer = fileBuffer;
    });
    if (this.validImage) this.showConfig();
  }

  showConfig(): void {
    this.createPairService.isUpload = false;
    this.createPairService.showConfigs = true;
    this.setCurrentMode();
    this.showPotConfig();
  }

  showPotConfig(): void {
    this.createPairService.showPotConfigs = true;
  }

  // when user uploads an image
  onFileSelected(files: FileList) {
    this.selectedFile = files.item(0);
    this.validateImage().then((uploadedBuffer) => {
      this.imageBuffer = uploadedBuffer;
    });
    if (this.validImage) this.showConfig();
  }

  openColourModal(isPrimary: boolean): void {
    this.toolColorService.openColourModal(isPrimary);
  }

  // get the uploaded file data as Buffer to be analysed by potrace
  async getFileData(file: File): Promise<any> {
    return new Promise((resolve, reject) => {
      let fileReader = new FileReader();
      fileReader.onload = () => {
        let fileURL = fileReader.result;
        resolve(fileURL);
      };
      fileReader.readAsDataURL(file);
    });
  }

  // validate and returns the uploaded file data as Buffer
  async validateImage(): Promise<any> {
    let validFormats = ["image/bmp", "image/jpeg", "image/jpg", "image/png"];

    return new Promise((resolve, reject) => {
      if (validFormats.includes(this.selectedFile.type)) {
        this.getFileData(this.selectedFile).then(async (fileBuffer) => {
          resolve(fileBuffer);
        });
        this.validImage = true;
      } else {
        const lang = this.translate.currentLang.toString();
        if (lang === "en")
          this.snackbarService.openSnackBar(
            "Invalid image. Please select another.",
            "Close"
          );
        else if (lang === "fr")
          this.snackbarService.openSnackBar(
            "Image invalide. Veuillez en sélectionner un autre.",
            "Fermer"
          );
        else
          this.snackbarService.openSnackBar(
            "Ungültiges Bild. Bitte wählen Sie eine andere.",
            "Schließen"
          );
        this.validImage = false;
        this.uploadBox.nativeElement.classList.remove("active");
      }
    });
  }

  // to return to main page
  back(page: string): void {
    if (this.createPairService.addSuccess) {
      this.clearField();
    }
    if (page === "init") {
      this.canvasService.clearUndoRedoHistory();
      if (!this.createPairService.isUpload) {
        this.getDrawPaths();

        if (this.drawPaths.length !== 0)
          this.modalService.openWarning(WARNING_TYPE.BACK_DRAWING, "");
        else {
          this.createPairService.isDraw = false;
          this.createPairService.isUpload = false;
          this.createPairService.isSourceChosen = false;
          this.createPairService.showPotConfigs = false;
          this.createPairService.showConfigs = false;
        }
      } else {
        this.createPairService.isDraw = false;
        this.createPairService.isUpload = false;
        this.createPairService.isSourceChosen = false;
        this.createPairService.showPotConfigs = false;
        this.createPairService.showConfigs = false;
      }
    } else if (page === "draw") {
      this.createPairService.htmlElement.innerHTML = this.createPairService
        .isDraw
        ? this.drawingHTML
        : this.container.nativeElement.innerHTML;
      this.modalService.openWarning(WARNING_TYPE.BACK_DRAWING, "draw");
      this.clearField();
    } else {
      this.modalService.openWarning(WARNING_TYPE.BACK_DRAWING, "upload");
    }
  }

  clearField() {
    this.chosenWord = "";
    this.allHints = [];
  }

  setCurrentMode(): void {
    if (this.translate.currentLang.toString() === "en") {
      this.currentMode = this.modes[1];
    } else if (this.translate.currentLang.toString() === "fr") {
      this.currentMode = "Aléatoire";
    } else if (this.translate.currentLang.toString() === "de") {
      this.currentMode = "Zufallsmodus";
    }
  }

  // to proceed to drawing configurations
  next(page: string): void {
    this.drawingHTML = this.canvasService.htmlElement.innerHTML;

    switch (page) {
      case "config":
        // next after drawing on canvas
        this.createPairService.isDraw = false;
        this.createPairService.showConfigs = true;
        this.createPairService.showPotConfigs = false;
        this.createPairService.isUpload = false;

        setTimeout(() => {
          this.container.nativeElement.innerHTML = this.drawingHTML;
        }, 50);
        break;
    }
  }

  openFileWindow(): void {
    this.fileInput.nativeElement.click();
  }

  // used to determine how the user provides the drawing
  chooseDrawingSource(selectedSource: string): void {
    this.createPairService.isSourceChosen = true;
    selectedSource === "draw"
      ? (this.createPairService.isDraw = true)
      : (this.createPairService.isUpload = true);
    selectedSource === "draw"
      ? (this.isPotrace = false)
      : (this.isPotrace = true); // work around
  }

  addHint(hint: string): void {
    if (hint != "") {
      this.allHints.push(hint);
      this.currentHint = "";
    }
  }

  removeHint(i: number): void {
    this.allHints.splice(i, 1);
  }

  translateDiff(): void {
    switch (this.currentDiff) {
      case "Facile":
      case "Einfach":
        this.currentDiff = "Easy";
        break;
      case "Moyen":
      case "Mittlere":
        this.currentDiff = "Medium";
        break;
      case "Difficile":
      case "Schwierig":
        this.currentDiff = "Hard";
        break;
    }
  }

  translateMode(): void {
    switch (this.currentMode) {
      case "Conventionnel":
      case "Konventioneller":
        this.currentMode = "Conventional";
        break;
      case "Aléatoire":
      case "Zufallsmodus":
        this.currentMode = "Random";
        break;
      case "Panoramique gauche à droit":
      case "Panoramamodus von links nach rechts":
        this.currentMode = "Panoramic Left to Right";
        break;
      case "Panoramique droite à gauche":
      case "Panoramamodus von rechts nach links":
        this.currentMode = "Panoramic Right to Left";
        break;
      case "Panoramique bas à haut":
      case "Panoramamodus von unten nach oben":
        this.currentMode = "Panoramic Bottom to Top";
        break;
      case "Panoramique haut à bas":
      case "Panoramamodus von oben nach unten":
        this.currentMode = "Panoramic Top to Bottom";
        break;
      case "Centré intérieur vers extérieur":
      case "Zentrierter nach innen nach außen":
        this.currentMode = "Centered Inwards to Outwards";
        break;
      case "Centré extérieur vers intérieur":
      case "Zentrierter nach außen nach innen":
        this.currentMode = "Centered Outwards to Inwards";
        break;
    }
  }

  async create(): Promise<void> {
    if (this.isPotrace) {
      await this.potraceDraw().then(async (res) => {
        this.getDrawPaths();

        const pathOrder: number[] = (await this.draw(
          this.currentMode,
          true
        )) as number[];

        let orderedPathDetails: IPathDetails[] = [];
        for (var i = 0; i < pathOrder.length; i++) {
          const index: number = pathOrder[i];
          orderedPathDetails.push(this.pathDetails[index]);
        }

        this.translateDiff();
        this.translateMode();

        this.createPairService.addWordImage(
          this.chosenWord,
          this.allHints,
          this.currentDiff,
          this.currentMode,
          orderedPathDetails
        );
      });
    } else {
      this.getDrawPaths();
      const pathOrder: number[] = (await this.draw(
        this.currentMode,
        true
      )) as number[];
      let orderedPathDetails: IPathDetails[] = [];
      for (var i = 0; i < pathOrder.length; i++) {
        const index: number = pathOrder[i];
        orderedPathDetails.push(this.pathDetails[index]);
      }

      this.translateDiff();
      this.translateMode();

      this.createPairService.addWordImage(
        this.chosenWord,
        this.allHints,
        this.currentDiff,
        this.currentMode,
        orderedPathDetails
      );
    }
    this.canvasService.clearUndoRedoHistory();
  }

  async preview() {
    let pathOrder: number[] = [];

    if (this.isPotrace) {
      await this.potraceDraw().then(async (res) => {
        this.getDrawPaths();

        pathOrder = await this.draw(this.currentMode, false);
        let orderedPathDetails: IPathDetails[] = [];
        for (var i = 0; i < pathOrder.length; i++) {
          const index: number = pathOrder[i];
          orderedPathDetails.push(this.pathDetails[index]);
        }
        this.addPotracePath(orderedPathDetails);

        // use vivus for previewing, only method that works
        const vivDrawing = new vivus("drawingboard", { type: "oneByOne" });
        vivDrawing.play(this.drawSpeed);
      });
    } else {
      this.getDrawPaths();

      const pathDepths: number[] = [];
      pathOrder = await this.draw(this.currentMode, false);

      for (let order of pathOrder) {
        const pathID = this.getStrElement(this.drawPaths[order], 9);
        const depth = parseInt(pathID);
        pathDepths.push(depth);
      }
      this.drawPreview(pathOrder, pathDepths);
    }
  }

  addPotracePath(orderedPathDetails: IPathDetails[]) {
    this.container.nativeElement.innerHTML = "";

    orderedPathDetails.forEach((IPathDet) => {
      let pathStr = "";
      const ptLength = IPathDet.pathPoints.length;
      if (ptLength == 1) {
        // if single point, need to duplicate to successfully add
        pathStr += `${IPathDet.pathPoints[0].x} ${IPathDet.pathPoints[0].y}L ${IPathDet.pathPoints[0].x} ${IPathDet.pathPoints[0].y}`;
      } else {
        for (var i = 0; i < ptLength - 1; i++) {
          pathStr += `${IPathDet.pathPoints[i].x} ${IPathDet.pathPoints[i].y}L `; // add L to end of every point
        }
        pathStr += `${IPathDet.pathPoints[ptLength - 1].x} ${
          IPathDet.pathPoints[ptLength - 1].y
        }`; // cannot have L at the end of the path
      }

      // creating the path and adding
      const color = orderedPathDetails[0].color;
      const size = orderedPathDetails[0].size;

      const pathElem: SVGElement = this.renderer.createElement("path", "svg");
      pathElem.setAttribute("d", `M ${pathStr}`);
      pathElem.setAttribute("stroke", color);
      pathElem.setAttribute("fill", "none");
      pathElem.setAttribute("stroke-width", `${size}`);
      pathElem.setAttribute("stroke-linejoin", "round");
      pathElem.setAttribute("stroke-linecap", "round");
      (this.container.nativeElement as HTMLElement).appendChild(pathElem);
    });
  }

  drawPreview(pathOrder: number[], pathIDs: number[]) {
    let pathsDirty = (this.container
      .nativeElement as HTMLElement).querySelectorAll("path");
    let paths = [];

    pathsDirty.forEach((path) => {
      if (path.getAttribute("d").search("M") != -1) {
        paths.push(path);
      }
    });

    let time = 0;

    for (var i = 0; i < pathOrder.length; i++) {
      const path = this.getPathByID(paths, pathIDs[i]);
      const length = path.getTotalLength();
      path.style.transition = "none";
      path.style.strokeDasharray = length + " " + length;
      path.style.strokeDashoffset = length.toString();
      path.getBoundingClientRect();

      setTimeout(() => {
        path.style.transition = "stroke-dashoffset 0.5s";
        path.style.strokeDashoffset = "0";
      }, time);
      time += 500;
    }
  }

  getPathByID(paths: any, pathId: number): SVGPathElement {
    for (let i = 0; i < paths.length; i++) {
      if (paths[i].getAttribute("id") === pathId.toString()) {
        return paths[i];
      }
    }
  }

  async potraceDraw(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      this.container.nativeElement.innerHTML = "";
      const newStroke =
        ' stroke="' +
        this.paletteService.getRGBA("primary") +
        '" fill="none"/>';

      await this.setMaxSize().then(async (resized) => {
        // get resized if uploaded size > canvas dimensions
        await this.getSvgBuffer(resized).then((path) => {
          const indexM = path.lastIndexOf("stroke");
          let newPath = path.substring(0, indexM);
          newPath += newStroke;

          this.container.nativeElement.innerHTML += newPath;

          // get paths from container
          let pathsDirty = (this.container
            .nativeElement as HTMLElement).querySelectorAll("path"); //retrieve the one huge path
          this.container.nativeElement.innerHTML = ""; // clear since we're appending back

          // reconstructing and separating by M (every starting M is a new path)
          const completePath = pathsDirty[0].getAttribute("d");
          const onePathColor = pathsDirty[0].getAttribute("stroke");
          const bigPathSplit = completePath.split(" ");

          let pathArr = [bigPathSplit[0]];
          for (var i = 1; i < bigPathSplit.length; i++) {
            const c = bigPathSplit[i];

            //can prob optimize but w/ever
            if (i == bigPathSplit.length - 1) {
              pathArr.push(c); // push the last char element (last coord of point)
              const d = pathArr.join(" ");
              this.createAddPath(d, onePathColor);
              pathArr = []; //combine the path d, create the path and clear the array
            } else if (c == "M") {
              const d = pathArr.join(" ");
              this.createAddPath(d, onePathColor);
              pathArr = [];
              pathArr.push(c);
            } else {
              pathArr.push(c);
            }
          }
          resolve(true);
        });
      });
    });
  }

  createAddPath(d: string, color: string) {
    const pathElem: SVGElement = this.renderer.createElement("path", "svg");
    pathElem.setAttribute("d", d);
    pathElem.setAttribute("stroke", color);
    pathElem.setAttribute("fill", "none");
    (this.container.nativeElement as HTMLElement).appendChild(pathElem);
  }

  // sets max width and height for image file bigger than 552 x 520 (current canvas size)
  async setMaxSize(): Promise<any> {
    return new Promise((resolve, reject) => {
      imageProcessor
        .src(this.imageBuffer)
        .pipe(
          resize({ maxWidth: widthCreate, maxHeight: heightCreate }),
          sharpen()
        )
        .then((processedBase64) => {
          resolve(processedBase64);
        });
    });
  }

  // returns svg path of the imageBuffer
  async getSvgBuffer(file: any): Promise<string> {
    const trace = new potrace.Potrace();
    trace.setParameters({
      // threshold: 128,
      threshold: this.currentTolerance + 100, //TODO TEMP
      color: this.paletteService.getRGBA("primary"),
    });

    return new Promise((resolve, reject) => {
      trace.loadImage(file, function (err) {
        if (err) {
          return reject(err);
        }
        const path = trace.getSVG();
        return resolve(path);
      });
    });
  }
  // POTRACE THINGS ------^^^^^^^^---------------------------------------------------------------------------------------

  getOriginalOrder(): number[] {
    let pathOrder: number[] = [];

    const pathMap = new Map();
    for (var i = 0; i < this.drawPaths.length; i++) {
      const pathID = this.getStrElement(this.drawPaths[i], 9);
      pathMap.set(i, parseInt(pathID));
    }
    let pathSorted = new Map<number, number>();
    pathSorted = new Map([...pathMap.entries()].sort((a, b) => a[1] - b[1]));

    for (const key of pathSorted.keys()) {
      pathOrder.push(key);
    }
    return pathOrder;
  }

  getOriginalOrderLayer(layer: string[]): number[] {
    let pathOrder: number[] = [];

    const pathMap = new Map();
    for (var i = 0; i < layer.length; i++) {
      const pathID = this.getStrElement(layer[i], 9);
      pathMap.set(i, parseInt(pathID));
    }
    let pathSorted = new Map<number, number>();
    pathSorted = new Map([...pathMap.entries()].sort((a, b) => a[1] - b[1]));

    for (const key of pathSorted.keys()) {
      pathOrder.push(key);
    }
    return pathOrder;
  }

  async draw(mode: string, createMode: boolean): Promise<number[]> {
    return new Promise((resolve, reject) => {
      this.cleanPath(this.drawPaths, createMode);
      if (this.isPotrace) {
        this.separatePath();
      }
      this.findPathExtremity(createMode);

      let pathOrder: number[] = [];
      if (mode == DRAW_MODE.ORIGINAL) {
        resolve(this.getOriginalOrder());
      } else if (mode == DRAW_MODE.RANDOM) {
        // fill array with the index
        for (var i = 0; i < this.drawPaths.length; i++) {
          pathOrder[i] = i;
        }

        // Fisher–Yates shuffle algorithm to shuffle in same array O(n) space
        let max = pathOrder.length;
        let temp, indx;

        // While there remain elements to shuffle…
        while (max) {
          // Pick a remaining element…
          indx = Math.floor(Math.random() * max--);

          // And swap it with the current element.
          temp = pathOrder[max];
          pathOrder[max] = pathOrder[indx];
          pathOrder[indx] = temp;
        }
        resolve(pathOrder);
      }

      const pathMap = new Map();
      this.pathExtremes.forEach((IPathExt) => {
        if (mode == DRAW_MODE.PAN_LR) {
          pathMap.set(IPathExt.PATH, IPathExt.MIN_X);
        } else if (mode == DRAW_MODE.PAN_RL) {
          pathMap.set(IPathExt.PATH, IPathExt.MAX_X);
        } else if (mode == DRAW_MODE.PAN_BT) {
          pathMap.set(IPathExt.PATH, IPathExt.MIN_Y);
        } else if (mode == DRAW_MODE.PAN_TB) {
          pathMap.set(IPathExt.PATH, IPathExt.MAX_Y);
        } else if (mode == DRAW_MODE.CENT_IN_OUT) {
          pathMap.set(IPathExt.PATH, IPathExt.MIN_DIST);
        } else if (mode == DRAW_MODE.CENT_OUT_IN) {
          pathMap.set(IPathExt.PATH, IPathExt.MAX_DIST);
        }
      });

      let pathSorted = new Map<any, any>();
      if (
        mode == DRAW_MODE.PAN_LR ||
        mode == DRAW_MODE.PAN_TB ||
        mode == DRAW_MODE.CENT_IN_OUT
      ) {
        pathSorted = new Map(
          [...pathMap.entries()].sort((a, b) => a[1] - b[1])
        );
      } else if (
        mode == DRAW_MODE.PAN_RL ||
        mode == DRAW_MODE.PAN_BT ||
        mode == DRAW_MODE.CENT_OUT_IN
      ) {
        pathSorted = new Map(
          [...pathMap.entries()].sort((a, b) => b[1] - a[1])
        );
      }

      for (const key of pathSorted.keys()) {
        pathOrder.push(key);
      }

      resolve(pathOrder);
    });
  }

  isPairIncomplete(): boolean {
    return this.chosenWord === "" || this.allHints.length === 0;
  }

  isEmpty(): boolean {
    this.getDrawPaths();
    return this.drawPaths.length == 0;
  }

  getDrawPaths() {
    this.drawPaths = [];
    let paths: string[] = [];

    if (this.isPotrace) {
      // using different container for some reason
      paths = this.container.nativeElement.innerHTML.split("<");
    } else {
      paths = this.canvasService.htmlElement.innerHTML.split("<");
    }

    // only save path with movement in d = " M x y L x y..."
    paths.forEach((path) => {
      if (path.search("M") != -1) {
        this.drawPaths.push(path);
      }
    });
  }

  cleanPath(arrLines: string[], createMode: boolean): void {
    if (arrLines.length == 0) {
      console.log("Lines empty error");
      return;
    }
    this.pathDetails = [];

    // if potrace, search from beggining-ish added "path ng_content..." vs drawn  search from 48. the first and smallest index of M is 48 ( will go up with path id = single digit / double / triple digit)
    const searchM = this.isPotrace ? 4 : 48;

    for (var i = 0; i < arrLines.length; i++) {
      const indexM = arrLines[i].indexOf("M", searchM);
      let depth = i;

      let arrPaths = arrLines[i].substring(indexM + 2).split(" "); // + 2 skip over M and space to start directly in path (M X Y X Y)
      let arrPathsPoints = arrPaths.slice(0, -2); // remove last 2 elements -> (stroke-linecap, stroke-linejoin)

      let size = 2;
      let colorStr = "";

      if (!this.isPotrace) {
        while (
          arrPathsPoints[arrPathsPoints.length - 1].search("width") == -1 &&
          arrPathsPoints[arrPathsPoints.length - 1].search("rgba") == -1 &&
          arrPathsPoints.length > 2
        ) {
          arrPathsPoints.splice(arrPathsPoints.length - 1, 1);
        }

        const sizeStr = this.getStrElement(
          arrPathsPoints[arrPathsPoints.length - 1],
          14
        );
        size = parseInt(sizeStr);
        colorStr = this.getStrElement(
          arrPathsPoints[arrPathsPoints.length - 2],
          8
        );
        arrPathsPoints.splice(arrPathsPoints.length - 1, 2); // remove the size and color elem.
      }

      // potrace
      else {
        depth = -1;
        arrPathsPoints.splice(arrPathsPoints.length - 1, 3);

        size = 1; //TODO SET SIZE HERE
        colorStr = this.paletteService.getRGBA("primary");
      }

      for (var j = 0; j < arrPathsPoints.length; j++) {
        const lastIndex = arrPathsPoints[j].length - 1;

        //remove the M/L in array
        if (
          arrPathsPoints[j] == "M" ||
          arrPathsPoints[j] == "L" ||
          arrPathsPoints[j] == "C" ||
          arrPathsPoints[j] == '"'
        ) {
          arrPathsPoints.splice(j, 1);
        } else if (arrPathsPoints[j][lastIndex] == "L") {
          arrPathsPoints[j] = arrPathsPoints[j].substring(0, lastIndex); //remove the L from 126L 49L XL YL etc
        } else if (arrPathsPoints[j][lastIndex] == ",") {
          arrPathsPoints[j] = arrPathsPoints[j].substring(0, lastIndex); //remove the L from 126L 49L XL YL etc
        }
      }

      const pathDetail: IPathDetails = {
        pathPoints: this.pairPoint(arrPathsPoints, createMode),
        color: colorStr,
        size: size,
        depth: depth,
      };

      this.pathDetails.push(pathDetail);
    }
  }

  separatePath() {
    if (this.pathDetails[0].pathPoints.length <= 1) {
      console.log("less than 2 paths in potrace. error.");
      return;
    }
    const color = this.pathDetails[0].color;
    const size = this.pathDetails[0].size;

    const pathPoints: PathPoint[] = this.pathDetails[0].pathPoints;
    this.pathDetails.splice(0, 1);
    let arrPoints: PathPoint[] = [];
    arrPoints.push(pathPoints[0]);

    let count = 0;
    for (var i = 1; i < pathPoints.length; i++) {
      const currPt = pathPoints[i];

      //TODO THE DISTANCE VARIES DRAWING SPEED AND QUALITY
      if (currPt.isSamePath(arrPoints[count], 5)) {
        arrPoints.push(currPt);

        if (i == pathPoints.length - 1) {
          const pathDet: IPathDetails = {
            pathPoints: arrPoints,
            color: color,
            size: size,
            depth: -1,
          };
          this.pathDetails.push(pathDet);
        }
        count++;
      } else {
        if (arrPoints.length > 0) {
          const pathDet: IPathDetails = {
            pathPoints: arrPoints,
            color: color,
            size: size,
            depth: -1,
          };
          this.pathDetails.push(pathDet);
          arrPoints = [];
          arrPoints.push(currPt);
          count = 0;
        }
      }
    }
  }

  // return correct value between "". use startIndex to search for closing ", then substring correctly
  getStrElement(elem: string, startIndex: number): string {
    const closeIndex = elem.indexOf('"', startIndex);
    return elem.substring(startIndex, closeIndex);
  }

  // pair together and remove duplicate points
  pairPoint(arrPts: string[], createMode: boolean): PathPoint[] {
    if (arrPts.length < 2) {
      console.log("pairPointClean length arrPts < 2 ERROR");
      return [];
    }
    const ratioX = createMode ? widthLight / widthCreate : 1;
    const ratioY = createMode ? heightLight / heightCreate : 1;

    let pathPoints: PathPoint[] = [];
    let prev: PathPoint = new PathPoint(arrPts[0], arrPts[1], ratioX, ratioY);
    pathPoints.push(prev);

    // pair every 2 points x y in one.
    for (var i = 1; i < arrPts.length; i += 2) {
      const newPt = new PathPoint(arrPts[i - 1], arrPts[i], ratioX, ratioY);

      if (!newPt.isEqual(prev)) {
        pathPoints.push(newPt);
        prev = newPt;
      }
    }
    return pathPoints;
  }

  // find max/min X/Y of all pathPoints
  findPathExtremity(createMode: boolean): void {
    const ratioX = createMode ? widthLight / widthCreate : 1;
    const ratioY = createMode ? heightLight / heightCreate : 1;
    this.centerPt = new PathPoint("276.5", "260", ratioX, ratioY); //center of canvas

    this.pathExtremes = [];
    for (var i = 0; i < this.pathDetails.length; i++) {
      const arrP = this.pathDetails[i].pathPoints;

      if (arrP.length == 1) {
        // if only has 1 point, need to set min/Max X/Y identical for both.
        const center_dist = Math.sqrt(
          (this.centerPt.x - arrP[0].x) ** 2 +
            (this.centerPt.y - arrP[0].y) ** 2
        ); // pythagore distance
        const res: IPathExtremes = {
          PATH: i,
          MIN_X: arrP[0].x,
          MAX_X: arrP[0].x,
          MIN_Y: arrP[0].y,
          MAX_Y: arrP[0].y,
          MIN_DIST: center_dist,
          MAX_DIST: center_dist,
        };
        this.pathExtremes.push(res);
        // break;
      }

      let min_X = Number.MAX_VALUE;
      let max_X = 0;
      let min_Y = Number.MAX_VALUE;
      let max_Y = 0;
      let dist_min = Number.MAX_VALUE;
      let dist_max = 0;

      arrP.forEach((point) => {
        if (point.x < min_X) {
          min_X = point.x;
        } else if (point.x > max_X) {
          max_X = point.x;
        }

        if (point.y < min_Y) {
          min_Y = point.y;
        } else if (point.y > max_Y) {
          max_Y = point.y;
        }
        const center_dist = Math.sqrt(
          (this.centerPt.x - point.x) ** 2 + (this.centerPt.y - point.y) ** 2
        );
        if (center_dist < dist_min) {
          dist_min = center_dist;
        } else if (center_dist > dist_max) {
          dist_max = center_dist;
        }
      });
      const res: IPathExtremes = {
        PATH: i,
        MIN_X: min_X,
        MAX_X: max_X,
        MIN_Y: min_Y,
        MAX_Y: max_Y,
        MIN_DIST: dist_min,
        MAX_DIST: dist_max,
      };
      this.pathExtremes.push(res);
    }
  }
}
