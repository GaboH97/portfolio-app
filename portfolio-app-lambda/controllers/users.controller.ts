import { Route, Get, Patch, Path, Tags, Body, Controller, SuccessResponse } from "tsoa";
import * as UsersService from '../services/usersService';
import { EditableUserPortfolio } from "../types/userPortfolio";

@Route("users")
@Tags('Users')
export class UsersController extends Controller{

    public async findAll() {
    }

    public async create() {

    }
    
    /**
     * Gets info of a user with a given `id`
     * @param {number} id id of the user
     * @returns A User object
     */
    @Get('/:id')
    @SuccessResponse("200", "Ok")
    public async findById(
        @Path() id: number
    ) {
        return await UsersService.getUserInfo(id.toString());
    }

    @Patch('/:id')
    public async updateById(
        @Path() id: string,
        @Body() updatableUserPortfolio: EditableUserPortfolio
    ) {
        return await UsersService.updateUserPortfolio(id, updatableUserPortfolio);
    }
}