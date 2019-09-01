import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { StripSnakeCasePipe } from "./pipes/strip-snake-case.pipe";

import { ModalDialogComponent } from "./components/modal-dialog/modal-dialog.component";


/**
 * Simple re-export module which allows multiple modules to use the same
 * components.
 */
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    StripSnakeCasePipe,
    ModalDialogComponent
  ],
  exports: [
    StripSnakeCasePipe,
    ModalDialogComponent
  ]
})
export class SharedModule { }
