import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { delay, map } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { catchError } from 'rxjs/operators';
import { User } from '../../model/user';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { environment } from '../../../environments/environment';

export interface Person {
    id: string;
    author: string;
    authorName: string;
    authorTitle: string;
    authorDescription: string;

}

export interface Author {
    id: string;
    fullName: string;
    userName: string;
    phoneNo: string;
    profile: string;

}

export interface Role {
    role: string;
}

export interface tag {
    tagName: string;
    authorName: string;
}

export interface article {
    _Id: string;
    title: string;
}

@Injectable({
    providedIn: 'root'
})
export class apiService {
    // rootUrl = "http://localhost:7001"
    // private URL = 'http://localhost:7001//api/v1/author/getauthor';
    // private ARTISTURL = 'http://localhost:7001/api/v1/artist/getarticle';
    constructor(private http: HttpClient) {
    }

    // Artist get api
    getArtists() {

        return this.http.get<any[]>(`${environment.adminServerAddresss}artist/getartists`);
    }

    // Author get api
    getauthorData() {
        return this.http.get<any[]>(`${environment.adminServerAddresss}author/getauthor`);
    }


    getArticleData() {
        return this.http.get<any[]>(`${environment.adminServerAddresss}article/getArticle`)
    }

    getSlideshowCurrentDateData() {
        return this.http.get<any[]>(`${environment.adminServerAddresss}slideShow/getslideshowcurrentDay`)
    }

    getSlideshowCurrentWeekData() {
        return this.http.get<any[]>(`${environment.adminServerAddresss}slideShow/getslideshowWeek`)
    }

    getSlideshowCurrentMonthData() {
        return this.http.get<any[]>(`${environment.adminServerAddresss}slideShow/getslideshowMonth`)
    }

    addTag(data: string) {
        let bodyData = {
            "tag": data,
            "author": localStorage.getItem('user'),
            "userId": localStorage.getItem('userId')
        }
        return this.http.post<any[]>(`${environment.adminServerAddresss}tags/addTag`, bodyData);
    }

    administration(body: any) {
        console.log(body);
        return this.http.put(`${environment.adminServerAddresss}update/${body.userId}`, body, {
            observe: 'body',
            headers: new HttpHeaders().append('Content-Type', 'application/json')
        });
    }

    sliderConfig(body: any) {
        //console.log(body);
        return this.http.post(`${environment.adminServerAddresss}siteconfiguration/createArticleCountryPos`, body, {
            observe: 'body',
            headers: new HttpHeaders().append('Content-Type', 'application/json')
        });
    }

    trendingConfig(body: any) {
        //console.log(body);
        return this.http.post(`${environment.adminServerAddresss}siteconfiguration/createTrendingArticle`, body, {
            observe: 'body',
            headers: new HttpHeaders().append('Content-Type', 'application/json')
        });
    }

    globalStoriesConfig(body: any) {
        //console.log(body);
        return this.http.post(`${environment.adminServerAddresss}siteconfiguration/topGlobalStories`, body, {
            observe: 'body',
            headers: new HttpHeaders().append('Content-Type', 'application/json')
        });
    }

    popularSlideshow(body: any) {
        //console.log(body);
        return this.http.post(`${environment.adminServerAddresss}siteconfiguration/popularSlideshows`, body, {
            observe: 'body',
            headers: new HttpHeaders().append('Content-Type', 'application/json')
        });
    }

    featuresConfig(body: any) {
        //console.log(body);
        return this.http.post(`${environment.adminServerAddresss}siteconfiguration/features`, body, {
            observe: 'body',
            headers: new HttpHeaders().append('Content-Type', 'application/json')
        });
    }


    accountUpdate(body: any) {
        //  console.log(body);
        let userId = localStorage.getItem('userId');
        console.log(userId);

        return this.http.put(`${environment.adminServerAddresss}update/${userId}`, body, {
            observe: 'body',
            headers: new HttpHeaders().append('Content-Type', 'application/json')
        })


    }

