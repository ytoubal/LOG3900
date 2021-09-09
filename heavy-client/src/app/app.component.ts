import { Component } from "@angular/core";
import { NavigationStart, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";

import { Subscription } from "rxjs";
import { ThemeService } from "./services/theme/theme.service";

import firebase from "@firebase/app";
import "@firebase/database";
import "@firebase/storage";

export let browserRefresh = false;

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "heavy-client";

  subscription: Subscription;

  constructor(
    private router: Router,
    public themeService: ThemeService,
    private translate: TranslateService
  ) {
    const firebaseConfig = {
      apiKey: "AIzaSyD1ML8f1yLj-eeOO4Qxv8N_BVTHQxVxrDo",
      authDomain: "projet-3-c0113.firebaseapp.com",
      projectId: "projet-3-c0113",
      storageBucket: "projet-3-c0113.appspot.com",
      messagingSenderId: "1078681419993",
      appId: "1:1078681419993:web:906063aad209632357bec8",
    };
    firebase.initializeApp(firebaseConfig);
    this.subscription = router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        browserRefresh = !router.navigated;
      }
      translate.addLangs(["en", "fr", "de"]);
      translate.setDefaultLang("en");
      if (typeof translate.currentLang !== "undefined")
        translate.use(translate.currentLang);
      else translate.use("en");
    });
  }

  ngAfterViewInit() {
    this.themeService.doc = document;
  }
}
