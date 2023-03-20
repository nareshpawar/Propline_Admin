import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Router } from '@angular/router'; 
import { ToastrService } from 'ngx-toastr';
import { HeaderShowServiceService } from 'src/app/theme/components/header-show-service.service';
import { PageServicesService } from '../page-services.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit,OnDestroy {
  public loginForm: FormGroup;
  public hide = true;
  constructor(public fb: FormBuilder, public router:Router,private _hederShowService:HeaderShowServiceService,
              private pageServeices: PageServicesService,private toastr: ToastrService) { }

  ngOnInit() {
    this._hederShowService.headerFlag.next(false);
    this._hederShowService.menuFlag.next(false);
    this._hederShowService.AccountDropdownFlag.next(false);
    this._hederShowService.submitButtonFlag.next(false);
    this._hederShowService.sidebarFlag.next(false);
    this.loginForm = this.fb.group({
      username: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required])],
      rememberMe: false
    });
  }

  ngOnDestroy(): void {
    this._hederShowService.menuFlag.next(true);
    this._hederShowService.headerFlag.next(true);
    this._hederShowService.AccountDropdownFlag.next(true);
    this._hederShowService.submitButtonFlag.next(true);
    this._hederShowService.sidebarFlag.next(true);


  }

  public onLoginFormSubmit(values:Object):void {
    if (this.loginForm.valid) {
      this.pageServeices.login(this.loginForm.value).subscribe(res=>{
        if(res.statusCode == 200){
          this.toastr.success("","Login Succesfully"); 
          this.router.navigate(['/adminProperties']);
          localStorage.setItem("userName", res.data.username);
          }else{
            this.toastr.error("","Please Enter Valid Username and Password");
          }
      },error=>{
        this.toastr.error("","Please Enter Valid Username and Password");
      }
      )
      
    }
  }
 
}
