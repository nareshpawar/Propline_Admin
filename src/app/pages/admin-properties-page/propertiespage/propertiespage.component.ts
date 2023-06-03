import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { AppSettings, Settings } from 'src/app/app.settings';
import { Property, Pagination } from '../../../app.models';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { filter, map, Subscription } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { HeaderShowServiceService } from 'src/app/theme/components/header-show-service.service';
import { PageServicesService } from '../../page-services.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'; 
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';

///////////////////////////////////////////////////////////
export interface UserData {
          "sr_no":number,
          "id": string,
          "title": string,
          "covered_image":string,
          "desc": string,
          "propertyType": string, //ele.property_type,
          "propertyStatus": Array<string>,
          "city": string,
          "zipCode": number,
          "neighborhood": Array<string>,
          "street": Array<string>,
          "formattedAddress": string,
          "features": Array<string>,
          "featured": boolean,
          "priceDollar": object,
          "priceEuro": object,
          "bedrooms": string,
          "bathrooms": string,
          "Balconies": string,
          "furnishedStatus": string,
          "total_floor": string,
          "floorNo": string,
          "area": object,
          "additionalFeatures": Array<object>,
          "gallery":Array<object>,
          "plans": Array<object>,
          "videos": Array<object>,
          "lastUpdate": string,
        }

//////////////////////////////////////////////////////////////////

@Component({
  selector: 'app-propertiespage',
  templateUrl: './propertiespage.component.html',
  styleUrls: ['./propertiespage.component.scss']
})
export class PropertiespageComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav') sidenav: any;
  public sidenavOpen: boolean = true;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('empTbSort') empTbSort = new MatSort();
  public properties: Property[]=[];
  public viewType: string = 'grid';
  public viewCol: number = 33.3;
  public searchFields: any;
  public sort: string;
  public count: number = 12;
  public message: string;

  public pagination: Pagination = new Pagination(1, this.count, null, 2, 0, 0);
  public settings: Settings
  public removedSearchField: string;
  public watcher: Subscription;

//////////////////////////////////////////////////////////////////////

displayedColumns: string[] = ["SR No", 'Image', 'Title', 'Action', 'Active/Inactive'];
dataSource: MatTableDataSource<UserData>;
@ViewChild(MatSort) Msort: MatSort;

