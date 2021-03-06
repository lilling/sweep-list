import { Get, Post, Body, Controller, Param } from '@nestjs/common';
import { user_sweep, Win, Search, URL } from '../../../shared/classes';
import { UserSweepService } from '../services/user_sweep.service';
import { URLClickTypes } from '../models/URL-click-type.enum';
import { SocialMedia } from '../../../shared/models/social-media.enum';

@Controller('api/sweep')
export class SweepController {
    UserSweepService: UserSweepService;
    constructor() {
        this.UserSweepService = new UserSweepService();
    }

    @Get('user_sweep/:user_sweep_id')
    GetSweep(@Param() params): Promise<user_sweep> {
        return this.UserSweepService.getItem(params.user_sweep_id, `user_sweep_id`);
    }

    @Post('today_user_sweeps')
    GetTodaySweeps(@Body() user_sweep_search: Search): Promise<user_sweep[]> {
        return this.UserSweepService.GetSweeps(user_sweep_search, `today`);
    }

    @Post('tomorrow_user_sweeps')
    GetTomorrowSweeps(@Body() user_sweep_search: Search): Promise<user_sweep[]> {
        return this.UserSweepService.GetSweeps(user_sweep_search, `tomorrow`);
    }

    @Post('later_user_sweeps')
    GetLaterSweeps(@Body() user_sweep_search: Search): Promise<user_sweep[]> {
        return this.UserSweepService.GetSweeps(user_sweep_search, `upcoming`);
    }

    @Post('active_user_sweeps')
    GetActiveSweeps(@Body() user_sweep_search: Search): Promise<user_sweep[]> {
        return this.UserSweepService.GetSweeps(user_sweep_search, `active`);
    }

    @Post('ended_user_sweeps')
    GetEndedSweeps(@Body() user_sweep_search: Search): Promise<user_sweep[]> {
        return this.UserSweepService.GetSweeps(user_sweep_search, `ended`);
    }

    @Post('won_user_sweeps')
    GetWonSweepsY(@Body() user_sweep_search: Search): Promise<user_sweep[]> {
        return this.UserSweepService.GetSweeps(user_sweep_search, `won`);
    }

    @Get('user_wins/:user_account_id')
    GetWins(@Param() params): Promise<Win[]> {
        return this.UserSweepService.GetWins(params.user_account_id);
    }

    /*@Get('user_sweep_url_share/:user_sweep_id/:social_media')
    ShareSweepURL(@Param() params): Promise<URL> {
        return this.UserSweepService.GetSweepURL(params.user_sweep_id, URLClickTypes.share, params.social_media);
    }*/

    @Post('user_sweep_url_share')
    ShareSweepURL(@Body() data: {sweep_id: number, social_media: SocialMedia, URL: string}): Promise<URL> {
        return this.UserSweepService.GetSweepURL(data.sweep_id, URLClickTypes.share, data.social_media, data.URL);
    }

    @Get('user_sweep_url_enter/:user_sweep_id')
    EnterSweepURL(@Param() params): Promise<URL> {
        return this.UserSweepService.GetSweepURL(params.user_sweep_id, URLClickTypes.enter);
    }

    @Get('user_sweep_url_show/:user_sweep_id')
    ShowSweepURL(@Param() params): Promise<URL> {
        return this.UserSweepService.GetSweepURL(params.user_sweep_id, URLClickTypes.none);
    }

    @Get('del_sweep/:user_sweep_id')
    DelSweep(@Param() params): Promise<user_sweep> {
        return this.UserSweepService.ToggleSweepState(`deleted_yn`, params.user_sweep_id, true);
    }

    @Get('undel_sweep/:user_sweep_id')
    UndelSweep(@Param() params): Promise<user_sweep> {
        return this.UserSweepService.ToggleSweepState(`deleted_yn`, params.user_sweep_id, false);
    }

    @Get('win_sweep/:user_sweep_id/:prize_value')
    WinSweep(@Param() params): Promise<user_sweep> {
        return this.UserSweepService.ToggleSweepState(`won_yn`, params.user_sweep_id, true, params.prize_value);
    }

    @Get('unwin_sweep/:user_sweep_id')
    UnwinSweep(@Param() params): Promise<user_sweep> {
        return this.UserSweepService.ToggleSweepState(`won_yn`, params.user_sweep_id, false);
    }

    @Post('sweep')
    ManageSweep(@Body() user_sweep: user_sweep): Promise<user_sweep>{
        return this.UserSweepService.ManageSweep(user_sweep);
    }

}
