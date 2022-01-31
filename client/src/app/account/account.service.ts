import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, of, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IUser } from '../shared/models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl
  //BehaviorSubject replaced with ReplaySubject V206
  //1 no of obj that it holds
  private currentUserSource = new ReplaySubject<IUser>(1)
  currenUser$ = this.currentUserSource.asObservable()


  constructor(private http: HttpClient, private router: Router) { }


  // to persist login, load the user from token claims this is use App Component
  loadCurrentUser(token: string) {
    if (token == null) {
      this.currentUserSource.next(null);
      //return observable as null V206 imp
      return of(null)
    }

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);

    return this.http.get(this.baseUrl + 'account', {headers}).pipe(
      map((user: IUser) => {
        if (user) {
          localStorage.setItem('token', user.token);
          this.currentUserSource.next(user);
        }
      })
    )
  }

  //project the response into currentUserSource
  login(values: any){
    return this.http.post(this.baseUrl + 'account/login' , values).pipe(
      map((user: IUser) =>{
        if(user){
          localStorage.setItem('token', user.token)
          this.currentUserSource.next(user)
        }
      })
    )
  }

  register(values: any){
    return this.http.post(this.baseUrl + 'account/register' , values).pipe(
      map((user: IUser) =>{
        if(user){
          localStorage.setItem('token', user.token)
          this.currentUserSource.next(user)
        }
      })
    )
  }

  logout(){
    localStorage.removeItem('token')
    this.currentUserSource.next(null)
    //go to home
    this.router.navigateByUrl('/')
  }

  checkEmailExists(email: string){
    return this.http.get(this.baseUrl + 'account/emailexists?email=' + email);
  }

}
