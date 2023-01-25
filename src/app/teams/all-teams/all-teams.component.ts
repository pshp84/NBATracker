import { Component } from '@angular/core';
import { HttpService } from 'src/app/service/http/http.service';
import { Teams } from 'src/app/models/teams';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-teams',
  templateUrl: './all-teams.component.html',
  styleUrls: ['./all-teams.component.scss']
})

export class AllTeamsComponent {

  teams: Teams[] = [];
  selectedTeam!: number;
  displayedTeams: Teams[] = [];
  currentDate: Date = new Date();
  firstGameDate: Date = new Date(new Date().setDate(new Date().getDate() - 11)); // we need to start from 12 days ago
  allDates: Array<string> = [];
  submitted: boolean = false
  constructor(private service: HttpService, private router: Router) { }

  ngOnInit() {
    this.getTeams();
    this.populateAllDates();
  }

  getTeams() {
    this.service.getTeams().subscribe(teams => {
      this.teams = teams.data;
      this.selectedTeam = this.teams[0]?.id;
      if (sessionStorage['teams']) {
        this.displayedTeams = JSON.parse(sessionStorage['teams'])
      }
    })
  }

  getDaysArray(startDate: Date, endDate: Date = new Date()) {
    for (var arr = [], date = new Date(startDate); date <= new Date(endDate); date.setDate(date.getDate() + 1)) {
      arr.push(new Date(date).toISOString().split('T')[0]);
    }
    return arr.reverse();
  }

  populateAllDates() {
    this.allDates = this.getDaysArray(new Date(this.firstGameDate));
  }

  getSpecificTeam() {
    if (!this.isSelectedTeamBeingDisplayed() && !this.submitted) {
      this.submitted = true
      this.getGames(this.selectedTeam);
    }
  }

  isSelectedTeamBeingDisplayed() {
    return this.displayedTeams.some(team => team.id == this.selectedTeam);
  }

  getGames(teamId: number) {

    let obj = Object.entries({
      pages: 0,
      per_page: 12,
      'team_ids[]': teamId
    });

    let query = '';

    for (let i = 0; i < obj.length; i++) {
      if (i == 0) {
        query = query.concat(`${obj[i][0]}=${obj[i][1]}`)
      } else {
        query = query.concat(`&${obj[i][0]}=${obj[i][1]}`)
      }
    }
  
    for (let i = 0; i < this.allDates.length; i++) {
      query = query.concat(`&dates[]=${this.allDates[i]}`);
    }

    this.service.getGames(query).subscribe(res => {
      let team = this.teams.find(team => team.id == teamId);

      if (team) {
        team.games = res.data;
        this.calculateAverageAndWins(team);
      }
    })
  }

  calculateAverageAndWins(team: Teams) {
    let winTotal: number = 0;
    let loseTotal: number = 0;

    for (let i = 0; i < team.games.length; i++) {
      if (team.abbreviation == team.games[i].home_team.abbreviation) { // if our team is home team
        winTotal += team.games[i].home_team_score;
      } else { // if our team is vistor team
        loseTotal += team.games[i].visitor_team_score;
      }

      // the winning team will be the team which scored more
      team.games[i].winningTeam = team.games[i].home_team_score > team.games[i].visitor_team_score ? team.games[i].home_team.abbreviation : team.games[i].visitor_team.abbreviation;
    }

    team.average_points_scored = Math.round(winTotal / team.games.length);
    team.average_points_concended = Math.round(loseTotal / team.games.length);

    this.displayedTeams.push(team);
    this.setSession();
    this.submitted = false;
  }

  removeDisplayedTeam(displayedTeamIndex: number) {
    this.displayedTeams.splice(displayedTeamIndex, 1);
    this.setSession()
  }

  setSession() {
    sessionStorage['teams'] = JSON.stringify(this.displayedTeams)
  }

  seeGameResult(teamAbbreviation: string) {
    sessionStorage['selectedTeam'] = JSON.stringify(this.displayedTeams.find(team => team.abbreviation == teamAbbreviation))
    this.router.navigate([`/results/${teamAbbreviation}`])
  }
}
