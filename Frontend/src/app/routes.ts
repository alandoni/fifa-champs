import { Routes }  from '@angular/router';

import { InsertMatchComponent } from './insert-match/insert-match.component';
import { CreatePlayerComponent } from './create-player/create-player.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SeasonSelectorComponent } from './season-selector/season-selector.component';
import { PlayersListComponent } from './players-list/players-list.component';
import { HallOfFameComponent } from './hall-of-fame/hall-of-fame.component';
import { CreateAdminComponent } from './create-admin/create-admin.component';
import { AdminsListComponent } from './admins-list/admins-list.component';

export const appRoutes: Routes = [
	{path: 'login', component: LoginComponent},
	{path: 'players', component: PlayersListComponent},
	{path: 'season/results/:id', component: SeasonSelectorComponent},
	{path: 'season/results/:month/:year', component: SeasonSelectorComponent},
	{path: 'season/results/current', component: SeasonSelectorComponent},
	{path: 'season/results/alltime', component: SeasonSelectorComponent},
	{path: 'create-player', component: CreatePlayerComponent},
	{path: 'insert-match', component: InsertMatchComponent},
	{path: 'match/:id', component: InsertMatchComponent},
	{path: 'season/standings/:id', component: SeasonSelectorComponent},
	{path: 'season/standings/current', component: SeasonSelectorComponent},
	{path: 'season/standings/:month/:year', component: SeasonSelectorComponent},
	{path: 'season/standings/alltime', component: SeasonSelectorComponent},
	{path: 'admin', component: AdminsListComponent},
	{path: 'admin/create/:id/:nickname/:salt', component: CreateAdminComponent},
	{path: 'hall', component: HallOfFameComponent},
	{path: '', redirectTo: 'season/standings/current', pathMatch: 'full'},
	{path: '**', component: PageNotFoundComponent}
];
