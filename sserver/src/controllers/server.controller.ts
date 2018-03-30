import { Get, Post, Body, Controller, Param } from '@nestjs/common';
import { PostToPublish } from '../../../shared/classes';
import { ServerService } from '../services/server.service';

@Controller('api/server')
export class ServerController {
    ServerService: ServerService;
    constructor() {
        this.ServerService = new ServerService();
    }

    @Get('posts_to_publish')
    GetPostsToPublish(): Promise<PostToPublish[]> {
        return this.ServerService.GetPostsToPublish();
    }

    /*@Post('sweep')
    ManageSweep(@Body() user_sweep: user_sweep): Promise<user_sweep_display>{
        return this.UserSweepService.ManageSweep(user_sweep);
    }*/
}