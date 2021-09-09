import { Injectable } from "@angular/core";
@Injectable({
  providedIn: "root",
})
export class WordImageService {
  currentHints: string[] = [];
  currentWords: string[] = [];

  constructor() {}
}
