import { Module } from '@nestjs/common';
import { UserController } from './controllers/user_account.controller';
import { SweepController } from './controllers/user_sweep.controller';
import { PaymentController } from './controllers/payment.controller';

@Module({
  imports: [],
  controllers: [UserController, SweepController, PaymentController],
  components: [],
})
export class ApplicationModule {}
