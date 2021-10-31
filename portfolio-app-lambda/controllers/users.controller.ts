import {
    Route,
    Get,
    Patch,
    Path,
    Tags,
    Body,
    Controller,
    Response,
    SuccessResponse,
    Example
} from "tsoa";
import * as UsersService from '../services/usersService';
import { User } from "../types/user";
import { EditableUserPortfolio } from "../types/userPortfolio";

/**
 * Class to handle User related requests
 */
@Route("users")
@Tags('Users')
export class UsersController extends Controller {

    /**
     * Gets info of a user with a given `id`
     * @param {number} id ID of the user
     * @returns A User object
     */
    @Get('/:id')
    @SuccessResponse("200", "Ok")
    @Example<User>({
        details: {
            id: "1",
            firstName: "John",
            lastName: "Doe",
            description: "Super cool guy",
            experienceSummary:"John is a super talented and handsome guy",
            profilePhoto:"http://lorempixel.com/400/200/people",
            title:"John Doe",
            userId:"12345789",
            username:"jdoe"
        },
        tweets: [
            {
                id: "123456789",
                text: "My first Tweet"
            },
            {
                id: "111222333",
                text: "My second tweet"
            }
        ]
    })
    public async findById(
        @Path() id: number
    ): Promise<User> {
        return await UsersService.getUserInfo(id.toString());
    }

    /**
     * 
     * @param {number} id ID of the user 
     * @param {EditableUserPortfolio} updatableUserPortfolio object with fields to update in user portfolio
     * @returns Updated user
     */
    @Patch('/:id')
    public async updateById(
        @Path() id: string,
        @Body() updatableUserPortfolio: EditableUserPortfolio
    ) {
        return await UsersService.updateUserPortfolio(id, updatableUserPortfolio);
    }
}