    getAllUserDetails() {
        return this.http.get<any>(`${environment.adminServerAddresss}alluserdetails`)
    }

    getUserRole() {
        return this.http.get<any>(`${environment.adminServerAddresss}user/getRoles`)
    }

    getarticles() {
        let userId = localStorage.getItem('userId');
        return this.http.get<any>(`${environment.adminServerAddresss}article/getArticleByUserId/${userId}`)
    }


    getEvents() {
        let userId = localStorage.getItem('userId');
        return this.http.get<any>(`${environment.adminServerAddresss}event/getEventByUserId/${userId}`)
    }

    getEntityLocation() {
        let userId = localStorage.getItem('userId');
        return this.http.get<any>(`${environment.adminServerAddresss}entityLocation/getVenueByUserId/${userId}`)
    }

    getArtwork() {
        let userId = localStorage.getItem('userId');
        return this.http.get<any>(`${environment.adminServerAddresss}artwork/getArtworkByUserId/${userId}`)
    }

    gethomepageconfig() {
        let userId = localStorage.getItem('userId');
        return this.http.get<any>(`${environment.adminServerAddresss}siteconfiguration/getArticleByUserId/${userId}`)
    }

    getslideshowpageconfig() {
        let userId = localStorage.getItem('userId');
        return this.http.get<any>(`${environment.adminServerAddresss}siteconfiguration/getSlideshowByUserId/`)
    }

    getslideshowpageWeekconfig() {
        let userId = localStorage.getItem('userId');
        return this.http.get<any>(`${environment.adminServerAddresss}siteconfiguration/getSlideshowByUserIdWeek/${userId}`)
    }

    getslideshowpageMonthconfig() {
        let userId = localStorage.getItem('userId');
        return this.http.get<any>(`${environment.adminServerAddresss}siteconfiguration/getSlideshowByUserIdMonth/${userId}`)
    }

    getuserDetails() {
        let userId = localStorage.getItem('userId');
        return this.http.get<any>(`${environment.adminServerAddresss}user/${userId}/userinfo`)
    }

    getvenuesDetails() {
        return this.http.get<any>(`${environment.adminServerAddresss}entityLocation/getvenue`);
    }

    getEventsDetails() {
        return this.http.get<any>(`${environment.adminServerAddresss}event/getEvents`);
    }

    getArtworksDetails() {
        return this.http.get<any>(`${environment.adminServerAddresss}artwork/getartwork`);
    }

    deleteArticle(aricleId) {
        return this.http.delete(`${environment.adminServerAddresss}article/deleteArticle/${aricleId}`)
    }

    deleteEvent(eventId) {
        return this.http.delete(`${environment.adminServerAddresss}event/deleteEvents/${eventId}`)
    }

    deleteArtwork(artworkId) {
        return this.http.delete(`${environment.adminServerAddresss}artwork/deleteArtwork/${artworkId}`)
    }

    deleteTopGlobalStories(aricleId, topGlobalStoriesID) {
        return this.http.delete(`${environment.adminServerAddresss}siteconfiguration/deletetopGlobalStories/${aricleId}/${topGlobalStoriesID}`)
    }

    deleteFeatures(aricleId, FeaturesID) {
        return this.http.delete(`${environment.adminServerAddresss}siteconfiguration/deleteFeatures/${aricleId}/${FeaturesID}`)
    }

    deleteSiteConfiguartion(aricleId, SliderID) {
        return this.http.delete(`${environment.adminServerAddresss}siteconfiguration/deleteSliders/${aricleId}/${SliderID}`)
    }

    deleteTrendingConfig(aricleId, TreindingConfigId) {
        return this.http.delete(`${environment.adminServerAddresss}siteconfiguration/deleteTrending/${aricleId}/${TreindingConfigId}`)
    }

