import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import {MaterializeDirective} from "angular2-materialize";

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { CreatePlayerComponent } from './create-player/create-player.component';

import { LoginService } from './login.service';
import { PlayerService } from './player.service';
import { ApiRequestService } from './api-request.service';


@NgModule({
  declarations: [
    MaterializeDirective,
    AppComponent,
    LoginComponent,
    CreatePlayerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [LoginService, PlayerService, ApiRequestService],
  bootstrap: [AppComponent]
})
export class AppModule { }
