import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { HeaderShowServiceService } from 'src/app/theme/components/header-show-service.service';
import { emailValidator } from 'src/app/theme/utils/app-validators';
import { PageServicesService } from '../../page-services.service';
import { PagesComponent } from '../../pages.component';
import { MasterPagesServicesService } from '../master-pages-services.service';

@Component({
  selector: 'app-tenent',
  templateUrl: './tenent.component.html',
  styleUrls: ['./tenent.component.scss']
})
export class TenentComponent implements OnInit {
  @HostListener('window:scroll')
  tenentForm: FormGroup
  displayedColumns: string[] = ['position', 'Tenent_Name', 'Email', 'Mobile', 'Address', 'Created_On', 'Updated_On', 'Action']; //'Status','Owner',,'Aggrement_Start','Aggrement_End','DOB'
  dataSource;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  changeHederFlag: boolean = true;
  ownerDetails: any;
  tenentDetails: any;
  @ViewChild('days') days: ElementRef;
  document = [1, 2, 3, 4, 5, 6];
  docFlag = false;

  constructor(private _liveAnnouncer: LiveAnnouncer,
    private _hederShowService: HeaderShowServiceService,
    private _masterPagesService: MasterPagesServicesService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private pageServices: PageServicesService) {
    this._hederShowService.headerFlag.subscribe(res => {
      this.changeHederFlag = res;
    })
  }

  ngOnInit(): void {
    this._hederShowService.headerFlag.next(false);
    this._hederShowService.submitButtonFlag.next(false);
    this.tenentForm = this.fb.group({
      "tenant_id": '',
      "tenant_name": ['', Validators.required],
      "tenant_address": ['', Validators.required],
      "contact_number": ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      "email": ['', [Validators.required, emailValidator]],
      "dob": ['', Validators.required],
      "status": [''],
      "owner": [''],
      "aggrement_start_date": ['', Validators.required],
      "getAggrement_end_date": ['', Validators.required],
      // "updated_on"           : ['',Validators.required],
      // "created_on"           : ['',Validators.required],
      "daysCount": null,
      "adhar_card": null,
      "pan_card": null,
      "profile_photo": null,
      "company_doc": null,
      "other_doc": null,
      "agreement_doc": null
    })

    this.getOwnerDetails();
    this.getTenentDetails();


  }

  getOwnerDetails() {
    this._masterPagesService.getOwnerData().subscribe(res => {
      this.ownerDetails = res.data;
    })
  }
  getTenentDetails() {
    this._masterPagesService.getTenentData().subscribe(res => {
      this.tenentDetails = res.data.map((ele, index) => {
        return {
          'position': index + 1,
          "tenant_id": ele["tenant_id"],
          "tenant_name": ele["tenant_name"],
          "tenant_address": ele["tenant_address"],
          "contact_number": ele["contact_number"],
          "email": ele["email"],
          "dob": ele["dob"],
          "status": ele["status"],
          "owner": ele["owner"],
          "aggrement_start_date": ele["aggrement_start_date"],
          "getAggrement_end_date": ele["getAggrement_end_date"],
          "updated_on": ele["updated_on"],
          "created_on": ele["created_on"],
        };
      })
      this.dataSource = new MatTableDataSource(this.tenentDetails);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;

    })
  }

