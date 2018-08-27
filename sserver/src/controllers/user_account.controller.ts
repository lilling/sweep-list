import { Get, Post, Body, Controller, Param } from '@nestjs/common';
import { ExtandedSocialUser, user_account } from '../../../shared/classes';
import { UserAccountService } from '../services/user_account.service';

@Controller('api/user')
export class UserController {
    UserAccountService: UserAccountService;

    constructor() {
        this.UserAccountService = new UserAccountService();
    }

    /*@Get('user_accounts/:user_account_id')
    root(@Param() params): Promise<user_account> {
        return this.UserAccountService.getItem(params.user_account_id, 'user_account_id');
    }*/

    @Get('user_accounts')
    DBtest(): Promise<user_account[]> {
        return this.UserAccountService.getAll();
    }

    @Get('user_accounts/:user_account_id')
    CookieLogin(@Param() params): Promise<user_account> {
        return this.UserAccountService.CookieLogin(params.user_account_id);
    }

    @Post('Login')
    Login(@Body() account: ExtandedSocialUser): Promise<{ user: user_account, isNew?: boolean }> {
        return this.UserAccountService.Login(account);
    }

    @Post('email_available')
    checkEmailAvailability(@Body() email: string): Promise<boolean> {
        return this.UserAccountService.checkEmailAvailability(email);
    }

    @Post('create_user')
    CreateUser(@Body() account: ExtandedSocialUser): Promise<{ user: user_account, isNew?: boolean }> {
        return this.UserAccountService.CreateUser(account);
    }

    @Get('deleteUserAccountConfirm/:user_account_id')
    deleteUserAccountConfirm(@Param() params): Promise<{ tasks: string, active: string, ended: string, won: string }> {
        return this.UserAccountService.deleteUserAccountConfirm(params.user_account_id);
    }

    @Post('deleteUserAccount')
    deleteUserAccount(@Body() user_account: any): Promise<boolean> {
        return this.UserAccountService.deleteUserAccount(user_account.user_account_id);
    }
}
