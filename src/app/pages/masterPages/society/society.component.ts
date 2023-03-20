import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSort, Sort } from '@angular/material/sort';
import { Subject, takeUntil } from 'rxjs';
import { HeaderShowServiceService } from 'src/app/theme/components/header-show-service.service';
import { PageServicesService } from '../../page-services.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MasterPagesServicesService } from '../master-pages-services.service';

export interface PeriodicElement {
  position: number;
  society: string;
  location: string;
  street: string;
  neighborhood: string,
  city: string,
}

@Component({
  selector: 'app-society',
  templateUrl: './society.component.html',
  styleUrls: ['./society.component.scss']
})
export class SocietyComponent implements OnInit {
  displayedColumns: string[] = ['position', 'society', 'location', 'street', 'neighborhood', 'city','Action'];//, 'Delete'
  public societyForm: FormGroup;
  notifier = new Subject();
  cities;
  neighborhoods: any;
  streets: any;
  societyData: any;
  societyMaster: PeriodicElement[];
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  neighborhoodsData: any;
  streetsData: any;

  constructor(private fb: FormBuilder,
    private _pageService: PageServicesService, 
    private _liveAnnouncer: LiveAnnouncer,
    private _hederShowService: HeaderShowServiceService,
    private _masterPagesService: MasterPagesServicesService ) { }

  ngOnInit(): void {
    this._hederShowService.headerFlag.next(false);
    this._hederShowService.submitButtonFlag.next(false);
    this.societyForm = this.fb.group({
      society: ['',Validators.required],
      // projectName: '',
      city: ['',Validators.required],
      neighborhood: ['',Validators.required],
      streets: ['',Validators.required],
      location: ['',Validators.required],
      pin: ['',Validators.required],
      society_id:'',
      
    })
    this.getCitiesController();
    this.getStreetController();
    this.getNeighborhoodController();
    this.getSocietyData();
  }
  getCitiesController() {
    this._pageService
      .getCitiesController()
      .pipe(takeUntil(this.notifier))
      .subscribe((res: any) => {
        this.cities = res.data;
      // console.log(this.cities);

      })
  }
  selectCity(city){
      let neighborhoods = [];
      this.neighborhoods = this.neighborhoodsData;
      this.streets = this.streetsData;
      this.neighborhoods.forEach(item => {
       if (item.city_id === city){
        neighborhoods.push(item);
       }
      });
      this.neighborhoods = neighborhoods;
  }
  selectNeighborhood(neighborhood){
    let streets = [];
    this.streets = this.streetsData;
    this.streets.forEach(element => {
        if(element.neighborhood_id === neighborhood){
          streets.push(element);
        }
    });
    this.streets = streets;
  }
  getNeighborhoodController() {
    this._pageService
      .getNeighborhoodController()
      .pipe(takeUntil(this.notifier))
      .subscribe((res: any) => {
        this.neighborhoodsData = res.data.map(neighbor => {
          return {
            neighborhood_id: neighbor.neighborhood_id,
            neighborhood: neighbor.neighborhood,
            city_id: neighbor.cities.city_id,
          };
        })
        this.neighborhoods = this.neighborhoodsData;
      })
      
  }
  getStreetController() {
    this._pageService.getStreetController().pipe(takeUntil(this.notifier)).subscribe((res: any) => {
    
      this.streetsData =res.data.map(street => {
        return {
          street_id: street.street_id,
          street: street.street,
          neighborhood_id: street.neighborhood.neighborhood_id,
          city_id: street.neighborhood.cities.city_id,
        };
      })
      this.streets = this.streetsData;
    })
  }

  getSocietyData() {
    this._pageService.getSocietyMaster().pipe(takeUntil(this.notifier)).subscribe((res: any) => {
      // this.societyData = res.Data;
      // console.log(res.data);
      
      this.societyMaster = res.data.map((ele, index) => {
        return {
          position: index + 1,
          society: ele.society,
          location: ele.location,
          streets_name: ele.streets.street,
          streets:ele.streets.street_id,
          city_name: ele.streets.neighborhood.cities.city,
          city: ele.streets.neighborhood.cities.city_id,
          neighborhood_name: ele.streets.neighborhood.neighborhood,
          neighborhood:ele.streets.neighborhood.neighborhood_id,
          pin:ele.pin,
          society_id: ele.society_id,
        };
      })
      this.dataSource = new MatTableDataSource<PeriodicElement>(this.societyMaster);
    })
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this._hederShowService.headerFlag.next(true);
    this._hederShowService.submitButtonFlag.next(true);
  }

  submit() {
    let Obj;
    let streetData = this.streets.find(item=> item.street_id == this.societyForm.value.streets);
    if(this.societyForm.value.society_id == ""){
      Obj = {
        "location": this.societyForm.value.location,
        "pin": this.societyForm.value.pin,
        "society": this.societyForm.value.society,
      }
    }else{
      Obj = {
        "location": this.societyForm.value.location,
        "pin": this.societyForm.value.pin,
        "society": this.societyForm.value.society,
        "society_id": this.societyForm.value.society_id
      }
    }
    if(this.societyForm.valid){
      let streetId = streetData.street_id

      this._pageService.postSocietyMaster(streetId, Obj).subscribe(res => {
        this.societyForm.reset();
        this.getSocietyData();
      })
    }else{
      Object.keys(this.societyForm.controls).forEach(key =>{
        this.societyForm.controls[key].markAllAsTouched();
     });
    }

  }

  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editData(rowData){
    this.societyForm.patchValue(rowData);
  }
  deleteData(element){
    // console.log(element);
    
    let id = element.society_id;
    this._masterPagesService.deleteScocietyController(id).subscribe(res=>{
      this.getSocietyData();
    })
    
  }
}
