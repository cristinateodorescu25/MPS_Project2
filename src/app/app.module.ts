import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

import {HomeComponent} from './pages/home/home.component';
import {HttpClientModule} from '@angular/common/http';
import {LoginComponent} from './pages/login/login.component';
import {SignupComponent} from './pages/signup/signup.component';
import {UiService} from './services/ui/ui.service';
import {WebsocketService} from './services/websocket.service';
import {ChatService} from './services/chat.service';
import {DonatorComponent} from './pages/donator/donator.component';
import {DoctorComponent} from './pages/doctor/doctor.component';
import {PersonalComponent} from './pages/personaltr/personaltr.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent,
    DonatorComponent,
    DoctorComponent,
    PersonalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    UiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
