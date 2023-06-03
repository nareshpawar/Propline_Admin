import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { HeaderShowServiceService } from 'src/app/theme/components/header-show-service.service';
import { MasterPagesServicesService } from '../master-pages-services.service';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatTableDataSource } from '@angular/material/table';
import { element } from 'protractor';
import { emailValidator } from 'src/app/theme/utils/app-validators';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  displayedColumns: string[] = ['position', 'First Name','Last Name','User Name','Password','Email','Address','Role','Action'];//'User Name','Password','Mobile Number'
  ELEMENT_DATA;
  dataSource;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  userRoleData = [];
  notifier = new Subject();
  userForm : FormGroup;
  userData: any;
  userRoleID=1;
  constructor(
    private _hederShowService:HeaderShowServiceService,
    private _masterService:MasterPagesServicesService,
    private fb:FormBuilder,
    private toastr:ToastrService,
    private _liveAnnouncer: LiveAnnouncer,
  ){ 
   
  }

  ngOnInit(): void {
    this._hederShowService.headerFlag.next(false);
    this._hederShowService.submitButtonFlag.next(false);
    this.getUserRole();
    this.getUserData();
    this.userForm = this.fb.group({
      "user_id": '',
      "username": ['',Validators.required],
      "password": ['',Validators.required],
      "first_name": ['',Validators.required],
      "last_name": ['',Validators.required],
      "user_email": ['',[Validators.required,emailValidator]],
      "user_address": ['',Validators.required],
      "role": ['Admin',Validators.required],
      // "user_mobile":['',[Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]]
    })
  }
  ngAfterViewInit() {
    // this.dataSource.sort = this.sort;
    // this.dataSource.paginator = this.paginator;
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
  getUserRole(){
      this._masterService.getUserRole().pipe(takeUntil(this.notifier))
      .subscribe((res: any) => {
        this.userRoleData = res.data;
      })
  }
  getUserData(){
    this._masterService.getUserData().pipe(takeUntil(this.notifier))
    .subscribe((res: any) => {
      this.ELEMENT_DATA = res.data.map((ele,index) => {
        return {
          'position': index+1,
          "user_id": ele.user_id,
          'first_name':ele.first_name,
          'last_name':ele.last_name,
          'username':ele.username,
          'password':ele.password,
          'user_email':ele.user_email,
          'user_address':ele.user_address,
          'role':ele.userRoles.role,
        };
      })
      this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    },error=>{
      this.toastr.error("","Something went wrong");
    })
  }

  submitUserData(){
    // this.userForm.removeControl("user_mobile");
   
    if(this.userForm.value.user_id == ''){
      this.userForm.removeControl("user_id");
    }else{
      this.userRoleData.forEach(ele=>{
        if(ele.role == this.userForm.controls.role ){}
        this.userForm.controls.role.setValue(ele);
      })
    }

    if (this.userForm.valid) {
      this._masterService.userSubmit(this.userRoleID, this.userForm.value).subscribe(res => {
        this.userForm.reset();
        this.getUserData();
        this.toastr.success("", "Data Save Successfully")
      })
    } else {
      Object.keys(this.userForm.controls).forEach(key => {
        this.userForm.controls[key].markAllAsTouched();
      });
    }
  }

  editData(element){
   this.userForm.patchValue(element);
   
   }

   deleteData(element){
    let id = element.user_id;
    this._masterService.deleteUserController(id).subscribe(res=>{
      this.getUserData();
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

  ngOnDestroy(): void {
    this._hederShowService.headerFlag.next(true);
    this._hederShowService.submitButtonFlag.next(true);
  }

  selectChangeFun(event){
    let role = event.value
    this.userRoleData.forEach(element => {
      if(element.role === role){
        this.userRoleID = element.role_id;
      }
    });
     
    
  }
}
