import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Property, Location } from './app.models';
import { AppSettings } from './app.settings';
import { isPlatformBrowser } from '@angular/common';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent, ConfirmDialogModel } from './shared/confirm-dialog/confirm-dialog.component';
import { AlertDialogComponent } from './shared/alert-dialog/alert-dialog.component';
import { TranslateService } from '@ngx-translate/core';

export class Data {
  constructor(public properties: Property[],
              public compareList: Property[],
              public favorites: Property[],
              public locations: Location[]) { }
}

@Injectable({
  providedIn: 'root'
})
export class AppService {
  public Data = new Data(
    [], // properties
    [], // compareList
    [], // favorites
    []  // locations
  )
 
  public url = environment.url + '/assets/data/'; 
  public apiKey = 'AIzaSyAO7Mg2Cs1qzo_3jkKkZAKY6jtwIlm41-I';
  public pripertyData :any ;

  loginAcc = new Subject();

  constructor(public http:HttpClient, 
              private bottomSheet: MatBottomSheet, 
              private snackBar: MatSnackBar,
              public appSettings:AppSettings,
              public dialog: MatDialog,
              public translateService: TranslateService,
              @Inject(PLATFORM_ID) private platformId: Object) { }
    
  public getProperties(): Observable<Property[]>{
    return this.http.get<Property[]>(this.url + 'properties.json');
  }

  public getPropertyById(id): Observable<Property>{
    return this.http.get<Property>(this.url + 'property-' + id + '.json');
  }

  public getFeaturedProperties(): Observable<Property[]>{
    return this.http.get<Property[]>(this.url + 'featured-properties.json');
  } 

  public getRelatedProperties(): Observable<Property[]>{
    return this.http.get<Property[]>(this.url + 'related-properties.json');
  }

  public getPropertiesByAgentId(agentId): Observable<Property[]>{
    return this.http.get<Property[]>(this.url + 'properties-agentid-' + agentId + '.json');
  }

  public getLocations(): Observable<Location[]>{
    return this.http.get<Location[]>(this.url + 'locations.json');
  }

