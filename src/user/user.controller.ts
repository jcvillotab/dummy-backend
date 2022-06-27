import { Controller, Get } from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { UserService } from './user.service';

@Controller('user')
export class UserController {

    constructor(private userService: UserService) {

    }

    @Get('/')
    async getAllUsers() {
        return await this.userService.getAllUsers();
    }


}
