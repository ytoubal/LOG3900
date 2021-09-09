import { Injectable } from '@angular/core';
import { Themes } from 'src/app/enum/theme';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  doc: Document;
  theme: string = "light";

  constructor() { }

  getTheme(theme: number) {
    
    switch (theme) {
      case 0:
        this.theme = Themes.Light
        break;
      case 1:
        this.theme = Themes.Dark
        break;
      case 2: 
        this.theme = Themes.Red
        break;
      case 3: 
        this.theme = Themes.Christmas
        break;
      case 4: 
        this.theme = Themes.Halloween
        break;
      case 5: 
        this.theme = Themes.Valentine
        break;
    }
    this.toggle();
  }

  toggle() {
    this.doc.querySelectorAll('*').forEach(
      el => {
        el.classList.remove('dark', 'light', 'red', 'christmas', 'halloween', 'valentine')
        el.classList.toggle(this.theme)

        // if (el.hasChildNodes) {
        //   this.toggle()
        // }
      }

    );
    
  }
}
