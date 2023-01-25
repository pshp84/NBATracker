import { Teams } from "./teams"

export interface Games {
    date: string;
    home_team: Teams;
    home_team_score: number;
    id: number;
    period: number;
    postseason: boolean;
    season: string;
    time: string;
    name: string;
    visitor_team: Teams;
    visitor_team_score: number;
    winningTeam?: string;
}