import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MasterPagesServicesService {
  url = environment.baseUrl;
  constructor(private httpClient: HttpClient){ 
  }
  //////////////////////////////////// get Mrthods ////////////////////////////////////////
  getCitiesController():Observable<any>{
    return this.httpClient.get<any>(this.url + `/api/cities`);
  }
  getNeighborhoodController():Observable<any>{
    return this.httpClient.get<any>(this.url + `/api/neighborhood`);
  }
  getPropertyTypeController():Observable<any>{
    return this.httpClient.get<any>(this.url + `/api/propertyType`);
  }
  getStreetController():Observable<any>{
    return this.httpClient.get<any>(this.url + `/api/street`);
  }
  getProperty(){
    return this.httpClient.get<any>(this.url + `/api/property`);
  }
  
  getFeedbackDetails(){
    return this.httpClient.get<any>(this.url + `/api/feedback`);
  }
  getAgentsDetails(){
    return this.httpClient.get<any>(this.url + `/api/agents`);
  }
  getMissionDetails(){
    return this.httpClient.get<any>(this.url + `/api/mission`);
  }
  getServicesDetails(){
    return this.httpClient.get<any>(this.url + `/api/services`);
  }
  getTestimonialDetails(){
    return this.httpClient.get<any>(this.url + `/api/testimonial`);
  }
  getUserRole(){
    return this.httpClient.get<any>(this.url + `/api/users/roles`);
  }
  getUserData(){
    return this.httpClient.get<any>(this.url + `/api/users`);
  }
  getOwnerData(){
    return this.httpClient.get<any>(this.url + `/api/owner`);

  }
  getTenentData(){
    return this.httpClient.get<any>(this.url + `/api/tenant`);

  }

  getBannerImages(){
    return this.httpClient.get<any>(this.url + `/api/master/banner`);

  }

  getDashboard(){
    return this.httpClient.get<any>(this.url + `/api/master/getDashboardCount`);
  }
  getMapData(){
    return this.httpClient.get<any>(this.url + `/api/master/getMapData`);
    
  }

  getCareerData(){
    return this.httpClient.get<any>(this.url + `/api/careers`);

  }
  ////////////////////////////////// Post Methods///////////////////////////////////////////

  getPropertyDetails(streetId,obj){
    return this.httpClient.post<any>(this.url + `/api/property?street_id=`+streetId ,obj);
  }
  citiesController(data):Observable<any>{
    return this.httpClient.post<any>(this.url +`/api/cities`,data);
  }

  neighborhoodController(data,Id):Observable<any>{
    return this.httpClient.post<any>(this.url + `/api/neighborhood?city_id=`+Id, data);
  }

  propertyTypeController(data):Observable<any>{
    return this.httpClient.post<any>(this.url + `/api/propertyType`,data);
  }

  streetController(Id,neighborhoodObj):Observable<any>{
    return this.httpClient.post<any>(this.url + `/api/street?neighborhood_id=`+Id,neighborhoodObj);
  }

  ourServicesPost(obj):Observable<any>{
    return this.httpClient.post<any>(this.url + `/api/services`,obj);

  }
  ourMissionpost(obj):Observable<any>{
    return this.httpClient.post<any>(this.url + `/api/mission`,obj);
  }
  testimonialPost(obj):Observable<any>{
    return this.httpClient.post<any>(this.url + `/api/testimonial`,obj);
  }
  agentPost(obj):Observable<any>{
    return this.httpClient.post<any>(this.url + `/api/agents`,obj);
  }

  userSubmit(roleId,obj):Observable<any>{
    return this.httpClient.post<any>(this.url + `/api/users?role_id=`+roleId,obj);

  }

  postOwnerDetails(formData,propertyId,flag){
    return this.httpClient.post<any>(this.url + `/api/owner?property_id=`+propertyId +`&doc_flag=`+flag,formData);
  }

  postTenentDetails(formData, ownerId){
    const headers:any = {"ownerId" : String(ownerId)};
    return this.httpClient.post<any>(this.url + `/api/tenant`,formData,{ headers });
  }

  uploadImage(image){
    return this.httpClient.post<any>(this.url + `/api/master/banner`,image);

  }

  postCareerData(data){
    return this.httpClient.post<any>(this.url + `/api/careers`,data);

  }
/////////////////////////////////////////// DELETE ////////////////////////////////////

  deletePropertyTypeController(id :any){
    const headers:any = { "property_type_id": String(id) };
    return this.httpClient.delete(this.url + '/api/propertyType',{headers})
  }


  deleteCityController(id :any){
    // const headers:any = { "property_type_id": String(id) };
    return this.httpClient.delete(this.url + '/api/cities?cityId='+id);
  }
  deleteNeighborhoodController(id :any){
    const headers:any = { "neighborhood_id": String(id) };
    return this.httpClient.delete(this.url + '/api/neighborhood',{headers});
  }

  deleteStreetController(id :any){
    const headers:any = { "street_id": String(id) };
    return this.httpClient.delete(this.url + '/api/street',{headers});
  }

  deleteScocietyController(id :any){
    const headers:any = { "societyId": String(id) };
    return this.httpClient.delete(this.url + '/api/society',{headers});
  }

  deleteServicesController(id :any){
    const headers:any = { "serviceId": String(id) };
    return this.httpClient.delete(this.url + '/api/services',{headers});
  }

  deleteMissionController(id :any){
    const headers:any = { "missionId": String(id) };
    return this.httpClient.delete(this.url + '/api/mission',{headers});
  }
  deleteTestimonialController(id :any){
    const headers:any = { "testimonialId": String(id) };
    return this.httpClient.delete(this.url + '/api/testimonial',{headers});
  }
  deleteAgentController(id :any){
    // const headers:any = { "testimonialId": String(id) };
    return this.httpClient.delete(this.url + '/api/agents?agentId='+id);
  }
  deleteUserController(id :any){
    const headers:any = { "userId": String(id) };
    return this.httpClient.delete(this.url + '/api/users',{headers});
  }

  deleteOwner(id:any){
    const headers:any = { "ownerId": String(id) };
    return this.httpClient.delete(this.url + '/api/owner',{headers});
  }
  deleteTenentDetails(id:any){
    const headers:any = { "tenantId": String(id) };
    return this.httpClient.delete(this.url + '/api/tenant',{headers});
  }
  deleteBannerImage(id:any){
    const headers:any = { "id": String(id) };
    return this.httpClient.delete(this.url + '/api/master/banner',{headers});
  }

  deleteCareerdata(id){
    return this.httpClient.delete(this.url + '/api/careers?jobId='+id); 
  }
}
