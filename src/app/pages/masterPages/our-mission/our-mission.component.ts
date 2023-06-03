import { LiveAnnouncer } from '@angular/cdk/a11y';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Observable, Observer } from 'rxjs';
import { HeaderShowServiceService } from 'src/app/theme/components/header-show-service.service';
import { MasterPagesServicesService } from '../master-pages-services.service';
export interface PeriodicElement {
  position:number;
  image: string;
  icon: string;
  Title: string;
  description: string;
}

@Component({
  selector: 'app-our-mission',
  templateUrl: './our-mission.component.html',
  styleUrls: ['./our-mission.component.scss']
})
export class OurMissionComponent implements OnInit {
  displayedColumns: string[] = ['position', 'image','Action'];//,'icon','Title','description',,'Delete'
  selection = new SelectionModel<PeriodicElement>(true, []);
  ELEMENT_DATA: PeriodicElement[];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  missionForm: FormGroup;
  icons =[ {icon:"home"                , name: "Home"},
           {icon:"thumb_up"            , name: "Thumbs Up"},
           {icon:"location_on"         , name: "Location On"} ,
           {icon:"supervisor_account"  , name: "Supervisor Account"},
           {icon:"format_list_bulleted", name: "Format List Bullet"},
           {icon:"search"              , name: "Search"},
           {icon:"monetization_on"     , name: "Money"}]
  changeHederFlag:boolean = true;
  podocfile;
  dataSource;
  imageFile = null;
    /** Whether the number of selected elements matches the total number of rows. */
   
  constructor(
              private _hederShowService:HeaderShowServiceService,
              private _masterPagesService: MasterPagesServicesService,
               private _liveAnnouncer: LiveAnnouncer,
               private fb: FormBuilder,
              private toastr: ToastrService) { 
      this._hederShowService.headerFlag.subscribe(res =>{
        this.changeHederFlag = res;
      }) }
  ngOnInit(): void {
    this._hederShowService.headerFlag.next(false);
    this._hederShowService.submitButtonFlag.next(false);
    this.missionForm= this.fb.group(
     { 
      image :null,
      missionModels: this.fb.array([this.createmission()])
    }
    )
    this.getMissionDetails();
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
  getMissionDetails(){
    this._masterPagesService.getMissionDetails().subscribe(res=>{
      this.ELEMENT_DATA = res.data.map((PD,index) => {
        return {
          position: index+1,
          id:PD.id,
          image: PD.image,
          missionModels: PD.missionModels,
        };
      })
      this.dataSource = new MatTableDataSource<PeriodicElement>(this.ELEMENT_DATA);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      
    },error=>{
      this.toastr.error("","Something went wrong");
    })
  }
  public createmission(): FormGroup {
    return this.fb.group({
      icon: ['',Validators.required],
      title: ['',Validators.required],
      description: ['',Validators.required],
    });
  }
  public addMissions(): void {
    const missionModels = this.missionForm.get('missionModels') as FormArray;
    if(missionModels.length <= 3){
      missionModels.push(this.createmission());
    }else if(missionModels.length <=5 ){
      this.toastr.error('', "Can't add More");
    }
  }
  submitMission(){
      let mission=  { missionModels : this.missionForm.controls.missionModels.value}
      let imageFile = this.missionForm.controls.image.value !== null && this.missionForm.value.image.length !== 0 ? this.missionForm.controls.image.value[0].file: null ;
      const formData: FormData = new FormData();
      formData.append("mission", JSON.stringify(mission));
      if(imageFile !== null){
        formData.append("file_name",imageFile);
      }

     if(this.missionForm.valid){ 
    this._masterPagesService.ourMissionpost(formData).subscribe(res =>{
        this.getMissionDetails();
        this.missionForm.reset();
        const missionModels = this.missionForm.get('missionModels') as FormArray;
        missionModels.clear();
        missionModels.push(this.createmission());
        this.toastr.success("","Data Save Successfully")
    },
    error => {
      this.missionForm.reset();
      this.toastr.error("","Something went wrong")
    }
    )}else{
      Object.keys(this.missionForm.controls).forEach(key =>{
        this.missionForm.controls[key].markAllAsTouched();
        
     });
    }
  }
  ngOnDestroy(): void {
    this._hederShowService.headerFlag.next(true);
    this._hederShowService.submitButtonFlag.next(true);
  }

  selectRow(event,row){
    if(event.checked){
    this.missionForm.patchValue({
      image:row.image,
      missionModels:row.missionModels
    })
  } else{
    this.missionForm.patchValue({
      image:'',
      missionModels:this.fb.array([this.createmission()])
    })
  }
  }
  selectFile(){
    this.imageFile = null;
  }
  get missionModels(){
    return this.missionForm.get('missionModels') as FormArray;
  }
  deleteCard(i){
    this.missionModels.removeAt(i)
  }

  editData(element){
    this.imageFile=element.image;
    element.missionModels.forEach((element,i) => {
      if( i>0 && i <3){
      this.addMissions();
    }  
    });
    this.missionForm.controls.image.setValue(null);
    this.missionForm.controls.missionModels.patchValue(element.missionModels);
  }

  deleteData(element){
    
    let id = element.id;
    this._masterPagesService.deleteMissionController(id).subscribe(res=>{
      this.getMissionDetails();
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
