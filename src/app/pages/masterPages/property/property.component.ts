import { Component, OnInit, ViewChild,AfterViewInit } from '@angular/core';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {MatSort, Sort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table'
import { HeaderShowServiceService } from 'src/app/theme/components/header-show-service.service';
import { MasterPagesServicesService } from '../master-pages-services.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
export interface PeriodicElement {
  position: number;
  propertytype: string;
  discription: string;
}

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.scss']
})
export class PropertyComponent implements OnInit {
  ELEMENT_DATA: PeriodicElement[] = [
                                     {position: 1, propertytype: 'Flat/ Apartment', discription: "1.0079"},
                                     {position: 2, propertytype: 'Residential House', discription: "4.0026"},
                                     {position: 3, propertytype: 'Villa', discription: "6.941"},
                                     {position: 4, propertytype: 'Builder Floor Apartment', discription: "9.0122"},
                                     {position: 5, propertytype: 'Residential Land/ Plot', discription: "10.811"},
                                     {position: 6, propertytype: 'Penthouse', discription: "12.0107"},
                                     ];

  propertyFor = ['Residential','Commercial']       

  propertyType = ['Flat/ Apartment','Residential House','Villa','Builder Floor Apartment','Residential Land/ Plot','Penthouse']
  commercialProperty = ['Warehouse/ Godown',
                        'Commercial office Space',
                        'Commercial Shop',
                        'Commercial Showroom', "Restaurant Space"]                                     
  displayedColumns: string[] = ['position', 'propertytype', 'discription','Action'];//,'Delete'
  dataSource;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  changeHederFlag:boolean = true;
  propertyData : PeriodicElement[];     
  @ViewChild('Property') property;
  @ViewChild('discription') discription;
  propertyForm : FormGroup;
  constructor(private _liveAnnouncer: LiveAnnouncer,
              private _hederShowService:HeaderShowServiceService,
              private _masterPagesService: MasterPagesServicesService,
              private fb:FormBuilder) {
    this._hederShowService.headerFlag.subscribe(res =>{
      this.changeHederFlag = res;
    })
   }
  ngOnInit(): void {
    this._hederShowService.headerFlag.next(false);
    this._hederShowService.submitButtonFlag.next(false);
    this.propertyForm = this.fb.group({
      propertyFor:['Residential', Validators.required],
      propertyType:[''],
      property_type_id:'',
    })
    // discription:[''],
    this.getPropertyTypeController();
  }
  getPropertyTypeController(){
    this._masterPagesService.getPropertyTypeController().subscribe(res=>{
      this.propertyData = res.data.map((PD,index) => {
        return {
          position: index+1,
          propertytype: PD.property_name, 
          discription: PD.property_desc,
          property_type_id:PD.property_type_id
        };
      })
      this.dataSource= new MatTableDataSource<PeriodicElement>(this.propertyData);
      this.dataSource.paginator = this.paginator;
    })
  }

  get propertyForType(){
      return this.propertyForm.get('propertyFor') as FormControl;
  }
 
  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
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
  submit(){
    let propertyFor = this.propertyForType.value; 
    let propertyType = this.propertyForm.get('propertyType').value; 
    if (this.propertyForm.valid) {
      this.postPropertyType(propertyFor,propertyType,this.propertyForm.value.property_type_id);  
    }else{
      Object.keys(this.propertyForm.controls).forEach(key =>{
        this.propertyForm.controls[key].markAllAsTouched();
        
     });
    }
  }
  postPropertyType(propertyFor,propertyType,id){
    let Obj
    if(id !== ''){
     Obj={
        "property_desc": propertyType,
        "property_name": propertyFor,
        "property_type_id":id
      }
      
    }else{
      Obj={
        "property_desc": propertyType,
        "property_name": propertyFor,
      }
    }
      this._masterPagesService.propertyTypeController(Obj).subscribe(res=>{
        this.getPropertyTypeController();
        // this.property.nativeElement.value = "";
        // this.discription.nativeElement.value = "";
        this.propertyForm.controls.propertyType.setValue('');

      })

  }
  ngOnDestroy(): void {
    this._hederShowService.headerFlag.next(true);
    this._hederShowService.submitButtonFlag.next(true);

  }  

  editData(element){
  this.propertyForm.controls.propertyFor.setValue(element.propertytype);
  this.propertyForm.controls.propertyType.setValue(element.discription);
  }

  deleteData(element){
    let id = element.property_type_id;
    this._masterPagesService.deletePropertyTypeController(id).subscribe(res=>{
      this.getPropertyTypeController();
    })
    
  }

  clearForm(){
    this.propertyForm.controls.propertyFor.setValue('Residential');
    this.propertyForm.controls.propertyType.setValue('');
  }

}
