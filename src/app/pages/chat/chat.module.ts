import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";

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
    CommonModule
  ],
  declarations: [ChatPage]
})
export class ChatModule { }
