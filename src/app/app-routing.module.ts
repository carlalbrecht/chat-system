import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthenticatedGuard } from "./guards/authenticated.guard";


const routes: Routes = [
  { path: "", redirectTo: "chat", pathMatch: "full" },
  { path: "login", loadChildren: "./pages/login/login.module#LoginModule" },
  {
    path: "chat",
    loadChildren: "./pages/chat/chat.module#ChatModule",
    canActivate: [AuthenticatedGuard]
  },
  {
    path: "dashboard",
    loadChildren: "./pages/dashboard/dashboard.module#DashboardModule",
    canActivate: [AuthenticatedGuard]
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