    deletePopularSlideshow(slideshowId, popularSlideshowsID) {
        return this.http.delete(`${environment.adminServerAddresss}siteconfiguration/deletepopularslideshow/${slideshowId}/${popularSlideshowsID}`)
    }


    getArticlebyArticleId(aricleId) {
        return this.http.get(`${environment.adminServerAddresss}article/getArticleByArticleId/${aricleId}`)
    }

    createArtwork(data) {
        let headers = new Headers({ "content-type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(`${environment.adminServerAddresss}artwork/createArtwok`, data)
    }

    gethomeconfigDetails() {
        return this.http.get<any>(`${environment.adminServerAddresss}siteconfiguration/getArticle`)
    }

    getslideshowhomeconfigDetails() {
        return this.http.get<any>(`${environment.adminServerAddresss}siteconfiguration/getSlideshow`)
    }

    addSinglePhoto(data) {
        return this.http.post(`${environment.medaiServerAddress}entityProfileLocation/photo`, data)
    }

    updateVenuPhoto(data) {
        return this.http.post(`${environment.medaiServerAddress}entityProfileLocation/updatePhoto`, data)
    }

    createEntityProfileLocation(data) {
        let headers = new Headers({ "content-type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        data.userId = localStorage.getItem('userId')
        return this.http.post(`${environment.adminServerAddresss}entityLocation/createEntityLocationProfile`, data)
    }

    // createSlideShow(data) {
    //     return this.http.post(`${environment.adminServerAddresss}slideShow/createSlideShow`, data)
    // }

    updateSlideShow(data) {
        return this.http.post(`${environment.adminServerAddresss}slideShow/updateSlideshow`, data)
    }

    getSlideShow() {
        return this.http.get<any[]>(`${environment.adminServerAddresss}slideShow/getSlideShows`)
    }

    getSlideShowBySlideShowId(slideShowId) {
        return this.http.get(`${environment.adminServerAddresss}slideShow/getSlideShowsBySlideShowId/${slideShowId}`)
    }

    createArticle(data) {
        return this.http.post(`${environment.adminServerAddresss}article/createarticle`, data)
    }

    UpdateArticle(data) {
        return this.http.post(`${environment.adminServerAddresss}article/updatearticle`, data)
    }

    createArtists(data) {
        return this.http.post(`${environment.adminServerAddresss}artist/createartist`, data);
    }

    addArtistPhoto(data) {
        return this.http.post(`${environment.medaiServerAddress}artist/photo`, data);
    }

    updateArtistPhoto(data) {
        return this.http.post(`${environment.medaiServerAddress}artist/photoUpdate`, data);
    }

    createAuthor(data) {
        return this.http.post(`${environment.adminServerAddresss}author/createauthor`, data)
    }

    createArticleCountryPos(data) {
        return this.http.post(`${environment.adminServerAddresss}siteconfiguration/createArticleCountryPos`, data)
    }

    gettrends() {
        //let userId = localStorage.getItem('userId');
        return this.http.get<any>(`${environment.adminServerAddresss}trend/getTrend`)
    }

    deleteTrend(TrendId) {
        return this.http.delete(`${environment.adminServerAddresss}trend/deleteTrend/${TrendId}`)
    }

    getTrendbyTrendId(trendId) {
        return this.http.get(`${environment.adminServerAddresss}trend/getTrendByTrendId/${trendId}`)
    }

    getArtworkByArtworkId(id) {
        return this.http.get(`${environment.adminServerAddresss}artwork/getArtworkByArtworkId/${id}`);
    }

    updateArtWork(data) {
        return this.http.post(`${environment.adminServerAddresss}artwork/updateArtwork`, data);
    }

    getEntityLocationByEnityId(id) {
        return this.http.get(`${environment.adminServerAddresss}entityLocation/getentityLocationByEntityId/${id}`);
    }

    updateEntity(data) {
        return this.http.post(`${environment.adminServerAddresss}entityLocation/updateVenue`, data);
    }

    getEventByEventId(id) {
        return this.http.get(`${environment.adminServerAddresss}event/getEventByEventId/${id}`);
    }

    updateEvent(data) {
        return this.http.post(`${environment.adminServerAddresss}event/updateEvent`, data);
    }

    getArtistByArtistId(artistId) {
        return this.http.get(`${environment.adminServerAddresss}artist/getArtistByArtistId/${artistId}`);
    }

    updateArtist(data) {
        return this.http.post(`${environment.adminServerAddresss}artist/updateartists`, data);
    }


    // _________________________________________________

    createProduct(data) {
        return this.http.post(`${environment.adminServerAddresss}product/createproduct`, data)
    }

    updateProduct(data) {
        return this.http.post(`${environment.adminServerAddresss}product/updateproduct`, data)
    }

    updateStoreProfile(data){
        return this.http.post(`${environment.adminServerAddresss}user/updateProfile`, data)
    }
    updateStoreLogo(data){
        return this.http.post(`${environment.medaiServerAddress}product/uploadstoreLogo`, data);
    }

    saveProductCategoryWise(data) {
        return this.http.post(`${environment.adminServerAddresss}product/productSaveCategoryWise`, data)
    }

    // Tag get Api
    getTagData() {
        return this.http.get<any[]>(`${environment.adminServerAddresss}tags/getTag`)
    }


    // products api
    getProductData() {
        return this.http.get<any[]>(`${environment.adminServerAddresss}product/getProducts`)
    }

    getProducts(data) {
        return this.http.post<any>(`${environment.adminServerAddresss}product/getProductsByUserId`, data)
    }


    getReviewedProducts( req_data ) {
        let url = environment.adminServerAddresss + 'product/getReviewedProducts?userId=' + req_data.userId + "&page=" + req_data.page;
        return this.http.get(url);
    }

    getCustomersBySellerID( req_data ) {
        // let url = environment.adminServerAddresss + 'user/getCustomersBySellerID?userId=' + req_data.userId + "&page=" + req_data.page;
        let url = environment.adminServerAddresss + 'user/getCustomersBySellerID?userId=' + req_data.userId + "&page=" + req_data.page + "&month=" + req_data.month + "&year=" + req_data.year;
        return this.http.get(url);
    }

    getdashBoardDataBySellerID( userId ) {
        let url = environment.adminServerAddresss + 'user/getdashBoardDataBySellerID?userId=' + userId;
        return this.http.get(url);
    }
    
    

    reviewApprove( req_data ) {
        let url = environment.adminServerAddresss + 'product/updateReviewedProducts';
        return this.http.post(url, req_data);
    }

    getProductsByUserIdProductId(data) {
        return this.http.post<any>(`${environment.adminServerAddresss}product/getProductsByProductIdUserId`, data)
    }

    deleteProduct(data) {
        return this.http.post(`${environment.adminServerAddresss}product/deleteProduct`, data)
    }

    // category api
    getAllCategories() {
        return this.http.get(`${environment.adminServerAddresss}categories/getCategories`)
    }

    // slide show api
    createSlideShow(data) {
        return this.http.post(`${environment.adminServerAddresss}slideShow/createSlideShow`, data)
    }
    getSlideShowList(data) {
        return this.http.post<any>(`${environment.adminServerAddresss}slideShow/list`, data);
    }

    getRelatedProductList(data) {
        return this.http.post<any>(`${environment.adminServerAddresss}product/getProductsByUserId`, data).pipe(
            map( response => {
                return response.data.docs[0].products;
           } )
          );
    }

    getRelatedSlideShowList(data) {
        return this.http.post<any>(`${environment.adminServerAddresss}slideShow/list`, data).pipe(
            map( response => {
                console.log(response.data.docs[0].slideShows);
                return response.data.docs[0].slideShows;
           
           } )
          );
    }

    deleteSlideShow(data) {
        return this.http.post(`${environment.adminServerAddresss}slideShow/deleteSlideShow`, data)
    }

    // homepage config api
    saveHomeConfig(data) {
        return this.http.post(`${environment.adminServerAddresss}homePageConfig/saveHomeConfig`, data)
    }

    getHomeConfig(data) {
        return this.http.post<any>(`${environment.adminServerAddresss}homePageConfig/getHomeConfig`, data)
    }

    saveHomeConfigTheme2(data) {
        return this.http.post(`${environment.adminServerAddresss}homePageConfig/saveHomeConfigTheme2`, data)
    }

    getHomeConfigTheme2(data) {
        return this.http.post<any>(`${environment.adminServerAddresss}homePageConfig/getHomeConfigTheme2`, data)
    }

    // slider api
    getSliderList(data) {
        return this.http.post<any>(`${environment.adminServerAddresss}slider/list`, data);
    }

    createSlider(data) {
        return this.http.post(`${environment.adminServerAddresss}slider/createSlider`, data)
    }

    deleteSlider(data) {
        return this.http.post(`${environment.adminServerAddresss}slider/deleteSlider`, data)
    }

    getOrderByUserId(userId,page) {
        let url = environment.adminServerAddresss + 'orders/getOrderByUserId?userId=' + userId + "&page=" + page;
        return this.http.get(url);
    }

    getPendingOrdersByUserId(userId,page) {
        let url = environment.adminServerAddresss + 'orders/getPendingOrdersByUserId?userId=' + userId + "&page=" + page;
        return this.http.get(url);
    }

    getshippiedOrdersByUserId(userId,page) {
        let url = environment.adminServerAddresss + 'orders/getshippiedOrdersByUserId?userId=' + userId + "&page=" + page;
        return this.http.get(url);
    }

    
    

    // //Place orders through shipping server / prime server
    // shipWebOrder(data) {
    //     return this.http.post(`${environment.SHIPPING_SERVER_ADDRESS}/websiteshipping/createwebsiteorder`, data);
    // }

    async shipmentCreateOrder(bodyData) {
        const uri = environment.SHIPPING_SERVER_ADDRESS + 'createwebsiteorder';
        const obj = bodyData;
        return this.http.post(uri, obj).toPromise();
      }
    
      async generatePickup(bodyData) {
        const uri = environment.SHIPPING_SERVER_ADDRESS + 'generatepickup';
        console.log('Sending req', uri, bodyData);
        const obj = bodyData;
        return this.http.post(uri, obj).toPromise();
      }

      async getOrdersPageWiseService(para) {
        var seller_id = para["sellerId"];
        var page_no = para["page_no"];
        const uri = environment.SHIPPING_SERVER_ADDRESS + 'getwebsiteorders/orders/pagewise?seller_id=' + seller_id + '&page_no='+page_no;
        return this.http.get(uri).toPromise();
      }
    
      updateOrderStatus(data) {
        return this.http.post(`${environment.adminServerAddresss}orders/updateOrderStatus`, data);
    }

    pendingOrderPaymentStatusComplete(bodyData) {
        return this.http.post(`${environment.adminServerAddresss}orders/pendingOrderPaymentStatusComplete`, bodyData);
    }


    checkSubscription(data) {
        return this.http.get(`${environment.adminServerAddresss}subscription/check/`+data);
    }

    getSubscriptionContent(bodyData) {
        return this.http.post(`${environment.adminServerAddresss}subscription/getSubscriptionContent`, bodyData);
    }

    addSubscription(bodyData) {
        return this.http.post(`${environment.adminServerAddresss}subscription/add`, bodyData);
    }

    paySubscription(bodyData) {
        return this.http.post(`${environment.adminServerAddresss}subscription/pay`, bodyData);
    }

    getOrderByDate(userId,page, bodyData) {
        let url = environment.adminServerAddresss + 'orders/getOrderByDate?userId=' + userId + "&page=" + page;
        return this.http.post(url, bodyData);
    }

}
