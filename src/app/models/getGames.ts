import { Games } from "./games"

export interface getGames {
    data: Array<Games>
    meta: {
        total_pages: number
        current_page: number
        next_page: number | null
        per_page: number
        total_count: number
    }
}