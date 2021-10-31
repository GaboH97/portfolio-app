export interface UserPortfolio {
    /**
     * Id of the User Portfolio entity
     */
    id: string;
    /**
     * Given name of the user
     */
    firstName: string;
    /**
     * Family name of the user
     */
    lastName: string;
    /**
     * URL of the user's profile photo
     */
    profilePhoto: string;
    /**
     * Given name of the user
     */
    title: string;
    /**
     * Description of the user
     */
    description: string;
    /**
     * Experience summary of the user
     */
    experienceSummary: string;
    /**
     * ID of the user's Twitter account
     */
    userId: string;
    /**
     * Username of the user's Twitter account
     */
    username: string;
}

/**
 * An updatable representation of a user portfolio
 */
export type EditableUserPortfolio = Partial<Omit<UserPortfolio, "id" | "userId" | "username " >>;