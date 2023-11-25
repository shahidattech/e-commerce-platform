import { Component, OnInit, ElementRef } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from "@angular/http";
import { routerTransition } from '../../router.animations';
import { distinctUntilChanged, debounceTime, switchMap, tap, catchError } from 'rxjs/operators'
import { Subject, Observable, of, concat } from 'rxjs';
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import { Product } from './product';
import { apiService, Person, tag, Role } from '../../shared/services/index';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../environments/environment';
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import "rxjs/Rx";
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import { HttpClient } from '@angular/common/http';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  animations: [routerTransition()],
  providers: [apiService]
})
export class ProductComponent implements OnInit {
  public show: boolean = true;
  public venue: boolean = true;
  public NewTag: string;
  radioSel: any;
  radioSelectedString: string;

  loading: boolean = false;
  response: string;
  TagModel: NgbModalRef;

  productForm: FormGroup;

  tagdata: Observable<tag[]>;
  tagloading = false;
  taginputs$ = new Subject<string>();

  relatedProductData: Observable<tag[]>;
  relatedProductLoading = false;
  relatedProductInputs$ = new Subject<string>();

  relatedSlideShowData: Observable<tag[]>;
  relatedSlideShowLoading = false;
  relatedSlideShowInputs$ = new Subject<string>();

  updateArticle = null;
  uploadedSlideImg: null;
  uploadedParagraphImgs: null;
  uploadedFeatureImg: null;
  uploadFiles: null;

  categories: any = [];
  subsubCat: any = [];
  codList: any = ['Yes', 'No'];
  colorList: any = ['RED', 'BLUE', 'YELLOW', 'GREEN', 'WHITE', 'PINK', 'BLACK', 'VIOLATE', 'DARK GREEN'];
  // '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
  // '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
  // '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
  // '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
  // '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
  // '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
  // '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
  // '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', 
  // '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];
  productId: any;
  productInfo: any;
  public constructor(private _apiService: apiService, private httpClient: HttpClient, private http: Http, private router: Router, private el: ElementRef, private _fb: FormBuilder, private modalService: NgbModal, private route: ActivatedRoute, private spinner: NgxSpinnerService) {
    this.getAllCategories();
  }

  ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('productId');
    console.log(this.productId);

    if (this.productId) {
      this.getProductDetails(this.productId);
    }

    this.loadTag();
    this.loadRelatedProduct();
    this.loadSlideShowProduct();

