import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { CreatePlayerComponent } from './create-player/create-player.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component'

import { LoginService } from './login.service';
import { PlayerService } from './player.service';
import { ApiRequestService } from './api-request.service';

import { RouterModule, Routes } from '@angular/router';
import { appRoutes } from './routes.ts';

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
    CreatePlayerComponent,
		PageNotFoundComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		HttpModule,
		RouterModule.forRoot(appRoutes)
	],
	providers: [LoginService, PlayerService, ApiRequestService],
	bootstrap: [AppComponent]
})
export class AppModule { }
