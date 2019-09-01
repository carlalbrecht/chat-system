import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";

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
    CommonModule
  ],
  declarations: [DashboardPage]
})
export class DashboardModule { }
