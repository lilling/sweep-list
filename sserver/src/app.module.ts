import { Module } from '@nestjs/common';
import { UserController } from './controllers/user_account.controller';
import { SweepController } from './controllers/user_sweep.controller';

@Module({
  imports: [],
  controllers: [UserController, SweepController],
  components: [],
})
export class ApplicationModule {}
