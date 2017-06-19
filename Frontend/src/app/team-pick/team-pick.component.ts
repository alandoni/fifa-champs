import { Component, OnInit } from '@angular/core';
import { TeamPickService } from './../team-pick.service';
import { Team } from './../models/team'
@Component({
  selector: 'app-team-pick',
  templateUrl: './team-pick.component.html',
  styleUrls: ['./team-pick.component.css']
})
export class TeamPickComponent implements OnInit {

	pickedTeams: boolean;
  stars:string;
  jsonTeams: JSON;
  team1: Team;
  team2: Team;

  constructor(private teamPickService: TeamPickService) { }

  ngOnInit() {
    this.pickedTeams = false;
    
    this.teamPickService.getJSON().subscribe((jsonTeams) => {
      this.jsonTeams = jsonTeams;
      this.selectStarsAndTeams();
    });
  }

  randomIntFromInterval(min, max) {
      return Math.floor(Math.random()*(max-min+1)+min);
  }

  selectStarsAndTeams(){
      this.pickedTeams = false;
      this.chooseStars();
      this.chooseTeams();
      this.pickedTeams = true;
  }
  
  chooseStars(){
    let indexOfType = this.randomIntFromInterval(1, this.jsonTeams["oddsForTypesAvailable"].length) - 1;;
    this.stars = this.jsonTeams["oddsForTypesAvailable"][indexOfType];
    while((this.jsonTeams["oddsForTypesAvailable"].length > 0) && (this.jsonTeams[this.stars].length < 2)){
      console.log("Removed Stars: " + this.jsonTeams["oddsForTypesAvailable"][indexOfType]);
      this.jsonTeams["oddsForTypesAvailable"].splice(indexOfType, 1);
      indexOfType = this.randomIntFromInterval(1, this.jsonTeams["oddsForTypesAvailable"].length) - 1;
      this.stars = this.jsonTeams["oddsForTypesAvailable"][indexOfType];
    }
  }

  chooseTeams(){
    let indexTeamOne = this.randomIntFromInterval(1, this.jsonTeams[this.stars].length) - 1
    this.team1 = this.jsonTeams[this.stars][indexTeamOne];
    this.team1.badgeImage = (this.team1.badgeImage == "")?"https://cdn.tutsplus.com/net/uploads/legacy/958_placeholders/placehold.gif":this.team1.badgeImage;
    this.jsonTeams[this.stars].splice(indexTeamOne, 1);

    let indexTeamTwo = this.randomIntFromInterval(1, this.jsonTeams[this.stars].length) - 1  
    this.team2 = this.jsonTeams[this.stars][indexTeamTwo];
    this.team2.badgeImage = (this.team2.badgeImage == "")?"https://cdn.tutsplus.com/net/uploads/legacy/958_placeholders/placehold.gif":this.team2.badgeImage;
    this.jsonTeams[this.stars].splice(indexTeamTwo, 1);
  }

}
