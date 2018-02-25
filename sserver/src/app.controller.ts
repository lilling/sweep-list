import { Get, Controller } from '@nestjs/common';

@Controller()
export class AppController {

    @Get('b')
    root(): string {
        return 'Hello World!';
    }

    @Get('DBtest')
    DBtest(): string {

        return 'Hello DB!';
    }
}
