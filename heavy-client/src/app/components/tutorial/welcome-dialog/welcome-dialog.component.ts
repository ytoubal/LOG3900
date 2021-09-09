import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ThemeService } from "src/app/services/theme/theme.service";
import { TutorialService } from "src/app/services/tutorial/tutorial.service";

@Component({
  selector: "app-welcome-dialog",
  templateUrl: "./welcome-dialog.component.html",
  styleUrls: ["./welcome-dialog.component.scss"],
})
export class WelcomeDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<WelcomeDialogComponent>,
    private router: Router,
    private tutorialService: TutorialService,
    public themeService: ThemeService,
    public translate: TranslateService
  ) {}

  ngOnInit() {
    this.themeService.toggle();
  }

  close() {
    this.dialogRef.close();
  }
  goMenu() {
    this.dialogRef.close();
    this.router.navigate(["/menu"]);
    this.tutorialService.goNextStep = true;
  }
}
