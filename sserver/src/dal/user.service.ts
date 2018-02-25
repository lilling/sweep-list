import { BaseService } from './base.service';
import { user } from './DB';

export class UserService extends BaseService<user> {
    constructor() {
        super('user');
    }
}