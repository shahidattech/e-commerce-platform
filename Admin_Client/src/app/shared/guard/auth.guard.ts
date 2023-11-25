import { Injectable } from '@angular/core';
import { CanActivate,ActivatedRouteSnapshot,RouterStateSnapshot } from '@angular/router';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(public userService: UserService,private router: Router) {}
    canActivate(next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean {
   if (localStorage.getItem('token') != null)
      {
        let role = next.data["role"] as Array<string>;
        if (role) {
          var match = this.userService.roleMatch(role);
          if (match) return true;
          else {
            this.router.navigate(['/access-denied']);
            return false;
          }
        }
        else
          return true;
      }
      this.router.navigate(['/login']);
      return false;
  } 
  
  }
