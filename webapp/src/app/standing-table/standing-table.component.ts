import { Component, OnInit, OnChanges, Input, SimpleChanges } from '@angular/core';
import { Match } from './../models/match';
import { Statistics } from './../models/statistics';
import { Player } from './../models/player';
import { ChampionshipService } from './../championship.service';
import { LoginService } from './../login.service';

@Component({
    selector: 'app-standing-table',
    templateUrl: './standing-table.component.html',
    styleUrls: ['./standing-table.component.css']
})
export class StandingTableComponent implements OnChanges {

    @Input() matches : Array<Match>;
    @Input() noFilterSelected : Boolean;

    statisticsList : Array<Statistics>;
    days = 0;
    numberOfMatches = 0;
    limit = 0;

    constructor(private championshipService : ChampionshipService, private loginService : LoginService) { }

    ngOnChanges(changes : SimpleChanges) {
        this.setLimit();

        this.statisticsList = Statistics.getStatisticsFromMatches(this.matches, this.limit);

        // we should not update the stats it the statisticsList
        // contains stats for all championships
        if (!changes['noFilterSelected']) {
            this.updateStats();
        }
    }

    updateStats() {
        // update the stats only if the user is an admin
        if (this.loginService.isLoggedIn()) {
            if (this.statisticsList != null && this.statisticsList.length > 0) {
                const champs = this.championshipService.getSelectedChampionship();
                // we should not add stats for an unfinished championship
                if (!champs.isCurrent) {
                    champs.matches = this.matches;
                    champs.players = this.statisticsList.map(item => item.player);
                } else {
                    // if the championship is unfinished, the stats must remain empty
                    champs.matches = [];
                    champs.players = [];
                }
                this.championshipService.update(champs._id, champs).subscribe((res) => {}, (err) => {});
            }
        }
    }

    setLimit() {
        if (this.matches == null || this.matches.length === 0) {
            this.days = 0;
            this.numberOfMatches = 0;
            this.limit = 0;
            return;
        }

        const days = [];
        for (const match of this.matches) {
            if (days.indexOf(match.date) < 0 && match.date != null && !match.isFinal) {
                days.push(match.date);
            }
        }
        this.days = days.length;
        this.numberOfMatches = this.matches.length;

        if (this.noFilterSelected) {
            this.limit = Math.floor(this.numberOfMatches / 15);
        } else {
            this.limit = this.days;
        }
    }

    hasPlayers() {
        return this.statisticsList != null && this.statisticsList.length > 0;
    }

    getSg(statistic) {
        if (statistic.goalBalance < 0) {
            return 1;
        }
        return 0;
    }

    getColor(position, statistic) {
        if (position < 4) {
            return 1;
        }
        if (statistic.matches < this.limit) {
            return 2;
        }
        return 0;
    }

    formatNumber(number) {
        return parseFloat(number).toFixed(2);
    }
}
