import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { HeaderShowServiceService } from 'src/app/theme/components/header-show-service.service';
import { MasterPagesServicesService } from '../master-pages-services.service';
export interface PeriodicElement {
  position: number;
  Image: string;
  // discription: number;
  
}
@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit,OnDestroy {
  displayedColumns: string[] = ['position', 'Image','Action'];
  dataSource;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  changeHederFlag:boolean = true;
  bannerForm : FormGroup

  constructor( private _liveAnnouncer: LiveAnnouncer,
               private _hederShowService:HeaderShowServiceService,
               private _masterPagesService: MasterPagesServicesService,
               private fb: FormBuilder,private toastr: ToastrService) {
                this._hederShowService.headerFlag.subscribe(res =>{
                  this.changeHederFlag = res;
                })
                }

  ngOnInit(): void {
    this._hederShowService.headerFlag.next(false);
    this._hederShowService.submitButtonFlag.next(false);

    this.bannerForm = this.fb.group({
      image : this.fb.control(null,Validators.required)
    })

    this.getAllImages();
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  getAllImages(){
    this._masterPagesService.getBannerImages().subscribe(res=>{
      let ImageData = res.data.map((PD,index) => {
        return {
          position : index+1,
          id:PD.id,
          Image : PD.filePath,
          
        };
      })
      this.dataSource= new MatTableDataSource<PeriodicElement>(ImageData);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }, error => {
  
      this.toastr.error("","Something went wrong")
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  submitForm(){
    const formData: FormData = new FormData();
    let imageFile = this.bannerForm.controls.image.value !== null && this.bannerForm.value.image.length !== 0 ? this.bannerForm.controls.image.value[0].file: null ;
    formData.append("file_name",imageFile);
    if(this.bannerForm.valid){
      this._masterPagesService.uploadImage(formData).subscribe(res=>{
        this.toastr.success("","Data Save Successfully")
        this.bannerForm.reset();
        this.getAllImages();
      }, error => {
        this.bannerForm.reset();
        this.toastr.error("","Something went wrong")
      })
    }

  }

  deleteImage(id){
    this._masterPagesService.deleteBannerImage(id).subscribe(res=>{
      this.toastr.success("","Image Deleted Successfully");
      this.getAllImages();
    }, error => {
       
        this.toastr.error("","Something Went Wrong");
      })
  }

  ngOnDestroy(): void {
    this._hederShowService.headerFlag.next(true);
    this._hederShowService.submitButtonFlag.next(true);

  }

}
