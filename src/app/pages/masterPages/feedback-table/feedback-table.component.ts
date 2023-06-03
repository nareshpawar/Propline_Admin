import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HeaderShowServiceService } from 'src/app/theme/components/header-show-service.service';
import { MasterPagesServicesService } from '../master-pages-services.service';
export interface PeriodicElement {
  position:number;
  email: string;
  message: string;
  sender_type: string;
  
}
@Component({
  selector: 'app-feedback-table',
  templateUrl: './feedback-table.component.html',
  styleUrls: ['./feedback-table.component.scss']
})
export class FeedbackTableComponent implements OnInit {
  displayedColumns: string[] = ['position', 'email','message'];
  dataSource;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  streetData: any;
  changeHederFlag:boolean = true;
  ELEMENT_DATA: PeriodicElement[]; 
  constructor(private _liveAnnouncer: LiveAnnouncer,
              private _hederShowService:HeaderShowServiceService,
              private _masterPagesService: MasterPagesServicesService) { 
                this._hederShowService.headerFlag.subscribe(res =>{
                  this.changeHederFlag = res;
                }) }

  ngOnInit(): void {
    this._hederShowService.headerFlag.next(false);
    this._hederShowService.submitButtonFlag.next(false);
    this.getFeedbackData();
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

    getFeedbackData(){
      this._masterPagesService.getFeedbackDetails().subscribe(res=>{
          // this.ELEMENT_DATA = res.data;
          this.ELEMENT_DATA = res.data.map((PD,index) => {
            return {
              position: index+1,
              email: PD.email,
              message: PD.message,
              sender_type: PD.sender_type,
              
            };
          })
          this.dataSource = new MatTableDataSource<PeriodicElement>(this.ELEMENT_DATA);
          this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
      })
    }
  
    ngOnDestroy(): void {
      this._hederShowService.headerFlag.next(true);
      this._hederShowService.submitButtonFlag.next(true);
  
    }
  
}
