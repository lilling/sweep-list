import { Get, Post, Body, Controller, Param } from '@nestjs/common';
import { user_sweep, Win, Search, URL } from '../../../shared/classes';
import { UserSweepService } from '../services/user_sweep.service';

@Controller('api/sweep')
export class SweepController {
    UserSweepService: UserSweepService;
    constructor() {
        this.UserSweepService = new UserSweepService();
    }

    @Get('user_sweep/:id')
    GetSweep(@Param() params): Promise<user_sweep> {
        return this.UserSweepService.getItem(params.id, `user_sweep_id`);
    }

    @Post('todo_user_sweeps')
    GetTodoSweeps(@Body() user_sweep_search: Search): Promise<user_sweep[]> {
        return this.UserSweepService.GetSweeps(user_sweep_search, `todo`);
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

    @Get('user_wins/:id')
    GetWins(@Param() params): Promise<Win[]> {
        return this.UserSweepService.GetWins(params.id);
    }

    @Get('user_sweep_url/:id')
    GetSweepURL(@Param() params): Promise<URL> {
        return this.UserSweepService.GetSweepURL(params.id);
    }

    @Get('user_sweep_urls/:id')
    GetSweepsURL(@Param() params): Promise<string[]> {
        return this.UserSweepService.GetSweepURLs(params.id);
    }

    @Get('del_sweep/:id')
    DelSweep(@Param() params): Promise<user_sweep> {
        return this.UserSweepService.ToggleSweepState(`deleted_yn`, params.id, true);
    }

    @Get('undel_sweep/:id')
    UndelSweep(@Param() params): Promise<user_sweep> {
        return this.UserSweepService.ToggleSweepState(`deleted_yn`, params.id, false);
    }

    @Get('win_sweep/:id')
    WinSweep(@Param() params): Promise<user_sweep> {
        return this.UserSweepService.ToggleSweepState(`won_yn`, params.id, true);
    }

    @Get('unwin_sweep/:id')
    UnwinSweep(@Param() params): Promise<user_sweep> {
        return this.UserSweepService.ToggleSweepState(`won_yn`, params.id, false);
    }

    @Post('sweep')
    ManageSweep(@Body() user_sweep: user_sweep): Promise<user_sweep>{
        return this.UserSweepService.ManageSweep(user_sweep);
    }
}
