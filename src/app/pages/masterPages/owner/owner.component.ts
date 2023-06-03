import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { HeaderShowServiceService } from 'src/app/theme/components/header-show-service.service';
import { MasterPagesServicesService } from '../master-pages-services.service';
import { emailValidator } from 'src/app/theme/utils/app-validators';
import {  Subscription } from 'rxjs';
import { SearchCountryField, CountryISO } from 'ngx-intl-tel-input';
@Component({
  selector: 'app-owner',
  templateUrl: './owner.component.html',
  styleUrls: ['./owner.component.scss']
})




export class OwnerComponent implements OnInit {

  displayedColumns: string[] = ['position', 'Name', 'Date Of Birth', 'Email', 'Mobile', 'Address', 'Property Name', 'Action']; //,
  ELEMENT_DATA;
  dataSource;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  ownerForm: FormGroup;
  property;
  ownerDetails: any;
  @HostListener('window:scroll')
  @ViewChild('profile') profile: any;
  subscription: Subscription;

  profilePhotoFlag1: boolean = false;
  profilePhotoFlag2: boolean = false;
  profilePhotoFlag3: boolean = false;

  AdharFlag1: boolean = false;
  AdharFlag2: boolean = false;
  AdharFlag3: boolean = false;

  panFlag1: boolean = false;
  panFlag2: boolean = false;
  panFlag3: boolean = false;

  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  phonePattern = /^\+\d{1,3}-\d{3}-\d{3}-\d{4}$/;
  ownerData: any;

  ProfileImage;
  adharCardTitle;
  PanCardTitle;

  ProfileImage2;
  adharCardTitle2;
  PanCardTitle2;

  ProfileImage3;
  adharCardTitle3;
  PanCardTitle3;

  multipleFileUploadFlag : boolean = false;
  extraDocs = [];
  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private _hederShowService: HeaderShowServiceService,
    private _masterService: MasterPagesServicesService,
    private fb: FormBuilder,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this._hederShowService.headerFlag.next(false);
    this._hederShowService.submitButtonFlag.next(false);
    this.ownerForm = this.fb.group({

      "owner_id": null,
      "owner_name": ['', Validators.required],
      "permanent_address": ['', Validators.required],
      "email": [''],
      "contact_number": ['', [Validators.required, Validators.pattern(this.phonePattern)]],
      "dob": [''],
      "property_id": ['', Validators.required],
      "adharFile": null,
      "panFile": null,
      "profile": null,
      // "doc":null,
      "extra_docs":null,
      "is_current_owner": false,
      "co_profile": null,
      "co_adhar_card": null,
      "co_panFile": null,
      "co_owner_details": this.fb.group({
        "owner_name": new FormControl(''),
        "permanent_address": new FormControl(''),
        "email": new FormControl('', [, emailValidator]),
        "contact_number": new FormControl('', [Validators.pattern(this.phonePattern)]),
        "dob": new FormControl(''),
      }),
      "is_poa": false,
      "poa_owner_details": this.fb.group({
        "owner_name": new FormControl(''),
        "permanent_address": new FormControl(''),
        "email": new FormControl('', [, emailValidator]),
        "contact_number": new FormControl('', [Validators.pattern(this.phonePattern)]),
        "dob": new FormControl(''),
      }),
      "poa_adhar": null,
      "poa_pan": null,
      "poa_profile": null,
     
    })

