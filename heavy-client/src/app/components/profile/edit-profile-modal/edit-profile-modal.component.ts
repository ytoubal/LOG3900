import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { Achievement, LVL_ACHIEVEMENTS } from "src/app/const/lvl-achievements";
// import { MatDialogRef } from "@angular/material";
// import { stat } from "fs";
import { profilePics } from "src/app/const/profile-pics";
import { ProfilePic } from "src/app/interfaces/profile-pic";
import { AuthentificationService } from "src/app/services/authentification/authentification.service";
import { HttpClientService } from "src/app/services/httpClient/http-client.service";
import { ProfileService } from "src/app/services/profile/profile.service";
import { SnackbarService } from "src/app/services/snackbar/snackbar.service";
import { ThemeService } from "src/app/services/theme/theme.service";
import {
  IResponse,
  Status,
} from "../../../../../../server/app/interfaces/IResponse";

@Component({
  selector: "app-edit-profile-modal",
  templateUrl: "./edit-profile-modal.component.html",
  styleUrls: ["./edit-profile-modal.component.scss"],
})
export class EditProfileModalComponent implements OnInit {
  @ViewChild("currentPfp", { static: false }) currentPfp: ElementRef;
  @ViewChild("currentBorder", { static: false }) currentBorder: ElementRef;

  fName: string;
  lName: string;
  avatar: ProfilePic;
  title: string;
  border: string;
  pfpOptions: ProfilePic[] = profilePics.slice(0, 10);
  achievementOptions = LVL_ACHIEVEMENTS;

  constructor(
    private authService: AuthentificationService,
    private httpClientService: HttpClientService,
    private snackbarService: SnackbarService,
    public profileService: ProfileService,
    public themeService: ThemeService,
    public translate: TranslateService
  ) {
    this.fName = this.authService.fName;
    this.lName = this.authService.lName;
    this.avatar = profilePics.find((o) => o.name === this.authService.avatar);
    if (this.profileService.title) this.title = this.profileService.title;
    else this.title = "none";
  }

  ngOnInit() {
    this.themeService.toggle();
  }

  changeCurrentPfp(chosenAvatar: ProfilePic): void {
    this.currentPfp.nativeElement.src = chosenAvatar.src;
    this.avatar = chosenAvatar;
    console.log("avatar is " + this.avatar.name + " " + this.avatar.src);
  }

  changeCurrentBorder(index: number): void {
    this.currentBorder.nativeElement.src = LVL_ACHIEVEMENTS[index].border.src;
    console.log(LVL_ACHIEVEMENTS[index]);
    this.border = LVL_ACHIEVEMENTS[index].border.name;
  }

  onSave(): void {
    this.authService.avatar = this.avatar.name;
    this.authService.fName = this.fName;
    this.authService.lName = this.lName;

    if (typeof this.border !== "undefined")
      this.profileService.border = this.border;
    this.profileService.title = this.title;

    const userProfileUpdate = {
      username: this.authService.username,
      firstName: this.authService.fName,
      lastName: this.authService.lName,
      avatar: this.authService.avatar,
      title: this.profileService.title,
      border: this.profileService.border,
    };

    console.log(userProfileUpdate);

    this.httpClientService
      .updateUserInfo(userProfileUpdate)
      .subscribe((data: IResponse) => {
        const status = data.status;
        const lang = this.translate.currentLang.toString();
        if (status == Status.UPDATE_OK) {
          if (lang === "en")
            this.snackbarService.openSnackBar(
              "Profile has been updated.",
              "Close"
            );
          else if (lang === "fr")
            this.snackbarService.openSnackBar(
              "Votre profil a été mis à jour.",
              "Fermer"
            );
          else
            this.snackbarService.openSnackBar(
              "Ihr Profil wurde aktualisiert.",
              "Schließen"
            );
        } else if (status == Status.HTTP_NOT_FOUND) {
          if (lang === "en")
            this.snackbarService.openSnackBar(
              "There seems to be a problem with the server. Try again later.",
              "Close"
            );
          else if (lang === "fr")
            this.snackbarService.openSnackBar("Problème de serveur.", "Fermer");
          else this.snackbarService.openSnackBar("Serverproblem.", "Schließen");
        }
      });
  }
}
