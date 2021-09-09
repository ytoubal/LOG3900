import { Injectable } from "@angular/core";
import { IPathDetails } from "src/app/components/create-pair/PathPoint";
import firebase from "@firebase/app";
import "@firebase/database";
import { SnackbarService } from "../snackbar/snackbar.service";
import { TranslateService } from "@ngx-translate/core";
@Injectable({
  providedIn: "root",
})
export class CreatePairService {
  htmlElement: HTMLElement;
  isDraw: boolean = false;
  isUpload: boolean = false;
  isSourceChosen: boolean = false;
  showPotConfigs: boolean = false;
  showConfigs: boolean = false;
  addSuccess: boolean = false;

  constructor(
    private snackbarService: SnackbarService,
    private translate: TranslateService
  ) {}

  addWordImage(
    word: string,
    hints: string[],
    difficulty: string,
    mode: string,
    pathPts: IPathDetails[]
  ) {
    const wordImage = { word, hints, difficulty, mode, pathPts };
    return firebase
      .database()
      .ref("/wordImages")
      .push(wordImage)
      .then((data) => {
        const lang = this.translate.currentLang.toString();
        if (lang === "en")
          this.snackbarService.openSnackBar(
            "Image word pair has been created successfully",
            "Close"
          );
        else if (lang === "fr")
          this.snackbarService.openSnackBar(
            "Votre paire mot image a été créée!",
            "Fermer"
          );
        else
          this.snackbarService.openSnackBar(
            "Ihr Bildwortpaar wurde erfolgreich erstellt.",
            "Schließen"
          );
        this.isDraw = false;
        this.isUpload = false;
        this.isSourceChosen = false;
        this.showPotConfigs = false;
        this.showConfigs = false;
        this.addSuccess = true;
      })
      .catch((error) => {
        const lang = this.translate.currentLang.toString();
        if (lang === "en")
          this.snackbarService.openSnackBar(
            "Image word pair was not created.",
            "Close"
          );
        else if (lang === "fr")
          this.snackbarService.openSnackBar(
            "Votre paire mot image n'a pas pu être créée.",
            "Fermer"
          );
        else
          this.snackbarService.openSnackBar(
            "Bildwortpaar wurde nicht erstellt.",
            "Schließen"
          );
        this.addSuccess = false;
      });
  }
}
