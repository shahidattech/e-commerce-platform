import { Component, OnInit, ElementRef } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from "@angular/http";
import { distinctUntilChanged, debounceTime, switchMap, tap, catchError } from 'rxjs/operators'
import { Subject, Observable, of, concat } from 'rxjs';
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import { Form } from './slideShow';
import { apiService, Person, tag, Role, Author } from '../../shared/services/index';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FORMS } from './radio-data';
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, FormArray, Validators, FormControl, AbstractControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';
import "rxjs/Rx";
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
declare var $: any;
@Component({
  selector: 'app-slideShow',
  templateUrl: './slideShow.component.html',
  styleUrls: ['./slideShow.component.scss'],
  providers: [apiService]
})
export class SlideShowComponent implements OnInit {
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
  TagModel: NgbModalRef;

  SlideShowForm: FormGroup;
  UpdateSLideShowId: string = null;

  public constructor(private _apiService: apiService, private spinner: NgxSpinnerService, private router: Router, private el: ElementRef, private _fb: FormBuilder, private modalService: NgbModal, private route: ActivatedRoute, private http: Http) {
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
    this.SlideShowForm = this._fb.group({
      title: [null, [Validators.required, Validators.minLength(5)]],
      shortTitle: [null, [Validators.required, Validators.minLength(5)]],
      description: [null],
      slideshow_carousel: this._fb.array([this.AddCaurouselImages()]),
    });
  }
  AddCaurouselImages() {
    return this._fb.group({
      events_carousel_images: [null],
      image_caption: [null],
      image_credit: [null],
      imageTitle: [null],
      alt_text: [null]
    });
  }
  get addcarouselArray() {
    return <FormArray>this.SlideShowForm.get('slideshow_carousel');
  }
  addcarousel() {
    this.addcarouselArray.push(this.AddCaurouselImages());
  }
  removecarousel(index) {
    this.addcarouselArray.removeAt(index);
  }
  myCarouselImages: string[] = [];
  get_event_carousel_images(e) {
    //console.log (e.target.files);
    for (var i = 0; i < e.target.files.length; i++) {
      this.myCarouselImages.push(e.target.files[i]);
    }
  }


  myFiles: string[] = [];
  myFeatures: string[] = [];
  myParaGraphImg: string[] = [];
  mySlidImg: string[] = [];

  getFileDetails(e) {
    //console.log (e.target.files);
    for (var i = 0; i < e.target.files.length; i++) {
      this.myFiles.push(e.target.files[i]);
    }
  }
  getslideImg(e) {
    //console.log (e.target.files);
    for (var i = 0; i < e.target.files.length; i++) {
      this.mySlidImg.push(e.target.files[i]);
    }
  }
  submitForm() {
    // this.spinner.show();
    console.log('Submittingcffff');
    
    const file_data = new FormData();
    for (var i = 0; i < this.myCarouselImages.length; i++) {
      file_data.append("slideshow_carousel_images", this.myCarouselImages[i]);
    }
    this._apiService.createSlideShow(Object.assign({ "userId": localStorage.getItem('userId') }, 
    this.SlideShowForm.value)).subscribe(result=>{
      console.log('121', result)
    });
  }
}
