import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { HeaderShowServiceService } from '../header-show-service.service';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit {
  changeHederFlag:boolean = true;
  userName: string;
  constructor(public appService:AppService,private _hederShowService:HeaderShowServiceService) { 
    this._hederShowService.headerFlag.subscribe(res =>{
      this.changeHederFlag = res;
    })
  }

  ngOnInit() {

   this.userName = localStorage.getItem("userName");
  }

  headerContentFlag(){ 
    this._hederShowService.headerFlag.next(false);
  }

  logOut(){
    localStorage.clear();
  }
 

}
