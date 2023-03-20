import { isPlatformBrowser } from '@angular/common';
import { Component, OnInit, ViewChild, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Settings, AppSettings } from '../app.settings';
import { HeaderShowServiceService } from '../theme/components/header-show-service.service';
import { MasterPagesServicesService } from './masterPages/master-pages-services.service';
// import {MdSidenav} from "@angular/material";
import { ToastrService } from 'ngx-toastr';
import { PageServicesService } from './page-services.service';
@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {
  @ViewChild('sidenav') sidenav : any;
  @ViewChild('sidenavForAdmin') sidenavForAdmin : any;  
  public toolbarTypes = [1, 2];
  public toolbarTypeOption:number;
  public headerTypes = ['default', 'image', 'carousel', 'map', 'video'];
  public headerTypeOption:string;
  public searchPanelVariants = [1, 2, 3];
  public searchPanelVariantOption:number;
  public headerFixed: boolean = false;
  public showBackToTop: boolean = false;
  public scrolledCount = 0;

  public settings: Settings;

  changeHederFlag:boolean = true;
  sidebarFlag: boolean = true;

  clickEventSubscription:Subscription;
  // @ViewChild('propertieSidebar') public propertieSidebar ;
  // @HostListener('window:resize', ['$event'])
  // onResize(event) {
  //     this.screenWidth$.next(event.target.innerWidth);
  //     if (event.target.innerWidth <= 500) {
  //         this.propertieSidebar.close();
  //     }
  // }
  // screenWidth: number;
  // private screenWidth$ = new BehaviorSubject<number>(window.innerWidth);
  
  constructor(public appSettings:AppSettings, 
              public router:Router, private toastr: ToastrService,
  @Inject(PLATFORM_ID) private platformId: Object,private _hederShowService:HeaderShowServiceService,
    private _masterPagesService: MasterPagesServicesService, private pageServices:PageServicesService) {
    this.settings = this.appSettings.settings;  
    this._hederShowService.headerFlag.subscribe(res =>{
      this.changeHederFlag = res;
    })
    this._hederShowService.sidebarFlag.subscribe(res =>{
      this.sidebarFlag = res;
    })

    this.clickEventSubscription = this.pageServices.scroll.subscribe((message)=>{
      if(message === "scroll"){
        this.scrollToTop();
      }
    })
  }

  ngOnInit() {
    // this.screenWidth$.subscribe(width => {
    //   this.screenWidth = width;
    // });
    this.toolbarTypeOption = this.settings.toolbar;    
    this.headerTypeOption = this.settings.header; 
    this.searchPanelVariantOption = this.settings.searchPanelVariant;
  }
  
  public changeTheme(theme){
    this.settings.theme = theme;       
  }

  public chooseToolbarType(){
    this.settings.toolbar = this.toolbarTypeOption;
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0,0);
    }
  }

  public chooseHeaderType(){
    this.settings.header = this.headerTypeOption;    
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0,0);
    }
    this.router.navigate(['/']);
  }

  public chooseSearchPanelVariant(){
    this.settings.searchPanelVariant = this.searchPanelVariantOption;
  }
     
 
  @HostListener('window:scroll') onWindowScroll() {
    const scrollTop = Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop);
    (scrollTop > 300) ? this.showBackToTop = true : this.showBackToTop = false; 

    if(this.settings.stickyMenuToolbar){      
      let top_toolbar = document.getElementById('top-toolbar');
      if(top_toolbar){ 
        if(scrollTop >= top_toolbar.clientHeight) {
          this.settings.mainToolbarFixed = true;
        }
        else{
          this.settings.mainToolbarFixed = false;
        } 
      }        
    } 
    
        
    let load_more = document.getElementById('load-more');
    if(load_more){
      if(window.innerHeight > load_more.getBoundingClientRect().top + 120){ 
        if(!this.settings.loadMore.complete){
          if(this.settings.loadMore.start){        
            if(this.scrolledCount < this.settings.loadMore.step){  
              this.scrolledCount++; 
              if(!this.settings.loadMore.load){ 
                this.settings.loadMore.load = true; 
              }
            }
            else{
              this.settings.loadMore.start = false;
              this.scrolledCount = 0;
            }
          }  
        }              
      }
    }
  }

  public scrollToTop2(){
    // console.log("scroll");
    
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior: 'smooth' 
    });
  }

  public scrollToTop(){
    var scrollDuration = 200;
    var scrollStep = -window.pageYOffset  / (scrollDuration / 20);
    var scrollInterval = setInterval(()=>{
      if(window.pageYOffset != 0){
         window.scrollBy(0, scrollStep);
      }
      else{
        clearInterval(scrollInterval); 
      }
    },10);
    if(window.innerWidth <= 768){
      setTimeout(() => { 
        if (isPlatformBrowser(this.platformId)) {
          window.scrollTo(0,0);
        } 
      });
    }
  }

  ngAfterViewInit(){
    document.getElementById('preloader').classList.add('hide');
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {        
        this.sidenav.close();
        this.settings.mainToolbarFixed = false;
        setTimeout(() => {
          if (isPlatformBrowser(this.platformId)) {
            window.scrollTo(0,0);
          } 
        }); 
      }            
    });    
  }   


  headerContentFlag(){ 
    this._hederShowService.headerFlag.next(false);
    // this.sidenavForAdmin.close()
  }

  
 

}
