import { Get, Post, Body, Controller, Param } from '@nestjs/common';
import { user_account, facebook_account, google_account } from './dal/DB';
import { UserAccountService } from './dal/user_account.service';
import { SocialUser } from 'angularx-social-login';

@Controller()
export class UserController {
    UserAccountService: UserAccountService;
    constructor() {
        this.UserAccountService = new UserAccountService();
    }

    @Get('user_accounts/:id')
    root(@Param() params): Promise<user_account> {
        return this.UserAccountService.getItem(params.id, 'user_account_id');
    }

    @Get('user_accountsFB/:id')
    GetUserByFB(@Param() params): Promise<user_account> {
        return this.UserAccountService.getUserByFB(params.id);
    }

    @Get('user_accounts')
    DBtest(): Promise<user_account[]> {
        return this.UserAccountService.getAll();
    }

/*    @Post('FacebookLogin')
    FacebookLogin(@Body() facebook_account: SocialUser): Promise<user_account>{
        \*stub*\return this.UserAccountService.FacebookLogin(facebook_account);
    }*/
}
