import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthentificationService } from 'src/app/services/authentification/authentification.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SnackbarService } from 'src/app/services/snackbar/snackbar.service';
import { IResponse } from  '../../../../../server/IResponse';
import { IUser } from '../../../../../server/IUser';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'my-auth-token',
  }),
};

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loading = false;
  submitted = false;
  usernameControl = new FormControl(
    '',
    Validators.compose([Validators.maxLength(12), Validators.required])
  );

  returnUrl: string;
  loginForm: FormGroup;

  constructor(
    formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthentificationService,
    public http: HttpClient,
    private snackbarService: SnackbarService
  ) {
    this.loginForm = formBuilder.group({
      username: this.usernameControl,
    });
  }

  ngOnInit(): void {}

  async login() {
    if(this.loginForm.valid) {
      this.authService.isA = true;
      this.authService.username = this.usernameControl.value !== null ? this.usernameControl.value.trim() : this.authService.username.trim();

      const user : IUser = {username : this.authService.username, socketId : '' };

      if (!user.username.length) {
        this.snackbarService.openSnackBar(`Username can't be empty`, 'Close');
      }
      else {
        // this.http.post<any>('http://localhost:3000/database/insert', user, httpOptions).subscribe((data: IResponse) => {
        this.http.post<any>('https://painseau.herokuapp.com/database/insert', user, httpOptions).subscribe((data: IResponse) => {
          const status = data.status;
          if (status == 201) {
            this.router.navigate(['/chat']);
          }
          else if (status == 0) {
            this.snackbarService.openSnackBar('User already connected, please choose another username.', 'Close');
          }
        });
      }


    }
  }

  async loginB() {
    if(this.loginForm.valid) {
      this.authService.isA = false;
      this.authService.username = this.usernameControl.value !== null ? this.usernameControl.value.trim() : this.authService.username.trim();

      const user : IUser = {username : this.authService.username, socketId : '' };

      if (!user.username.length) {
        this.snackbarService.openSnackBar(`Username can't be empty`, 'Close');
      }
      else {
        // this.http.post<any>('http://localhost:3000/database/insert', user, httpOptions).subscribe((data: IResponse) => {
        this.http.post<any>('https://painseau.herokuapp.com/database/insert', user, httpOptions).subscribe((data: IResponse) => {
          const status = data.status;
          if (status == 201) {
            this.router.navigate(['/chat']);
          }
          else if (status == 0) {
            this.snackbarService.openSnackBar('User already connected, please choose another username.', 'Close');
          }
        });
      }


    }
  }


  }
