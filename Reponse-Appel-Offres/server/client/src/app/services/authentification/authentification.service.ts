import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
//import { Profile } from '@app/models/profile';

@Injectable({
  providedIn: "root",
})
export class AuthentificationService {
  // private readonly BASE_URL: string = "http://localhost:3000"; //test
  private readonly BASE_URL: string = "https://painseau.herokuapp.com"; //test

  

  username: string;

  constructor(private http: HttpClient) {}

  login(username) {}

  //logout() {
  // remove user from local storage to log user out
  // localStorage.removeItem('currentUser');
  //this.currentUserSubject.next(null);
  // }

  //Pour le sign up, eventually...
  // signupRequest(userData: {
  //   fName: string,
  //   lName: string,
  //   mail: string,
  //   password: string,
  //   }) {
  //   return this.http
  //       .post<{ title: string; body: string }>(this.BASE_URL + '/auth/reg', userData)
  //       .pipe(catchError(this.handleError<string>('registerRequest error')));
  // }

  //   private handleError<T>(request: string, result?: T) {
  //       return (error: Error): Observable<T> => {
  //         return of(result as T); // Let the app keep running by returning an empty result.
  //     };
  // }
}
