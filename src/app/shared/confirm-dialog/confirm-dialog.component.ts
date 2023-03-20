import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageServicesService } from 'src/app/pages/page-services.service';

export class ConfirmDialogModel { 
  constructor(public title: string, public message: string) { }
}

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {
  public title: string;
  public message: string;
  public reason:string;
  public resonSaveFlag = false;
  public id;
  public propActive :boolean;
  public reasonsArray= ["Active",
                        "The proprty again available on the market",
                        "Only for promotion",
                        "Others",
                        "Inactive",
                        "Owner hold the decision",
                        "Property sale by owner",
                        "Property sold out by other broker",
                        "Property sold out by propline.in", ];
  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogModel,
              private _pagesServices: PageServicesService) { 
    this.title = data.title;
    this.message = data.message;
  }

  ngOnInit(): void {
  }

  onConfirm(): void {
    // this._pagesServices.isPropertyActive(this.id,0,this.reason).subscribe(res=>{
    //       })
   
    if(this.propActive){
       this._pagesServices.isPropertyActive(this.id, 1,this.reason).subscribe(res => {
      })
    }else{
      this._pagesServices.isPropertyActive(this.id,0,this.reason).subscribe(res=>{
              })
    }
    
    this.dialogRef.close(true);
  }

  onDismiss(): void { 
    this.dialogRef.close(false);
  }

  selectReason(event){
    this.resonSaveFlag = true;
    this.reason = event.value;
  }


} 