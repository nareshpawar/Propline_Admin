import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { HeaderShowServiceService } from 'src/app/theme/components/header-show-service.service';
import { MasterPagesServicesService } from '../master-pages-services.service';
import { emailValidator, matchingPasswords } from 'src/app/theme/utils/app-validators';

export interface PeriodicElement {
  position:number;
  email: string;
  message: string;
  sender_type: string;
}

@Component({
  selector: 'app-agents',
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.scss']
})
export class AgentsComponent implements OnInit {
  displayedColumns: string[] = ['position','agent_name','contact', 'email','organisation','agent_desc','Edit'];//,'Delete'
  dataSource;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  ELEMENT_DATA: PeriodicElement[];
  agentForm: FormGroup;
  changeHederFlag:boolean = true;
  imageFile: any = null;
  constructor(private _liveAnnouncer: LiveAnnouncer,
    private _hederShowService:HeaderShowServiceService,
    private _masterPagesService: MasterPagesServicesService,
    private fb : FormBuilder,private toastr: ToastrService) { 
      this._hederShowService.headerFlag.subscribe(res =>{
        this.changeHederFlag = res;
      }) }


   

  ngOnInit(): void {
    this._hederShowService.headerFlag.next(false);
    this._hederShowService.submitButtonFlag.next(false);

    this.agentForm= this.fb.group({
      "agent_desc": ["",Validators.required],
      "agent_name": ["",Validators.required],
      "contact": ["",[Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      "email": ["",[Validators.required,emailValidator]],
      "organisation": ["",Validators.required],
      "profile": null,
      "agent_id":null
    })

    this.getAgentsDetails();
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
  getAgentsDetails(){
    this._masterPagesService.getAgentsDetails().subscribe(res=>{
      this.ELEMENT_DATA = res.data.map((ele,index) => {
        return {
          "agent_desc": ele.agent_desc,
          "agent_name": ele.agent_name,
          "contact": ele.contact,
          "email": ele.email,
          "organisation": ele.organisation,
          "profile": ele.profile,
          "agent_id":ele.agent_id,
          position: index+1
        };
      })
      this.dataSource = new MatTableDataSource<PeriodicElement>(this.ELEMENT_DATA);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    },error=>{
      this.toastr.error("","Something went wrong");
    }
    )
  }

  submitAgentForm(){
    let imageFile =this.agentForm.controls.profile.value !== null && this.agentForm.value.profile.length !== 0 ? this.agentForm.controls.profile.value[0].file : null;
    let agents = JSON.parse(JSON.stringify(this.agentForm.value));
    delete agents.profile;
    const formData: FormData = new FormData();
    formData.append("agents", JSON.stringify(agents));
    if(imageFile !== null){
      formData.append("file_name",imageFile);
  }

   if(this.agentForm.valid){
    this._masterPagesService.agentPost(formData).subscribe(
      (res:any)=>{
        this.getAgentsDetails();
        this.agentForm.reset();
        this.toastr.success("","Data Save Successfully")
      },
      (error:any) =>{
        this.agentForm.reset();
        this.toastr.error("","Something went wrong");
      }
      )}else{
        Object.keys(this.agentForm.controls).forEach(key =>{
          this.agentForm.controls[key].markAllAsTouched();
          
       });

      }
  }
  selectFile(){
    this.imageFile = null;
  }

  editData(element){
    this.imageFile = element.profile;
    this.agentForm.controls.profile.setValue(null);
    this.agentForm.patchValue(element);
    this.agentForm.controls.profile.setValue(null);

  }
  deleteData(element){
    let id = element.agent_id;
    this._masterPagesService.deleteAgentController(id).subscribe(res=>{
      this.getAgentsDetails()
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

}
