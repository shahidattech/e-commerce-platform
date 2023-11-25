import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders,HttpParams} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import { Response } from "@angular/http";
import { environment } from '../../../environments/environment';
import {catchError, tap} from 'rxjs/operators';
const httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
};
@Injectable()
export class UserService {
  
  
  constructor(private _http:HttpClient) { }
  

  register(body:any){
    return this._http.post(`${environment.adminServerAddresss}user`,body,{
      observe:'body',
      headers:new HttpHeaders().append('Content-Type','application/json')
    });
  }

  accountUpdate(body:any){
    return this._http.post(`${environment.adminServerAddresss}api/update`,body,{
      observe:'body',
      headers:new HttpHeaders().append('Content-Type','application/json')
    });
  }
  login(body:any): Observable<any> {
    return this._http.post<any>(`${environment.adminServerAddresss}user/login`, JSON.stringify(body),{
      observe:'body',
      headers:new HttpHeaders().append('Content-Type','application/json')
    }).pipe(
       tap((result) => this.save_token(result)),
       catchError(this.handleError<any>('login'))
     );
    }
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            return of(result as T);
        };
    }
    private save_token(data) {
        if (data.success && data.active) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', data.user.firstName);
            localStorage.setItem('userId',data.user.userId);
           // localStorage.setItem('user', data.user.userRole);
            return;
        }
    }
  getAll(){
    return  this._http.get(`${environment.adminServerAddresss}alluserdetails`);
  }
  roleMatch(allowedRoles): boolean {
    var isMatch = false;
    var user = localStorage.getItem('user');
    allowedRoles.forEach(element => {
      if (user.indexOf(element) > -1) {
        isMatch = true;
        return false;
      }
    });
    return isMatch;

  }


  getUserById(id){
    return this._http.get(`${environment.adminServerAddresss}user/`+ id +`/userinfo`);
  }

  getUserSettingsById(id){
    return this._http.get(`${environment.adminServerAddresss}user/`+ id +`/userAccountSettings`);
  }

  userStatus(data){
    return this._http.post(`${environment.adminServerAddresss}checkstatus`, data);
  }
}