import { Module } from '@nestjs/common';
import { UserController } from './user_account.controller';
import { SweepController } from './user_sweep.controller';
import { ServerController } from './server.controller';

@Module({
  imports: [],
  controllers: [UserController, SweepController, ServerController],
  components: [],
})
export class ApplicationModule {}