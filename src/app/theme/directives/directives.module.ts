import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnlyNumberDirective } from './only-number.directive';
// import { BulletTextBoxDirective } fro../../pages/masterPages/bullet-teext-box.directiveive';

@NgModule({
  declarations: [
    OnlyNumberDirective,
    // BulletTextBoxDirective
  ],
  exports: [
    OnlyNumberDirective
  ],
  imports: [
    CommonModule
  ]
})
export class DirectivesModule { }
