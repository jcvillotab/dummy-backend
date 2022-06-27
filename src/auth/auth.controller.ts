import { Body, Controller, HttpCode, Post, Put } from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change_password.dto';
import { LoginAuthDto } from './dto/login_auth.dto';
import { PasswordResetDto } from './dto/password_reset.dto';
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

    @Public()
    @HttpCode(204)
    @Post('sendEmailReset')
    async sendEmailReset(@Body() request: ChangePasswordDto){
        return await this.authService.sendEmailReset(request);
    }


    @Public()
    @HttpCode(200)
    @Put('resetPassword')
    async resetPassword(@Body() request: PasswordResetDto){
        await this.authService.resetPassword(request);
        return{};
    }
}
