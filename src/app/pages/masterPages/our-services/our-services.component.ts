import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { HeaderShowServiceService } from 'src/app/theme/components/header-show-service.service';
import { MasterPagesServicesService } from '../master-pages-services.service';
export interface PeriodicElement {
  position:number;
  icon: string;
  title: string;
  desc: string;
}

@Component({
  selector: 'app-our-services',
  templateUrl: './our-services.component.html',
  styleUrls: ['./our-services.component.scss']
})
export class OurServicesComponent implements OnInit {
  displayedColumns: string[] = ['position','icon','title', 'desc','Action'];//,'delete'
  ELEMENT_DATA: PeriodicElement[];
  dataSource; 
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  changeHederFlag:boolean = true;
  serviceForm: FormGroup;
  icons = [{ icon: "home", name: "Home" },
  { icon: "thumb_up", name: "Thumbs Up" },
  { icon: "location_on", name: "Location On" },
  { icon: "supervisor_account", name: "Supervisor Account" },
  { icon: "format_list_bulleted", name: "Format List Bullet" },
  { icon: "search", name: "Search" },
  { icon: "monetization_on", name: "Money" }]
  constructor( private _hederShowService:HeaderShowServiceService,
               private _masterPageService : MasterPagesServicesService,
               private fb : FormBuilder,private toastr: ToastrService,
               private _liveAnnouncer: LiveAnnouncer,
               private _masterPagesService: MasterPagesServicesService,
               ) {
    this._hederShowService.headerFlag.subscribe(res =>{
      this.changeHederFlag = res;
    }) 
   }

  ngOnInit(): void {
    this._hederShowService.headerFlag.next(false);
    this._hederShowService.submitButtonFlag.next(false);
    this.serviceForm = this.fb.group({
      icon:['',Validators.required],
      title:['',Validators.required],
      desc:['',Validators.required],
      service_id:null,
    })
    this.getServicesDetails();
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  announceSortChange(sortState: Sort) {
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
  getServicesDetails(){
    this._masterPageService.getServicesDetails().subscribe(res=>{
      this.ELEMENT_DATA = res.data.map((PD,index) => {
        return {
          position: index+1,
          desc: PD.desc,
          icon: PD.icon,
          title: PD.title,
          service_id:PD.service_id,
        };
      })
      this.dataSource = new MatTableDataSource<PeriodicElement>(this.ELEMENT_DATA);
      
    },error=>{
      this.toastr.error("","Something went wrong");
    })
  }

  submitServiceForm(){
    let finalData = this.serviceForm.value
    if( this.serviceForm.value.service_id == null){
      delete finalData.service_id;
    }

    if(this.serviceForm.valid){
      this._masterPageService.ourServicesPost(finalData).subscribe(
    res=>{
        this.getServicesDetails();
        this.serviceForm.reset();
        this.toastr.success("","Data Save Successfully")
    },
    error => {
      this.serviceForm.reset();
      this.toastr.error("","Something went wrong")
    }),error => {
      if(error){
        this.serviceForm.reset();
        this.toastr.error("","Something went wrong")
      }
    }
    }else{
      Object.keys(this.serviceForm.controls).forEach(key =>{
        this.serviceForm.controls[key].markAllAsTouched();
        
     });
    } 
  }

  ngOnDestroy(): void {
    this._hederShowService.headerFlag.next(true);
    this._hederShowService.submitButtonFlag.next(true);
  }
  editData(element){
    this.serviceForm.patchValue(element);
  }

  deleteData(element){
    let id = element.service_id;
    this._masterPagesService.deleteServicesController(id).subscribe(res=>{
      this.getServicesDetails();
      this.toastr.success("","Data Deleted Successfully")
    },
    error => {
     
      this.toastr.error("","Something went wrong")
    }),error => {
      if(error){
        this.toastr.error("","Something went wrong")
      }
    }
    
  }
}
