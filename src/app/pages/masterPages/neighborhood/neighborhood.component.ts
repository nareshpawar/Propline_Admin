import { Component, OnInit, ViewChild,AfterViewInit, OnDestroy } from '@angular/core';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {MatSort, Sort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table'
import { HeaderShowServiceService } from 'src/app/theme/components/header-show-service.service';
import { PageServicesService } from '../../page-services.service';
import { Subject,takeUntil } from 'rxjs';
import { MasterPagesServicesService } from '../master-pages-services.service';
import { FormBuilder, Validators } from '@angular/forms';
export interface PeriodicElement {
  city: string;
  position: number;
  neighborhood: string;
  
}


@Component({
  selector: 'app-neighborhood',
  templateUrl: './neighborhood.component.html',
  styleUrls: ['./neighborhood.component.scss']
})
export class NeighborhoodComponent implements OnInit,OnDestroy {
  ELEMENT_DATA: PeriodicElement[] = [
    {position: 1, city: 'Pune', neighborhood: "Katraj"},
    {position: 2, city: 'Pune', neighborhood: "Hinjawadi"},
    {position: 3, city: 'Pune', neighborhood: "Shivaji Nagar"},
    {position: 4, city: 'Pune', neighborhood: "Wakad"},
    {position: 5, city: 'Pune', neighborhood: "Yerawada"},
    {position: 6, city: 'Pune', neighborhood: "Chandan Nagar"},
    
  ];
  
  displayedColumns: string[] = ['position', 'city', 'neighborhood','Action'];//,'Delete'
  dataSource;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  changeHederFlag:boolean = true;
  notifier = new Subject();
  cities: any;
  neiborhoodData: any;
  constructor(private _liveAnnouncer: LiveAnnouncer,private _hederShowService:HeaderShowServiceService,
              private _pageService:PageServicesService,
              private _masterPagesService: MasterPagesServicesService,
              private formBuilder: FormBuilder) {
    this._hederShowService.headerFlag.subscribe(res =>{
      this.changeHederFlag = res;
    }) }


  ngOnInit(): void {
    this._hederShowService.headerFlag.next(false);
    this._hederShowService.submitButtonFlag.next(false);

    this.getCitiesController();
    this.getNeighborhoodController();
   

  }
  Form = this.formBuilder.group({
    city: ['',Validators.required],
    neighborhood:  ['',Validators.required],
    neighborhood_id:''

  });
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  

   /** Announce the change in sort state for assistive technology. */
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
  getCitiesController(){
    this._pageService
        .getCitiesController()
        .pipe(takeUntil(this.notifier))
        .subscribe((res : any) => {
        this.cities = res.data;
    })
  }
  getNeighborhoodController(){
    this._masterPagesService.getNeighborhoodController().pipe(takeUntil(this.notifier))
    .subscribe((res : any) => {
     this.neiborhoodData= res.data.map((PD,index) => {
      return {
        position: index+1,
        city: PD.cities.city, 
        neighborhood: PD.neighborhood,
        neighborhood_id:PD.neighborhood_id
      };
    })
    this.dataSource = new MatTableDataSource<PeriodicElement>(this.neiborhoodData);
})
  }
  submitNeighborhood(neighborhood,city){
   if(this.Form.valid){

     this.neiborhoodController(city,neighborhood);
   }else{
    this.Form.markAsTouched();
   }
    
  }
  neiborhoodController(city,neighborhood){
   let obj; 
   let id;
   if( this.Form.value.neighborhood_id != ''){
    obj ={
      "neighborhood":neighborhood,
      "neighborhood_id":this.Form.value.neighborhood_id
     }
   }else{
     obj ={
       "neighborhood":neighborhood,
      }
    } 
    this.cities.forEach(element => {
      if(element.city == city){
        id= element.city_id
      }
    });
 
    
    
   this._masterPagesService.neighborhoodController(obj,id).subscribe(res=>{
    this.Form.reset();
    this.getNeighborhoodController();
   })
  }

  ngOnDestroy(): void {
    this._hederShowService.headerFlag.next(true);
    this._hederShowService.submitButtonFlag.next(true);

  }  
  editData(element){
    this.Form.patchValue(element);
  }

  deleteData(element){
    let id = element.neighborhood_id;
    this._masterPagesService.deleteNeighborhoodController(id).subscribe(res=>{
      this.getNeighborhoodController();
    })
    
  }

}
