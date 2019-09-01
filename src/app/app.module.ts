import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { UserService } from './services/user.service';
import { UserListService } from './services/user-list.service';
import { AuthenticatedGuard } from "./guards/authenticated.guard";


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    UserService,
    UserListService,
    AuthenticatedGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
