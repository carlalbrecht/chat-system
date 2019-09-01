import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from "@angular/router";

import { SharedModule } from 'src/app/shared.module';
import { DashboardPage } from "./dashboard.page";


const routes: Routes = [
  {
    path: "",
    component: DashboardPage
  }
];


@NgModule({
  imports: [
    RouterModule.forChild(routes),
    FormsModule,
    CommonModule,
    SharedModule
  ],
  declarations: [DashboardPage]
})
export class DashboardModule { }
