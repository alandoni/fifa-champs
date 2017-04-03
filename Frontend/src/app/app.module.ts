import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterializeModule } from 'angular2-materialize';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { CreatePlayerComponent } from './create-player/create-player.component';
import { StandingTableComponent } from './standing-table/standing-table.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { InsertMatchComponent } from './insert-match/insert-match.component';
import { DropdownPlayerComponent } from './dropdown-player/dropdown-player.component';
import { SeasonSelectorComponent } from './season-selector/season-selector.component';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { PlayersListComponent } from './players-list/players-list.component';
import { HallOfFameComponent } from './hall-of-fame/hall-of-fame.component';
import { MatchComponent } from './match/match.component';
import { MatchListComponent } from './match-list/match-list.component';

import { LoginService } from './login.service';
import { PlayerService } from './player.service';
import { MatchService } from './match.service';
import { ChampionshipService } from './championship.service';
import { ApiRequestService } from './api-request.service';

import { RouterModule, Routes } from '@angular/router';
import { appRoutes } from './routes';
import { AdminsListComponent } from './admins-list/admins-list.component';
import { CreateAdminComponent } from './create-admin/create-admin.component';
import { NavigationBarItemComponent } from './navigation-bar-item/navigation-bar-item.component';
import { SelectComponent } from './select/select.component';

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		CreatePlayerComponent,
	    InsertMatchComponent,
		StandingTableComponent,
		PageNotFoundComponent,
		SeasonSelectorComponent,
		NavigationBarComponent,
		PlayersListComponent,
		DropdownPlayerComponent,
		NavigationBarComponent,
		HallOfFameComponent,
		MatchComponent,
		MatchListComponent,
		AdminsListComponent,
		CreateAdminComponent,
		NavigationBarItemComponent,
		SelectComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		HttpModule,
		MaterializeModule,
		RouterModule.forRoot(appRoutes)
	],
	providers: [LoginService, PlayerService, MatchService, ChampionshipService, ApiRequestService],
	bootstrap: [AppComponent]
})
export class AppModule { }
