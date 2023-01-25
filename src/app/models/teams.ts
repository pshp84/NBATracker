import { Games } from "./games";

export interface Teams {
    id: number;
    abbreviation: string;
    city: string;
    conference: string;
    division: string;
    full_name: string;
    name: string;
    games: Array<Games>;
    average_points_scored?: number;
    average_points_concended?: number;
}