  ngAfterViewInit() {
    // this.dataSource.sort = this.sort;
    // this.dataSource.paginator = this.paginator;
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

  submitTenent() {

    let tenentFormData
    if (this.tenentForm.value.tenant_id == '') {
      tenentFormData = {
        "tenant_name": this.tenentForm.value.tenant_name,
        "tenant_address": this.tenentForm.value.tenant_address,
        "contact_number": this.tenentForm.value.contact_number,
        "email": this.tenentForm.value.email,
        "dob": this.tenentForm.value.dob,
        "aggrement_start_date": this.tenentForm.value.aggrement_start_date,
        "getAggrement_end_date": this.tenentForm.value.getAggrement_end_date,
        // "created_on"           :this.tenentForm.value.created_on,
        // "updated_on"           :this.tenentForm.value.updated_on           
      }

    } else {
      tenentFormData = {
        "tenant_id": this.tenentForm.value.tenant_id,
        "tenant_name": this.tenentForm.value.tenant_name,
        "tenant_address": this.tenentForm.value.tenant_address,
        "contact_number": this.tenentForm.value.contact_number,
        "email": this.tenentForm.value.email,
        "dob": this.tenentForm.value.dob,
        "aggrement_start_date": this.tenentForm.value.aggrement_start_date,
        "getAggrement_end_date": this.tenentForm.value.getAggrement_end_date,
        // "created_on"           :this.tenentForm.value.created_on,
        // "updated_on"           :this.tenentForm.value.updated_on  
      }
    }
    let owner_id = this.tenentForm.value.owner;
    let profile_photo = this.tenentForm.controls.profile_photo.value !== null && this.tenentForm.controls.profile_photo.value.length !== 0 ? this.tenentForm.controls.profile_photo.value[0].file : null;
    let adhar_card = this.tenentForm.controls.adhar_card.value !== null && this.tenentForm.controls.adhar_card.value.length !== 0 ? this.tenentForm.controls.adhar_card.value[0].file : null;
    let pan_card = this.tenentForm.controls.pan_card.value !== null && this.tenentForm.controls.pan_card.value.length !== 0 ? this.tenentForm.controls.pan_card.value[0].file : null;

    let company_doc = this.tenentForm.controls.company_doc.value !== null && this.tenentForm.controls.company_doc.value.length !== 0 ? this.tenentForm.controls.company_doc.value[0].file : null;
    let other_doc = this.tenentForm.controls.other_doc.value !== null && this.tenentForm.controls.other_doc.value.length !== 0 ? this.tenentForm.controls.other_doc.value[0].file : null;
    let agreement_doc = this.tenentForm.controls.agreement_doc.value !== null && this.tenentForm.controls.agreement_doc.value.length !== 0 ? this.tenentForm.controls.agreement_doc.value[0].file : null;

    const formData: FormData = new FormData();
    formData.append("tenant	", JSON.stringify(tenentFormData));
    if (profile_photo !== null) {
      formData.append("profile", profile_photo);
    }
    if (adhar_card !== null) {
      formData.append("adharcard", adhar_card);
    }
    if (pan_card !== null) {
      formData.append("pancard", pan_card);
    }

    if (profile_photo !== null) {
      formData.append("company_doc", company_doc);
    }
    if (adhar_card !== null) {
      formData.append("other_doc", other_doc);
    }
    if (pan_card !== null) {
      formData.append("agreement_doc", agreement_doc);
    }

    if (this.tenentForm.valid) {
      this._masterPagesService.postTenentDetails(formData, owner_id).subscribe(res => {
        this.tenentForm.reset();
        this.getTenentDetails();
        this.toastr.success("", "Data Save Successfully");
      },
        error => {
          this.tenentForm.reset();
          this.toastr.error("", "Something went wrong")
        }
      )
    } else {

      Object.keys(this.tenentForm.controls).forEach(key => {
        this.tenentForm.controls[key].markAllAsTouched();
      });
    }
    this.pageServices.sendClickevent("scroll");
  }
  editData(element) {
    this.tenentForm.patchValue(element);
    this.tenentForm.controls.owner.setValue([element.owner.owner_id]);
    element.owner.adhar_path !== null ? 
    this.tenentForm.controls.adhar_card.setValue([element.owner.adhar_path]) : 
    this.tenentForm.controls.adhar_card.setValue(null) ;

    element.owner.pan_card_path !== null ? 
    this.tenentForm.controls.pan_card.setValue([element.owner.pan_card_path]):
    this.tenentForm.controls.pan_card.setValue(null);
    
    element.owner.profile_path !== null ? 
    this.tenentForm.controls.profile_photo.setValue([element.owner.profile_path]):
    this.tenentForm.controls.profile_photo.setValue(null);
    
    // this.tenentForm.controls.company_doc.setValue(element.owner.);
    // this.tenentForm.controls.other_doc.setValue(element.owner.);
    // this.tenentForm.controls.agreement_doc.setValue(element.owner.);
    this.countDays();
  }

  deleteData(element) {
    let id = element.tenant_id;
    this._masterPagesService.deleteTenentDetails(id).subscribe(res => {
      this.getTenentDetails();
      this.toastr.success("", "Data Deleted Successfully")
    },
      error => {
        this.toastr.error("", "Something went wrong")
      }), error => {
        if (error) {
          this.toastr.error("", "Something went wrong")
        }
      }

  }

  ngOnDestroy(): void {
    this._hederShowService.headerFlag.next(true);
    this._hederShowService.submitButtonFlag.next(true);

  }


  countDays() {
    let startDate = new Date(this.tenentForm.value.aggrement_start_date);
    let endDate = new Date(this.tenentForm.value.getAggrement_end_date);

    // in days
    // let Difference_In_Time = endDate.getTime() - startDate.getTime();
    // let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

    // in months
    let months;
    let totalMonth;
    months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
    months -= startDate.getMonth();
    months += endDate.getMonth();
    totalMonth = months <= 0 ? 0 : months;

    //     this.tenentForm.controls.daysCount.setValue(totalMonth);
  }


  getMonth(todaysDate) {
    let month = this.tenentForm.value.daysCount;
    if (month !== null) {
      let d
      if (todaysDate !== null) {
        d = new Date(todaysDate.value);
      } else {
        d = new Date(this.tenentForm.value.aggrement_start_date);
      }
      const eleventhMonthDate = d.setMonth(d.getMonth() + Number(month));
      const fullDate = new Date(eleventhMonthDate);
      let tmp = fullDate.getDate() - 1;
      fullDate.setDate(tmp)
      this.tenentForm.controls.getAggrement_end_date.setValue(fullDate);
    }
  }

}
