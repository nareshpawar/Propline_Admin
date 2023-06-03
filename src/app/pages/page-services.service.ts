import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PagesComponent } from './pages.component';
@Injectable({
  providedIn: 'root'
})
export class PageServicesService {
  url = environment.baseUrl;
  
  scrollTop = new Subject<any>();
  scroll = this.scrollTop.asObservable();
  
  sendClickevent(event){
    this.scrollTop.next(event);
  }

  getClickEvent(event):Observable<any>{
    
    return this.scrollTop.asObservable();
  }

  constructor(private httpClient: HttpClient){ 
  }



  getCitiesController():Observable<any>{

    return this.httpClient.get<any>(this.url + `/api/cities`);

  }

  getNeighborhoodController():Observable<any>{
    return this.httpClient.get<any>(this.url + `/api/neighborhood`);
  }

  getPropertyTypeController():Observable<any>{
    return this.httpClient.get<any>(this.url + `/api/propertyType`);
  }

  
  getpropertyForData(id):Observable<any>{
    
    const headers:any = { "property_type_id": String(id) };
    return this.httpClient.get<any>(this.url + `/api/propertyType/getPropertyTypeById`,{headers});
  }

  getStreetController():Observable<any>{
    return this.httpClient.get<any>(this.url + `/api/street`);
  }
  getFeatues(){
    return this.httpClient.get<any>(this.url + `/api/street/getFeatures`);
  }

  getPropertyDetails(project_id,finalObject){

      return this.httpClient.post<any>(this.url + `/api/property?project_id=`+project_id,finalObject);
    
  }
  getProperty(){
    return this.httpClient.get<any>(this.url + `/api/property`);
  }
  getPropertyById(id){
    return this.httpClient.get<any>(this.url + `/api/property/byPropertyId?property_id=`+id);

  }

  getCardDetails(id){
    const headers:any = { "property_id": String(id) };
    return this.httpClient.get<any>(this.url + `/api/master/cards`,{headers});
  }

  putCardDetails(cardId,flag){
    const headers:any = { "cardId": String(cardId),
                          "flag": String(flag), 
                        };
    return this.httpClient.put<any>(this.url + `/api/master/cards`,{},{headers});
  }


  postSocietyMaster(st_id,Obj){
    return this.httpClient.post<any>(this.url + `/api/society?street_id=`+st_id,Obj);

  }
  getSocietyMaster(){
    return this.httpClient.get<any>(this.url + `/api/society`);

  }

  postFile(formdta){
    return this.httpClient.post<any>(this.url + `/api/media/uploadImage?property_id=1`,formdta);
  }

  getactivity(id){
    let headers ={
      "property_id" : String(id)
    }
    return this.httpClient.get<any>(this.url + `/api/owner/getActivity`,{headers});

  }
  getTenentData(){
    return this.httpClient.get<any>(this.url + `/api/tenant`);
  }

  login(form){
    return this.httpClient.post<any>(this.url + `/api/users/login?username=` + form.username + `&password=`+ form.password, {});
    
  }

  sendOtp(form){

    return this.httpClient.post<any>(this.url + `/api/users/loginWithOtp?username=`+ form.username +`&password=`+ form.password ,{});
  }

  verifyOtp(form){
    return this.httpClient.post<any>(this.url + `/api/users/verify-otp?username=`+ form.username +`&otp=`+ form.otp ,{});

  }

  isPropertyActive(id,flag,reason){
    return this.httpClient.put<any>(this.url + `/api/property/updateAction?property_id=` + id + `&isPropertyActive=` + flag + `&reason=`+ reason,{});
  }


}
