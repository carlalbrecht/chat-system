/**
 * Simple re-export module which allows multiple modules to use the same
 * components.
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { StripSnakeCasePipe } from "./pipes/strip-snake-case.pipe";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    StripSnakeCasePipe
  ],
  exports: [
    StripSnakeCasePipe
  ]
})
export class SharedModule { }
