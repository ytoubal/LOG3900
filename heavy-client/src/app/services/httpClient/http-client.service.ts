import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { IUserInfo } from "../../../../../server/app/interfaces/IUserInfo";
import { catchError } from "rxjs/operators";
import { IResponse } from "../../../../../server/app/interfaces/IResponse";
import { DATABASE_URL } from "src/app/const/database-url";
import { AuthentificationService } from "../authentification/authentification.service";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
    Authorization: "my-auth-token",
  }),
};

@Injectable({
  providedIn: "root",
})
export class HttpClientService {
  constructor(private http: HttpClient, private authService: AuthentificationService) {}

  getUserInfo(params: HttpParams): Observable<IUserInfo> {
    return this.http
      .get<IUserInfo>(DATABASE_URL + "/database/retrieveUserInfo", {
        params,
      })
      .pipe(catchError(this.handleError));
  }

  getAllUsersPublic(): Observable<IUserInfo['public'][]> {
    return this.http
      .get<IUserInfo['public'][]>(DATABASE_URL + "/database/all-usersPublic", {})
      .pipe(catchError(this.handleError));
  }

  updateUserInfo(body: any): Observable<IResponse> {
    return this.http
      .patch<any>(
        DATABASE_URL + "/database/updateUserInfo",
        body,
        httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      console.error("An error occured :", error.error.message);
    }
    return throwError("Something bad happened; please try again later :(");
  }

  deleteDrawing(drawing: string) {
    let params = new HttpParams().set('username', this.authService.username).set('drawing', drawing);
    return this.http.delete<any>(DATABASE_URL + '/database/delete-drawing', {params}).toPromise();
  }
}
