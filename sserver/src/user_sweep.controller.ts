import { Get, Post, Body, Controller, Param } from '@nestjs/common';
import { user_sweep, user_sweep_display } from './dal/DB';
import { UserSweepService } from './dal/user_sweep.service';
import { win } from './dal/WinAndURL';

@Controller()
export class SweepController {
    UserSweepService: UserSweepService;
    constructor() {
        this.UserSweepService = new UserSweepService();
    }

    @Get('user_sweep/:id')
    GetSweep(@Param() params): Promise<user_sweep> {
        return this.UserSweepService.getItem(params.id, 'user_sweep_id');
    }

    @Get('live_user_sweeps/:id')
    GetLiveSweeps(@Param() params): Promise<user_sweep_display[]> {
        return this.UserSweepService.GetSweeps(params.id, 'live');
    }

    @Get('ended_user_sweeps/:id')
    GetEndedSweeps(@Param() params): Promise<user_sweep_display[]> {
        return this.UserSweepService.GetSweeps(params.id, 'ended');
    }

    @Get('user_wins/:id')
    GetWins(@Param() params): Promise<win[]> {
        return this.UserSweepService.GetWins(params.id);
    }

    @Get('won_user_sweeps/:id/:year')
    GetWonSweepsY(@Param() params): Promise<user_sweep_display[]> {
        return this.UserSweepService.GetSweeps(params.id, 'won', params.year);
    }

    @Get('won_user_sweeps/:id/:year/:month')
    GetWonSweepsYM(@Param() params): Promise<user_sweep_display[]> {
        return this.UserSweepService.GetSweeps(params.id, 'won', params.year, params.month);
    }

    @Get('user_sweep_url/:id')
    GetSweepURL(@Param() params): Promise<string> {
        return this.UserSweepService.GetSweepURL(params.id);
    }

    @Get('user_sweep_urls/:id')
    GetSweepsURL(@Param() params): Promise<string[]> {
        return this.UserSweepService.GetSweepURLs(params.id);
    }

    @Get('del_sweep/:id')
    DelSweep(@Param() params): Promise<user_sweep_display> {
        return this.UserSweepService.ToggleSweepState('deleted_yn', params.id, true);
    }

    @Get('undel_sweep/:id')
    UndelSweep(@Param() params): Promise<user_sweep_display> {
        return this.UserSweepService.ToggleSweepState('deleted_yn', params.id, false);
    }

    @Get('win_sweep/:id')
    WinSweep(@Param() params): Promise<user_sweep_display> {
        return this.UserSweepService.ToggleSweepState('won_yn', params.id, true);
    }

    @Get('unwin_sweep/:id')
    UnwinSweep(@Param() params): Promise<user_sweep_display> {
        return this.UserSweepService.ToggleSweepState('won_yn', params.id, false);
    }

    @Post('sweep')
    ManageSweep(@Body() user_sweep: user_sweep): Promise<user_sweep_display>{
        return this.UserSweepService.ManageSweep(user_sweep);
    }
}
