import { Injectable } from '@angular/core';

@Injectable()
export class AuthServiceService {

  constructor() { }

  public getToken(): string {
    return localStorage.getItem('token');
  }

  public isAuthenticated():boolean{
    const token = this.getToken();
   
    // const lastName = localStorage.getItem('user');
     
     if (!token)   {
         //this.router.navigate(['/login']);
         return false;
     }else{
      return true;
     }
     
  }
}
