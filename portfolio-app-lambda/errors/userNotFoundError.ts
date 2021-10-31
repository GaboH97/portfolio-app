/**
 * Custom error class 
 */
export default class UserNotFoundError extends Error {
    /**
     * Constructor method for UserNotFoundError class
     * @param id Id of the user
     */
    constructor(id: string) {
        super(`User with ID ${id} not found`);
    }
}