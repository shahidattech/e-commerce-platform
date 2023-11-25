import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { first } from 'rxjs/operators';
// import { User } from './user';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { article, apiService } from '../../shared/services/index';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { Subject, Observable, of, concat } from 'rxjs';
import { Http } from "@angular/http";
declare var jquery: any;
import Swal from 'sweetalert2';
declare var $: any;
import { distinctUntilChanged, debounceTime, switchMap, tap, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { title } from 'process';

@Component({
  selector: 'app-product-list',
  templateUrl: './reviewed-product-list.component.html',
  styleUrls: ['./reviewed-product-list.component.scss']
})
export class ReviewedProductListComponent implements OnInit {

  users: any;
  user_activate: FormGroup;
  role_all
  //  = [
  //     { role: 'Author'},
  //     { role: 'Publisher'}
  //  ]; 
  userName: "";
  public data: any[];
  public filterQuery = "";
  public rowsOnPage = 5;
  public sortBy = "userName";
  public sortOrder = "asc";
  constructor(private http: Http, private router: Router, private userservice: UserService, private userService: UserService, private apiService: apiService, private modalService: NgbModal, private _formBuilder: FormBuilder, private spinner: NgxSpinnerService) {
  }
  ngOnInit() {
    this.getReviewedProducts();
    this.user_activate = this._formBuilder.group({
      active: ['', [Validators.required]],
      userRole: ['', [Validators.required]],
      userId: [''],
      filter: [''],
      articles: ['']
    });
  }

  // Get data from service
  private getReviewedProducts() {
    console.log('Getting all products again');
    let req_data = Object.assign({ "userId": localStorage.getItem('userId'), "page": 1 });
    this.apiService.getReviewedProducts(req_data)
      .subscribe((result) => {

        if (result['status'] == 200) {
          this.data = result['data'];
          console.log(this.data);
        }
        else if (result['status'] == 204) {
          Swal({
            title: 'Sorry !! ',
            text: result['data'],
            type: 'success',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
          }).then((result) => {
            this.router.navigate(["/layout/reviewed-product-list"]);
          });
        }
        else {
          Swal({
            title: 'Sorry !!',
            text: "We are facing some technical issue right now, Please try later",
            type: 'success',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
          }).then((result) => {
            this.router.navigate(["/layout/dashboard"]);
          });
        }
      });
  }

  //Get Roles Lit

  public toInt(num: string) {
    return +num;
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
      let data = Object.assign({ "userId": localStorage.getItem('userId'), "productId": item._id, "main_category": item.main_category, "sub_category": item.sub_category, "sub_sub_category": item.sub_sub_category });
      console.log(data);
      this.apiService.deleteProduct(data).subscribe(result => {
        if (result['status'] == 200) {
          this.http.post(`${environment.synchServerAddress}deleteproduct`, data).map(result => result.json())
            .subscribe((elasticdata: any) => {
              console.log("going to fetch prod list again", elasticdata);
              Swal({
                title: result['data'],
                text: "Successfully deleted!",
                type: 'success',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'OK'
                //closeOnConfirm: false,
                //closeOnCancel: false
              }).then((result) => {
                // this.router.navigate(["/layout/product-list"]);
                this.getReviewedProducts();
              });
              // this.getAllProducts();
              // this.router.navigate(["/layout/product-list"]);
            });
        }
        else {
          Swal({
            title: result['data'],
            text: "You won't be able to revert this!",
            type: 'error',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Something went wrong delete the product!'
            //closeOnConfirm: false,
            //closeOnCancel: false
          }).then((result) => {
            // this.router.navigate(["/layout/product-list"]);
            this.getReviewedProducts();
          });
        }
      });
    });
  }

  approve(r, item) {
    console.log(r)
    console.log(item);
    let data = {
      userId: localStorage.getItem('userId'),
      rnrId: r._id,
      productId: item._id
    }
    this.apiService.reviewApprove(data).subscribe(result => {
      console.log(result);
      if (result)
        if (result['status'] == 200) {
          r.isReviewApproved = true;
          Swal({
            text: result['data'],
            title: "Successfully approved!",
            type: 'success',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'OK'
          }).then((result) => {
            
          });
        }
    })

  }
}
