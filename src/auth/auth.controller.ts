import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login_auth.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
    
    constructor(private authService: AuthService) {

    }

    @Public()
    @Post('register')
    async register(@Body() request: RegisterDto){
        return await this.authService.register(request);
    }

    @Public()
    @HttpCode(200)
    @Post('login')
    async login(@Body() request: LoginAuthDto){
        return await this.authService.login(request);
    }
}
