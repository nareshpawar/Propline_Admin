import { Component, OnInit, ViewChild,AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {MatSort, Sort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table'
import { HeaderShowServiceService } from 'src/app/theme/components/header-show-service.service';
import { PageServicesService } from '../../page-services.service';
import { MasterPagesServicesService } from '../master-pages-services.service';
import { Subject,takeUntil } from 'rxjs';
import { FormControl, FormBuilder, Validators } from '@angular/forms';
export interface PeriodicElement {
  city: string;
  position: number;
  Neighborhood : string;
  Street: string;
}

@Component({
  selector: 'app-street',
  templateUrl: './street.component.html',
  styleUrls: ['./street.component.scss']
})
export class StreetComponent implements OnInit,OnDestroy {
  ELEMENT_DATA: PeriodicElement[] = [
    {position: 1, city: 'Pune',   Neighborhood: "wakad",   Street:  "E Square Cinemas(Xion Mall) Hinjewadi Phase 1, Wakad, Pimpri Chinchwad, Pune"},
    {position: 2, city: 'Pune',   Neighborhood: "katraj",   Street: "Behind Bharati vidyapith,Vighnaharta Nagar, Katraj,Pune"},
    {position: 3, city: 'Pune',   Neighborhood: "Yerawada", Street: "Shivswarup Developers ,Shastrinagar, Yerawada,Pune"},
    {position: 4, city: 'Pune',   Neighborhood: "Yerawada", Street: "Ramesh Hermes Heritage Phase 1, Shastrinagar, Yerawada,Pune"},
    {position: 5, city: 'Pune',   Neighborhood: "wakad",    Street: "Mana-mandir Society, Wakad, Pimpri Chinchwad, Pune,"},
    {position: 6, city: 'Pune',   Neighborhood: "wakad",    Street: "Shankar Kalat Nagar, Wakad, Pimpri Chinchwad, Pune,"},
  
  ];
  displayedColumns: string[] = ['position', 'city', 'Neighborhood', 'Street','Action'];//,'Delete'
  dataSource ;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  changeHederFlag:boolean = true;
  streets: any;
  neighborhoods: any;
  @ViewChild('neighborhood') neighborhoodInput: ElementRef<HTMLInputElement>;
  @ViewChild('street') streetInput: ElementRef<HTMLInputElement>;
  streetData: any;
  streetForm: any;
  constructor(private _liveAnnouncer: LiveAnnouncer,private _hederShowService:HeaderShowServiceService,
              private _pageService:PageServicesService,
              private _masterPagesService: MasterPagesServicesService,
              private formBuilder: FormBuilder,) {
    this._hederShowService.headerFlag.subscribe(res =>{
      this.changeHederFlag = res;
    }) }

  ngOnInit(): void {
    this._hederShowService.headerFlag.next(false);
    this._hederShowService.submitButtonFlag.next(false);

   
    // this.dataSource = new MatTableDataSource<PeriodicElement>(this.ELEMENT_DATA);
    this.streetForm = this.formBuilder.group({
      neighborhood: [null,Validators.required],
      street: ['',Validators.required],
      street_id:''
    });

    this.getNeighborhoodController();
    this.getStreetController()
    
  }
  notifier= new Subject();
  
  getNeighborhoodController(){
    this._pageService
        .getNeighborhoodController()
        .pipe(takeUntil(this.notifier))
        .subscribe((res : any) => {
          // console.log(res.data);
          (res.data)
        this.neighborhoods = res.data.map(neighbor => {
          return {
            neighborhood_id: neighbor.neighborhood_id,
            neighborhood: neighbor.neighborhood,
            city_id: neighbor.cities.city_id,
          };
        })
    })
  }

  getStreetController(){
    this._masterPagesService.getStreetController().pipe(takeUntil(this.notifier))
    .subscribe((res : any) => {
      // console.log(res.data);
      
      this.streetData= res.data.map((PD,index) => {
        return {
          position: index+1,
          city: PD.neighborhood.cities.city, 
          neighborhood: PD.neighborhood.neighborhood,
          street:PD.street,
          street_id: PD.street_id
        };
      })
      this.dataSource = new MatTableDataSource<PeriodicElement>(this.streetData);
   
        })
  }

  submitStreet(neighborhood,street){
    let neighborhoodObj;
    let Id;
    if(this.streetForm.value.street_id != ''){
       neighborhoodObj ={
        street : street,
        street_id: this.streetForm.value.street_id
      }
    }else{
       neighborhoodObj ={
        street : street,
      }
    }
    this.neighborhoods.forEach(element => {
      if(element.neighborhood == neighborhood){
          Id =element.neighborhood_id;
      }
    });

    if(this.streetForm.valid){
      this.postStreetController(Id,neighborhoodObj);
    }else if(this.streetForm.invalid){
      // console.log(this.streetForm.controls);
      
      Object.keys(this.streetForm.controls).forEach(key =>{
        this.streetForm.controls[key].markAllAsTouched();
     });
    }
  }

  postStreetController(Id,neighborhoodObj){
    this._masterPagesService.streetController(Id,neighborhoodObj).subscribe(res=>{
      this.streetForm.reset();
      this.getStreetController();
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
  editData(element){
  this.streetForm.patchValue(element);
  }
  deleteData(element){
    let id = element.street_id;
    this._masterPagesService.deleteStreetController(id).subscribe(res=>{
      this.getStreetController();
    })
    
  }
}
