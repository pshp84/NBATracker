import { Component } from '@angular/core';
import { Teams } from 'src/app/models/teams';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent {

  selectedTeam!: Teams
  constructor() { }

  ngOnInit() {
    this.selectedTeam = JSON.parse(sessionStorage['selectedTeam'])
  }

}
