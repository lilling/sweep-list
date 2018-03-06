import { Module } from '@nestjs/common';
import { UserController } from './user_account.controller';
import { SweepController } from './user_sweep.controller';

@Module({
  imports: [],
  controllers: [UserController, SweepController],
  components: [],
})
export class ApplicationModule {}
