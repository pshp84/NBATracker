import { Teams } from "./teams"

export interface getTeams {
    data: Array<Teams>
    meta: {
        total_pages: number
        current_page: number
        next_page: number | null
        per_page: number
        total_count: number
    }
}