  public getAddress(lat = 40.714224, lng = -73.961452){ 
    return this.http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lng+'&key='+this.apiKey);
  }

  public getLatLng(address){ 
    return this.http.get('https://maps.googleapis.com/maps/api/geocode/json?key='+this.apiKey+'&address='+address);
  }

  public getFullAddress(lat = 40.714224, lng = -73.961452){ 
    return this.http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lng+'&key='+this.apiKey).subscribe(data =>{ 
      return data['results'][0]['formatted_address'];
    });
  }

  public addToCompare(property:Property, component, direction){ 
    if(!this.Data.compareList.filter(item=>item.id == property.id)[0]){
      this.Data.compareList.push(property);
      this.bottomSheet.open(component, {
        direction: direction
      }).afterDismissed().subscribe(isRedirect=>{  
        if(isRedirect){
          if (isPlatformBrowser(this.platformId)) {
            window.scrollTo(0,0);
          }
        }        
      }); 
    } 
  }

  public addToFavorites(property:Property, direction){
    if(!this.Data.favorites.filter(item=>item.id == property.id)[0]){
      this.Data.favorites.push(property);
      this.snackBar.open('The property "' + property.title + '" has been added to favorites.', '×', {
        verticalPosition: 'top',
        duration: 3000,
        direction: direction 
      });  
    }    
  }

  public openConfirmDialog(title:string, message:string) {  
    const dialogData = new ConfirmDialogModel(title, message); 
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "500px",
      data: dialogData
    }); 
    return dialogRef; 
  }

  public openAlertDialog(message:string) {   
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      maxWidth: "400px",
      data: message
    }); 
    return dialogRef; 
  }

  public getTranslateValue(key:string, param:string = null){  
    let value = null;
    this.translateService.get(key, { param: param }).subscribe((res: string) => {
      value = res;
    }) 
    return value; 
  }

  public getPropertyTypes(){
    return [ 
      { property_type_id: 1, property_name: 'Office',   property_desc: "Test" },
      { property_type_id: 2, property_name: 'House',    property_desc: "Test" },
      { property_type_id: 3, property_name: 'Apartment',property_desc: "Test" },
      { property_type_id: 4, property_name: 'Villa', property_desc: "Test" }
    ]
  }

  public getPropertyStatuses(){
    return [ 
      // { id: 1, name: 'For Sale'},
      { id: 1, name: 'For Rent'},
      // { id: 3, name: 'Open House' },
      // { id: 4, name: 'No Fees' },
      // { id: 5, name: 'Hot Offer' },
      // { id: 6, name: 'Sold' }
    ]
  }

  public getCities(){
    return [ 
      { city_id: 1, city: 'New York' },
      { city_id: 2, city: 'Chicago' },
      { city_id: 3, city: 'Los Angeles' },
      { city_id: 4, city: 'Seattle' } 
    ]
  }

  public getNeighborhoods(){
    return [      
      { neighborhood_id: 1,  neighborhood: 'Astoria', city_id: 1 },
      { neighborhood_id: 2,  neighborhood: 'Midtown', city_id: 1 },
      { neighborhood_id: 3,  neighborhood: 'Chinatown', city_id: 1 }, 
      { neighborhood_id: 4,  neighborhood: 'Austin', city_id: 2 },
      { neighborhood_id: 5,  neighborhood: 'Englewood', city_id: 2 },
      { neighborhood_id: 6,  neighborhood: 'Riverdale', city_id: 2 },      
      { neighborhood_id: 7,  neighborhood: 'Hollywood', city_id: 3 },
      { neighborhood_id: 8,  neighborhood: 'Sherman Oaks', city_id: 3 },
      { neighborhood_id: 9,  neighborhood: 'Highland Park', city_id: 3 },
      { neighborhood_id: 10, neighborhood: 'Belltown', city_id: 4 },
      { neighborhood_id: 11, neighborhood: 'Queen Anne', city_id: 4 },
      { neighborhood_id: 12, neighborhood: 'Green Lake', city_id: 4 }      
    ]
  }

  public getStreets(){
    return [      
      { street_id: 1,  street: 'Astoria Street #1', city_id: 1, neighborhood_id: 1},
      { street_id: 2,  street: 'Astoria Street #2', city_id: 1, neighborhood_id: 1},
      { street_id: 3,  street: 'Midtown Street #1', city_id: 1, neighborhood_id: 2 },
      { street_id: 4,  street: 'Midtown Street #2', city_id: 1, neighborhood_id: 2 },
      { street_id: 5,  street: 'Chinatown Street #1', city_id: 1, neighborhood_id: 3 }, 
      { street_id: 6,  street: 'Chinatown Street #2', city_id: 1, neighborhood_id: 3 },
      { street_id: 7,  street: 'Austin Street #1', city_id: 2, neighborhood_id: 4 },
      { street_id: 8,  street: 'Austin Street #2', city_id: 2, neighborhood_id: 4 },
      { street_id: 9,  street: 'Englewood Street #1', city_id: 2, neighborhood_id: 5 },
      { street_id: 10, street: 'Englewood Street #2', city_id: 2, neighborhood_id: 5 },
      { street_id: 11, street: 'Riverdale Street #1', city_id: 2, neighborhood_id: 6 }, 
      { street_id: 12, street: 'Riverdale Street #2', city_id: 2, neighborhood_id: 6 },
      { street_id: 13, street: 'Hollywood Street #1', city_id: 3, neighborhood_id: 7 },
      { street_id: 14, street: 'Hollywood Street #2', city_id: 3, neighborhood_id: 7 },
      { street_id: 15, street: 'Sherman Oaks Street #1', city_id: 3, neighborhood_id: 8 },
      { street_id: 16, street: 'Sherman Oaks Street #2', city_id: 3, neighborhood_id: 8 },
      { street_id: 17, street: 'Highland Park Street #1', city_id: 3, neighborhood_id: 9 },
      { street_id: 18, street: 'Highland Park Street #2', city_id: 3, neighborhood_id: 9 },
      { street_id: 19, street: 'Belltown Street #1', city_id: 4, neighborhood_id: 10 },
      { street_id: 20, street: 'Belltown Street #2', city_id: 4, neighborhood_id: 10 },
      { street_id: 21, street: 'Queen Anne Street #1', city_id: 4, neighborhood_id: 11 },
      { street_id: 22, street: 'Queen Anne Street #2', city_id: 4, neighborhood_id: 11 },
      { street_id: 23, street: 'Green Lake Street #1', city_id: 4, neighborhood_id: 12 },
      { street_id: 24, street: 'Green Lake Street #2', city_id: 4, neighborhood_id: 12 }      
    ]
  }

  public getFeatures(){
    return [ 
      { id: 1, name: 'Air Conditioning', selected: false },
      { id: 2, name: 'Barbeque', selected: false },
      { id: 3, name: 'Dryer', selected: false },
      { id: 4, name: 'Microwave', selected: false }, 
      { id: 5, name: 'Refrigerator', selected: false },
      { id: 6, name: 'TV Cable', selected: false },
      { id: 7, name: 'Sauna', selected: false },
      { id: 8, name: 'WiFi', selected: false },
      { id: 9, name: 'Fireplace', selected: false },
      { id: 10, name: 'Swimming Pool', selected: false },
      { id: 11, name: 'Gym', selected: false },
    ]
  }

  public getPriceIncludes(){
    return [
      {id: "P1",name:"PLC", selected : false},
      {id: "P2",name:"Car Parking", selected : false},
      {id: "P3",name:"Club Membership", selected : false},
    ]
  }
  public getFurnishedItemList(){
    return [{ id:1,name:"Fridge",selected : false, },
      { id:2,
        name:"Sofa",
        selected : false,
      }, 
      { 
        id:2,
        name:"Washing Machine",
        selected : false,
      }, 
      { 
        id:3,
        name:"Dining Table",
        selected : false,
      },
      { 
        id:4,
        name:"Microwave",
        selected : false,
      },
      {
        id:5,
        name:"Gas Connection",
        selected : false,
      },
      {
        id:6,
        name:"Modular kitchen",
        selected : false,
      },
    ]
  }


  public getTransactionType(){
    return [
      { id:1, 
        name:"New Property", 
        selected : false,
        type : "Transaction"
        },
      { id:2, 
        name:"Resale", 
        selected : false,
        type : "Transaction"
        },
    ]
  }

  public getPossessionStatus(){
    return [
      { id:1,
        name:"Under Construction",
        selected : false,
        type: "Possession"  },
      { id:2,
        name:"Ready to Move",
        selected : false,
        type: "Possession" 
      },
    ]
  }
  public getAddFeature(){
    return [
      { id:"AD1",
        name:"Puja Room",
        selected : false,
      },
      { id:"AD2",
        name:"study",
        selected : false,
      },
      { id:"AD3",
        name:"store",
        selected : false,
      },
      { id:"AD4",
        name:"Servent Room",
        selected : false,
      },
      // { id:"AD5",
      //   name:"None of these",
      //   selected : false,
      // },
    ]
  }

  public getOverlooking(){
    return [
      {
      id:1,
      name: "Garden/Park",
      selected:false,
      },
      {
        id:2,
        name: "Pool",
        selected:false,
        },
        {
          id:3,
          name: "Main Road",
          selected:false,
        }
    ]
  }
  public getOverlookingComm(){
    return [
      
        {
          id:1,
          name: "Main Road",
          selected:false,
        },
        {
          id:2,
          name: "Not Available",
          selected:false,
          }

    ]
  }

  public getCarParking(){
    return  [{
        id:1,
        name: "Covered",
        selected:false,
        unit:''
        },
        {
          id:2,
          name: "Open",
          selected:false,
          unit:''
          },
          {
            id:3,
            name: "Common",
            selected:false,
            unit:''
            },
          {
              id:4,
              name: "None Of This",
              selected:false,
              unit:''
          }  

        ]
  }

  public getHomeCarouselSlides(){
    return this.http.get<any[]>(this.url + 'slides.json');
  }


  public filterData(data, params?: any, sort?, page?, perPage?){ 
    if(params){
      if(params.propertyType){
        data = data.filter(property => property.propertyType == params.propertyType.property_type_id)
      }
      if(params.propertyStatus && params.propertyStatus.length){       
        let statuses = [];
        params.propertyStatus.forEach(status => { statuses.push(status.name) });           
        let properties = [];
        data.filter(property =>
          property.propertyStatus.forEach(status => {             
            if(statuses.indexOf(status) > -1){                 
              if(!properties.includes(property)){
                properties.push(property);
              }                
            }
          })
        );
        data = properties;
      }

      if(params.price){
        if(this.appSettings.settings.currency == 'USD'){          
          if(params.price.from){
            data = data.filter(property => {
              if(property.priceDollar.sale && property.priceDollar.sale >= params.price.from ){
                return true;
              }
              if(property.priceDollar.rent && property.priceDollar.rent >= params.price.from ){
                return true;
              } 
              return false;
            });
          }
          if(params.price.to){
            data = data.filter(property => {
              if(property.priceDollar.sale && property.priceDollar.sale <= params.price.to){
                return true;
              }
              if(property.priceDollar.rent && property.priceDollar.rent <= params.price.to){
                return true;
              } 
              return false;
            });          
          }
        }
        if(this.appSettings.settings.currency == 'EUR'){
          if(params.price.from){
            data = data.filter(property => {
              if(property.priceEuro.sale && property.priceEuro.sale >= params.price.from ){
                return true;
              }
              if(property.priceEuro.rent && property.priceEuro.rent >= params.price.from ){
                return true;
              } 
              return false;
            });

          }
          if(params.price.to){
            data = data.filter(property => {
              if(property.priceEuro.sale && property.priceEuro.sale <= params.price.to){
                return true;
              }
              if(property.priceEuro.rent && property.priceEuro.rent <= params.price.to){
                return true;
              } 
              return false;
            });
          }
        }        
      }  

      if(params.city){
        data = data.filter(property => property.city == params.city.name)
      }

      if(params.zipCode){
        data = data.filter(property => property.zipCode == params.zipCode)
      }
      
      if(params.neighborhood && params.neighborhood.length){       
        let neighborhoods = [];
        params.neighborhood.forEach(item => { neighborhoods.push(item.name) });           
        let properties = [];
        data.filter(property =>
          property.neighborhood.forEach(item => {             
            if(neighborhoods.indexOf(item) > -1){                 
              if(!properties.includes(property)){
                properties.push(property);
              }                
            }
          })
        );
        data = properties;
      }

      if(params.street && params.street.length){       
        let streets = [];
        params.street.forEach(item => { streets.push(item.name) });           
        let properties = [];
        data.filter(property =>
          property.street.forEach(item => {             
            if(streets.indexOf(item) > -1){                 
              if(!properties.includes(property)){
                properties.push(property);
              }                
            }
          })
        );
        data = properties;
      }

      if(params.bedrooms){
        if(params.bedrooms.from){
          data = data.filter(property => property.bedrooms >= params.bedrooms.from)
        }
        if(params.bedrooms.to){
          data = data.filter(property => property.bedrooms <= params.bedrooms.to)
        }
      } 
      
      if(params.bathrooms){
        if(params.bathrooms.from){
          data = data.filter(property => property.bathrooms >= params.bathrooms.from)
        }
        if(params.bathrooms.to){
          data = data.filter(property => property.bathrooms <= params.bathrooms.to)
        }
      } 

      if(params.garages){
        if(params.garages.from){
          data = data.filter(property => property.garages >= params.garages.from)
        }
        if(params.garages.to){
          data = data.filter(property => property.garages <= params.garages.to)
        }
      } 

      if(params.area){
        if(params.area.from){
          data = data.filter(property => property.area.value >= params.area.from)
        }
        if(params.area.to){
          data = data.filter(property => property.area.value <= params.area.to)
        }
      } 

      if(params.yearBuilt){
        if(params.yearBuilt.from){
          data = data.filter(property => property.yearBuilt >= params.yearBuilt.from)
        }
        if(params.yearBuilt.to){
          data = data.filter(property => property.yearBuilt <= params.yearBuilt.to)
        }
      }

      if(params.features){       
        let arr = [];
        params.features.forEach(feature => { 
          if(feature.selected)
            arr.push(feature.name);
        });  
        if(arr.length > 0){
          let properties = [];
          data.filter(property =>
            property.features.forEach(feature => {             
              if(arr.indexOf(feature) > -1){                 
                if(!properties.includes(property)){
                  properties.push(property);
                }                
              }
            })
          );
          data = properties;
        }         
        
      }
      
    }
    //for show more properties mock data 
    // for (var index = 0; index < 2; index++) {
    //   data = data.concat(data);        
    // }     
    this.sortData(sort, data);
    return this.paginator(data, page, perPage)
  }

  public sortData(sort, data){
    if(sort){
      switch (sort) {
        case 'Newest':
          data = data.sort((a, b)=> {return <any>new Date(b.published) - <any>new Date(a.published)});           
          break;
        case 'Oldest':
          data = data.sort((a, b)=> {return <any>new Date(a.published) - <any>new Date(b.published)});           
          break;
        case 'Popular':
          data = data.sort((a, b) => { 
            if(a.ratingsValue/a.ratingsCount < b.ratingsValue/b.ratingsCount){
              return 1;
            }
            if(a.ratingsValue/a.ratingsCount > b.ratingsValue/b.ratingsCount){
              return -1;
            }
            return 0; 
          });
          break;
        case 'Price (Low to High)':
          if(this.appSettings.settings.currency == 'USD'){
            data = data.sort((a,b) => {
              if((a.priceDollar.sale || a.priceDollar.rent) > (b.priceDollar.sale || b.priceDollar.rent)){
                return 1;
              }
              if((a.priceDollar.sale || a.priceDollar.rent) < (b.priceDollar.sale || b.priceDollar.rent)){
                return -1;
              }
              return 0;  
            }) 
          }
          if(this.appSettings.settings.currency == 'EUR'){
            data = data.sort((a,b) => {
              if((a.priceEuro.sale || a.priceEuro.rent) > (b.priceEuro.sale || b.v.rent)){
                return 1;
              }
              if((a.priceEuro.sale || a.priceEuro.rent) < (b.priceEuro.sale || b.priceEuro.rent)){
                return -1;
              }
              return 0;  
            }) 
          }
          break;
        case 'Price (High to Low)':
          if(this.appSettings.settings.currency == 'USD'){
            data = data.sort((a,b) => {
              if((a.priceDollar.sale || a.priceDollar.rent) < (b.priceDollar.sale || b.priceDollar.rent)){
                return 1;
              }
              if((a.priceDollar.sale || a.priceDollar.rent) > (b.priceDollar.sale || b.priceDollar.rent)){
                return -1;
              }
              return 0;  
            }) 
          }
          if(this.appSettings.settings.currency == 'EUR'){
            data = data.sort((a,b) => {
              if((a.priceEuro.sale || a.priceEuro.rent) < (b.priceEuro.sale || b.v.rent)){
                return 1;
              }
              if((a.priceEuro.sale || a.priceEuro.rent) > (b.priceEuro.sale || b.priceEuro.rent)){
                return -1;
              }
              return 0;  
            }) 
          }
          break;
        default:
          break;
      }
    }
    return data;
  }

  public paginator(items, page?, perPage?) { 
    var page = page || 1,
    perPage = perPage || 4,
    offset = (page - 1) * perPage,   
    paginatedItems = items.slice(offset).slice(0, perPage),
    totalPages = Math.ceil(items.length / perPage);
    return {
      data: paginatedItems,
      pagination:{
        page: page,
        perPage: perPage,
        prePage: page - 1 ? page - 1 : null,
        nextPage: (totalPages > page) ? page + 1 : null,
        total: items.length,
        totalPages: totalPages,
      }
    };
  }



  public getTestimonials(){
    return [
        { 
            text: 'Donec molestie turpis ut mollis efficitur. Nam fringilla libero vel dictum vulputate. In malesuada, ligula non ornare consequat, augue nibh luctus nisl, et lobortis justo ipsum nec velit. Praesent lacinia quam ut nulla gravida, at viverra libero euismod. Sed tincidunt tempus augue vitae malesuada. Vestibulum eu lectus nisi. Aliquam erat volutpat.', 
            author: 'Mr. Adam Sandler', 
            position: 'General Director', 
            image: 'assets/images/profile/adam.jpg' 
        },
        { 
            text: 'Donec molestie turpis ut mollis efficitur. Nam fringilla libero vel dictum vulputate. In malesuada, ligula non ornare consequat, augue nibh luctus nisl, et lobortis justo ipsum nec velit. Praesent lacinia quam ut nulla gravida, at viverra libero euismod. Sed tincidunt tempus augue vitae malesuada. Vestibulum eu lectus nisi. Aliquam erat volutpat.', 
            author: 'Ashley Ahlberg', 
            position: 'Housewife', 
            image: 'assets/images/profile/ashley.jpg' 
        },
        { 
            text: 'Donec molestie turpis ut mollis efficitur. Nam fringilla libero vel dictum vulputate. In malesuada, ligula non ornare consequat, augue nibh luctus nisl, et lobortis justo ipsum nec velit. Praesent lacinia quam ut nulla gravida, at viverra libero euismod. Sed tincidunt tempus augue vitae malesuada. Vestibulum eu lectus nisi. Aliquam erat volutpat.', 
            author: 'Bruno Vespa', 
            position: 'Blogger', 
            image: 'assets/images/profile/bruno.jpg' 
        },
        { 
            text: 'Donec molestie turpis ut mollis efficitur. Nam fringilla libero vel dictum vulputate. In malesuada, ligula non ornare consequat, augue nibh luctus nisl, et lobortis justo ipsum nec velit. Praesent lacinia quam ut nulla gravida, at viverra libero euismod. Sed tincidunt tempus augue vitae malesuada. Vestibulum eu lectus nisi. Aliquam erat volutpat.', 
            author: 'Mrs. Julia Aniston', 
            position: 'Marketing Manager', 
            image: 'assets/images/profile/julia.jpg' 
        }
    ];
  }

  public getAgents(){
    return [        
        { 
            id: 1,
            fullName: 'Lusia Manuel',
            desc: 'Phasellus sed metus leo. Donec laoreet, lacus ut suscipit convallis, erat enim eleifend nulla, at sagittis enim urna et lacus.',            
            organization: 'HouseKey',
            email: 'lusia.m@housekey.com',
            phone: '(224) 267-1346',
            social: {
              facebook: 'lusia',
              twitter: 'lusia',
              linkedin: 'lusia',
              instagram: 'lusia',
              website: 'https://lusia.manuel.com'
            },
            ratingsCount: 6,
            ratingsValue: 480,
            image: 'assets/images/agents/a-1.jpg' 
        },
        { 
            id: 2,
            fullName: 'Andy Warhol',
            desc: 'Phasellus sed metus leo. Donec laoreet, lacus ut suscipit convallis, erat enim eleifend nulla, at sagittis enim urna et lacus.',            
            organization: 'HouseKey',
            email: 'andy.w@housekey.com',
            phone: '(212) 457-2308',
            social: {
              facebook: '',
              twitter: '',
              linkedin: '',
              instagram: '',
              website: 'https://andy.warhol.com'
            },
            ratingsCount: 4,
            ratingsValue: 400,
            image: 'assets/images/agents/a-2.jpg' 
        },        
        { 
            id: 3,
            fullName: 'Tereza Stiles',
            desc: 'Phasellus sed metus leo. Donec laoreet, lacus ut suscipit convallis, erat enim eleifend nulla, at sagittis enim urna et lacus.',            
            organization: 'HouseKey',
            email: 'tereza.s@housekey.com',
            phone: '(214) 617-2614',
            social: {
              facebook: '',
              twitter: '',
              linkedin: '',
              instagram: '',
              website: 'https://tereza.stiles.com'
            },
            ratingsCount: 4,
            ratingsValue: 380,
            image: 'assets/images/agents/a-3.jpg' 
        },
        { 
          id: 4,
          fullName: 'Michael Blair',
          desc: 'Phasellus sed metus leo. Donec laoreet, lacus ut suscipit convallis, erat enim eleifend nulla, at sagittis enim urna et lacus.',            
          organization: 'HouseKey',
          email: 'michael.b@housekey.com',
          phone: '(267) 388-1637',
          social: {
            facebook: '',
            twitter: '',
            linkedin: '',
            instagram: '',
            website: 'https://michael.blair.com'
          },
          ratingsCount: 6,
          ratingsValue: 480,
          image: 'assets/images/agents/a-4.jpg'  
        },
        { 
            id: 5,
            fullName: 'Michelle Ormond',
            desc: 'Phasellus sed metus leo. Donec laoreet, lacus ut suscipit convallis, erat enim eleifend nulla, at sagittis enim urna et lacus.',            
            organization: 'HouseKey',
            email: 'michelle.o@housekey.com',
            phone: '(267) 388-1637',
            social: {
              facebook: '',
              twitter: '',
              linkedin: '',
              instagram: '',
              website: 'https://michelle.ormond.com'
            },
            ratingsCount: 6,
            ratingsValue: 480, 
            image: 'assets/images/agents/a-5.jpg' 
        }
    ];
  }



  public getClients(){
    return [  
        { name: 'aloha', image: 'assets/images/clients/aloha.png' },
        { name: 'dream', image: 'assets/images/clients/dream.png' },  
        { name: 'congrats', image: 'assets/images/clients/congrats.png' },
        { name: 'best', image: 'assets/images/clients/best.png' },
        { name: 'original', image: 'assets/images/clients/original.png' },
        { name: 'retro', image: 'assets/images/clients/retro.png' },
        { name: 'king', image: 'assets/images/clients/king.png' },
        { name: 'love', image: 'assets/images/clients/love.png' },
        { name: 'the', image: 'assets/images/clients/the.png' },
        { name: 'easter', image: 'assets/images/clients/easter.png' },
        { name: 'with', image: 'assets/images/clients/with.png' },
        { name: 'special', image: 'assets/images/clients/special.png' },
        { name: 'bravo', image: 'assets/images/clients/bravo.png' }
    ];
  }
 
  getFlooring(){ 
    return [ {id:1 ,name:"Ceramic"    ,selected: false}, 
             {id:2 ,name:"Tiles"      ,selected: false}, 
             {id:3 ,name:"Granite"    ,selected: false}, 
             {id:4 ,name:"Marble"     ,selected: false}, 
             {id:5 ,name:"Marbonite"  ,selected: false}, 
             {id:6 ,name:"Mosaic"     ,selected: false}, 
             {id:7 ,name:"Normal"     ,selected: false}, 
             {id:8 ,name:"Tiles/Kotah",selected: false}, 
             {id:9 ,name:"Stone"      ,selected: false}, 
             {id:10,name:"Vitrified"  ,selected: false}, 
             {id:11,name:"Wooden"     ,selected: false},]
   
  }
  getFlooringComm(){ 
    return [ {id:1 ,name:"Ceramic"    ,selected: false}, 
             {id:2 ,name:"Tiles"      ,selected: false}, 
             {id:3 ,name:"Granite"    ,selected: false}, 
             {id:4 ,name:"Marble"     ,selected: false}, 
             {id:5 ,name:"Marbonite"  ,selected: false}, 
             {id:6 ,name:"Mosaic"     ,selected: false}, 
             {id:7 ,name:"Normal"     ,selected: false}, 
             {id:8 ,name:"Tiles/Kotah",selected: false}, 
             {id:9 ,name:"Stone"      ,selected: false}, 
             {id:10,name:"Vitrified"  ,selected: false}, 
             {id:11,name:"Wooden"     ,selected: false},
             {id:11,name:"Bare Shell"     ,selected: false},

            ]
   
  }

  getAmenities(){
    return  [{id:1 ,name:"Air Conditioned",                 selected:false,  },  
             {id:2 ,name:"Banquet Hall",                    selected:false,  },       
             {id:3 ,name:"Bar/Lounge",                      selected:false,  },                      
             {id:4 ,name:"Cafeteria/Food Court",            selected:false,  },                    
             {id:5 ,name:"Club House",                      selected:false,  },                         
             {id:6 ,name:"Concierge Services",              selected:false,  },                       
             {id:7 ,name:"Conference Room",                 selected:false,  },                               
             {id:8 ,name:"DTH Television Facility",         selected:false,  },                              
             {id:9 ,name:"Downtown",                        selected:false,  },                               
             {id:10 ,name:"Fingerprint Access",              selected:false,  },                                       
             {id:11 ,name:"Fireplace",                       selected:false,  },                                 
             {id:12 ,name:"Full Glass Wall",                 selected:false,  },                                    
             {id:13 ,name:"Golf Course",                     selected:false,  },                                      
             {id:14 ,name:"Gymnasium",                       selected:false,  },                      
             {id:15 ,name:"Health club with Steam / Jaccuzi",selected:false,  },                          
             {id:16 ,name:"Helipad",                         selected:false,  },                                          
             {id:17 ,name:"Hilltop",                         selected:false,  },                                             
             {id:18 ,name:"House help accommodation",        selected:false,  },                                             
             {id:19 ,name:"Intercome Facility",               selected:false,  },                                               
             {id:20 ,name:"Internet/Wi-Fi Connectivity",     selected:false,  },                                                  
             {id:21 ,name:"Island Kitchen Layout",           selected:false,  },                                                    
             {id:22 ,name:"Jogging and Strolling Track",     selected:false,  },                                                      
             {id:23 ,name:"Laundry Service",                 selected:false,  },                                                      
             {id:24 ,name:"Lift",                            selected:false,  },                                                 
             {id:25 ,name:"Maintenance Staff",               selected:false,  },                                                    
             {id:26 ,name:"Outdoor Tennis Courts",           selected:false,  },                                                    
             {id:27 ,name:"Park",                            selected:false,  },                                                        
             {id:28 ,name:"Piped Gas",                       selected:false,  },                                                          
             {id:29 ,name:"Power Back Up",                   selected:false,  },                                                        
             {id:30 ,name:"Private Garage",                  selected:false,  },                                                     
             {id:31 ,name:"Private Terrace/Garden",          selected:false,  },                                                     
             {id:32 ,name:"Private jaccuzi",                 selected:false,  },                                                      
             {id:33 ,name:"Private pool",                    selected:false,  },                                       
             {id:34 ,name:"RO Water System",                 selected:false,  },                                         
             {id:35 ,name:"Rain Water Harvesting",           selected:false,  },                                          
             {id:36 ,name:"Reserved Parking",                selected:false,  },                                  
             {id:37 ,name:"Sea facing",                      selected:false,  },                                    
             {id:38 ,name:"Security",                        selected:false,  },                                                     
             {id:39 ,name:"Service/Goods Lift",              selected:false,  },                                                     
             {id:40 ,name:"Sky Villa",                       selected:false,  },                                                         
             {id:41 ,name:"Skydeck",                         selected:false,  },                                                         
             {id:42 ,name:"Skyline View",                    selected:false,  },                                                         
             {id:43 ,name:"Smart Home",                      selected:false,  },                                                      
             {id:44 ,name:"Swimming Pool",                   selected:false,  },                                                          
             {id:45 ,name:"Theme based Architectures",       selected:false,  },                                                                
             {id:46 ,name:"Vaastu Compliant",                selected:false,  },                                                       
             {id:47 ,name:"Visitor Parking",                 selected:false,  },                                                      
             {id:48 ,name:"Waste Disposal",                  selected:false,  },                                                        
             {id:49 ,name:"Water Front",                     selected:false,  },                                                        
             {id:50 ,name:"Water Storage",                   selected:false,  },                                                          
             {id:51 ,name:"Wine Cellar",                     selected:false,  },                                                       
             {id:52 ,name:"Wrap Around Balcony",             selected:false,  },                              
            ]
  }

  getCommercialAmenities(){
    return [{id:1 ,name:"Air Conditioned", selected:false},
            {id:2 ,name:"Intercome facility", selected:false},       
            {id:3 ,name:"Lift",selected:false},                      
            {id:4 ,name:"Power Back Up",selected:false},                    
            {id:6 ,name:"Reserved Parking",selected:false},
            {id:7 ,name:"Security",selected:false},
            {id:8 ,name:"Service/Goods Lift",selected:false},
            {id:9 ,name:"Winter Storage",selected:false},
            {id:10 ,name:"CCTV Camera",selected:false},
            {id:10 ,name:"Cafeteria/Food Court",selected:false},
            {id:10 ,name:"Conference Room",selected:false},
            {id:10 ,name:"Fire Sprinklers",selected:false},
            {id:10 ,name:"Internet/Wi-Fi Connectivity",selected:false},
            {id:10 ,name:"Printer",selected:false},
            {id:10 ,name:"Projector",selected:false},
            {id:10 ,name:"RO Water System",selected:false},
            {id:10 ,name:"Tea/Coffee",selected:false},
            {id:10 ,name:"Visitor Parking",selected:false},
            {id:10 ,name:"Whiteboard",selected:false},
          ]
  }

}
