import { Component, OnInit, OnChanges } from '@angular/core';
import { MatchService } from './../match.service';
import { Player } from './../models/player';
import { Match } from './../models/match';
import { ChampionshipService } from './../championship.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector : 'app-season-selector',
    templateUrl : './season-selector.component.html',
    styleUrls : ['./season-selector.component.css']
})
export class SeasonSelectorComponent implements OnInit {

    matches : Array<Match>;
    date = new Date();
    isLoading = false;
    tab = 0;
    noChampionships = false;
    noFilterSelected = false;

    constructor(private matchService : MatchService, private championshipService : ChampionshipService,
        private route : ActivatedRoute, private router : Router) {}

    ngOnInit() {
        this.isLoading = true;

        if (!this.championshipService.getCurrentChampionship()) {
            this.championshipService.getCurrent().subscribe((championships) => {
                if (championships.length === 0) {
                    this.noChampionships = true;
                    return;
                }
                this.championshipService.setCurrentChampionship(championships[0]);
                this.championshipService.setSelectedChampionship(championships[0]);
            });
        }

        this.route.params.subscribe(params => {

            if (window.location.href.indexOf('results') > 0) {
                this.changeTab(1);
            } else {
                this.changeTab(0);
            }

            if (params['id'] === 'current') {
                this.requestCurrentMatches();
                return;
            }

            if (params['id'] === 'alltime') {
                this.requestAllMatches();
                return;
            }

            if (params['id']) {
                this.requestMatchesByChampionship(params['id']);
            }

            if (params['month'] && params['year']) {
                this.requestMatchesByMonth(+params['month'], +params['year']);
            }
        });
    }

    getCurrentMonth() {
        const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        return months[this.date.getMonth()] + ' de ' + this.date.getFullYear();
    }

    previousMonth() {
        this.date = this.sumMonth(this.date, -1);
        goToMonth(this.date);
    }

    nextMonth() {
        this.date = this.sumMonth(this.date, 1);
        goToMonth(this.date);
    }

    goToMonth(date) {
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        this.championshipService.getByMonth(month, year).subscribe((championships) => {
            this.championshipService.setSelectedChampionship(championships[0]);
        });

        const urlDate = month + '/' + year;

        if (this.tab === 0) {
            this.router.navigateByUrl('season/standings/' + urlDate);
        } else {
            this.router.navigateByUrl('season/results/' + urlDate);
        }
    }

    sumMonth(date, numberOfMonths) {
        const newDate = new Date(date);
        newDate.setMonth(date.getMonth() + numberOfMonths);
        return newDate;
    }

    requestMatchesByMonth(month, year) {
        this.date = new Date(year, month - 1, 1);
        this.isLoading = true;
        this.championshipService.getByMonth(month, year).subscribe((championships) => {
            if (championships.length > 0) {
                this.requestMatchesByChampionship(championships[0]._id);
            } else {
                this.matches = [];
            }
            this.isLoading = false;
        },
        (error) => console.log(error));
    }

    requestMatchesByChampionship(championshipId) {
        this.isLoading = true;
        this.matchService.getByChampionship(championshipId).subscribe((matches) => {
            this.processMatches(matches);
        },
        (error) => console.log(error));

        this.championshipService.getById(championshipId).subscribe((championship) => {
            if (championship) {
                this.noChampionships = false;
            }
            this.date = new Date(championship.year, championship.month - 1, 1);
        });
    }

    requestAllMatches() {
        this.isLoading = true;
        this.matchService.getAll().subscribe((matches) => {
            this.processMatches(matches);
        },
        (error) => console.log(error));
    }

    requestCurrentMatches() {
        if (this.championshipService.getCurrentChampionship()) {
            const championshipId = this.championshipService.getCurrentChampionship()._id;
            this.requestMatchesByChampionship(championshipId);
            return;
        }

        this.championshipService.getCurrent().subscribe((championships) => {
            if (championships.length === 0) {
                this.isLoading = false;
                return;
            }

            this.championshipService.setCurrentChampionship(championships[0]);
            this.requestMatchesByChampionship(championships[0]._id);
        });
    }

    processMatches(matches : Array<Match>) {
        this.matches = matches;
        this.isLoading = false;
    }

    formatDate(date) {
        const day = (date.getDate() < 10 ? '0' : '') + date.getDate();
        const month = (date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1);
        return  day + '/' + month + '/' + date.getFullYear();
    }

    dateFromString(str) {
        const parts = str.split('/');
        return new Date(parts[2], parts[1] - 1, parts[0]);
    }

    changeTab(tab) {
        this.tab = tab;
        if (tab === 0) {
            const newUrl = window.location.href.replace('results', 'standings');
            history.pushState({}, null, newUrl);
        } else {
            const newUrl = window.location.href.replace('standings', 'results');
            history.pushState({}, null, newUrl);
        }
    }

    noFilterSelectionChanged() {
        this.noFilterSelected = !this.noFilterSelected;

        if (this.noFilterSelected) {
            this.requestAllMatches();
        } else {
            this.requestMatchesByMonth(this.date.getMonth() + 1, this.date.getFullYear());
        }
    }
}
