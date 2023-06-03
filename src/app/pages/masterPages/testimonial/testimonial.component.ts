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
  title: string;
  designation: string;
  description: string;
}

@Component({
  selector: 'app-testimonial',
  templateUrl: './testimonial.component.html',
  styleUrls: ['./testimonial.component.scss']
})
export class TestimonialComponent implements OnInit {
  displayedColumns: string[] = ['position', 'title','designation','description','Action'];//,'Delete'
  ELEMENT_DATA: PeriodicElement[];
  dataSource;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  testimonialForm : FormGroup;
  changeHederFlag:boolean = true;
  imageFile: any = null;
  constructor( private _hederShowService:HeaderShowServiceService,
                private fb:FormBuilder,
                private _masterPagesService:MasterPagesServicesService,
               private _liveAnnouncer: LiveAnnouncer,
               private toastr: ToastrService,
              ) {
    this._hederShowService.headerFlag.subscribe(res =>{
      this.changeHederFlag = res;
    }) 
   }

  ngOnInit(): void {
    this._hederShowService.headerFlag.next(false);
    this._hederShowService.submitButtonFlag.next(false);

    this.testimonialForm = this.fb.group({
      profile: null,
      description: ['',Validators.required],
      designation: ['',Validators.required],
      title: ['',Validators.required],
      id:null,
    })
    this.getTestimonialDetails();
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
  getTestimonialDetails(){
    this._masterPagesService.getTestimonialDetails().subscribe(res=>{
      this.ELEMENT_DATA = res.data.map((PD,index) => {
        return {
          position: index+1,
          description: PD.description,
          designation: PD.designation,
          title: PD.title,
          profile:PD.profile,
          id:PD.id
        };
      })
      this.dataSource = new MatTableDataSource<PeriodicElement>(this.ELEMENT_DATA);
      
    },error=>{
      this.toastr.error("","Something went wrong");
    })
  }
  
  submitTestimonial(){
    let imageFile = this.testimonialForm.controls.profile.value !== null && this.testimonialForm.value.profile.length !== 0 ? this.testimonialForm.controls.profile.value[0].file : null ;
    let testimonial = this.testimonialForm.value;
    delete testimonial.profile;
    const formData: FormData = new FormData();
    formData.append("testimonial", JSON.stringify(testimonial));
    if(imageFile !== null){        
        formData.append("file_name",imageFile);
    }

    if(this.testimonialForm.valid){
    this._masterPagesService.testimonialPost(formData).subscribe(
          res => {
                this.getTestimonialDetails();
                this.testimonialForm.reset();
                this.toastr.success("","Data Save Successfully");
              },
          error => {
                this.testimonialForm.reset();
                this.toastr.error("","Something went wrong");
              }
        ),error => {
          if(error){
            this.testimonialForm.reset();
            this.toastr.error("","Something went wrong");
          }
        }}else{
          Object.keys(this.testimonialForm.controls).forEach(key =>{
            this.testimonialForm.controls[key].markAllAsTouched();
         });
        }
      }

  ngOnDestroy(): void {
    this._hederShowService.headerFlag.next(true);
    this._hederShowService.submitButtonFlag.next(true);

  }

  editData(element){
   this.imageFile = element.profile;
   this.testimonialForm.controls.profile.setValue(null);
   this.testimonialForm.patchValue(element);
   this.testimonialForm.controls.profile.setValue(null);
  }
  selectFile(){
    this.imageFile = null;
  }

  deleteData(element){
    let id = element.id;
    this._masterPagesService.deleteTestimonialController(id).subscribe(res=>{
      this.getTestimonialDetails();
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
