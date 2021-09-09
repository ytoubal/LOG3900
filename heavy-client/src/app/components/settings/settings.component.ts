import { AfterViewInit, Component, OnInit } from "@angular/core";
import { MatRadioChange } from "@angular/material/radio";
import { TranslateService } from "@ngx-translate/core";
import { themePreview } from "src/app/const/theme-preview";
import { ThemeService } from "src/app/services/theme/theme.service";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent implements OnInit, AfterViewInit {
  languages: any[] = [
    { name: "English - EN", value: "en" },
    { name: "French - FR", value: "fr" },
  ];
  currLang: string = this.languages[0].value;

  constructor(
    public themeService: ThemeService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    if (this.currLang !== this.translate.currentLang.toString())
      this.currLang = this.translate.currentLang.toString();
  }

  ngAfterViewInit() {
    this.themeService.toggle();
  }

  switchLang(event: MatRadioChange) {
    this.translate.use(event.value);
    this.currLang = event.value;
  }

  getThemePreview(theme: string): string {
    if (theme) return themePreview.find((o) => o.name === theme).src;
  }
}
