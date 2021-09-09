import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TutorialService {

  goNextStep:boolean =true;
  step: number = 0;
  word: string = "apple"
  constructor() { }

}
