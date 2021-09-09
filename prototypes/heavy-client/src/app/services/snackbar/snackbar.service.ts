import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
  providedIn: "root",
})
export class SnackbarService {
  constructor(private snackbar: MatSnackBar) {}

  openSnackBar(message: string, action: string): void {
    this.snackbar.open(message, action, {
      duration: 4000,
    });
  }
}
