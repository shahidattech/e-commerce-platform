import { Component, OnInit, ElementRef } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from "@angular/http";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import { Form } from './slider-add';
import { apiService, Person, tag, Role, Author } from '../../../shared/services/index';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FORMS } from './radio-data';
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, FormArray, Validators, FormControl, AbstractControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { environment } from '../../../../environments/environment';

import "rxjs/Rx";
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import { requiredFileType } from './requiredFileType';
declare var $: any;
@Component({
  selector: 'app-slider-add',
  templateUrl: './slider-add.component.html',
  styleUrls: ['./slider-add.component.scss'],
  providers: [apiService]
})
export class SliderAddComponent implements OnInit {
  // uploader = new FileUploader({url: YOUR URL});
  public show: boolean = true;
  public venue: boolean = true;
  public NewTag: string;
  radioSel: any;
  radio_name: string;
  radioSelectedString: string;
  radioList: Form[] = FORMS;

  loading: boolean = false;
  response: string;

  //  dataSaved = false;
  SliderForm: FormGroup;
  UpdateSLideShowId: string = null;

  public constructor(private _apiService: apiService, private spinner: NgxSpinnerService, private router: Router, private el: ElementRef, private _fb: FormBuilder, private modalService: NgbModal, private route: ActivatedRoute, private http: Http) {
    // Radio array to the print of all parts
    this.radioList = FORMS;
    this.radio_name = "";
    this.getSelecteditem();
  }
  toggle() {
    this.show = !this.show;
  }
  toggleVenue() {
    this.venue = !this.venue;
  }
  getSelecteditem() {
    this.radioSel = FORMS.find(Form => Form.value === this.radio_name);
    this.radioSelectedString = JSON.stringify(this.radioSel);
  }
  onItemChange(radio) {
    this.getSelecteditem();
  }
  ngOnInit() {
    // Article form validations
    this.SliderForm = this._fb.group({
      title: [null, [Validators.required, Validators.minLength(5)]],
      slideshow_carousel: this._fb.array([this.AddCaurouselImages()]),
      // slider_image: [null],
      image: new FormControl(null, [Validators.required])
    });
    this.route.paramMap.subscribe(params => {
      let slideShowId = params.get("slideShowId");
      this.UpdateSLideShowId = slideShowId;
      console.log(slideShowId);
      // if (slideShowId)
        // this.getSlideShow(slideShowId);
    })
  }

  AddCaurouselImages() {
    return this._fb.group({
      image: [null]
      // events_carousel_images: [null],
      // image_caption: [null],
      // image_credit: [null],
      // imageTitle: [null],
      // alt_text: [null]
    });
  }
  
  myCarouselImages: string[] = [];
  get_event_carousel_images(e) {
    //console.log (e.target.files);
    for (var i = 0; i < e.target.files.length; i++) {
      this.myCarouselImages.push(e.target.files[i]);
    }
  }

  // address paragraph
  AddImgParagraphGroup() {
    return this._fb.group({
      image_caption_para: [null],
      para_head: [null],
      Para_img_cap_credit: [null],
      image_title_paragraph: [null],
      image_alt_paragraph: [null]
    });
  }
  
  myFiles: string[] = [];
  myFeatures: string[] = [];
  myParaGraphImg: string[] = [];
  mySlidImg: string[] = [];

  // submit to the api
  submitForm() {
    const data = new FormData();
    const file_data = new FormData();
    const fileUploadObject: any = [];
    for (var i = 0; i < this.myCarouselImages.length; i++) {
      file_data.append("slideshow_carousel_images", this.myCarouselImages[i]);
    }
    for (var i = 0; i < this.myFiles.length; i++) {
      file_data.append("uploadFiles", this.myFiles[i]);
      fileUploadObject.push(this.myFiles[i]);
    }
    var keys = Object.keys(this.SliderForm.value);
    if (this.sliderImageFile) {
      file_data.append("sliderImg", this.sliderImageFile);
    }
    if (!this.UpdateSLideShowId) {
      this._apiService.createSlider(
        Object.assign({
          // 'image_file': fileUploadObject
          'sliderImg': this.sliderImageFile
        },
          { "userId": localStorage.getItem('userId') }, this.SliderForm.value))
        .subscribe((result_data: any) => {
          if (result_data["status"] == 200) {
            file_data.append("userId", localStorage.getItem('userId'));
            file_data.append("slideId", result_data["data"]._id);
            this.http.post(`${environment.medaiServerAddress}slider/photo`, file_data).map(result => result.json())
            .subscribe((file_data: any) => {
                if(file_data["status"] == 200){
                  Swal({
                    title: 'Great !! ',
                    text: file_data["data"],
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK'
                  }).then((result) => {
                    if (result.value) {
                      this.router.navigate(["/layout/slider-list"]);
                    }
                  });
                }
                else{
                  Swal({
                    title: 'Sorry ',
                    text: result_data["data"],
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK'
                  }).then((result) => {
                    if (result.value) {
                      this.router.navigate(["/layout/slider-list"]);
                    }
                  });
                }
              });
          }
          else {
            Swal({
              title: 'Sorry ',
              text: result_data["data"],
              type: 'success',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'OK'
            }).then((result) => {
              if (result.value) {
                this.router.navigate(["/layout/slider-list"]);
              }
            });
          }
        });
    }
  }

  // mySliderImage: string[] = [];
  sliderImageFile: any;
  get_image(e){
    console.log(e);
    // for (var i = 0; i < e.target.files.length; i++) {
      // console.log("e.target.files[i]", e.target.files[i]);
      // this.sliderImageFile = e.target.files[i];
    // }

    if(e.target.files.length >0){
      this.sliderImageFile = e.target.files[0];
    }

  }


}
