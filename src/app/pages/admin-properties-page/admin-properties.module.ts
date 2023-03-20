import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { PropertiespageComponent } from './propertiespage/propertiespage.component';


export const routes = [
  { path: '', component: PropertiespageComponent, pathMatch: 'full' },

];

@NgModule({
  declarations: [
    PropertiespageComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule 
  ]
})
export class AdminPropertiesModule { }