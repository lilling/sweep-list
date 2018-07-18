import { Get, Post, Body, Controller, Param } from '@nestjs/common';
import { PaymentService } from '../services/payment.service';
import { payment_package, payment } from '../../../shared/classes';

@Controller('api/payment')
export class PaymentController {
    PaymentService: PaymentService;
    constructor() {
        this.PaymentService = new PaymentService();
    }

    @Get('current_payment/:user_account_id')
    GetCurrentPayment(@Param() params): Promise<payment> {
        return this.PaymentService.getCurrentPayment(params.user_account_id);
    }

    @Get('last_payment/:user_account_id')
    GetLastPayment(@Param() params): Promise<payment> {
        return this.PaymentService.getLastPayment(params.user_account_id);
    }

    @Get('current_package/:user_account_id')
    GetCurrentPackage(@Param() params): Promise<payment_package> {
        return this.PaymentService.getCurrentPackage(params.user_account_id);
    }
    
    @Post('make_payment')
    MakePayment(@Body() payment): Promise<number>{
        return this.PaymentService.makePayment(payment.user_account_id, payment.payment_package_id, payment.amount_to_pay, payment.isYearly);
        //user_account_id: AAGUID, payment_package_id: number, amount_to_pay: number, isYearly: boolean
    }
}