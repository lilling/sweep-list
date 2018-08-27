import { DbGetter } from '../dal/DbGetter';
import { payment_package, payment } from '../../../shared/classes';

export class PaymentService {

    constructor() {
    }

    async getCurrentPayment(user_account_id: AAGUID): Promise<payment>{
        const db = DbGetter.getDB();
        var q =
            `SELECT *\n` +
            `  FROM sweepimp.payment\n` +
            ` WHERE user_account_id = $<user_account_id>\n` +
            `   AND current_timestamp BETWEEN payment_date AND paid_until`;
        return await db.oneOrNone<payment>(q, {user_account_id});
    };

    async getLastPayment(user_account_id: AAGUID): Promise<payment>{
        const db = DbGetter.getDB();
        var q =
            `SELECT *\n` +
            `  FROM sweepimp.payment\n` +
            ` WHERE payment_id = (SELECT CAST(SUBSTR(res, strpos(res, 'ZZZ') + 3) as bigint)\n` +
            `                       FROM (SELECT MAX(paid_until || 'ZZZ' || payment_id) res\n` +
            `                               FROM sweepimp.payment\n` +
            `                              WHERE user_account_id = $<user_account_id>) AS a)`;
        return await db.oneOrNone<payment>(q, {user_account_id});
    };

    async getCurrentPackage(user_account_id: AAGUID): Promise<payment_package>{
        const db = DbGetter.getDB();
        var q =
            `SELECT payment_package.*\n` +
            `  FROM sweepimp.payment\n` +
            `  JOIN sweepimp.payment_package USING (payment_package_id)\n` +
            ` WHERE user_account_id = $<user_account_id>\n` +
            `   AND current_timestamp BETWEEN payment_date AND paid_until`;
        return await db.oneOrNone<payment_package>(q, {user_account_id: user_account_id});
    };

    async makePayment(user_account_id: AAGUID, payment_package_id: number, amount_to_pay: number, isYearly: boolean): Promise<number>{
        const db = DbGetter.getDB();
        const today = new Date();
        const nextMonth = new Date();
        const nextYear = new Date();
        nextMonth.setMonth(today.getMonth() + 1);
        nextYear.setFullYear(today.getFullYear() + 1);
        const daysNextMonth = Math.ceil((nextMonth.getTime() - today.getTime()) / (1000 * 3600 * 24));
        const daysNextYear = Math.ceil((nextYear.getTime() - today.getTime()) / (1000 * 3600 * 24));
        const q =
            `SELECT DATE_PART('day', paid_until - now()) / DATE_PART('day', paid_until - payment_date) * amount_paid remaining_balance\n` +
            `      ,*\n` +
            `  FROM sweepimp.payment p\n` +
            ` WHERE user_account_id = $<user_account_id>\n` +
            `   AND current_timestamp BETWEEN payment_date AND paid_until`;
        const currentPayment = await db.oneOrNone(q, { user_account_id });
        if (!currentPayment){//new user, never paid
            return await db.tx('new payment', payment => {
                return this.InsertPayment(payment, user_account_id, payment_package_id, amount_to_pay, (isYearly ? daysNextYear : daysNextMonth));
            });
        } else {
            const daysToAdd = (currentPayment ? Math.round(currentPayment.remaining_balance / amount_to_pay * (isYearly? daysNextYear : daysNextMonth)) : 0);
            //insert new payment with added days
            return await db.tx('new payment', payment => {
                //TODO: return also daysToAdd, to prompt user
                return this.InsertPayment(payment, user_account_id, payment_package_id, amount_to_pay, (isYearly ? daysNextYear : daysNextMonth) + daysToAdd, currentPayment.payment_id);
            });
        }
    };

    async InsertPayment(payment, user_account_id: AAGUID, payment_package_id: number, amount_to_pay: number, daysToAdd: number, payment_id?: number): Promise<number> {
        if (payment_id){
            var q =
                `UPDATE sweepimp.payment\n` +
                `   SET paid_until = current_timestamp\n` +
                `      ,updated    = current_timestamp\n` +
                ` WHERE payment_id = $<payment_id^>`;
            payment.none(q, { payment_id });
        }
        q = `INSERT INTO sweepimp.payment\n` +
            `    (user_account_id\n` +
            `    ,payment_package_id\n` +
            `    ,amount_paid\n` +
            `    ,payment_date\n` +
            `    ,paid_until\n` +
            `    ,created\n` +
            `    ,updated)\n` +
            `VALUES
                ($<user_account_id>
                ,$<payment_package_id^>
                ,$<amount_to_pay^>
                ,current_timestamp
                ,current_timestamp + interval '$<daysToAdd^>' day
                ,current_timestamp
                ,current_timestamp)
            RETURNING payment_id`;
        return payment.one(q, {
            user_account_id: user_account_id,
            payment_package_id: payment_package_id,
            amount_to_pay: amount_to_pay,
            daysToAdd: daysToAdd
        })
    }
}

