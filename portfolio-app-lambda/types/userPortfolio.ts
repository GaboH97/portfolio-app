import { Tweet } from "../services/twitterAPIService";

export interface UserPortfolio {
    id: string;
    firstName: string;
    lastName: string;
    profilePhoto: string
    title: string;
    description: string;
    experienceSummary: string;
    userId?: string;
    username?: string;
}

export interface User {
    details?: UserPortfolio,
    tweets?: Tweet[]
}

export type EditableUserPortfolio = Partial<Omit<UserPortfolio, 'id'>>;