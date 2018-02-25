import { Get, Controller, Param } from '@nestjs/common';
import { user } from './dal/DB';
import { UserService } from './dal/user.service';

@Controller()
export class UserController {
    userService: UserService;
    constructor() {
        this.userService = new UserService();
    }

    @Get('users/:id')
    root(@Param() params): Promise<user> {
        return this.userService.getItem(params.id, 'user_id');
    }

    @Get('users')
    DBtest(): Promise<user[]> {
        return this.userService.getAll();
    }
}
