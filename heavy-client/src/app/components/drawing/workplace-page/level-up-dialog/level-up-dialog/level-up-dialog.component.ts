import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Levels } from "src/app/const/levels";
import { LVL_ACHIEVEMENTS } from "src/app/const/lvl-achievements";
import { ProfilePic } from "src/app/interfaces/profile-pic";
import { AuthentificationService } from "src/app/services/authentification/authentification.service";
import { ProfileService } from "src/app/services/profile/profile.service";
import { ThemeService } from "src/app/services/theme/theme.service";

@Component({
  selector: "app-level-up-dialog",
  templateUrl: "./level-up-dialog.component.html",
  styleUrls: ["./level-up-dialog.component.scss"],
})
export class LevelUpDialogComponent implements OnInit {
  pointsProgress: number;
  maxXP: number;
  achievedBorder: string;
  achievedTitle: string;

  constructor(
    public authService: AuthentificationService,
    public themeService: ThemeService,
    public translate: TranslateService
  ) {
    let level = this.authService.level;

    this.maxXP = Levels.find((l) => level + 1 == l.level).max;
    this.pointsProgress = Math.round(
      (this.authService.pointsXP / this.maxXP) * 100
    );

    this.achievedBorder = LVL_ACHIEVEMENTS[level].border.src;
    this.achievedTitle = LVL_ACHIEVEMENTS[level].title;

    this.authService.level++;
  }

  ngOnInit() {
    this.themeService.toggle();
  }
}
