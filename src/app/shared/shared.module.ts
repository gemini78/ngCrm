import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticatedDiective } from './directives/authenticated.directive';



@NgModule({
  declarations: [AuthenticatedDiective],
  imports: [
    CommonModule
  ],
  exports: [AuthenticatedDiective]
})
export class SharedModule { }
