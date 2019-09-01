import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { SharedModule } from 'src/app/shared.module';
import { ChatPage } from "./chat.page";


const routes: Routes = [
  {
    path: "",
    component: ChatPage
  }
];


@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    SharedModule
  ],
  declarations: [ChatPage]
})
export class ChatModule { }
