import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { AgmCoreModule } from '@agm/core';  
import { InputFileModule } from 'ngx-input-file';
import { SubmitPropertyComponent } from './submit-property.component';
import { NumberToWordsPipe } from './number-to-words.pipe';



export const routes = [
  { path: '', component: SubmitPropertyComponent, pathMatch: 'full'  },
  { path: ':id', component: SubmitPropertyComponent }
];

@NgModule({
  declarations: [SubmitPropertyComponent,NumberToWordsPipe],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    AgmCoreModule, 
    InputFileModule,
  
  ]
})
export class SubmitPropertyModule { }
