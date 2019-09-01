import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthenticatedGuard } from "./guards/authenticated.guard";


const routes: Routes = [
  { path: "", redirectTo: "chat", pathMatch: "full" },
  { path: "login", loadChildren: "./pages/login/login.module#LoginModule" },
  {
    path: "dashboard",
    loadChildren: "./pages/dashboard/dashboard.module#DashboardModule",
    canActivate: [AuthenticatedGuard]
  },

  // Chat pages (route parameter destructuring)
  {
    path: "chat",
    loadChildren: "./pages/chat/chat.module#ChatModule",
    canActivate: [AuthenticatedGuard]
  },
  {
    path: "chat/:group",
    loadChildren: "./pages/chat/chat.module#ChatModule",
    canActivate: [AuthenticatedGuard],
  },
  {
    path: "chat/:group/:channel",
    loadChildren: "./pages/chat/chat.module#ChatModule",
    canActivate: [AuthenticatedGuard],
  },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
