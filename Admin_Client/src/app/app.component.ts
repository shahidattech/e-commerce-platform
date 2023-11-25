import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'sweetalert2/src/sweetalert2.scss'
import { UserService } from './shared/services/user.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private userService: UserService) {
  }


  ngOnInit() {
    this.userService.userStatus(Object.assign({ "userId": localStorage.getItem('userId') })).subscribe((res: any) => {
      if (!res.success) {
        this.router.navigate(['/login']);
      }
    });
  }


}