/////////////////////////////////////////////////////////////////////

  constructor(public appSettings: AppSettings,
    public appService: AppService,
    public mediaObserver: MediaObserver,
    @Inject(PLATFORM_ID) private platformId: Object,
    private _hederShowService: HeaderShowServiceService,
    private _pagesServices: PageServicesService) {

    this.settings = this.appSettings.settings;
    this.watcher = mediaObserver.asObservable()
      .pipe(filter((changes: MediaChange[]) => changes.length > 0), map((changes: MediaChange[]) => changes[0]))
      .subscribe((change: MediaChange) => {
        if (change.mqAlias == 'xs') {
          this.sidenavOpen = false;
          this.viewCol = 100;
        }
        else if (change.mqAlias == 'sm') {
          this.sidenavOpen = false;
          this.viewCol = 50;
        }
        else if (change.mqAlias == 'md') {
          this.viewCol = 50;
          this.sidenavOpen = true;
        }
        else {
          this.viewCol = 33.3;
          this.sidenavOpen = true;
        }
      });


      //////////////////////////////
      // Assign the data to the data source for the table to render
      
      //////////////////////////////
  }

  ngOnInit(): void {

    this._hederShowService.headerFlag.next(false);
    // this._hederShowService.menuFlag.next(false);
    // this._hederShowService.AccountDropdownFlag.next(false);
    this._hederShowService.submitButtonFlag.next(true);
    
      
   

    this.getProperties();
  }
  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.Msort;
    // this.dataSource.sort = this.empTbSort;

  }


  public searchClicked(){ 
    this.properties.length = 0;
    this.getProperties(); 
  }

  public resetLoadMore(){
    this.settings.loadMore.complete = false;
    this.settings.loadMore.start = false;
    this.settings.loadMore.page = 1;
    this.pagination = new Pagination(1, this.count, null, null, this.pagination.total, this.pagination.totalPages);
  }
  public searchChanged(event){   
    event.valueChanges.subscribe(() => {
      this.resetLoadMore();
      this.searchFields = event.value;
      setTimeout(() => {      
        this.removedSearchField = null;
      });
      if(!this.settings.searchOnBtnClick){     
        this.properties.length = 0;  
      }            
    }); 
    event.valueChanges.pipe(debounceTime(500), distinctUntilChanged()).subscribe(() => { 
      if(!this.settings.searchOnBtnClick){     
        this.getProperties(); 
      }
    });       
  } 

  public getProperties() {
    // this.appService.getProperties().subscribe(data => { 
    //   let result = this.filterData(data); 
    //   if(result.data.length == 0){
    //     this.properties.length = 0;
    //     this.pagination = new Pagination(1, this.count, null, 2, 0, 0);  
    //     this.message = 'No Results Found';
    //     return false;
    //   } 
    //   this.properties = result.data; 
    //   this.pagination = result.pagination;
    //   this.message = null;
    // })
    this._pagesServices.getProperty().subscribe(res => {
      let ele = res.data
      let data = res.data.map((ele,i) => {
        return {
          "sr_no": i+1,
          "id": ele.propertyId,
          "property_name":ele?.property_name,
          "covered_image":ele.covered_image,
          "title": ele.society.society,
          "desc": ele.property_desc,
          "propertyType": ele.property_type, //ele.property_type,
          "propertyStatus": [
            ele.property_for
          ],
          "is_property_active":ele.is_property_active,
          "city": ele.society?.streets?.neighborhood?.cities?.city,
          "zipCode": ele.society?.pin,
          "neighborhood": [
            ele.society?.streets?.neighborhood?.neighborhood
          ],
          "street": [
            ele.society?.streets?.street,
          ],

          "formattedAddress": ele.society?.streets?.street + ',' + ele.society?.streets?.neighborhood?.neighborhood + ',' + ele.society?.streets?.neighborhood?.cities?.city, // ele.society.location + ',' +
          "featured": false,
          "priceDollar": {
            "sale": ele.price_details?.expectedPrice,
            "rent": null
          },
          "priceEuro": {
            "sale": null,
            "rent": null
          },
          "bedrooms": ele.property_features?.Bedrooms,
          "bathrooms": ele.property_features?.bathrooms,
          // "garages": 1,
          "Balconies": ele.property_features?.Balconies,
          "furnishedStatus": ele.property_features?.furnishedStatus,
          "total_floor": ele.property_features?.total_floor,
          "floorNo": ele.property_features?.floorNo,
          "area": {
            "value": ele.property_area?.superArea,
            "unit": ele.property_area?.super_major
          },
          "yearBuilt": 2007,
          // "property_posted_on":ele.property_posted_on,
          "additionalFeatures": [
            {
              "name": "Heat",
              "value": "Natural Gas"
            },
            {
              "name": "Roof",
              "value": "Composition/Shingle"
            },
            {
              "name": "Floors",
              "value": "Wall-to-Wall Carpet"
            },
            {
              "name": "Water",
              "value": "District/Public"
            },
            {
              "name": "Cross Streets",
              "value": "Orangethorpe-Gilbert"
            },
            {
              "name": "Windows",
              "value": "Skylights"
            },
            {
              "name": "Flat",
              "value": "5"
            },
            {
              "name": "Childroom",
              "value": "2"
            }
          ],
          "gallery": ele.gallery_media?.map(ele => {
            return {
              "small": ele.small,
              "medium": ele.medium,
              "big": ele.big
            }
          })
          ,
          "published": ele.property_posted_on,
        }
      })
      if(ele.covered_image !== null && ele.covered_image !== undefined){
        data.gallery.unshift({
          "small": ele.covered_image.Small,
          "medium": ele.covered_image.Medium,
          "big": ele.covered_image.Big
        })
      }
      data.reverse();
      this.dataSource = new MatTableDataSource(data);
      
      let result = this.filterData(data);
      if (result.data.length == 0) {
        this.properties.length = 0;
        this.pagination = new Pagination(1, this.count, null, 2, 0, 0);
        this.message = 'No Results Found';
        return false;
      }
      this.properties = result.data;
      this.pagination = result.pagination;
      this.message = null;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.Msort;

    })
  }

  public filterData(data) {
    return this.appService.filterData(data, this.searchFields, this.sort, this.pagination.page, this.pagination.perPage);
  }
  public removeSearchField(field) {
    this.message = null;
    this.removedSearchField = field;
  }
  public resetPagination() {
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.pagination = new Pagination(1, this.count, null, null, this.pagination.total, this.pagination.totalPages);
  }

  public changeCount(count) {
    this.count = count;
    this.properties.length = 0;
    this.resetPagination();
    this.getProperties();
  }
  public changeSorting(sort) {
    this.sort = sort;
    this.properties.length = 0;
    this.getProperties();
  }
  public changeViewType(obj) {
    this.viewType = obj.viewType;
    this.viewCol = obj.viewCol;
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  isPropertyActive(id, event) {
    if (event.checked) {
      let dialogRef = this.appService.openConfirmDialog("Choose Reasons", null);
      dialogRef.componentInstance.id = id;
      dialogRef.componentInstance.propActive = event.checked;
      dialogRef.afterClosed().subscribe(dialogResult => {
        if (!dialogResult) {
          event.source.checked = false;
        }
      });

      // this._pagesServices.isPropertyActive(id, 1,null).subscribe(res => {
      // })
    } else {
      let dialogRef = this.appService.openConfirmDialog("Choose Reasons", null);
      dialogRef.componentInstance.id = id;
      dialogRef.componentInstance.propActive = event.checked;
      dialogRef.afterClosed().subscribe(dialogResult => {
        if (!dialogResult) {
          event.source.checked = true;
        }
      });
    }
  }

  ngOnDestroy(): void {
    // this._hederShowService.menuFlag.next(true);
    this._hederShowService.headerFlag.next(true);
    // this._hederShowService.AccountDropdownFlag.next(true);
    this._hederShowService.submitButtonFlag.next(false);

  }
}
