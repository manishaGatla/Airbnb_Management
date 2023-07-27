import { Host, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AirbnbHeader } from 'src/components/airbnb-header/airbnb-header.component';
import { AirbnbLogin } from 'src/components/login-page/login-page.component';
import { FormsModule } from '@angular/forms';
import { AirbnbNodeService } from './airbnb-node.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { GuestPage } from 'src/components/guest-page/guest-page.component';
import { HostPage } from 'src/components/host-page/host-page.component';
import { AdminPage } from 'src/components/admin-page/admin-page.component';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    AirbnbHeader,
    AirbnbLogin,
    GuestPage,
    HostPage,
    AdminPage,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  exports: [
    RouterModule
  ],
  providers: [AirbnbNodeService, DatePipe],
  bootstrap: [AirbnbHeader]
})
export class AppModule { }
