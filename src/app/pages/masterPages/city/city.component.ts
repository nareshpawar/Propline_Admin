import { Component, OnInit, ViewChild,AfterViewInit, OnDestroy } from '@angular/core';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {MatSort, Sort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table'
import { HeaderShowServiceService } from 'src/app/theme/components/header-show-service.service';
import { MasterPagesServicesService } from '../master-pages-services.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
export interface PeriodicElement {
  city: string;
  position: number;
  // discription: number;
  
}


@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.scss']
})
export class CityComponent implements OnInit,OnDestroy {
  displayedColumns: string[] = ['position', 'city','Action'];//, 'discription','Delete'
  dataSource;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  changeHederFlag:boolean = true;
  cityName;
  @ViewChild('input')city;
  streetData: any;
  cityForm:FormGroup;
  constructor( private _liveAnnouncer: LiveAnnouncer,
               private _hederShowService:HeaderShowServiceService,
               private _masterPagesService: MasterPagesServicesService,
               private fb: FormBuilder) {
      this._hederShowService.headerFlag.subscribe(res =>{
      this.changeHederFlag = res;
    }) }
  ngOnInit(): void {
    this._hederShowService.headerFlag.next(false);
    this._hederShowService.submitButtonFlag.next(false);
    this.cityForm=this.fb.group({
      city:['',Validators.required],
      city_id:''
    })
    this.getCitiesController();
    // this.dataSource = new MatTableDataSource<PeriodicElement>(this.ELEMENT_DATA);

  }
  getCitiesController(){
    this._masterPagesService.getCitiesController().subscribe(res=>{
      this.streetData = res?.data?.map((PD,index) => {
        return {
          position: index+1,
          city: PD.city, 
          city_id:PD.city_id
          // discription: "Discription"
        };
      })
      this.dataSource= new MatTableDataSource<PeriodicElement>(this.streetData);
      this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    })
  }
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

  ngOnDestroy(): void {
    this._hederShowService.headerFlag.next(true);
    this._hederShowService.submitButtonFlag.next(true);

  }
  submitCity(name){
    if(this.cityForm.valid){
      this.citiesController(name);
    }else{
      Object.keys(this.cityForm.controls).forEach(key =>{
        this.cityForm.controls[key].markAllAsTouched();
        
     });
    }
  }

  citiesController(name){
    let data ;
    if(this.cityForm.value.city_id != ''){
      data = { 
        "city":name,
        "city_id":this.cityForm.value.city_id
      }
    }else{
      data = { 
        "city":name
      }
    }
    
    this._masterPagesService.citiesController(data).subscribe(res=>{
      this.city.nativeElement.value='';
      this.getCitiesController();
    })

  }

  editData(data){
    this.cityForm.patchValue(data);

  }
  deleteData(element){
    let Id = element.city_id;
    this._masterPagesService.deleteCityController(Id).subscribe(res=>{
      this.getCitiesController();
    })
  }

}
