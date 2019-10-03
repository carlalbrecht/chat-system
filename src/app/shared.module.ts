import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { InitialsPipe } from './pipes/initials.pipe.ts';
import { StripSnakeCasePipe } from "./pipes/strip-snake-case.pipe";

import { ChatItemComponent } from './components/chat-item/chat-item.component';
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
    ChatItemComponent,
    ModalDialogComponent
  ],
  exports: [
    InitialsPipe,
    StripSnakeCasePipe,
    ChatItemComponent,
    ModalDialogComponent
  ]
})
export class SharedModule { }
