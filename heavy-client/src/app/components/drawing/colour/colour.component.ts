import { Component } from '@angular/core';

@Component({
  selector: 'app-colour',
  templateUrl: './colour.component.html',
  styleUrls: ['./colour.component.css']
})

// Inspired from the website: https://malcoded.com/posts/angular-color-picker/
export class ColourComponent {
  hue: string;
  color: string;
}
