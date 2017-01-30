import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { LoginService } from './login.service';
import { RouterModule, Routes } from '@angular/router';
import { appRoutes } from './routes.ts';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component'

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		PageNotFoundComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		HttpModule,
		RouterModule.forRoot(appRoutes)
	],
	providers: [LoginService],
	bootstrap: [AppComponent]
})
export class AppModule { }
