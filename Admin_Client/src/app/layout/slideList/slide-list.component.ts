import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { apiService } from '../../shared/services/index';
import { Router } from '@angular/router';
declare var jquery: any;
import Swal from 'sweetalert2';

@Component({
  selector: 'app-slide-list',
  templateUrl: './slide-list.component.html',
  styleUrls: ['./slide-list.component.scss']
})
export class SlideListComponent implements OnInit {

  users: any;
  user_activate: FormGroup;
  role_all
  userName: "";
  public data: any[];
  public filterQuery = "";
  public rowsOnPage = 5;
  public sortBy = "title";
  public sortOrder = "asc";
  constructor(private apiService: apiService, private _formBuilder: FormBuilder, public router: Router) {
  }
  ngOnInit() {
    this.user_activate = this._formBuilder.group({
      active: ['', [Validators.required]],
      userRole: ['', [Validators.required]],
      userId: [''],
      filter: [''],
      articles: ['']
    });
    this.getSlideList();

  }

  private getSlideList() {
    let data = Object.assign({ "userId": localStorage.getItem('userId'), 'page': 1 });
    this.apiService.getSlideShowList(data)
      .subscribe((result) => {
        console.log('result', result);
        if(result["status"] == 200){
          console.log('43ffffffff', result["data"]["docs"][0].slideShows);
          this.data = result["data"]["docs"][0].slideShows;
        }
        else{
          Swal({
            title: 'Sorry !!',
            text: result["data"],
            type: 'warning',

            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Add One?'
            //closeOnConfirm: false,
            // closeOnCancel: true
          }).then((result) => {
            this.router.navigate(["/layout/slide-show"]);
          });
        }
      });
  }

  deleteItem(item) {
    Swal({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
      //closeOnConfirm: false,
      //closeOnCancel: false
    }).then((result) => {
      if (result.value) {
        Swal(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        );
        let data = Object.assign({ "userId": localStorage.getItem('userId'), "slideShowId": item._id });
        console.log(data);
        this.apiService.deleteSlideShow(data).subscribe(response => {
          this.getSlideList();
        })
      }


    })

  }

  onEdit(item) {
    // this._router.navigateByUrl(`/layout/forms/${item._id}`)
  }


}
