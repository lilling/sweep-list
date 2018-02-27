import { Module } from '@nestjs/common';
import { UserController } from './user_account.controller';

@Module({
  imports: [],
  controllers: [UserController],
  components: [],
})
export class ApplicationModule {}
