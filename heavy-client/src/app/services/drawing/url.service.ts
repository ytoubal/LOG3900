// Code inspired from https://community.wia.io/d/22-access-the-previous-route-in-your-angular-5-app

import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UrlService {
  previousUrl: string;
  currentUrl: string;

  constructor(public router: Router) {
    this.currentUrl = this.router.url;

    router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.previousUrl = this.currentUrl;
        this.currentUrl = e.url;
      }
    });
  }
}
