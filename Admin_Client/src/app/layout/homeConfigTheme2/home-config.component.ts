import { Component, OnInit } from '@angular/core';
import { apiService } from '../../shared/services/index';
declare var jquery: any;
import Swal from 'sweetalert2';
import { CdkDrag, CdkDragDrop, CdkDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Section } from './config';

@Component({
  selector: 'app-home-config',
  templateUrl: './home-config.component.html',
  styleUrls: ['./home-config.component.scss']
})
export class HomeConfigTheme2Component implements OnInit {
  homeConfigData: any = [];
  allProductsData: any = [];
  homeConfigSection1: any = [];
  homeConfigSection2: any = [];
  homeConfigSection3: any = [];
  pannelmenu: boolean = true;
  section_1 = [];
  section2 = [];
  section3 = [];
  section1_title = '';
  section2_title = '';
  section3_title = '';
  public filterQuery = "";
  section_title = 'Enter section title';
  demoPic = new Array("assets/demo-pic1.png","assets/demo-pic2.png");
  
  constructor(private apiService: apiService) {
  }

  ngOnInit() {
    this.getAllProducts();
    this.getHomeConfig();
  }

  setSection1Title(value) {
    this.section1_title = value;
  }
  setSection2Title(value) {
    this.section2_title = value;
  }
  setSection3Title(value) {
    this.section3_title = value;
  }

  private getHomeConfig() {
    let data = Object.assign({ "userId": localStorage.getItem('userId') });
    this.apiService.getHomeConfigTheme2(data)
      .subscribe((data) => {
        if (data && data.sections && data.sections.length > 0) {
          this.homeConfigData = data;
          this.setHomeConfigData(data.sections[0])
        }
      });
  }

  async setHomeConfigData(sec) {
    console.log(sec);
    let self = this;
    Object.keys(sec).map(function (key) {
      if (key == 'section_1') {
        self.section_1 = sec[key].products ? sec[key].products : [];
        self.section1_title = sec[key].title ? sec[key].title : self.section_title;
      } else if (key == 'section_2') {
        self.section2 = sec[key].products ? sec[key].products : [];
        self.section2_title = sec[key].title ? sec[key].title : self.section_title;
      } else if (key == 'section_3') {
        self.section3 = sec[key].products ? sec[key].products : [];
        self.section3_title = sec[key].title ? sec[key].title : self.section_title;
      }
    });
  }

  drop(event: CdkDragDrop<Section[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      if (event.container.data.length == 4) {
        Swal({
          title: 'Opps!!',
          text: "You have added maximum number of product in this section",
          type: 'error',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
        }).then((result) => {
        })
        setTimeout(() => {
          this.getAllProducts();
        }, 300);
        return;
      } else {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
        setTimeout(() => {
          this.getAllProducts();
        }, 300);
      }
    }
  }

  fakeArray(length: number): Array<any> {
    if (length >= 0) {
      return new Array(length);
    }
  }

  private getAllProducts() {
    this.allProductsData = [];
    let data = Object.assign({ "userId": localStorage.getItem('userId'), "page": 1 });
    this.apiService.getProducts(data)
      .subscribe((data) => {
        if(data['status'] == 200){
          this.allProductsData = data['data']['docs'][0]['products'];
          console.log(this.allProductsData);
        }
      });
  }

  pannelMenu() {
    if (this.pannelmenu) {
      this.pannelmenu = false;
    } else {
      this.pannelmenu = true;
    }
  }

  saveConfig() {
    this.homeConfigSection1 = [];
    this.homeConfigSection2 = [];
    this.homeConfigSection3 = [];

    for (let i = 0; i < this.section_1.length; i++) {
      let data1 = {
        id: this.section_1[i]._id,
        title: this.section_1[i].title,
        short_title: this.section_1[i].short_title,
        price: this.section_1[i].price ? this.section_1[i].price : '',
        size: this.section_1[i].size,
        mainImage: [{
          'location': this.section_1[i].mainImage[0].location
        }],
        // files: [{
        //   'uploadFiles': [{
        //     'location': this.section_1[i].files[0].uploadFiles[0].location
        //   }]
        // }]

      }
      this.homeConfigSection1.push(data1)
    }

    for (let i = 0; i < this.section2.length; i++) {
      let data2 = {
        id: this.section2[i]._id,
        title: this.section2[i].title,
        short_title: this.section2[i].short_title,
        price: this.section2[i].price ? this.section2[i].price : '',
        size: this.section2[i].size,
        mainImage: [{
          'location': this.section2[i].mainImage[0].location
        }],
        // files: [{
        //   'uploadFiles': [{
        //     'location': this.section2[i].files[0].uploadFiles[0].location
        //   }]
        // }]
      }
      this.homeConfigSection2.push(data2)
    }

    for (let i = 0; i < this.section3.length; i++) {
      let data3 = {
        id: this.section3[i]._id,
        title: this.section3[i].title,
        short_title: this.section3[i].short_title,
        price: this.section3[i].price ? this.section3[i].price : '',
        size: this.section3[i].size,
        mainImage: [{
          'location': this.section3[i].mainImage[0].location
        }],
        // files: [{
        //   'uploadFiles': [{
        //     'location': this.section3[i].files[0].uploadFiles[0].location
        //   }]
        // }]
      }
      this.homeConfigSection3.push(data3)
    }

    let homeData = {
      userId: localStorage.getItem('userId'),
      sections: {
        section_1: {
          title: this.section1_title,
          products: this.homeConfigSection1
        },
        section_2: {
          title: this.section2_title,
          products: this.homeConfigSection2
        },
        section_3: {
          title: this.section3_title,
          products: this.homeConfigSection3
        }
      }
    }

    this.apiService.saveHomeConfigTheme2(Object.assign(homeData)).subscribe((result_data: any) => {
      if (result_data && result_data.status == 'success') {
        Swal({
          title: 'Success',
          text: "You have successfully updated your homepage design",
          type: 'success',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
        }).then((result) => {
        })
      } else {
        Swal({
          title: 'Sorry!',
          text: "Server error please try again later",
          type: 'error',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
        });
      }
    }, error => {
      console.log("error", error);
    });
  }

}
