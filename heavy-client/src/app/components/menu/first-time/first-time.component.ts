import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-first-time',
  templateUrl: './first-time.component.html',
  styleUrls: ['./first-time.component.scss']
})
export class FirstTimeComponent implements OnInit {

  constructor(    
    public dialogRef: MatDialogRef<FirstTimeComponent>,
    private router: Router
  ) {}

  ngOnInit() {
  }

  goTutorial() {
    this.dialogRef.close();
    this.router.navigate(["/tutorial"]);
  }
  goMenu() {
    this.dialogRef.close();
    this.router.navigate(["/menu"]);
  }

}
