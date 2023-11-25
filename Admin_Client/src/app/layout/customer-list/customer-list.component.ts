import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { apiService } from '../../shared/services/index';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
declare var jquery: any;
import Swal from 'sweetalert2';
declare var $: any;
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-product-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit {
  @ViewChild('TABLE') table: ElementRef;
  users: any;
  // user_activate: FormGroup;
  role_all
  //  = [
  //     { role: 'Author'},
  //     { role: 'Publisher'}
  //  ]; 
  userName: "";
  public data: any = [];
  public filterQuery = "";
  public rowsOnPage = 5;
  public sortBy = "userName";
  public sortOrder = "asc";
  constructor(private router: Router, private apiService: apiService, private spinner: NgxSpinnerService) {
  }
  ngOnInit() {
    this.getCustomersBySellerID();
  }

  // Get data from service
  private getCustomersBySellerID() {
    this.spinner.show();
    // console.log('Getting all products again');
    // let req_data = Object.assign({ "userId": '6059ae7eb7192f4142140e8e', "page": 1 , "month": this.monthValue, "year": this.yearValue });
    let req_data = Object.assign({ "userId": localStorage.getItem('userId'), "page": 1, "month": this.monthValue, "year": this.yearValue });
    this.apiService.getCustomersBySellerID(req_data)
      .subscribe((result) => {
        this.spinner.hide();

        if (result['status'] == 200) {
          this.data = result['data'];
          // console.log(this.data);
          if (this.data) {
            const sortByDate = arr => {
              const sorter = (a, b) => {
                return new Date(b.order.added_date).getTime() - new Date(a.order.added_date).getTime();
              }
              arr.sort(sorter);
            };
            sortByDate(this.data);
          }
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
            this.router.navigate(["/layout/customer-list"]);
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
      }, err => {
        this.spinner.hide();
      });
  }

  ExportTOExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'customerListExport.xlsx');
  }

  getTotal(products) {
    if (products.length == 1 && (products[0].price || products[0].price == 0)) {
      return parseInt(products[0].price) * parseInt(products[0].quantity);
    } else if (products.length > 1) {
      let price = 0;
      for (let i = 0; i < products.length; i++) {
        price += parseInt(products[i].quantity) * parseInt(products[i].price);
        if (i + 1 == products.length) {
          return price;
        }
      }
    } else {
      return null;
    }
  }

  monthValue: any = "1";
  yearValue: any = "2022";

  searchByMonthly() {
    console.log("monthValue", this.monthValue);
    console.log("yearValue", this.yearValue);
    this.getCustomersBySellerID();
  }

}
