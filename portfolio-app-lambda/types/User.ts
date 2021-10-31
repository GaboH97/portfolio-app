import { Tweet } from "./tweet";
import { UserPortfolio } from "./userPortfolio";

/**
 * Interface for User
 */
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