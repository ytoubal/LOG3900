import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { IUserInfo } from "../../../../../server/app/interfaces/IUserInfo";
import { ErrorMatcher } from "./errormatcher";
import { SnackbarService } from "src/app/services/snackbar/snackbar.service";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import {
  IResponse,
  Status,
} from "../../../../../server/app/interfaces/IResponse";
import { AuthentificationService } from "src/app/services/authentification/authentification.service";
import { ProfilePic } from "src/app/interfaces/profile-pic";
import { profilePics } from "src/app/const/profile-pics";
import { DATABASE_URL } from "src/app/const/database-url";
import { TranslateService } from "@ngx-translate/core";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
    Authorization: "my-auth-token",
  }),
};

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
})
export class SignupComponent implements OnInit {
  @ViewChild("currentPfp", { static: false }) currentPfp: ElementRef;
  registrationForm: FormGroup;
  passwordForm: FormGroup;

  hidePw = true;
  minPwLength = 8;
  matcher = new ErrorMatcher();

  avatarName: string = "anonymous";
  username: string;
  firstName: string;
  lastName: string;
  password: string;

  pfpOptions: ProfilePic[] = profilePics.slice(0, 10);

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private snackbarService: SnackbarService,
    public http: HttpClient,
    private authService: AuthentificationService,
    public translate: TranslateService
  ) {
    this.registrationForm = this.formBuilder.group({
      fName: [
        "",
        Validators.compose([Validators.required, this.noWhitespaceValidator]),
      ],
      lName: [
        "",
        Validators.compose([Validators.required, this.noWhitespaceValidator]),
      ],
      username: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(10),
          this.noWhitespaceValidator,
        ]),
      ],
    });

    this.passwordForm = this.formBuilder.group(
      {
        pw: [
          "",
          Validators.compose([
            Validators.required,
            this.noWhitespaceValidator,
            Validators.minLength(5),
          ]),
        ],
        confirmPw: [""],
      },
      { validator: this.matchPasswords }
    );
  }

  ngOnInit() {}

  noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || "").trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }

  matchPasswords(group: FormGroup): { notSame: boolean } {
    const pw = group.get("pw").value;
    const confirmPw = group.get("confirmPw").value;

    return pw == confirmPw ? null : { notSame: true };
  }

  changeCurrentPfp(chosenAvatar: ProfilePic): void {
    this.currentPfp.nativeElement.src = chosenAvatar.src;
    this.avatarName = chosenAvatar.name;
  }

  async register() {
    this.authService.username = this.username;
    this.authService.avatar = this.avatarName;
    this.authService.pointsXP = 0;
    this.authService.level = 1;

    const USER_INFO: IUserInfo = {
      public: {
        username: this.username,
        avatar: this.avatarName,
        pointsXP: 0,
        album: [],
        title: "none",
        border: "border0",
      },
      private: {
        firstName: this.firstName,
        lastName: this.lastName,
        gameStats: {
          gamesPlayed: 0,
          gamesWon: 0,
          totalGameTime: 0,
          allGames: [],
        },
        connections: [],
      },
      connection: {
        username: this.username,
        password: this.password,
        socketId: "",
        isConnected: true,
        rooms: [],
      },
    };

    this.http
      .post<any>(
        DATABASE_URL + "/database/registerUserInfo",
        USER_INFO,
        httpOptions
      )
      .subscribe((data: IResponse) => {
        const status = data.status;

        if (status == Status.HTTP_CREATED) {
          const params = new HttpParams().set(
            "username",
            this.authService.username
          ); // Create new HttpParams
          this.http
            .get(DATABASE_URL + "/database/user-avatar", { params })
            .subscribe((data) => {
              this.authService.avatar = JSON.parse(
                JSON.stringify(data)
              ).public.avatar;
            });
          this.authService.connection = new Date().toLocaleString();
          this.authService.firstTime = true;
          this.router.navigate(["/menu"]);
        } else if (status == Status.USER_EXISTS) {
          const lang = this.translate.currentLang.toString();
          if (lang === "en")
            this.snackbarService.openSnackBar(
              "Username already taken. Please choose another.",
              "Close"
            );
          else if (lang === "fr")
            this.snackbarService.openSnackBar(
              "Ce nom est déjà pris.",
              "Fermer"
            );
          else
            this.snackbarService.openSnackBar(
              "Dieser Benutzername ist bereits vergeben.",
              "Schließen"
            );
        }
      });
  }

  goSignIn(): void {
    this.router.navigate(["/"]);
  }
}
