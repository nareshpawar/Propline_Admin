import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { HeaderShowServiceService } from '../header-show-service.service';

@Component({
  selector: 'app-toolbar1',
  templateUrl: './toolbar1.component.html'
})
export class Toolbar1Component implements OnInit {
  @Output() onMenuIconClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() onMenuAdminIconClick : EventEmitter<any> = new EventEmitter<any>();
  changeHederFlag:boolean = true;
  changeMenuFlag:boolean = true;
  changeAccountFlag:boolean = true;
  submitButton :boolean = true;
  sidebarFlag: boolean = true;
  constructor(public appService:AppService,private _hederShowService:HeaderShowServiceService) { 
    this._hederShowService.sidebarFlag.subscribe(res =>{
      this.sidebarFlag = res;
    })
  }
  ngOnInit() { 
    this._hederShowService.headerFlag.subscribe(res =>{
      this.changeHederFlag = res;
    })
    this._hederShowService.menuFlag.subscribe(res =>{
      this.changeMenuFlag = res;
    })
    this._hederShowService.AccountDropdownFlag.subscribe(res =>{
      this.changeAccountFlag = res;
    })
    this._hederShowService.submitButtonFlag.subscribe(res =>{
      this.submitButton = res;
    })
  }

  public sidenavToggle(){
    this.onMenuIconClick.emit();
  //   if(ref == 'basic'){
  // }
  // else if(ref == 'admin'){
  //   this.onMenuAdminIconClick.emit();
  // }
  }
}