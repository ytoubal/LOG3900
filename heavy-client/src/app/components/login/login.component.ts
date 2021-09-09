import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { AuthentificationService } from "src/app/services/authentification/authentification.service";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { SnackbarService } from "src/app/services/snackbar/snackbar.service";
import {
  IResponse,
  Status,
} from "../../../../../server/app/interfaces/IResponse";
import { DATABASE_URL } from "src/app/const/database-url";
import { ModalService } from "src/app/services/modal/modal.service";
import { Levels } from "src/app/const/levels";
import { TranslateService } from "@ngx-translate/core";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
    Authorization: "my-auth-token",
  }),
};

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  loading = false;
  submitted = false;
  usernameControl = new FormControl(
    "",
    Validators.compose([Validators.maxLength(12), Validators.required])
  );

  passwordControl = new FormControl(
    "",
    Validators.compose([Validators.maxLength(12), Validators.required])
  );

  returnUrl: string;
  loginForm: FormGroup;

  constructor(
    formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthentificationService,
    public http: HttpClient,
    private snackbarService: SnackbarService,
    public translate: TranslateService
  ) {
    this.loginForm = formBuilder.group({
      username: this.usernameControl,
    });
  }

  ngOnInit(): void {}

  async login() {
    if (this.loginForm.valid) {
      this.authService.username =
        this.usernameControl.value !== null
          ? this.usernameControl.value.trim()
          : this.authService.username.trim();

      this.authService.password = this.passwordControl.value;

      this.http
        .post<any>(
          DATABASE_URL + "/database/login",
          {
            username: this.authService.username,
            password: this.authService.password,
          },
          httpOptions
        )
        .subscribe((data: IResponse) => {
          const status = data.status;
          const lang = this.translate.currentLang.toString();
          if (status == Status.USER_EXISTS) {
            const user = JSON.parse(data.message);

            this.authService.avatar = user.avatar;
            this.authService.pointsXP = user.pointsXP;
            this.authService.album = user.album;
            this.authService.level = Levels.find(
              (o) =>
                this.authService.pointsXP >= o.min &&
                this.authService.pointsXP <= o.max
            ).level;
            this.authService.connection = new Date().toLocaleString();
            this.router.navigate(["/menu"]);
          } else if (status == Status.HTTP_NOT_FOUND) {
            if (lang === "en")
              this.snackbarService.openSnackBar(
                "Username or password incorrect.",
                "Close"
              );
            else if (lang === "fr")
              this.snackbarService.openSnackBar(
                "Nom d'utilisateur ou mot de passe invalide.",
                "Fermer"
              );
            else
              this.snackbarService.openSnackBar(
                "Benutzername oder Passwort falsch.",
                "Schließen"
              );
          } else if (status == Status.USER_ALREADY_CONNECTED) {
            if (lang === "en")
              this.snackbarService.openSnackBar(
                "User already connected.",
                "Close"
              );
            else if (lang === "fr")
              this.snackbarService.openSnackBar(
                "Utilisateur déjà connecté.",
                "Fermer"
              );
            else
              this.snackbarService.openSnackBar(
                "Benutzer bereits verbunden.",
                "Schließen"
              );
          } else if (status == Status.USER_INEXISTENT) {
            if (lang === "en")
              this.snackbarService.openSnackBar(
                "Username does not exist.",
                "Close"
              );
            else if (lang === "fr")
              this.snackbarService.openSnackBar(
                "Nom d'utilisateur inexistant.",
                "Fermer"
              );
            else
              this.snackbarService.openSnackBar(
                "Der Benutzername existiert nicht.",
                "Schließen"
              );
          }
        });
    }
  }

  goSignUp(): void {
    this.router.navigate(["/signup"]);
  }
}
