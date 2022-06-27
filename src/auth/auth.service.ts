import { Injectable} from '@nestjs/common';
import {CustomLogger} from '../common/utils/custom_logger';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/register.dto';
import { BadRequestException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { LoginAuthDto } from './dto/login_auth.dto';
import { ChangePasswordDto } from './dto/change_password.dto';
import { randomBytes } from 'crypto';
import { MailService } from 'src/mail/mail.service';
import { PasswordResetDto } from './dto/password_reset.dto';

@Injectable()
export class AuthService {
    logger: CustomLogger;
    constructor(private prisma: PrismaService, private jwtService: JwtService, private userService: UserService, private mailService: MailService) {
        this.logger = new CustomLogger(AuthService.name);
    }

    async generateToken(userId: number, email:string, roles: number[]) {
        this.logger.debug(`user=${userId} event=generate_token outcome=success type=audit`);
        const accessToken:string = await this.jwtService.signAsync({
            sub: userId,
            email,
            roles
        },
        {
            secret: process.env.JWT_SECRET,
            expiresIn: '1h'
        });

        return accessToken;
    }

    async sendEmailReset(dto: ChangePasswordDto){
        const user = await this.userService.getUserByEmail(dto.email);
        if(!user){
            this.logger.error('event=send_email_reset outcome=failure reason=user_not_found type=audit');
            throw new BadRequestException('User not found');
        }

        const token = randomBytes(20).toString('hex');
        this.logger.debug(`user=${user.id} event=send_email_reset outcome=success type=audit`);

        await this.prisma.user.update({
            where: {
                email: dto.email
            },
            data: {
                passwordResetToken: token,
                passwordResetExpires: new Date(Date.now() + 360000)
            }
        });
        
        const message:string = `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n
        Please click on the following link, or paste this into your browser to complete the process:\n
        ${process.env.DOMAIN}/reset/${token}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.`

            
        return await this.mailService.sendMail(dto.email,'Reset your password',message);
    }

    async resetPassword(dto: PasswordResetDto){
        const user = await this.prisma.user.findFirst({
            where: {
                passwordResetToken: dto.token,
            },
            select: {
                id: true,
                passwordResetExpires: true,
                passwordResetToken: true
            }
        });

        if(!user){
            this.logger.error(`event=reset_password outcome=failure reason=user_not_found type=audit`);
            throw new BadRequestException('Token not found');
        }

        if(user.passwordResetExpires < new Date()){
            this.logger.error(`event=reset_password outcome=failure reason=token_expired type=audit`);
            throw new BadRequestException('Token expired');
        }


        const newPassword = await argon2.hash(dto.newPassword);
        this.logger.debug(`user=${user.id} event=reset_password outcome=success type=audit`);
        return await this.prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                password: newPassword,
                passwordResetToken: "",
                passwordResetExpires: undefined
            },
            select:{
                id: true
            }
        });
    }

    async register(dto: RegisterDto){
        if(await this.userService.getUserByEmail(dto.email)){
            this.logger.error(`event=register outcome=failure reason=user_already_exists type=audit`);
            throw new BadRequestException('User already exists');
        }

        dto.password = await argon2.hash(dto.password);
        let user = await this.userService.createUser(dto);
        this.logger.debug(`user=${user.id} event=register outcome=success type=audit`);

        return {
            message: "User created successfully", 
        };
    }

    async login(dto: LoginAuthDto){
        const user = await this.userService.getUserByEmail(dto.username);
        
        if(!user){
            this.logger.error(`event=login outcome=failure reason=user_not_found type=audit`);
            throw new BadRequestException('User does not exist');
        }

        const isValid = await argon2.verify(user.password, dto.password);
        if(!isValid){
            this.logger.error(`event=login outcome=failure reason=invalid_password type=audit`);
            throw new BadRequestException('Invalid password');
        }

        const token = await this.generateToken(user.id, user.email, user.roles.map(role => role.id));
        this.logger.debug(`user=${user.id} event=login outcome=success type=audit`);
        

        return {
            email: user.email,
            token: token,
        };
    }
}