    $(function () {

      $('.checked_visual_arts').trigger('click');
      $('.product-chooser').not('.disabled').find('.product-chooser-item').on('click', function () {
        $(this).parent().parent().find('.product-chooser-item').removeClass('selected');
        $(this).addClass('selected');
        $(this).find('input[type="radio"]').prop("checked", true);
        // $(this).find('input[type="radio"]');              
      });

    });
    // Article form validations
    this.productForm = this._fb.group({
      title: new FormControl(null, [Validators.required, Validators.minLength(5)]),
      short_title: new FormControl(null, [Validators.required, Validators.minLength(5), Validators.maxLength(180)]),
      description: new FormControl(null, [Validators.required, Validators.minLength(5), Validators.maxLength(2000)]),
      // price: new FormControl(null, [Validators.required]),
      gst: new FormControl(null),
      tags: new FormControl(null),
      main_category: new FormControl(''),
      sub_category: new FormControl(''),
      sub_sub_category: new FormControl(''),
      relatedProducts: new FormControl(null),
      relatedSlideShows: new FormControl(null),
      seo_keywords: new FormControl(null),
      Published: new FormControl(null),
      saveDrafts: new FormControl(null),
      Published_option: new FormControl(null, [Validators.required]),
      main_img_uploader: new FormControl(null),
      // size: new FormControl(null),
      // weight: new FormControl(null, [Validators.required]),
      color: new FormControl(null),
      stock: new FormControl(null),
      // length: new FormControl(null),
      return_policy: new FormControl(null),
      codOption: 'Yes',
      colorOption: new FormControl(''),
      product_images: this._fb.array([this.AddProductImages()]),
      attributes: this._fb.array([this.AddAttributes()])
    });
  }

  have_mainImage: any;
  have_otherImages: any;
  getProductDetails(productId) {
    let req_data = Object.assign({ "userId": localStorage.getItem('userId'), "productId": productId, "page": 1 });
    this._apiService.getProductsByUserIdProductId(req_data)
      .subscribe((result) => {
        console.log(result);
        if (result && result.data && result.data.products) {
          this.productInfo = result.data.products[0];
          result.data.products[0].colorOption = result.data.products[0].color;
          this.productForm.patchValue(result.data.products[0]);
          if (result.data.products[0].Published == "true") {
            this.productForm.patchValue({ "Published_option": 'Published' });
            this.productForm.value.Published = true;
          } else if (this.productForm.value.Published_option == 'saveDrafts') {
            this.productForm.patchValue({ "Published_option": 'saveDrafts' });
            this.productForm.value.saveDrafts = true;
          }
          if (result.data.products[0].related_products) {
            this.productForm.patchValue({ "relatedProducts": result.data.products[0].related_products });
          }

          if (this.productInfo.attributes.length && this.productInfo.attributes.length > 1) {
            for (let ii = 0; ii < result.data.products[0].attributes.length - 1; ii++) {
              this.addAttributes();
              setTimeout(() => {
                this.productForm.patchValue({ "attributes": result.data.products[0].attributes });
              }, 200);
            }
          }
          if (this.productInfo.mainImage && this.productInfo.mainImage.length > 0) {
            console.log("main_img");
            this.have_mainImage = this.productInfo.mainImage[0].location;
          }
          if (this.productInfo.otherImages && this.productInfo.otherImages.length > 0) {
            console.log("otherImages");
            this.have_otherImages = this.productInfo.otherImages;
          }

        }
      });
  }

  getAllCategories() {
    this._apiService.getAllCategories().subscribe(response => {
      console.log(response);
      this.categories = response;
    })
  }

  subCat: any = [];
  private onCategorySelected() {
    // console.log(this.categories.data.find(c => c.key === this.productForm.value.main_category));
    this.subCat = [];
    this.subSubCat = [];
    // console.log(this.productForm.value.main_category);
    // console.log(this.categories);
    setTimeout(() => {
      console.log(this.productForm.value);
      this.subCat = this.categories.data[this.productForm.value.main_category];
      console.log(this.subCat);
    }, 1000);
  }

  subSubCat: any = [];
  private onSubCategorySelected() {
    this.subSubCat = [];

    // console.log(this.productForm.value.sub_category);
    // console.log(this.categories);
    setTimeout(() => {
      this.subSubCat = this.subCat[this.productForm.value.sub_category];
      console.log(this.subSubCat);
    }, 1000);
  }

  clickCategory() {
    this.subsubCat = [];
    // this.productForm.patchValue({ sub_category: null, sub_sub_category: null })
  }

  clickSubCategory(sub_cat, sub_sub_values) {
    // console.log(values);
    this.subsubCat = sub_sub_values;
    console.log(this.subsubCat);
    this.productForm.patchValue({ sub_category: sub_cat, sub_sub_category: null })
  }

  clickSubSubCategory(value) {
    console.log(value);
    this.productForm.patchValue({ sub_sub_category: value })
  }

  // Tag autocomplete section 
  private loadTag() {
    this.tagdata = concat(
      of([]), // default items
      this.taginputs$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        tap(() => this.tagloading = true),
        switchMap(tagdata => this._apiService.getTagData().pipe(
          catchError(() => of([])), // empty list on error
          tap(() => this.tagloading = false)
        ))
      )
    );
  }

  // Tag autocomplete section 
  private loadRelatedProduct() {
    let req_data = Object.assign({ "userId": localStorage.getItem('userId'), "page": 1 });
    this.relatedProductData = concat(
      of([]), // default items
      this.relatedProductInputs$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        tap(() => this.relatedProductLoading = true),
        switchMap(relatedProductData => this._apiService.getRelatedProductList(req_data).pipe(
          // switchMap(relatedProductData => this._apiService.getProductData().pipe(
          // switchMap(relatedProductData => this._apiService.getProducts(data).pipe(
          catchError(() => of([])), // empty list on error
          tap(() => this.relatedProductLoading = false)
        ))
      )
    );
  }

  private loadSlideShowProduct() {
    let data = Object.assign({ "userId": localStorage.getItem('userId'), "page": 1 });
    this.relatedSlideShowData = concat(
      of([]), // default items
      this.relatedSlideShowInputs$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        tap((data) => {
          console.log("jjj", data);
          this.relatedSlideShowLoading = true;
        }),
        switchMap(relatedSlideShowData =>
          this._apiService.getRelatedSlideShowList(data).pipe(
            catchError(() => of([])), // empty list on error
            tap((data1) => {
              this.relatedSlideShowLoading = false;
            })

          )
        )
      )
    );
    console.log(this.relatedSlideShowData);
  }

  myFiles: string[] = [];

  getFileDetails(e) {
    this.myFiles = [];
    //console.log (e.target.files);
    for (var i = 0; i < e.target.files.length; i++) {
      this.myFiles.push(e.target.files[i]);
    }
  }

  submitForm() {
    let self = this;
    if (this.productId) {

      this.checkImagesUploadChanges();

      // if (this.productForm.value.Published_option == 'Published') {
      //   this.productForm.value.Published = true;
      // } else if (this.productForm.value.Published_option == 'saveDrafts') {
      //   this.productForm.value.saveDrafts = true;
      // }
      // this.spinner.show();
      // let otherData = {
      //   "mainImage": this.productInfo.mainImage,
      //   "otherImages": this.productInfo.otherImages,
      //   "added_date": this.productInfo.added_date,
      //   "isReviewed": this.productInfo.isReviewed,
      //   "productId": this.productInfo.productId,
      //   "ratings_reviews": this.productInfo.ratings_reviews,
      //   "views": this.productInfo.views,
      //   "_id": this.productInfo._id,
      //   "main_category": this.productInfo.main_category,
      //   "sub_category": this.productInfo.sub_category,
      //   "sub_sub_category": this.productInfo.sub_sub_category
      // }
      // this._apiService.updateProduct(Object.assign({ "userId": localStorage.getItem('userId'), "product_id": this.productId }, otherData, this.productForm.value))
      //   .subscribe((adminServer_result: any) => {
      //     console.log('adminServer_result=', adminServer_result);
      //     this.spinner.hide();
      //     if (adminServer_result['status'] == 200) {
      //       Swal({
      //         title: 'Thank you',
      //         text: adminServer_result['data'],
      //         type: 'success',
      //         showCancelButton: false,
      //         confirmButtonColor: '#3085d6',
      //         confirmButtonText: 'OK'
      //       }).then((result) => {
      //         this.router.navigate(["/layout/product-list"]);
      //       });
      //     } else {
      //       Swal({
      //         title: 'Thank you',
      //         text: adminServer_result['data'],
      //         type: 'success',
      //         showCancelButton: false,
      //         confirmButtonColor: '#3085d6',
      //         confirmButtonText: 'OK'
      //       })
      //     }


      //   }, err => {
      //     this.spinner.hide();
      //   });

    } else {
      if (this.productForm.value.attributes[0].price == null || this.productForm.value.attributes[0].weight == null) {
        Swal({
          title: 'Error',
          text: "Please enter product weight && price",
          type: 'error',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
        });
        return;
      }
      $(".category_main:checked").each(function (i, item) {
        console.log(item.id);
      });
      // const data = new FormData();
      const file_data = new FormData();
      const fileUploadObject: any = [];
      let mainImageCheckCounter = 0;
      let otherImagesCheckCounter = 0;
      let keyCheckCounter = 0;
      let mainImageCheck = false;
      let otherImagesCheck = false;
      let keyCheck = false;
      // product main image
      for (var i = 0; i < this.myFiles.length; i++) {
        file_data.set("mainImage", this.myFiles[i]);
        fileUploadObject.push(this.myFiles[i]);
        mainImageCheckCounter = mainImageCheckCounter + 1;
        if (mainImageCheckCounter == this.myFiles.length) {
          mainImageCheck = true;
        }
      }
      // product other images
      for (var i = 0; i < this.myProductImages.length; i++) {
        console.log("file otherImages", this.myProductImages[i])
        file_data.append("otherImages", this.myProductImages[i]);
        otherImagesCheckCounter = otherImagesCheckCounter + 1;
        if (otherImagesCheckCounter == this.myProductImages.length) {
          otherImagesCheck = true;
        }
      }
      var keys = Object.keys(this.productForm.value);
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        let field_value = this.productForm.value[key];
        if (key === 'main_category') {
          if (!field_value) {
            $(".category_main:checked").each(function (i, item) {
              console.log(item.id);
              self.productForm.patchValue({ main_category: item.id })
            });
          }
        }
        keyCheckCounter = keyCheckCounter + 1;
        if (keyCheckCounter == keys.length) {
          keyCheck = true;
        }
      }

      if (this.productForm.value.Published_option == 'Published') {
        this.productForm.value.Published = true;
      } else if (this.productForm.value.Published_option == 'saveDrafts') {
        this.productForm.value.saveDrafts = true;
      }
      // this.spinner.show();
      this._apiService.createProduct(Object.assign({ "userId": localStorage.getItem('userId') }, this.productForm.value))
        .subscribe((adminServer_result: any) => {
          console.log('adminServer_result=', adminServer_result);
          let justCreatedProductId = adminServer_result.data;
          if (adminServer_result['status'] == 200) {
            file_data.append("_id", justCreatedProductId);
            file_data.append("userId", localStorage.getItem('userId'));
            this.http.post(`${environment.medaiServerAddress}product/uploadProductImages`, file_data)
              .subscribe((mediaServer_result: any) => {
                if (mediaServer_result['status'] == 200) {
                  console.log('mediaServer_result[data]', mediaServer_result);
                  let cat_sub_subsubData = {
                    "userId": localStorage.getItem('userId'),
                    "productId": justCreatedProductId,
                    "cat_subcat_subsub": mediaServer_result,
                    "isUpdate": true
                  };

                  this._apiService.saveProductCategoryWise(cat_sub_subsubData)
                    .subscribe((cateGoryDatasaveRes: any) => {
                      // this.spinner.hide();
                      if (cateGoryDatasaveRes['status'] == 200) {
                        Swal({
                          title: 'Thank you',
                          text: "Product created successfully. Click ok button to redirect products listing page",
                          type: 'success',
                          showCancelButton: false,
                          confirmButtonColor: '#3085d6',
                          confirmButtonText: 'OK'
                        }).then((result) => {
                          if (result.value) {
                            this.http.post(`${environment.synchServerAddress}product`, cat_sub_subsubData)
                              .subscribe((synServerResult: any) => {
                                if (synServerResult['status'] == 200) {
                                  this.router.navigate(["/layout/product-list"]);
                                }
                                else {
                                  this.router.navigate(["/layout/product-list"]);
                                }
                              });
                          }
                        });
                      }
                      else {
                        Swal({
                          title: 'Error',
                          text: "Error Occurred Arranging internal Data, Please try again!!",
                          type: 'success',
                          showCancelButton: false,
                          confirmButtonColor: '#3085d6',
                          confirmButtonText: 'OK'
                        }).then((result) => {

                        });
                      }
                    });
                }
                else {
                  Swal({
                    title: 'Error',
                    text: "Error occurred while uploading the images!!",
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK'
                  }).then((result) => {

                  });
                }
              });
          }
          else if (adminServer_result['status'] == 422) {
            this.spinner.hide();
            let error = "";
            adminServer_result['data'].errors.forEach(err => {
              error = error + err["msg"] + "|\n";
            });
            Swal({
              title: 'Error',
              text: error,
              type: 'success',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'OK'
            }).then((result) => {

            });
          }
          else {
            this.spinner.hide();
            Swal({
              title: 'Error',
              text: "Please verify the input data and resubmit!!",
              type: 'success',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'OK'
            }).then((result) => {

            });
          }
        });
    }


    // if(mainImageCheck == true && otherImagesCheck == true && keyCheck == true){

    // }
  }

  addTagModal(content: any) {
    console.log(content);
    this.TagModel = this.modalService.open(content)
    this.TagModel.result.then((result) => {
      console.log(`Closed with: ${result}`);
    }, (reason) => {
      console.log(`Dismissed ${reason}`);
    });
  }

  addTag() {
    // let userID = localStorage.getItem('userId');
    if (this.NewTag) {
      this._apiService.addTag(this.NewTag).subscribe(response => {
        if (response['message'] != 'Sucess') {
          alert(response['message'])
        } else {
          this.TagModel.close();
        }
      });
    }
  }

  AddProductImages() {
    return this._fb.group({
      product_image: [null],
      image_caption: [null],
      image_credit: [null],
      imageTitle: [null],
      alt_text: [null]
    });
  }

  get addProductImagesArray() {
    return <FormArray>this.productForm.get('product_images');
  }
  addProductImage() {
    this.addProductImagesArray.push(this.AddProductImages());
  }
  removeProductImage(index) {
    console.log(this.addProductImagesArray);
    this.addProductImagesArray.removeAt(index);
    this.myProductImages.splice(index, 1);
  }

  myProductImages: string[] = [];
  get_product_images(e) {
    for (var i = 0; i < e.target.files.length; i++) {
      this.myProductImages.push(e.target.files[i]);
    }
  }

  AddAttributes() {
    return this._fb.group({
      price: [null],
      weight: [null],
      unit: ['grams'],
      lenght: [null],
      breadth: [null],
      height: [null],
    });
  }

  get addAttributesArray() {
    return <FormArray>this.productForm.get('attributes');
  }
  addAttributes() {
    this.addAttributesArray.push(this.AddAttributes());
  }
  removeAttributes(index) {
    console.log(this.addAttributesArray);
    this.addAttributesArray.removeAt(index);
    this.myAttributes.splice(index, 1);
  }

  myAttributes: string[] = [];
  get_attributes(e) {
    console.log(e);
    // for (var i = 0; i < e.target.files.length; i++) {
    //   this.myAttributes.push(e.target.files[i]);
    // }
  }

  preview() {
    console.log(this.productForm.value);
  }

  checkImagesUploadChanges() {
    let self = this;
    const file_data = new FormData();
    let mainImageCheck = false;
    let otherImagesCheck = false;
    let mainImageCheckCounter = 0;
    let otherImagesCheckCounter = 0;

    for (var i = 0; i < this.myFiles.length; i++) {
      file_data.set("mainImage", this.myFiles[i]);
      mainImageCheckCounter = mainImageCheckCounter + 1;
      if (mainImageCheckCounter == this.myFiles.length) {
        mainImageCheck = true;
      }
    }
    
    for (var i = 0; i < this.myProductImages.length; i++) {
      console.log("file otherImages", this.myProductImages[i])
      file_data.append("otherImages", this.myProductImages[i]);
      otherImagesCheckCounter = otherImagesCheckCounter + 1;
      if (otherImagesCheckCounter == this.myProductImages.length) {
        otherImagesCheck = true;
      }
    }

    if (mainImageCheck == true && otherImagesCheck == true) {
      this.httpClient.post(`${environment.medaiServerAddress}product/uploadProductImagesReturnData`, file_data)
        .subscribe((mediaServer_result: any) => {
          if (mediaServer_result.status == 200) {
            let otherImages =[];
            if (this.have_otherImages && this.have_otherImages.length > 0) {
              otherImages = mediaServer_result.data.otherImages.concat(this.have_otherImages);
            }else{
              otherImages = mediaServer_result.data.otherImages;
            }

            let otherData = {
              "mainImage": mediaServer_result.data.mainImage,
              "otherImages": otherImages,
              "added_date": this.productInfo.added_date,
              "isReviewed": this.productInfo.isReviewed,
              "productId": this.productInfo.productId,
              "ratings_reviews": this.productInfo.ratings_reviews,
              "views": this.productInfo.views,
              "_id": this.productInfo._id,
              "main_category": this.productInfo.main_category,
              "sub_category": this.productInfo.sub_category,
              "sub_sub_category": this.productInfo.sub_sub_category
            }
            this.updateProduct(otherData);
          }
        });
    } else if (mainImageCheck == true) {
      this.httpClient.post(`${environment.medaiServerAddress}product/uploadProductImagesReturnData`, file_data)
        .subscribe((mediaServer_result: any) => {
          if (mediaServer_result.status == 200) {
            let otherData = {
              "mainImage": mediaServer_result.data.mainImage,
              "otherImages": this.productInfo.otherImages,
              "added_date": this.productInfo.added_date,
              "isReviewed": this.productInfo.isReviewed,
              "productId": this.productInfo.productId,
              "ratings_reviews": this.productInfo.ratings_reviews,
              "views": this.productInfo.views,
              "_id": this.productInfo._id,
              "main_category": this.productInfo.main_category,
              "sub_category": this.productInfo.sub_category,
              "sub_sub_category": this.productInfo.sub_sub_category
            }
            this.updateProduct(otherData);
          }
        });
    } else if (otherImagesCheck == true) {
      this.httpClient.post(`${environment.medaiServerAddress}product/uploadProductImagesReturnData`, file_data)
        .subscribe((mediaServer_result: any) => {
          if (mediaServer_result.status == 200) {
            let otherImages =[];
            if (this.have_otherImages && this.have_otherImages.length > 0) {
              otherImages = mediaServer_result.data.otherImages.concat(this.have_otherImages);
            }else{
              otherImages = mediaServer_result.data.otherImages;
            }

            let otherData = {
              "mainImage": this.productInfo.mainImage,
              "otherImages": otherImages,
              "added_date": this.productInfo.added_date,
              "isReviewed": this.productInfo.isReviewed,
              "productId": this.productInfo.productId,
              "ratings_reviews": this.productInfo.ratings_reviews,
              "views": this.productInfo.views,
              "_id": this.productInfo._id,
              "main_category": this.productInfo.main_category,
              "sub_category": this.productInfo.sub_category,
              "sub_sub_category": this.productInfo.sub_sub_category
            }
            this.updateProduct(otherData);
          }
        });
    } else {
      let otherData = {
        "mainImage": this.productInfo.mainImage,
        "otherImages": this.productInfo.otherImages,
        "added_date": this.productInfo.added_date,
        "isReviewed": this.productInfo.isReviewed,
        "productId": this.productInfo.productId,
        "ratings_reviews": this.productInfo.ratings_reviews,
        "views": this.productInfo.views,
        "_id": this.productInfo._id,
        "main_category": this.productInfo.main_category,
        "sub_category": this.productInfo.sub_category,
        "sub_sub_category": this.productInfo.sub_sub_category
      }
      this.updateProduct(otherData);
    }
  }

  updateProduct(otherData) {
    if (this.productForm.value.Published_option == 'Published') {
      this.productForm.value.Published = true;
    } else if (this.productForm.value.Published_option == 'saveDrafts') {
      this.productForm.value.saveDrafts = true;
    }
    this.spinner.show();

    this._apiService.updateProduct(Object.assign({ "userId": localStorage.getItem('userId'), "product_id": this.productId }, otherData, this.productForm.value))
      .subscribe((adminServer_result: any) => {
        console.log('adminServer_result=', adminServer_result);
        this.spinner.hide();
        if (adminServer_result['status'] == 200) {
          Swal({
            title: 'Success',
            text: adminServer_result['data'],
            type: 'success',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
          }).then((result) => {
            this.router.navigate(["/layout/product-list"]);
          });
        } else {
          Swal({
            title: 'Thank you',
            text: adminServer_result['data'],
            type: 'success',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
          })
        }

      }, err => {
        this.spinner.hide();
      });
  }

  removeOtherImage(i) {
    Swal({
      title: 'Are you sure?',
      text: "You want to delete the Primary Image?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.have_otherImages.splice(i, 1);
      }
    });
  }


}
