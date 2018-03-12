import { Module } from '@nestjs/common';
import { UserController } from './controllers/user_account.controller';
import { SweepController } from './controllers/user_sweep.controller';
import { ServerController } from './controllers/server.controller';

@Module({
  imports: [],
  controllers: [UserController, SweepController, ServerController],
  components: [],
})
export class ApplicationModule {}
