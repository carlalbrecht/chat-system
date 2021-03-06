import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { SharedModule } from 'src/app/shared.module';
import { LoginPage } from "./login.page";


const routes: Routes = [
  {
    path: "",
    component: LoginPage
  }
];


@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    SharedModule
  ],
  declarations: [LoginPage]
})
export class LoginModule { }
