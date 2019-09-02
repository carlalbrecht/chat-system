import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { InitialsPipe } from './pipes/initials.pipe.ts';
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
    InitialsPipe,
    StripSnakeCasePipe,
    ModalDialogComponent
  ],
  exports: [
    InitialsPipe,
    StripSnakeCasePipe,
    ModalDialogComponent
  ]
})
export class SharedModule { }
