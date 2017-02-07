import { Routes }  from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SeasonComponent } from './season/season.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SeasonSelectorComponent } from './season-selector/season-selector.component';
import { PlayersListComponent } from './players-list/players-list.component';

export const appRoutes: Routes = [
	{path: 'login', component: LoginComponent},
	{path: 'players', component: PlayersListComponent},
	/*{path: 'create-player', component: CreatePlayerComponent},
	{path: 'create-match', component: CreateMatchComponent},
	{path: 'season/results/:id', component: ResultsComponent},
	{path: 'season/results/:month/:year', component: ResultsComponent},
	{path: 'season/results/current', component: ResultsComponent},
	{path: 'season/results/alltime', component: CreateMatchComponent},*/
	{path: 'season/classification/:id', component: SeasonSelectorComponent},
	{path: 'season/classification/current', component: SeasonSelectorComponent},
	{path: 'season/classification/:month/:year', component: SeasonSelectorComponent},
	{path: 'season/classification/alltime', component: SeasonSelectorComponent},
	//{path: 'hall', component: CreateMatchComponent},
	{path: '', redirectTo: 'season/classification/current', pathMatch: 'full'},
	{path: '**', component: PageNotFoundComponent}
];