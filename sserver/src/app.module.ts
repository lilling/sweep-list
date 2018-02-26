import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserController } from './user_account.controller';

@Module({
  imports: [],
  controllers: [AppController, UserController],
  components: [],
})
export class ApplicationModule {}
