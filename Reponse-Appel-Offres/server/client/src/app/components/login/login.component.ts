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
import { IResponse } from  '../../../../../IResponse';
import { IUser } from '../../../../../IUser';

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

//   // get all data from server
//   getUsernames(): Observable<object> {
//     return this.http.get('http://localhost:3000/database/all');
//   }
// }

//   public async login() {
//     await this.getServerValidation().then((res) => {
//         if(res)
//             setTimeout(()=>{ this.router.navigate(['/signup']); }, 2000);
//     }).catch((err)=>{
//         console.log(err);
//     });
// }

//   async getServerValidation(): Promise<boolean> {
//     return new Promise((resolve, reject) => {
//         this.authentification.authentificationRequest({ username: this.usernameRef.nativeElement.value}).subscribe(res => {
//             let serverResponse =  res as { title: string, body: string };
//             let message  = "";
//             try {
//                 message += serverResponse.body;
//                 resolve(serverResponse.title ==='Success');
//                 //this.userSession.mail = this.usernameRef.nativeElement.value;
//                 //this.userSession.isconnected = true;
//             }
//             catch(err) {
//                 message += "[Serveur déconnecté. Connexion Impossible]"
//                 reject(err);
//             }
//             this.stateRef.nativeElement.innerHTML = message;
//         });
//     });
// }


  }
