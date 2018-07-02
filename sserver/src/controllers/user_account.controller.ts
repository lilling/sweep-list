import { Get, Post, Body, Controller, Param } from '@nestjs/common';
import { SocialUserAndAccount, Account , user_account } from '../../../shared/classes';
import { UserAccountService } from '../services/user_account.service';

@Controller('api/user')
export class UserController {
    UserAccountService: UserAccountService;
    constructor() {
        this.UserAccountService = new UserAccountService();
    }

    /*@Get('user_accounts/:id')
    root(@Param() params): Promise<user_account> {
        return this.UserAccountService.getItem(params.id, 'user_account_id');
    }*/

    @Get('user_accounts')
    DBtest(): Promise<user_account[]> {
        return this.UserAccountService.getAll();
    }

    @Get('user_accounts/:id')
    CookieLogin(@Param() params): Promise<user_account>{
        return this.UserAccountService.CookieLogin(params.id);
    }

    @Get('user_social_medias/:id')
    GetSocialMedia(@Param() params): Promise<string[]>{
        return this.UserAccountService.GetSocialMedia(params.id);
    }

    @Post('SocialMediaLogin')
    SocialMediaLogin(@Body() social_media_account: SocialUserAndAccount): Promise<user_account>{
        return this.UserAccountService.SocialMediaLogin(social_media_account);
    }

    @Post('extendUserAccounts')
    extendUserAccounts(){
        this.UserAccountService.extendFacebookUserAccounts();
    }

    @Get('deleteUserAccountConfirm/:id')
    deleteUserAccountConfirm(@Param() params): Promise<any>{
        return this.UserAccountService.deleteUserAccountConfirm(params.id);
    }

    @Post('deleteUserAccount')
    deleteUserAccount(@Body() user_account_id: any){
        this.UserAccountService.deleteUserAccount(user_account_id.user_account_id);
    }
}