    this.getOwnerDetails();
    this.getProperty();
    
  }

  // "owner":{"is_current_owner":true,"co_owner_details":{},"owner_name":""}
  // "property_id":1 // in url
  // "c_adhar_card":File,
  // "c_pan_card":File
  // "co_profile":File


  coOwnerArray(): FormGroup {
    return this.fb.group({
      "owner_name": new FormControl('', Validators.required),
      "permanent_address": new FormControl('', Validators.required),
      "email": new FormControl('', Validators.required),
      "contact_number": new FormControl('', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
      "dob": new FormControl('', Validators.required),
      "profile": null,
      "adhar_title": null,
      "pan_card": null,
      "isCurrentCoOwner": false
    })
  }

  get IsCurrentCoOwner() {
    return this.ownerForm.get('co_owner_details')['controls'] as FormArray;
  }

  addCoOwners() {


    this.IsCurrentCoOwner.push(this.coOwnerArray());
  }

  getProperty() {
    this._masterService.getProperty().subscribe(res => {
      this.property = res.data;
    },
      error => {

        this.toastr.error("", "Something went wrong")
      })
  }
  // propertyName(property_id){
  //   this.property.forEach(element => {
  //       if(element.propertyId = property_id && property_id != undefined && element.propertyId != undefined){
  //         return element.property_name;
  //       }
  //   });
  // }
  getOwnerDetails() {
    this._masterService.getOwnerData().subscribe(res => {
      this.ownerDetails = res.data;
      if (res.statusCode == 204 || res.status == 'Failed') {
        this.toastr.error("", "Something went wrong")
      } else {
        this.ELEMENT_DATA = res.data?.map((ele, index) => {
          return {
            'position': index + 1,
            'owner_id': ele.owner_id,
            'owner_name': ele.owner_name,
            'dob': ele.dob,
            'email': ele.email,
            'contact_number': ele.contact_number,
            'permanent_address': ele.permanent_address,
            'property_name': ele.property?.property_name,
            'is_current_owner': ele.property?.is_current_owner,
            'co_owner_details': ele.property?.co_owner_details
          };
        })
        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      }

    },
      error => {
        this.toastr.error("", "Something went wrong")
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
 
  editData(elementId) {
    this.ownerForm.reset();
    this.ownerForm.controls.co_owner_details.reset();
    this.ownerForm.controls.poa_owner_details.reset();
    this.ownerData = this.ownerDetails.find(item => item.owner_id === elementId);
    console.log(this.ownerData);
    
    this.ownerForm.patchValue(this.ownerData);
    console.log(this.ownerForm.controls.extra_docs);

    if (this.ownerData.profile_path !== null) {
      this.profilePhotoFlag1 = true;
      this.ProfileImage  = this.ownerData.profile_path;
      this.ownerForm.controls.profile.setValue([this.ownerData.profile_path ]);
    }
    if (this.ownerData.adhar_path !== null) {
      this.AdharFlag1 = true;
      this.adharCardTitle= this.ownerData.adhar_title;
      this.ownerForm.controls.adharFile.setValue([this.ownerData.adhar_path]);
    }
    if (this.ownerData.pan_card_path !== null) {
      this.panFlag1 = true;
      this.PanCardTitle  = this.ownerData.pan_card;
      this.ownerForm.controls.panFile.setValue([this.ownerData.pan_card_path]);
    }
    // if(this.ownerData.extra_docs !== null && this.ownerData.extra_docs.length !== 0){
    //   let extrsDocs= [];
    //   this.ownerData.extra_docs.forEach(element => {
    //     extrsDocs.push(element.path);
    //   });
      this.ownerForm.controls.extra_docs.setValue(null);
    // }
    this.extraDocs = [];
    this.ownerData.extra_docs.forEach(element => {
      this.extraDocs.push(element);
    });
    console.log(this.ownerForm.controls.extra_docs);
    

    this.property?.forEach(ele => {
      if (this.ownerData.property.property_name !== undefined && ele?.property_name == this.ownerData.property.property_name) {
        this.ownerForm.controls.property_id.setValue(ele.propertyId);
      }
    });

    this.ownerForm.controls.co_owner_details.patchValue(this.ownerData.ownerDto[0]);
    if (this.ownerData.ownerDto[0].profile_path !== null) {
      this.profilePhotoFlag2 = true;
      this.ProfileImage2 = this.ownerData.ownerDto[0].profile_path;
      this.ownerForm.controls.co_profile.setValue([this.ownerData.ownerDto[0].profile_path]);
    }
    if (this.ownerData.ownerDto[0].adhar_path !== null) {
      this.AdharFlag2 = true;
      this.adharCardTitle2 = this.ownerData.ownerDto[0].adhar_title;
      this.ownerForm.controls.co_adhar_card.setValue([this.ownerData.ownerDto[0].adhar_path]);
    }
    if (this.ownerData.ownerDto[0].pan_card_path !== null) {
      this.panFlag2 = true;
      this.PanCardTitle2 =  this.ownerData.ownerDto[0].pan_card;
      this.ownerForm.controls.co_panFile.setValue([this.ownerData.ownerDto[0].pan_card_path]);
    }

    this.ownerForm.controls.poa_owner_details.patchValue(this.ownerData.poa_owner_details[0]);
    
    if (this.ownerData.poa_owner_details[0].profile_path !== null) {
      this.profilePhotoFlag3 = true;
      this.ProfileImage3 = this.ownerData.poa_owner_details[0].profile_path;
      this.ownerForm.controls.poa_profile.setValue([this.ownerData.poa_owner_details[0].profile_path]);
    }
    if (this.ownerData.poa_owner_details[0].adhar_path !== null) {
      this.AdharFlag3 = true;
      this.adharCardTitle3 = this.ownerData.poa_owner_details[0].adhar_title;
      this.ownerForm.controls.poa_adhar.setValue([this.ownerData.poa_owner_details[0].adhar_path]);
    }
    if (this.ownerData.poa_owner_details[0].pan_card_path !== null) {
      this.panFlag3 = true;
      this.PanCardTitle3 =  this.ownerData.poa_owner_details[0].pan_card;
      this.ownerForm.controls.poa_pan.setValue([this.ownerData.poa_owner_details[0].pan_card_path]);
    }
  }

  gotoTop() {

    // window.scroll(0,0);
    // this.viewport.scrollToPosition([0,0]);
    // this.scroll.nativeElement.scrollTop = 0;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteData(element) {

    let id = element.owner_id;
    this._masterService.deleteOwner(id).subscribe(res => {
      this.getOwnerDetails();
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

  submitUserData() {
    if(this.ownerForm.invalid){
      this.toastr.error("", "Please Fill The Form First");
      return;
    }

    let ownerFormData
    if (this.ownerForm.value.owner_id == '') {
      ownerFormData = {
        "owner_name": this.ownerForm.value.owner_name,
        "permanent_address": this.ownerForm.value.permanent_address,
        "email": this.ownerForm.value.email,
        "contact_number": this.ownerForm.value.contact_number,
        "dob": this.ownerForm.value.dob,
        "is_current_owner": this.ownerForm.value.is_current_owner,
        "ownerDto": [this.ownerForm.value.co_owner_details],
        "is_poa": this.ownerForm.value.is_poa,
        "poa_owner_details": [this.ownerForm.value.poa_owner_details]
      }
    } else {
      ownerFormData = {
        "owner_id": this.ownerForm.value.owner_id,
        "owner_name": this.ownerForm.value.owner_name,
        "permanent_address": this.ownerForm.value.permanent_address,
        "email": this.ownerForm.value.email,
        "contact_number": this.ownerForm.value.contact_number,
        "dob": this.ownerForm.value.dob,
        "is_current_owner": this.ownerForm.value.is_current_owner,
        "ownerDto": [this.ownerForm.value.co_owner_details],
        "is_poa": this.ownerForm.value.is_poa,
        "poa_owner_details": [this.ownerForm.value.poa_owner_details]
      }
    }
    let propert_id = this.ownerForm.value.property_id;
    let profile = (this.ownerForm.controls.profile.value !== null &&
                  this.ownerForm.controls.profile.value.length !== 0 && 
                  this.ownerForm.controls.profile.value[0].file) ? 
                  this.ownerForm.controls.profile.value[0].file : 
                  (this.ownerForm.controls.profile.value !== null ? this.ownerForm.controls.profile.value[0] : null);

    let adharFile = this.ownerForm.controls.adharFile.value !== null &&
                    this.ownerForm.controls.adharFile.value.length !== 0 &&
                    this.ownerForm.controls.adharFile.value[0].file ? 
                    this.ownerForm.controls.adharFile.value[0].file : 
                    this.ownerForm.controls.adharFile.value !== null ? this.ownerForm.controls.adharFile.value[0] : null;

    let panFile = this.ownerForm.controls.panFile.value !== null &&
                  this.ownerForm.controls.panFile.value.length !== 0 &&
                  this.ownerForm.controls.panFile.value[0].file ? 
                  this.ownerForm.controls.panFile.value[0].file : 
                  this.ownerForm.controls.panFile.value !== null ?this.ownerForm.controls.panFile.value[0] : null;

    let co_profile = this.ownerForm.controls.co_profile.value !== null &&
                     this.ownerForm.controls.co_profile.value.length !== 0 &&
                     this.ownerForm.controls.co_profile.value[0].file ? 
                     this.ownerForm.controls.co_profile.value[0].file : 
                     this.ownerForm.controls.co_profile.value !== null ? this.ownerForm.controls.co_profile.value [0] : null;

    let co_adhar_card = this.ownerForm.controls.co_adhar_card.value !== null &&
                        this.ownerForm.controls.co_adhar_card.value.length !== 0 &&
                        this.ownerForm.controls.co_adhar_card.value[0].file ? 
                        this.ownerForm.controls.co_adhar_card.value[0].file : 
                        this.ownerForm.controls.co_adhar_card.value !== null ? this.ownerForm.controls.co_adhar_card.value[0] :null ;

    let co_panFile = this.ownerForm.controls.co_panFile.value !== null &&
                     this.ownerForm.controls.co_panFile.value.length !== 0 && 
                     this.ownerForm.controls.co_panFile.value[0].file ? 
                     this.ownerForm.controls.co_panFile.value[0].file : 
                     this.ownerForm.controls.co_panFile.value !== null ? this.ownerForm.controls.co_panFile.value[0] : null;

    let poa_adhar = this.ownerForm.controls.poa_adhar.value !== null &&
                    this.ownerForm.controls.poa_adhar.value.length !== 0 &&
                    this.ownerForm.controls.poa_adhar.value[0].file ? 
                    this.ownerForm.controls.poa_adhar.value[0].file : 
                    this.ownerForm.controls.poa_adhar.value !== null ? this.ownerForm.controls.poa_adhar.value[0] : null;

    let poa_pan = this.ownerForm.controls.poa_pan.value !== null &&
                  this.ownerForm.controls.poa_pan.value.length !== 0 &&
                  this.ownerForm.controls.poa_pan.value[0].file ? 
                  this.ownerForm.controls.poa_pan.value[0].file : 
                  this.ownerForm.controls.poa_pan.value !== null ? this.ownerForm.controls.poa_pan.value[0] : null;

    let poa_profile = this.ownerForm.controls.poa_profile.value !== null &&
                      this.ownerForm.controls.poa_profile.value.length !== 0 &&
                      this.ownerForm.controls.poa_profile.value[0].file ? 
                      this.ownerForm.controls.poa_profile.value[0].file : 
                      this.ownerForm.controls.poa_profile.value !== null ? this.ownerForm.controls.poa_profile.value[0] : null;
    // let extra_docs :any = [];
    // this.ownerForm.controls.extra_docs.value.forEach((element,i) => {
    //   if(element.file){
    //     extra_docs.push(element.file);
    //   }
    // });
    
    const formData: FormData = new FormData();
    formData.append("owner", JSON.stringify(ownerFormData));
    if (profile !== null) {
      formData.append("profile", profile);
    }
    if (adharFile !== null) {
      formData.append("adhar_card", adharFile);
    }
    if (panFile !== null) {
      formData.append("pan_card", panFile);
    }
    if (co_profile !== null) {
      formData.append("co_profile", co_profile);
    }
    if (co_adhar_card !== null) {
      formData.append("c_adhar_card", co_adhar_card);
    }
    if (co_panFile !== null) {
      formData.append("c_pan_card", co_panFile);
    }
    if (poa_adhar !== null) {
      formData.append("poa_adhar", poa_adhar);
    }
    if (poa_pan !== null) {
      formData.append("poa_pan", poa_pan);
    }
    if (poa_profile !== null) {
      formData.append("poa_profile", poa_profile);
    }
    let extra_doc = this.ownerForm.controls.extra_docs.value;
    if(extra_doc!== null && extra_doc.length != 0){
      extra_doc?.forEach((element) => {
        element.file? formData.append("extra_docs", element.file):null;
      });
    }  
    if (this.ownerForm.valid) {
      this._masterService.postOwnerDetails(formData, propert_id,this.multipleFileUploadFlag).subscribe(res => {
        this.ownerForm.reset();

        this.getOwnerDetails();
        this.profilePhotoFlag1 = false;
        this.profilePhotoFlag2 = false;
        this.profilePhotoFlag3 = false;
      
        this.AdharFlag1= false;
        this.AdharFlag2= false;
        this.AdharFlag3= false;
      
        this.panFlag1 = false;
        this.panFlag2 = false;
        this.panFlag3 = false;
        this.ProfileImage   = null;
        this.adharCardTitle = null;
        this.PanCardTitle   = null;
        this.ProfileImage2  = null;
        this.adharCardTitle2= null;
        this.PanCardTitle2  = null;
        this.ProfileImage3  = null;
        this.adharCardTitle3= null;
        this.PanCardTitle3  = null;
        this.multipleFileUploadFlag = false;
        this.extraDocs =[];
        if (res.statusCode == 204 || res.status == 'Failed') {
          this.toastr.error("", "Something went wrong")
        } else {
          this.toastr.success("", "Data Save Successfully");
        }
      },
        error => {
          this.ownerForm.reset();
          this.toastr.error("", "Something went wrong")
        }
      )
    }
  }

  clearForm(){
    this.ownerForm.reset();
    this.profilePhotoFlag1 = false;
    this.profilePhotoFlag2 = false;
    this.profilePhotoFlag3 = false;
  
    this.AdharFlag1= false;
    this.AdharFlag2= false;
    this.AdharFlag3= false;
  
    this.panFlag1 = false;
    this.panFlag2 = false;
    this.panFlag3 = false;
    this.ProfileImage   = null;
    this.adharCardTitle = null;
    this.PanCardTitle   = null;
    this.ProfileImage2  = null;
    this.adharCardTitle2= null;
    this.PanCardTitle2  = null;
    this.ProfileImage3  = null;
    this.adharCardTitle3= null;
    this.PanCardTitle3  = null;
    this.extraDocs =[];
  }


  // getImage(imagePath,fileName) {
  //   return this.http
  //     .get(
  //       imagePath,
  //       {
  //         responseType: 'arraybuffer',
  //       }
  //     )
  //     .pipe(
  //       map((response) => {
  //         return new File([response], fileName);
  //       })
  //     );
  // }

  getDocument(){
     this.multipleFileUploadFlag = true;
  }

  ngOnDestroy(): void {
    this._hederShowService.headerFlag.next(true);
    this._hederShowService.submitButtonFlag.next(true);
  }
}
