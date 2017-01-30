import { Routes }  from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

export const appRoutes: Routes = [
	{path: 'login', component: LoginComponent},
	/*{path: 'create-player', component: CreatePlayerComponent},
	{path: 'create-match', component: CreateMatchComponent},
	{path: 'results/:id', component: ResultsComponent},
	{path: 'results/:month/:year', component: ResultsComponent},
	{path: 'classification/:id', component: CreateMatchComponent},
	{path: 'results/current', component: ResultsComponent},
	{path: 'classification/current', component: CreateMatchComponent},
	{path: 'classification/:month/:year', component: CreateMatchComponent},
	{path: 'results/alltime', component: CreateMatchComponent},
	{path: 'classification/alltime', component: CreateMatchComponent},
	{path: 'hall', component: CreateMatchComponent},
	{path: '', redirectTo: '/results/current', pathMatch: 'full'},*/
	{path: '', redirectTo: '/login', pathMatch: 'full'},
	{path: '**', component: PageNotFoundComponent}
];