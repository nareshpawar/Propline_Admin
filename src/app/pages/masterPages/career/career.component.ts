import { Component , HostListener, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MasterPagesServicesService } from '../master-pages-services.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-career',
  templateUrl: './career.component.html',
  styleUrls: ['./career.component.scss']
})
export class CareerComponent implements OnInit {
  careerData;
  careerForm : FormGroup;
  displayedColumns: string[] = ['position', 'Job Type', 'Job Summary','Is-Active','Action'];
  dataSource;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  responsibility = [];
  qualification  =[];

  jobTitles =[ "Admin Executive"
    ,"HR Executive"
    ,"Sales Executive"
    ,"Relationship Manager"
    ,"Sales Manager"
    ,"Telecaller ( Pre sales executive )"
    ,"Digital Marketing Executive"];

  experience =["0-1","1-2","2-3","5-8"]  


  constructor( private fb: FormBuilder,private toastr: ToastrService,
    private _liveAnnouncer: LiveAnnouncer, 
    private masterService : MasterPagesServicesService) { }

  ngOnInit(): void {

    this.careerForm = this.fb.group({
      "is_active": this.fb.control(false,Validators.required),
      "jobSummary": this.fb.control(null,Validators.required),
      "jobType": this.fb.control(null,Validators.required),
      "qualifications": this.fb.array([]),
      "responsibilities": this.fb.array([]),
      "jobId":this.fb.control(null),
      "experience": this.fb.control(null,Validators.required),
      "salary":this.fb.control(null,Validators.required),
    })

    this.addResponsibilitiesAndQualifications(this.getResponsibilities(this.responsibility).controls,this.getQualifications(this.qualification).controls);
    this.getCaeerData();
  }

  getCaeerData(){
    this.masterService.getCareerData().subscribe(res=>{
        this.careerData = res.data.map((ele, index) => {
          return {
            'position': index + 1,
            "is_active": ele["is_active"],
            "jobSummary": ele["jobSummary"],
            "jobType": ele["jobType"],
            "qualifications": ele["qualifications"],
            "responsibilities": ele["responsibilities"],
            "jobId":ele["jobId"]

          };
        })
        this.dataSource = new MatTableDataSource(this.careerData);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
  
    })
  }

  get responsibilities() {
    return this.careerForm.controls.responsibilities as FormArray;
  }

  get qualifications() {
    return this.careerForm.controls.qualifications as FormArray;
  }


  getResponsibilities(responsibility){
    
    return this.fb.array(responsibility);                
  }
  
  getQualifications(qualification){
    return this.fb.array(qualification);                
  }

  addResponsibilitiesAndQualifications(responsibilities,getQualifications){
    let responsibility = responsibilities;
    this.responsibilities.clear();
    responsibility?.forEach(element => {
      this.responsibilities?.push(element);
    });
    let qualification = getQualifications;
    this.qualifications.clear();
    qualification?.forEach(element => {
      this.qualifications?.push(element);
    });
  }

  submitCareerForm(){
    if(this.careerForm.valid){
      this.masterService.postCareerData(this.careerForm.value).subscribe(res=>{
        this.toastr.success("", "Data Save Successfully");
        this.careerForm.reset();
        this.responsibility = [];
        this.qualification = [];
        this.getCaeerData();
        this.addResponsibilitiesAndQualifications(this.getResponsibilities(this.responsibility).controls,this.getQualifications(this.qualification).controls);
      },
      error => {
        this.toastr.error("", "Something went wrong");
        this.careerForm.reset();
        this.addResponsibilitiesAndQualifications(this.getResponsibilities(this.responsibility).controls,this.getQualifications(this.qualification).controls);
      })
    }
  }


  editData(element){
    this.responsibility = element.responsibilities; 
    this.qualification =  element.qualifications;
    this.addResponsibilitiesAndQualifications(this.getResponsibilities(this.responsibility).controls,this.getQualifications(this.qualification).controls)
    this.careerForm.patchValue(element);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


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


  addInputTextForQualification(input){
    let removeDot = input.target.value.replaceAll("• ","");
    let simpleText = removeDot.replaceAll("\n• ","");
    let updateString = simpleText.replaceAll("\n","");
    let qualificationText =  updateString.split(".");
    this.addResponsibilitiesAndQualifications(this.getResponsibilities(this.responsibility).controls,this.getQualifications(qualificationText).controls);  
  }
  addInputTextForResponsibility(input){
    let removeDot = input.target.value.replaceAll("• ","");
    let simpleText = removeDot.replaceAll("\n• ","");
    let updateString = simpleText.replaceAll("\n","");
    let responsibility =  updateString.split(".");
    this.addResponsibilitiesAndQualifications(this.getResponsibilities(responsibility).controls,this.getQualifications(this.qualification).controls);  
  }
  clearForm(){
    this.careerForm.reset();
    this.responsibility = [];
    this.qualification = [];
  }

  deleteData(element){
    this.masterService.deleteCareerdata(element.jobId).subscribe(res=>{
      this.toastr.success("","Job detail deleted successfully");
      this.getCaeerData();
    }, error => {
      this.toastr.error("","Something Went Wrong");
    })
  }
}
