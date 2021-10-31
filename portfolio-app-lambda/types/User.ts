import { Tweet } from "./Tweet";
import { UserPortfolio } from "./UserPortfolio";

export interface User {
    /**
     * User port folio info
     */
    details?: UserPortfolio,
    /**
     * List of tweets of the user
     */
    tweets?: Tweet[]
}