import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { AgmCoreModule } from '@agm/core';  
import { InputFileModule } from 'ngx-input-file';
import { CityComponent } from './city/city.component';
import { NeighborhoodComponent } from './neighborhood/neighborhood.component';
import { StreetComponent } from './street/street.component';
import { PropertyComponent } from './property/property.component';
import { SocietyComponent } from './society/society.component';
import { OurServicesComponent } from './our-services/our-services.component';
import { OurMissionComponent } from './our-mission/our-mission.component';
import { TestimonialComponent } from './testimonial/testimonial.component';
import { AgentsComponent } from './agents/agents.component';
import { FeedbackTableComponent } from './feedback-table/feedback-table.component';
import { OwnerComponent } from './owner/owner.component';
import { UserComponent } from './user/user.component';
import { TenentComponent } from './tenent/tenent.component';
import { BannerComponent } from './banner/banner.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AngularFileViewerModule } from '@taldor-ltd/angular-file-viewer';
import { FormsModule } from '@angular/forms';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
export const routes = [
  {   path: 'city', component: CityComponent, pathMatch: 'full'                  },
  {   path: 'neighborhood', component: NeighborhoodComponent, pathMatch: 'full'  },
  {   path: 'street', component: StreetComponent, pathMatch: 'full'              },
  {   path: 'property', component: PropertyComponent, pathMatch: 'full'          },
  {   path: 'society', component: SocietyComponent, pathMatch: 'full'            },
  {   path: 'services', component: OurServicesComponent, pathMatch: 'full'       },
  {   path: 'mission', component: OurMissionComponent, pathMatch: 'full'         },
  {   path: 'testimonial', component: TestimonialComponent, pathMatch: 'full'    },
  {   path: 'agents', component: AgentsComponent, pathMatch: 'full'              },
  {   path: 'feedback', component: FeedbackTableComponent, pathMatch: 'full'     },
  {   path: 'user', component: UserComponent, pathMatch: 'full'                  },
  {   path: 'owner', component: OwnerComponent, pathMatch: 'full'                },
  {   path: 'tenent', component: TenentComponent, pathMatch: 'full'              },
  {   path: 'banner', component: BannerComponent, pathMatch: 'full'              },
  {   path: 'dashboard', component: DashboardComponent, pathMatch: 'full'        },

];

@NgModule({
  declarations: [ CityComponent,
                  NeighborhoodComponent, 
                  StreetComponent, 
                  PropertyComponent, 
                  SocietyComponent, 
                  OurServicesComponent, 
                  OurMissionComponent, 
                  TestimonialComponent, 
                  AgentsComponent, 
                  FeedbackTableComponent, 
                  OwnerComponent, 
                  UserComponent, 
                  TenentComponent, 
                  BannerComponent, 
                  DashboardComponent,
                ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    AgmCoreModule, 
    InputFileModule,
    NgxChartsModule,
    AngularFileViewerModule,
    FormsModule,
    NgxIntlTelInputModule
  ]
})
export class MasterDataModule { }
