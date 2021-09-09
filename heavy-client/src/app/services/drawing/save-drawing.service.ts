import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable, Renderer2, RendererFactory2 } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { Observable } from "rxjs";
import { DATABASE_URL } from "src/app/const/database-url";
import { AuthentificationService } from "../authentification/authentification.service";
import { CanvasService } from "./canvas.service";
import firebase from "@firebase/app";
import "@firebase/storage";
import { ExportService } from "./export.service";
import { SnackbarService } from "../snackbar/snackbar.service";
import { TranslateService } from "@ngx-translate/core";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
    Authorization: "my-auth-token",
  }),
};

@Injectable({
  providedIn: "root",
})
export class SaveDrawingService {
  children: HTMLElement[];
  renderer: Renderer2;
  svgToSave: string;
  name: string;
  tag: string[];
  style: string;
  svgString: string;
  savedDrawings: any[];
  savedWords: string[];
  savedBool: boolean[];

  constructor(
    public canvas: CanvasService,
    public http: HttpClient,
    public rendererFactory: RendererFactory2,
    public sanitizer: DomSanitizer,
    private authService: AuthentificationService,
    private snackbarService: SnackbarService,
    private exportService: ExportService,
    private translate: TranslateService
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.children = [];
    this.tag = [];
    this.name = "";
    this.style = "";
    this.svgString = "";
    this.savedDrawings = [];
    this.savedWords = [];
    this.savedBool = [];
  }

  saveSvg(): Observable<string> {
    const xml = new XMLSerializer();
    let stringSvg = "";
    this.getChildren();
    this.children.forEach((child: HTMLElement) => {
      stringSvg += xml.serializeToString(child) + ",,";
    });
    this.children = [];

    const stringStyle = this.canvas.htmlElement.getAttribute("style");
    const myDrawing = {
      style: stringStyle,
      svg: stringSvg,
      name: this.name,
      tag: this.tag,
    };

    return this.http.post(
      "http://localhost:3000/api/gallery/insert",
      myDrawing,
      { responseType: "text" }
    );
  }

  deleteDrawing(id: string): Observable<string> {
    return this.http.post(
      "http://localhost:3000/api/gallery/delete",
      { id },
      { responseType: "text" }
    );
  }

  getSVGFromServer(id: string): Observable<object> {
    const params = new HttpParams().set("idDrawing", id); // Create new HttpParams
    return this.http.get("http://localhost:3000/api/gallery/svg", { params });
  }

  getGallery(): Observable<object> {
    return this.http.get("http://localhost:3000/api/gallery/all");
  }

  getTags(): Observable<object> {
    let params = new HttpParams();

    this.tag.forEach((tag: string) => {
      params = params.append("tag[]", tag);
    });
    return this.http.get("http://localhost:3000/api/gallery/tag", { params });
  }

  updateWorkspace(style: string, svg: HTMLElement[]): void {
    this.getChildren();
    this.children.forEach((child: HTMLElement) => {
      this.renderer.removeChild(this.canvas.htmlElement, child);
    });
    this.canvas.htmlElement.setAttribute("style", style);
    for (const element of svg) {
      this.renderer.appendChild(this.canvas.htmlElement, element);
    }
    this.children = [];
  }

  getChildren(): void {
    if (this.canvas.htmlElement) {
      this.canvas.htmlElement.childNodes.forEach((child: HTMLElement) => {
        if (
          child.tagName !== "filter" &&
          child.getAttribute("id") !== "gridContainer"
        ) {
          this.children.push(child);
        }
      });
    }
  }

  saveUserDrawing(word: string) {
    const xml = new XMLSerializer();
    this.getChildren();
    let svgChildren = "";
    this.children.forEach((child: HTMLElement) => {
      svgChildren += xml.serializeToString(child);
    });
    this.children = [];
    const style = this.canvas.htmlElement
      ? this.canvas.htmlElement.getAttribute("style")
      : null;
    if (style) {
      const backgroundColor = style.split(";");
      const width = backgroundColor[1].split(":")[1];
      const height = backgroundColor[2].split(":")[1];
      // tslint:disable-next-line: max-line-length //il faut que ce soit sur une ligne pour que le test en lien fonctionne
      this.svgString = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" style = "${backgroundColor[0]}" viewbox = "0 0 ${width} ${height}" height = "${height}" width = "${width}">`;
      svgChildren = svgChildren.split("#").join("%23");
      this.svgString += svgChildren + "</svg>";
    }
    this.savedDrawings.push(
      this.sanitizer.bypassSecurityTrustUrl(this.svgString)
    );
    this.savedWords.push(word);
    // return this.sanitizer.bypassSecurityTrustUrl(this.svgString);
  }

  saveCurrentDrawing(word: string) {
    let canvas = this.exportService.SVGToCanvas(false);
    setTimeout(() => {
      this.savedDrawings.push(canvas.toDataURL());
    }, 1000);
    this.savedWords.push(word);
    this.savedBool.push(false);
  }

  saveToAlbum(drawing: string, word: string, index: number) {
    let storageRef = firebase
      .storage()
      .ref("/images/" + this.authService.username);
    let id = word + new Date().toString();
    let imagesRef = storageRef.child(id);
    imagesRef.putString(drawing, "data_url").then((snapshot) => {
      console.log(snapshot);
    });
    const savedDrawing = {
      drawing: id,
      word,
      username: this.authService.username,
    };

    const lang = this.translate.currentLang.toString();
    if (lang === "en")
      this.snackbarService.openSnackBar(
        "Drawing has been added to your gallery.",
        "Close"
      );
    else if (lang === "fr")
      this.snackbarService.openSnackBar(
        "Le dessin a été rajouté dans votre album.",
        "Fermer"
      );
    else
      this.snackbarService.openSnackBar(
        "Zeichnung wurde Ihrer Galerie hinzugefügt.",
        "Schließen"
      );

    this.savedBool[index] = true;
    return this.http
      .post<any>(
        DATABASE_URL + "/database/insert-album",
        savedDrawing,
        httpOptions
      )
      .toPromise();
  }

  isSaved(index: number): boolean {
    return this.savedBool[index];
  }
}
